"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Calendar, Check, Save } from "lucide-react";

<<<<<<< HEAD
/**
 * Profile page — avatar no longer overlaps name inputs
 * - Key changes:
 *   - cover height increased to h-40 so avatar can overlap visually but not intrude into form
 *   - avatar placed with negative margin-top (over cover) but followed by margin-bottom so form is pushed down
 *   - removed weird zero-height wrapper
 */

export default function ProfilePage(): JSX.Element {
  const router = useRouter();
  const ACCENT = "#FF3B6A";

  const initialRef = useRef({
    firstName: "Andy",
    lastName: "Lexsian",
    email: "Andylexian22@gmail.com",
    dob: "1996-02-24",
    gender: "Male" as "Male" | "Female" | "",
    location:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  });

  const [form, setForm] = useState({ ...initialRef.current });
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

=======
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
  });

  const [initialForm, setInitialForm] = useState(form);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/u;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

  const isDirty = useMemo(
<<<<<<< HEAD
    () => JSON.stringify(form) !== JSON.stringify(initialRef.current),
    [form]
=======
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
  );

  const noErrors = Object.keys(errors).length === 0;
  const canSave = isDirty && noErrors;

<<<<<<< HEAD
  const validateField = (name: string, value: string) => {
    setErrors((prev) => {
      const next = { ...prev };

      if (name === "firstName" || name === "lastName") {
        if (!value.trim()) next[name] = `${name === "firstName" ? "First" : "Last"} name cannot be empty.`;
        else if (!nameRegex.test(value)) next[name] = "No numbers or special characters.";
=======
  // 🟢 Lấy dữ liệu user từ API khi mở trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/account");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const user = data[0];
          setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            dob: user.dob || "",
            gender: user.gender || "",
            location: user.location || "",
          });
          setInitialForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            dob: user.dob || "",
            gender: user.gender || "",
            location: user.location || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const validateField = (name: string, value: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (name === "firstName" || name === "lastName") {
        if (!value.trim())
          next[name] = `${
            name === "firstName" ? "First" : "Last"
          } name cannot be empty.`;
        else if (!nameRegex.test(value))
          next[name] = "No numbers or special characters.";
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
  };

  const validateAll = (): boolean => {
    const nextErrors: Record<string, string> = {};

<<<<<<< HEAD
    if (!form.firstName.trim()) nextErrors.firstName = "First name cannot be empty.";
    else if (!nameRegex.test(form.firstName)) nextErrors.firstName = "No numbers or special characters.";

    if (!form.lastName.trim()) nextErrors.lastName = "Last name cannot be empty.";
    else if (!nameRegex.test(form.lastName)) nextErrors.lastName = "No numbers or special characters.";

    if (!emailRegex.test(form.email)) nextErrors.email = "Invalid email address.";
=======
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
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1

    if (!form.dob) nextErrors.dob = "Date of birth required.";
    else if (!dobRegex.test(form.dob)) nextErrors.dob = "Invalid date format.";

    if (!form.gender) nextErrors.gender = "Please choose gender.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (!editing) setEditing(true);
  };

  const handleOpenDatePicker = () => {
<<<<<<< HEAD
    const el = dateInputRef.current as HTMLInputElement | null;
    if (!el || el.disabled) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.focus();
      try { el.click(); } catch {}
    }
  };

  const handleSave = () => {
    const ok = validateAll();
    if (!ok) {
      document.getElementById("profile-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    initialRef.current = { ...form };
    setEditing(false);
    setErrors({});
    alert("✅ Saved changes");
=======
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

  // 🟢 Gọi API lưu dữ liệu
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
      alert("✅ Saved changes");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save changes");
    }
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
  };

  useEffect(() => {
    if (editing) validateAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

<<<<<<< HEAD
=======
  if (loading)
    return (
      <div className="p-6 text-gray-600 text-sm">
        Loading user information...
      </div>
    );

>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
      <style>{`
        :root { --accent: ${ACCENT}; }
        /* hide scrollbars for the scroll container */
        #profile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        #profile-scroll::-webkit-scrollbar { display: none; }

        /* hide native date indicators that create extra visuals in some browsers */
        input[type="date"]::-webkit-clear-button,
        input[type="date"]::-webkit-inner-spin-button {
          -webkit-appearance: none; display: none;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; pointer-events: none; width: 0; height: 0; }
        input[type="date"]::-moz-calendar-picker-indicator { display: none; }

        /* pill styles */
        .pill { border: 2px solid rgba(255,59,106,0.35); border-radius: 28px; padding: 10px 16px; height:44px; background:white; box-sizing: border-box; }
        .pill:focus { outline:none; box-shadow: 0 0 0 4px rgba(255,59,106,0.06); border-color: var(--accent); }
        .textarea-pill { border: 2px solid rgba(255,59,106,0.35); border-radius: 14px; padding: 12px; min-height:96px; box-sizing: border-box; }

<<<<<<< HEAD
        .calendar-button { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; display:flex; align-items:center; justify-content:center; border-radius: 10px; background: white; border: 1px solid rgba(0,0,0,0.04); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
=======
        
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
        .calendar-button:active { transform: translateY(-50%) scale(0.98); }

        .gender-chip { border: 2px solid rgba(255,59,106,0.35); border-radius: 18px; padding: 8px 14px; display:flex; align-items:center; gap:10px; justify-center; }
        .gender-chip.active { background: rgba(255,59,106,0.06); border-color: var(--accent); color: var(--accent); }
        .gender-dot { width:18px; height:18px; border-radius:999px; border:2px solid rgba(255,59,106,0.4); display:flex; align-items:center; justify-content:center; }
        .gender-dot.active { background: var(--accent); border-color: var(--accent); color: white; }
      `}</style>

      {/* header */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button onClick={() => router.back()} className="p-2" aria-label="Back">
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-base font-semibold">Profile</h1>
      </div>

      {/* scrollable content */}
      <div
        id="profile-scroll"
        className="px-4 overflow-y-auto"
        style={{
          height: "calc(100vh - 88px)",
          paddingBottom: "calc(72px + env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
<<<<<<< HEAD
        {/* cover: increased height so avatar can overlap without intruding into the form */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mt-2">
          <Image src="/images/cover.jpg" alt="cover" fill className="object-cover" />
=======
        {/* cover */}
        <div className="relative w-full h-28 rounded-xl overflow-hidden mt-2">
          <Image
            src="/main_page/home/clup1.jpg"
            alt="cover"
            fill
            className="object-cover"
          />
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
          <button
            aria-label="Edit cover"
            className="absolute right-3 top-3 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow"
            onClick={() => alert("Cover edit coming soon")}
          >
<<<<<<< HEAD
            <div style={{ background: ACCENT, width: 28, height: 28, borderRadius: 999 }} className="flex items-center justify-center">
=======
            <div
              style={{
                background: ACCENT,
                width: 28,
                height: 28,
                borderRadius: 999,
              }}
              className="flex items-center justify-center"
            >
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
              <Edit2 size={14} color="white" />
            </div>
          </button>
        </div>

<<<<<<< HEAD
        {/* avatar: overlap cover visually but with margin-bottom so form is pushed down and won't be overlapped */}
        <div className="flex justify-center -mt-12 mb-6">
          <div className="relative w-24 h-24">
            <Image src="/images/avatar.jpg" alt="avatar" fill className="rounded-full object-cover border-4 border-white shadow" />
            <button
              className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-1 shadow"
              onClick={() => alert("Avatar edit coming soon")}
            >
              <div style={{ background: ACCENT, width: 28, height: 28, borderRadius: 999 }} className="flex items-center justify-center">
                <Edit2 size={14} color="white" />
              </div>
            </button>
=======
        {/* avatar */}
        <div className="relative w-full" style={{ height: 0 }}>
          <div
            style={{ position: "relative", top: -36 }}
            className="flex justify-center"
          >
            <div className="relative w-24 h-24">
              <Image
                src="/main_page/home/avatar.jpg"
                alt="avatar"
                fill
                className="rounded-full object-cover border-4 border-white shadow"
              />
              <button
                className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full p-1 shadow"
                onClick={() => alert("Avatar edit coming soon")}
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
                  <Edit2 size={14} color="white" />
                </div>
              </button>
            </div>
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
          </div>
        </div>

        {/* form */}
<<<<<<< HEAD
        <div className="mt-0 space-y-4 pb-2">
          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">First Name</label>
=======
        <div className="mt-2 space-y-4 pb-2">
          {/* First Name */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              First Name
            </label>
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
            <input
              className="pill w-full"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              disabled={!editing}
              placeholder="First Name"
            />
<<<<<<< HEAD
            {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
=======
            {errors.firstName && (
              <div className="text-xs text-red-500 mt-1">
                {errors.firstName}
              </div>
            )}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
          </div>

          {/* Last Name */}
          <div>
<<<<<<< HEAD
            <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
=======
            <label className="text-sm text-gray-600 mb-1 block">
              Last Name
            </label>
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
            <input
              className="pill w-full"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={!editing}
              placeholder="Last Name"
            />
<<<<<<< HEAD
            {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
=======
            {errors.lastName && (
              <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>
            )}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
<<<<<<< HEAD
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
=======
            {errors.email && (
              <div className="text-xs text-red-500 mt-1">{errors.email}</div>
            )}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
          </div>

          {/* Date of Birth with aligned calendar button */}
          <div>
<<<<<<< HEAD
            <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
            <div className="relative">
              <input
                ref={dateInputRef}
                className="pill w-full pr-14"
=======
            <label className="text-sm text-gray-600 mb-1 block">
              Date of Birth
            </label>
            <div className="relative">
              <input
                ref={dateInputRef}
                className="pill w-full pr-14" /* more right padding so calendar button doesn't overlap */
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                disabled={!editing}
                type="date"
                aria-label="Date of birth"
              />
<<<<<<< HEAD
=======
              {/* calendar button vertically centered with translateY(-50%) */}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
<<<<<<< HEAD
            {errors.dob && <div className="text-xs text-red-500 mt-1">{errors.dob}</div>}
          </div>

          {/* Gender chips */}
=======
            {errors.dob && (
              <div className="text-xs text-red-500 mt-1">{errors.dob}</div>
            )}
          </div>

          {/* Gender chips - wide and centered */}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Gender</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => editing && handleChange("gender", "Male")}
<<<<<<< HEAD
                className={`gender-chip flex-1 ${form.gender === "Male" ? "active" : ""}`}
                aria-pressed={form.gender === "Male"}
                disabled={!editing}
              >
                <div className={`gender-dot ${form.gender === "Male" ? "active" : ""}`}>
=======
                className={`gender-chip flex-1 ${
                  form.gender === "Male" ? "active" : ""
                }`}
                aria-pressed={form.gender === "Male"}
                disabled={!editing}
              >
                <div
                  className={`gender-dot ${
                    form.gender === "Male" ? "active" : ""
                  }`}
                >
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
                  {form.gender === "Male" && <Check size={12} color="white" />}
                </div>
                <span className="text-sm font-medium">Male</span>
              </button>

              <button
                type="button"
                onClick={() => editing && handleChange("gender", "Female")}
<<<<<<< HEAD
                className={`gender-chip flex-1 ${form.gender === "Female" ? "active" : ""}`}
                aria-pressed={form.gender === "Female"}
                disabled={!editing}
              >
                <div className={`gender-dot ${form.gender === "Female" ? "active" : ""}`}>
                  {form.gender === "Female" && <Check size={12} color="white" />}
=======
                className={`gender-chip flex-1 ${
                  form.gender === "Female" ? "active" : ""
                }`}
                aria-pressed={form.gender === "Female"}
                disabled={!editing}
              >
                <div
                  className={`gender-dot ${
                    form.gender === "Female" ? "active" : ""
                  }`}
                >
                  {form.gender === "Female" && (
                    <Check size={12} color="white" />
                  )}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
                </div>
                <span className="text-sm font-medium">Female</span>
              </button>
            </div>
<<<<<<< HEAD
            {errors.gender && <div className="text-xs text-red-500 mt-1">{errors.gender}</div>}
=======
            {errors.gender && (
              <div className="text-xs text-red-500 mt-1">{errors.gender}</div>
            )}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
<<<<<<< HEAD
                className={`w-[92%] py-3 rounded-full font-medium transition ${canSave ? "bg-[var(--accent)] text-white shadow" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
=======
                className={`w-[92%] py-3 rounded-full font-medium transition ${
                  canSave
                    ? "bg-[var(--accent)] text-white shadow"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
>>>>>>> e2420288edf33c3d3f66fa4974f8ea148cca12f1
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
