"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
  const router = useRouter();

  // State cho các tùy chọn bảo mật
  const [settings, setSettings] = useState({
    faceId: true,
    rememberPassword: true,
    touchId: true,
  });

  // Hàm toggle
  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-white relative pb-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
      </div>

      {/* Security Settings */}
      <div className="px-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm">
          {/* Face ID */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-gray-800 text-base">Face ID</span>
            <ToggleSwitch
              checked={settings.faceId}
              onChange={() => toggleSetting("faceId")}
            />
          </div>

          {/* Remember Password */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-gray-800 text-base">Remember Password</span>
            <ToggleSwitch
              checked={settings.rememberPassword}
              onChange={() => toggleSetting("rememberPassword")}
            />
          </div>

          {/* Touch ID */}
          <div className="flex justify-between items-center">
            <span className="text-gray-800 text-base">Touch ID</span>
            <ToggleSwitch
              checked={settings.touchId}
              onChange={() => toggleSetting("touchId")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Toggle Switch Component */
type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
};

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full p-[2px] transition-colors duration-200 ${
        checked ? "bg-rose-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      ></div>
    </button>
  );
}
