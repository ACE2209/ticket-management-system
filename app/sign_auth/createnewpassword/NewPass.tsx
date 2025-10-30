/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
    else router.push("/sign_auth/forgotpassword");
  }, [searchParams, router]);

  const handleContinue = async () => {
    // ⚠️ Kiểm tra độ dài mật khẩu
    if (password.length < 8) {
      setMessage("⚠️ Password must be at least 8 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          new_password: password,
          token: token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "❌ Failed to reset password");
      }

      setMessage("✅ Password updated successfully! Redirecting...");
      setTimeout(() => router.push("/sign_auth/signin"), 2000);
    } catch (err: any) {
      console.error("❌ Error:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    !password ||
    !confirmPassword ||
    password !== confirmPassword ||
    password.length < 8 ||
    loading;

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FEFEFE] px-6">
      {/* Header */}
      <div className="relative w-full max-w-md flex items-center justify-center pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create a New Password
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter and confirm your new password
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* New Password */}
        <div className="relative flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px] text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {password && password.length < 8 && (
            <p className="text-xs text-red-500 mt-1">
              Password must be at least 8 characters
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-[38px] text-gray-400"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={isButtonDisabled}
          className={`mt-6 py-4 rounded-xl text-base font-semibold text-white w-full transition ${
            isButtonDisabled
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-[#FF2D55] hover:bg-pink-600"
          }`}
        >
          {loading ? "Updating..." : "Continue"}
        </button>

        {message && (
          <p
            className={`text-center mt-4 text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
