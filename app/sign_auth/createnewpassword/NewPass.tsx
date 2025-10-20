"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
    else router.push("/sign_auth/forgot");
  }, [searchParams, router]);

  const handleContinue = async () => {
    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "❌ Failed to update password");
        return;
      }

      alert("✅ Password updated successfully!");
      router.push("/sign_auth/signin");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled =
    !password || !confirmPassword || password !== confirmPassword || loading;

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#FEFEFE] px-6">
      <div className="relative w-full max-w-md flex items-center justify-center pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create a New Password
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter your new password
        </p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* New Password */}
        <div className="relative flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">New Password</label>
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
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
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
      </div>
    </div>
  );
}
