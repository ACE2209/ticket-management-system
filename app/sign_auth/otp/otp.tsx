"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function OtpPage() {
  const LENGTH = 6;
  const router = useRouter();
  const searchParams = useSearchParams();

  const API_BASE = "http://localhost:8080";

  const [otp, setOtp] = useState(Array(LENGTH).fill(""));
  const [showModal, setShowModal] = useState(false);
  const [resendTime, setResendTime] = useState(0);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("");
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ⭐ NEW: show error text here

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🧩 Lấy email, action, userId từ URL
  useEffect(() => {
    const e = searchParams.get("email");
    const a = searchParams.get("action");
    const id = searchParams.get("id");
    if (e) setEmail(e);
    if (a) setAction(a);
    if (id) setUserId(id);
  }, [searchParams]);

  // ⏳ Đếm ngược resend
  useEffect(() => {
    if (resendTime > 0) {
      const timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTime]);

  // 🧩 Khi nhập OTP
  const handleChange = (val: string, idx: number) => {
    if (/^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);

      if (val && idx < LENGTH - 1) inputRefs.current[idx + 1]?.focus();

      const code = newOtp.join("");
      if (code.length === LENGTH) verifyOtp(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async (code: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/auth/verify/${userId}?otp=${code}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setShowModal(true);
        setErrorMessage(""); // clear lỗi
      } else {
        setErrorMessage(data.message || "OTP không chính xác, thử lại nha!");
        setOtp(Array(LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi kết nối đến máy chủ!");
    }
  };

  // ✅ Resend OTP
  const handleResend = async () => {
    if (!userId) {
      setErrorMessage("Thiếu user ID!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-otp/${userId}`, {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setErrorMessage(""); 
        setResendTime(30);
      } else {
        setErrorMessage(data.message || "Không thể gửi lại mã OTP!");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Lỗi kết nối đến máy chủ!");
    }
  };

  // 🧭 Sau khi xác minh thành công
  const handleContinue = () => {
    setShowModal(false);
    if (action === "forgot") {
      router.push(
        `/sign_auth/createnewpassword?email=${encodeURIComponent(email)}`
      );
    } else {
      router.push("/sign_auth/signin");
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-6 flex flex-col">
      {/* 🔙 Nút back */}
      <button
        onClick={() => router.back()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        ←
      </button>

      {/* 🔢 Tiêu đề */}
      <div className="text-center mt-8">
        <h1 className="text-2xl font-semibold">Enter OTP</h1>
        <p className="text-gray-500 mt-2 text-sm">
          We sent a {LENGTH}-digit code to{" "}
          <strong className="text-gray-900">{email}</strong>
        </p>
      </div>

      {/* 🔘 6 ô nhập OTP */}
      <div className="flex justify-center gap-3 mt-8 max-w-xs mx-auto">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            value={d}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={1}
            className="w-11 h-11 sm:w-12 sm:h-12 text-center border-2 border-gray-300 rounded-full text-lg sm:text-xl font-semibold focus:border-pink-500 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
          />
        ))}
      </div>

      {/* 🔁 Resend */}
      <div className="mt-6 text-center text-sm text-gray-600">
        Didn’t receive code?{" "}
        <button
          onClick={handleResend}
          disabled={resendTime > 0}
          className={`font-semibold ${
            resendTime > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-pink-600 hover:underline"
          }`}
        >
          {resendTime > 0 ? `Resend in ${resendTime}s` : "Resend code"}
        </button>

        {/* ⭐ Hiển thị lỗi đỏ */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>

      {/* ✅ Modal thành công */}
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white w-80 rounded-2xl p-6 text-center shadow-2xl animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500 shadow-lg flex items-center justify-center animate-bounce">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              OTP Verified Successfully
            </h2>
            <p className="text-gray-500 text-sm mt-2 mb-5">
              You can now continue.
            </p>
            <button
              onClick={handleContinue}
              className="w-full bg-pink-600 text-white font-semibold py-2 rounded-xl shadow hover:bg-pink-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
