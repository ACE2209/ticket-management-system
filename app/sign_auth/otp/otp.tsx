"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function OtpPage() {
  const LENGTH = 4;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState(Array(LENGTH).fill(""));
  const [showModal, setShowModal] = useState(false);
  const [resendTime, setResendTime] = useState(0);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState(""); // "signup" hoặc "forgot"
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const e = searchParams.get("email");
    const a = searchParams.get("action");
    if (e) setEmail(e);
    if (a) setAction(a);
  }, [searchParams]);

  // Countdown resend
  useEffect(() => {
    if (resendTime > 0) {
      const t = setTimeout(() => setResendTime(resendTime - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTime]);

  const handleChange = (val: string, idx: number) => {
    if (/^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[idx] = val;
      setOtp(newOtp);

      if (val && idx < LENGTH - 1) inputRefs.current[idx + 1]?.focus();

      const code = newOtp.join("");
      if (code.length === LENGTH) {
        if (code === "4511") { // giả lập OTP đúng
          setShowModal(true);
        } else {
          setTimeout(() => {
            alert("Sai OTP, nhập lại nha!");
            setOtp(Array(LENGTH).fill(""));
            inputRefs.current[0]?.focus();
          }, 200);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = () => {
    setResendTime(30);
    alert("Đã gửi lại mã OTP!");
  };

  const handleContinue = () => {
    setShowModal(false);
    if (action === "forgot") {
      router.push(`/sign_auth/createnewpassword?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/main_page/home"); // Hoặc next step signup
    }
  };

  return (
    <div className="relative min-h-screen bg-white p-6 flex flex-col">
      <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
        ←
      </button>

      <div className="text-center mt-8">
        <h1 className="text-2xl font-semibold">Enter OTP</h1>
        <p className="text-gray-500 mt-2 text-sm">
          We sent a 4-digit code to <strong className="text-gray-900">{email}</strong>
        </p>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            value={d}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={1}
            className="w-14 h-14 text-center border-2 border-gray-300 rounded-full text-xl font-semibold focus:border-pink-500 focus:outline-none"
          />
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        Didn’t receive code?{" "}
        <button
          onClick={handleResend}
          disabled={resendTime > 0}
          className={`font-semibold ${resendTime > 0 ? "text-gray-400 cursor-not-allowed" : "text-pink-600 hover:underline"}`}
        >
          {resendTime > 0 ? `Resend in ${resendTime}s` : "Resend code"}
        </button>
      </div>

      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white w-80 rounded-2xl p-6 text-center shadow-2xl animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500 shadow-lg flex items-center justify-center animate-bounce">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">OTP Verified Successfully</h2>
            <p className="text-gray-500 text-sm mt-2 mb-5">You can now continue.</p>
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
