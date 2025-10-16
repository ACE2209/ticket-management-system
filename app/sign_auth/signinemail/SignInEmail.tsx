"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [searchParams]);

  // ✅ Hàm đăng nhập
  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Lưu user tạm vào localStorage (có thể thay bằng cookie/session)
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("Sign in successful!");
      router.push("/main_page/home"); // Chuyển hướng sau khi đăng nhập
    } catch (err) {
      console.error("Sign in error:", err);
      alert("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSignInButtonDisabled = !email || !password || loading;

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      {/* Header */}
      <div className="flex items-center justify-center relative p-6 pt-10 pb-8">
        <button
          onClick={() => router.push("/sign_auth/signin")}
          className="absolute left-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          aria-label="Go back"
        >
          <span className="text-xl font-bold text-gray-800">←</span>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
      </div>

      {/* Form */}
      <div className="px-6 flex flex-col flex-grow">
        {/* Email */}
        <label
          htmlFor="email"
          className="block text-gray-700 text-base font-medium mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 border-none bg-gray-100 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#F41F52] outline-none transition duration-150"
        />

        {/* Password */}
        <label
          htmlFor="password"
          className="block text-gray-700 text-base font-medium mb-2"
        >
          Password
        </label>
        <div className="relative w-full mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-none bg-gray-100 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#F41F52] outline-none transition duration-150 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={() =>
              router.push(
                `/sign_auth/forgotpassword?email=${encodeURIComponent(email)}`
              )
            }
            className="text-[#E53935] text-base font-semibold hover:underline"
          >
            Forgot Password
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isSignInButtonDisabled}
          className={`w-full bg-[#F41F52] text-white py-4 rounded-xl text-lg font-semibold transition duration-150 mb-6 ${
            isSignInButtonDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-pink-600"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Or continue with */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social login */}
        <div className="flex flex-col gap-4 mt-6">
          <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl text-gray-700 text-base font-semibold hover:bg-gray-50 transition duration-150">
            <Image
              src="/sign_auth/google.png"
              alt="Google"
              width={24}
              height={24}
              className="mr-3"
            />
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-xl text-gray-700 text-base font-semibold hover:bg-gray-50 transition duration-150">
            <Image
              src="/sign_auth/apple.png"
              alt="Apple"
              width={20}
              height={20}
              className="mr-3"
              style={{ width: "auto", height: "auto" }}
            />
            Continue with Apple
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-700 text-base p-6">
        Don’t have an account?{" "}
        <span
          onClick={() => router.push("/sign_auth/createaccount")}
          className="text-[#FF2D55] font-semibold cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </div>
    </div>
  );
}
