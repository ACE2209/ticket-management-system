"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy email từ query (nếu có)
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [searchParams]);

  // Hàm xử lý đăng ký
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    setLoading(true);

    const newAccount = { firstName, lastName, email, password };

    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "❌ Something went wrong");
        return;
      }

      console.log("✅ Account created:", data);
      alert("✅ Account created successfully!");
      router.push(`/sign_auth/otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  // Disable nút khi thiếu dữ liệu
  const isDisabled =
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword ||
    loading;

  return (
    <div
      className="flex flex-col min-h-screen items-center bg-white px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full max-w-md flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Sign Up</h2>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Complete your account
        </h1>
        <p className="text-sm text-gray-500">Create your new account</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">
          First Name
        </label>
        <input
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="p-3 mb-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
        />

        <label className="text-gray-700 text-sm font-medium mb-1">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="p-3 mb-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
        />

        <label className="text-gray-700 text-sm font-medium mb-1">E-mail</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 mb-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
        />

        <label className="text-gray-700 text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 mb-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
        />

        <label className="text-gray-700 text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 mb-6 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
        />

        <button
          onClick={handleSignUp}
          disabled={isDisabled}
          className="bg-[#FF2D55] text-white py-3 rounded-xl text-base font-semibold hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-700 mt-6 mb-8">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/sign_auth/signin")}
          className="text-[#FF2D55] font-semibold cursor-pointer hover:underline"
        >
          Login
        </span>
      </div>
    </div>
  );
}
