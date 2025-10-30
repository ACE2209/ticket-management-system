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
  const [errorMessage, setErrorMessage] = useState("");

  // Lấy email từ query (nếu có)
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [searchParams]);

  // Hàm xử lý đăng ký
  const handleSignUp = async () => {
    if (password.length < 8) {
      setErrorMessage("⚠️ Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match!");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    const newAccount = {
      firstName,
      lastName,
      email,
      password,
      role: "customer",
    };

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });

      const data = await res.json();
      console.log("📩 Server response:", data);

      if (!res.ok) {
        const serverMsg =
          data?.error ||
          data?.message ||
          data?.errors?.[0]?.message ||
          "❌ Something went wrong";
        setErrorMessage(serverMsg);
        return;
      }

      alert("✅ Account created successfully!");

      const userId = data.user?.id || data.id;
      if (!userId) {
        setErrorMessage("⚠️ Cannot find user ID from server response.");
        return;
      }

      router.push(
        `/sign_auth/otp?email=${encodeURIComponent(
          email
        )}&id=${userId}&action=signup`
      );

      localStorage.setItem("currentUser", JSON.stringify(newAccount));
    } catch (err) {
      console.error(err);
      setErrorMessage("❌ Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword ||
    password.length < 8 ||
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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`p-3 mb-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none ${
            password && password.length < 8 ? "ring-red-400" : ""
          }`}
        />
        {password && password.length < 8 && (
          <p className="text-red-500 text-xs mb-3">
            ⚠️ Password must be at least 8 characters long.
          </p>
        )}

        <label className="text-gray-700 text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`p-3 mb-2 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none ${
            confirmPassword && password !== confirmPassword ? "ring-red-400" : ""
          }`}
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-red-500 text-xs mb-4">⚠️ Passwords do not match.</p>
        )}

        {/* Hiển thị lỗi tổng quát từ server */}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4 font-medium">
            {errorMessage}
          </p>
        )}

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
