"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [touched, setTouched] = useState({ pass: false, confirm: false });

  const MIN_LEN = 8;

  useEffect(() => {
    if (touched.pass) {
      if (password.length > 0 && password.length < MIN_LEN) {
        setErrorPass(`Password must be at least ${MIN_LEN} characters`);
      } else setErrorPass("");
    }

    if (touched.confirm) {
      if (confirm.length > 0 && confirm !== password) {
        setErrorConfirm("Passwords do not match");
      } else setErrorConfirm("");
    }
  }, [password, confirm, touched]);

  const canSubmit =
    password.length >= MIN_LEN && confirm === password && password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ pass: true, confirm: true });
    if (!canSubmit) return;
    router.push("/main_page/home");
  };

  return (
    <div className="flex flex-col w-[375px] h-[812px] mx-auto bg-white font-[PlusJakartaSans] px-6 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <ArrowLeft size={18} className="text-gray-700" />
      </button>

      {/* Title */}
      <div className="flex flex-col items-center mt-16 text-center">
        <h1 className="text-[22px] font-bold text-[#111111] leading-[32px]">
          Create a
          <span className="block">New Password</span>
        </h1>
        <p className="text-[#6C6C6C] text-[14px] mt-2">
          Enter your new password
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center mt-12 space-y-6"
      >
        {/* New Password */}
        <div>
          <label className="block text-[#78828A] text-[14px] mb-2 font-medium">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, pass: true }))}
            placeholder="Enter new password"
            className={`w-full h-[52px] rounded-[16px] px-4 bg-[#F6F8FE] text-[14px] placeholder-[#9CA4AB] focus:outline-none ${
              errorPass ? "border border-red-400" : "border border-transparent"
            }`}
          />
          {errorPass && (
            <p className="mt-2 text-xs text-red-500">{errorPass}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[#78828A] text-[14px] mb-2 font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched((s) => ({ ...s, confirm: true }))}
            placeholder="Confirm your password"
            className={`w-full h-[52px] rounded-[16px] px-4 bg-[#F6F8FE] text-[14px] placeholder-[#9CA4AB] focus:outline-none ${
              errorConfirm
                ? "border border-red-400"
                : "border border-transparent"
            }`}
          />
          {errorConfirm && (
            <p className="mt-2 text-xs text-red-500">{errorConfirm}</p>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full h-[56px] rounded-[24px] text-white text-[16px] font-semibold mt-8 transition ${
            canSubmit
              ? "bg-[#FF2D55] hover:opacity-95"
              : "bg-[#FFB0C0] cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
