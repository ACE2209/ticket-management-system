"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Đã xóa state [rememberMe, setRememberMe]
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleSignIn = () => {
    // Đã xóa 'rememberMe' khỏi console log
    console.log("Signing in with:", { email, password });
    // router.push('/dashboard');
  };

  const isSignInButtonDisabled = !email || !password;

  return (
    // Đặt min-h-screen lên phần tử ngoài cùng để đảm bảo chiều cao
    <div className="flex flex-col min-h-screen bg-[#FEFEFE]">
      
      {/* Header Section */}
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

      {/* Form Fields & Buttons Section (Sử dụng flex-grow để chiếm không gian chính) */}
      <div className="px-6 flex flex-col flex-grow">
        
        {/* Email Address Field */}
        <label htmlFor="email" className="block text-gray-700 text-base font-medium mb-2">
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

        {/* Password Field */}
        <label htmlFor="password" className="block text-gray-700 text-base font-medium mb-2">
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
        </div>

        {/* Forgot Password (Đã bỏ Remember Me, chỉ giữ Forgot Password và căn phải) */}
        <div className="flex justify-end items-center mb-6"> 
          <button
            onClick={() => router.push(`/sign_auth/forgotpassword?email=${encodeURIComponent(email)}`)}
            className="text-[#E53935] text-base font-semibold hover:underline"
          >
            Forgot Password
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isSignInButtonDisabled}
          className="w-full bg-[#F41F52] text-white py-4 rounded-xl text-lg font-semibold hover:bg-pink-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          Sign In
        </button>

        {/* Or continue with Divider */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Login Buttons */}
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
              width={24}
              height={24}
              className="mr-3"
            />
            Continue with Apple
          </button>
        </div>
      </div>
      
      {/* Don't have an account? Sign Up Link */}
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