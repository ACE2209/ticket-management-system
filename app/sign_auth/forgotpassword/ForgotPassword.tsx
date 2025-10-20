"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleContinue = () => {
    console.log("Recovering password for:", email);
    router.push(`/sign_auth/otp?email=${encodeURIComponent(email)}`);
  };

  const isButtonDisabled = !email;

  return (
    <div
      className="flex flex-col min-h-screen items-center bg-[#FEFEFE] px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full max-w-md flex items-center justify-center pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          ←
        </button>
      </div>

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Recover your account password
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-gray-700 text-sm font-medium mb-2">
            E-mail
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[#FF2D55] outline-none"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={isButtonDisabled}
          className="mt-6 bg-[#FF2D55] text-white py-4 rounded-xl text-base font-semibold hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
