"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react";

export default function ChangePassWordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Kiểm tra điều kiện password
  const isLongEnough = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirm;

  const handleSubmit = async () => {
    if (!isLongEnough || !hasSpecialChar) {
      alert("❌ Password must be at least 8 characters and contain special characters!");
      return;
    }
    if (!passwordsMatch) {
      alert("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      let token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      const payload = { password }; // 🔹 theo Swagger: { "password": "string" }

      let res = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      // 🔁 Nếu token hết hạn, thử refresh token
      if (res.status === 401 && refreshToken) {
        const refreshRes = await fetch("http://localhost:8080/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!refreshRes.ok) throw new Error("Failed to refresh token");
        const refreshData = await refreshRes.json();
        localStorage.setItem("access_token", refreshData.access_token);
        token = refreshData.access_token;

        // Gửi lại PUT request
        res = await fetch("http://localhost:8080/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || "Update password failed");
      }

      alert("✅ Password updated successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-white relative pb-24 px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      </div>

      <p className="text-sm text-gray-500 mb-8">
        The new password must be different from the current password
      </p>

      {/* Password input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-800">Password</label>
        <div className="mt-2 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F41F52]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password rules */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Check size={16} className={isLongEnough ? "text-green-500" : "text-gray-400"} />
            <span className={isLongEnough ? "text-green-500" : "text-gray-400"}>
              There must be at least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Check size={16} className={hasSpecialChar ? "text-green-500" : "text-gray-400"} />
            <span className={hasSpecialChar ? "text-green-500" : "text-gray-400"}>
              There must be a unique symbol like @!#
            </span>
          </div>
        </div>
      </div>

      {/* Confirm password */}
      <div className="mb-10">
        <label className="text-sm font-medium text-gray-800">Confirm Password</label>
        <div className="mt-2 relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#F9FAFB] border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F41F52]"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full h-[52px] font-semibold rounded-full transition ${
          loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#F41F52] text-white hover:opacity-90"
        }`}
      >
        {loading ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}
