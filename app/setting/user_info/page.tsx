"use client";

import React, {
  JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Calendar, Check, Save } from "lucide-react";

export default function UserInfoPage(): JSX.Element {
  const router = useRouter();
  const ACCENT = "#FF3B6A";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "" as "Male" | "Female" | "",
    location: "",
    avatar: "", // ✅ thêm trường avatar
  });

  const [initialForm, setInitialForm] = useState(form);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ ref cho input file avatar

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  const noErrors = Object.keys(errors).length === 0;
  const canSave = isDirty && noErrors;

  // ✅ Lấy user hiện tại từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      setForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        dob: currentUser.dob || "",
        gender: currentUser.gender || "",
        location: currentUser.location || "",
        avatar: currentUser.avatar || "", // ✅ load avatar
      });
      setInitialForm({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        dob: currentUser.dob || "",
        gender: currentUser.gender || "",
        location: currentUser.location || "",
        avatar: currentUser.avatar || "",
      });
    }
    setLoading(false);
  }, []);

  const validateField = useCallback((name: string, value: string) => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    setErrors((prev) => {
      const next = { ...prev };
      if (name === "firstName" || name === "lastName") {
        if (!value.trim())
          next[name] = `${
            name === "firstName" ? "First" : "Last"
          } name cannot be empty.`;
        else if (!nameRegex.test(value))
          next[name] = "No numbers or special characters.";
        else delete next[name];
      } else if (name === "email") {
        if (!emailRegex.test(value)) next.email = "Invalid email address.";
        else delete next.email;
      } else if (name === "dob") {
        if (!value) next.dob = "Date of birth required.";
        else if (!dobRegex.test(value)) next.dob = "Invalid date format.";
        else delete next.dob;
      } else if (name === "gender") {
        if (!value) next.gender = "Please choose gender.";
        else delete next.gender;
      } else {
        delete next[name];
      }

      Object.keys(next).forEach((k) => {
        if (!next[k]) delete next[k];
      });

      return next;
    });
  }, []);

  const validateAll = useCallback((): boolean => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    const nextErrors: Record<string, string> = {};

    if (!form.firstName.trim())
      nextErrors.firstName = "First name cannot be empty.";
    else if (!nameRegex.test(form.firstName))
      nextErrors.firstName = "No numbers or special characters.";

    if (!form.lastName.trim())
      nextErrors.lastName = "Last name cannot be empty.";
    else if (!nameRegex.test(form.lastName))
      nextErrors.lastName = "No numbers or special characters.";

    if (!emailRegex.test(form.email))
      nextErrors.email = "Invalid email address.";

    if (!form.dob) nextErrors.dob = "Date of birth required.";
    else if (!dobRegex.test(form.dob)) nextErrors.dob = "Invalid date format.";

    if (!form.gender) nextErrors.gender = "Please choose gender.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (!editing) setEditing(true);
  };

  const handleOpenDatePicker = () => {
    const el = dateInputRef.current;
    if (!el || el.disabled) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else {
      el.focus();
      try {
        el.click();
      } catch {}
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, avatar: base64 }));
      setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const ok = validateAll();
    if (!ok) {
      document
        .getElementById("profile-scroll")
        ?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setInitialForm({ ...form });
      setEditing(false);
      localStorage.setItem("currentUser", JSON.stringify(form));
      alert("✅ Saved changes");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes");
    }
  };

  useEffect(() => {
    if (editing) validateAll();
  }, [editing, validateAll]);

  if (loading)
    return (
      <div className="p-6 text-gray-600 text-sm">
        Loading user information...
      </div>
    );

  return (
    <div
      className="flex flex-col bg-white relative overflow-y-auto"
      id="profile-scroll"
      style={{
        fontFamily: "PlusJakartaSans, sans-serif",
        height: "100vh",
        minHeight: "100dvh",
        overflowX: "hidden",
        paddingBottom: "max(env(safe-area-inset-bottom), 32px)",
        boxSizing: "border-box",
      }}
    >
      {/* ✅ Avatar Modal */}
      {showAvatarModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 animate-slideUp">
            <div className="bg-white w-80 rounded-2xl shadow-lg p-5 text-center">
              <h3 className="text-base font-semibold mb-4">
                Change your picture
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert("📸 Take a photo feature coming soon");
                    setShowAvatarModal(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    />
                  </svg>
                  <span>Take a photo</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    />
                  </svg>
                  <span>Choose from your file</span>
                </button>

                <button
                  onClick={() => {
                    setForm((prev) => ({ ...prev, avatar: "" }));
                    setShowAvatarModal(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Delete Photo</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64 = reader.result as string;
                      setForm((prev) => ({ ...prev, avatar: base64 }));
                      setShowAvatarModal(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      <style>
        {`
        :root { --accent: ${ACCENT}; }
        #profile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        #profile-scroll::-webkit-scrollbar { display: none; }
        input[type="date"]::-webkit-clear-button,
        input[type="date"]::-webkit-inner-spin-button { -webkit-appearance: none; display: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; pointer-events: none; width: 0; height: 0; }
        input[type="date"]::-moz-calendar-picker-indicator { display: none; }
        .pill { border: 2px solid rgba(255,59,106,0.35); border-radius: 28px; padding: 10px 16px; height:44px; background:white; box-sizing: border-box; }
        .pill:focus { outline:none; box-shadow: 0 0 0 4px rgba(255,59,106,0.06); border-color: var(--accent); }
        .textarea-pill { border: 2px solid rgba(255,59,106,0.35); border-radius: 14px; padding: 12px; min-height:96px; box-sizing: border-box; }
        .calendar-button:active { transform: translateY(-50%) scale(0.98); }
        .gender-chip { border: 2px solid rgba(255,59,106,0.35); border-radius: 18px; padding: 8px 14px; display:flex; align-items:center; gap:10px; justify-center; }
        .gender-chip.active { background: rgba(255,59,106,0.06); border-color: var(--accent); color: var(--accent); }
        .gender-dot { width:18px; height:18px; border-radius:999px; border:2px solid rgba(255,59,106,0.4); display:flex; align-items:center; justify-content:center; }
        .gender-dot.active { background: var(--accent); border-color: var(--accent); color: white; }
      @keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn 0.25s ease forwards; }
.animate-slideUp { animation: slideUp 0.25s ease forwards; }

      
      `}
      </style>

      {/* header */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={() => router.back()} className="p-2" aria-label="Back">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-base font-semibold">Profile</h1>
      </div>

      <div
        id="profile-scroll"
        className="px-4 overflow-y-auto"
        style={{
          height: "calc(100vh - 88px)",
          paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        {/* cover */}
        <div className="relative w-full h-28 rounded-xl overflow-hidden mt-2">
          <Image
            src="/images/clup1.jpg"
            alt="cover"
            fill
            className="object-cover"
          />
        </div>

        {/* avatar */}
        <div className="relative w-full" style={{ height: 0 }}>
          <div
            style={{ position: "relative", top: -36 }}
            className="flex justify-center"
          >
            <div className="relative w-24 h-24">
              <Image
                src={form.avatar || "/images/avatar.jpg"}
                alt="avatar"
                fill
                className="rounded-full object-cover border-4 border-white shadow"
              />
              <button
                className={`absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-1 shadow transition ${
                  editing
                    ? "opacity-100 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (editing) setShowAvatarModal(true);
                }}
                disabled={!editing}
              >
                <div
                  style={{
                    background: ACCENT,
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                  }}
                  className="flex items-center justify-center"
                >
                  <Edit2 size={14} color={editing ? "white" : "#ccc"} />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
        </div>

        {/* form */}
        <div className="mt-15 space-y-4 pb-2">
          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              First Name
            </label>
            <input
              className="pill w-full"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={!editing}
              placeholder="First Name"
            />
            {errors.firstName && (
              <div className="text-xs text-red-500 mt-1">
                {errors.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Last Name
            </label>
            <input
              className="pill w-full"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={!editing}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">E-mail</label>
            <input
              className="pill w-full"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!editing}
              placeholder="example@mail.com"
              type="email"
            />
            {errors.email && (
              <div className="text-xs text-red-500 mt-1">{errors.email}</div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Date of Birth
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                className="pill w-full pr-14"
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                disabled={!editing}
                type="date"
                aria-label="Date of birth"
              />
              <button
                type="button"
                aria-label="Open calendar"
                onClick={handleOpenDatePicker}
                className="calendar-button"
                title="Open calendar"
              >
                <Calendar size={16} color={ACCENT} />
              </button>
            </div>
            {errors.dob && (
              <div className="text-xs text-red-500 mt-1">{errors.dob}</div>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Gender</label>
            <div className="flex gap-3">
              {["Male", "Female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    editing && handleChange("gender", g as "Male" | "Female")
                  }
                  className={`gender-chip flex-1 ${
                    form.gender === g ? "active" : ""
                  }`}
                  aria-pressed={form.gender === g}
                  disabled={!editing}
                >
                  <div
                    className={`gender-dot ${
                      form.gender === g ? "active" : ""
                    }`}
                  >
                    {form.gender === g && <Check size={12} color="white" />}
                  </div>
                  <span className="text-sm font-medium">{g}</span>
                </button>
              ))}
            </div>
            {errors.gender && (
              <div className="text-xs text-red-500 mt-1">{errors.gender}</div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Location</label>
            <textarea
              className="textarea-pill w-full"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              disabled={!editing}
              placeholder="Lorem Ipsum is simply dummy text..."
            />
          </div>

          {/* actions */}
          <div className="flex justify-center mt-4">
            {editing ? (
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`w-[92%] py-3 rounded-full font-medium transition ${
                  canSave
                    ? "bg-[var(--accent)] text-white shadow"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Save size={16} className="inline mr-2" /> Save Changes
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditing(true);
                  validateAll();
                }}
                className="w-[92%] py-3 rounded-full bg-gray-100 text-gray-800 font-medium shadow"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
