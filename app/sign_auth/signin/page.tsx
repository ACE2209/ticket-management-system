"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    router.push(`/sign_auth/signinemail?email=${encodeURIComponent(email)}`);
  };

  return (
    <div
      className="bg-[#F41F52] min-h-screen relative flex flex-col items-center"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="w-full text-center text-[#FEFEFE] pt-[76px] pb-8">
        <h4 className="text-[24px] font-bold leading-[32px] mb-1">
          Hi, Welcome Back! 👋
        </h4>
        <p className="text-[14px] font-medium leading-[22px] mx-auto max-w-[250px]">
          Tickla ❤️
        </p>
      </div>

      <div className="w-full h-full bg-white rounded-t-[32px] p-6 flex flex-col flex-grow">
        <label className="text-gray-700 text-base font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(""); 
          }}
          className={`w-full p-4 mb-2 border-none bg-gray-100 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#F41F52] outline-none transition duration-150 ${
            error ? "ring-2 ring-red-400" : ""
          }`}
        />
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Continue with Email Button */}
        <button
          onClick={handleContinue}
          disabled={!email}
          className="w-full bg-[#F41F52] text-white py-4 rounded-xl text-lg font-semibold hover:bg-pink-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with Email
        </button>

        {/* Divider "Or continue with" */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Continue with Google Button */}
        <button className="w-full flex items-center justify-center border border-gray-300 py-3 mb-4 rounded-xl text-gray-700 text-base font-semibold hover:bg-gray-50 transition duration-150">
          <Image
            src="/sign_auth/google.png"
            alt="Google"
            width={20}
            height={20}
            className="mr-3"
          />
          Continue with Google
        </button>

        {/* Continue with Apple Button */}
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

        {/* Sign Up Link */}
        <div className="mt-8 text-center text-gray-700">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/sign_auth/createaccount")}
            className="text-[#F41F52] font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
