"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Language() {
  const router = useRouter();
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  return (
    // 👇 THÊM flex flex-col justify-between để chia layout thành 2 phần: nội dung và nút dưới
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col justify-between p-6">
      {/* Phần trên: tiêu đề + chọn ngôn ngữ */}
      <div>
        {/* Tiêu đề */}
        <div className="text-center mt-16">
          <h1 className="text-2xl font-semibold">Select your Language</h1>
          <p className="text-gray-500 mt-2">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>

        {/* Ô chọn ngôn ngữ */}
        <div className="w-full mt-10">
          <label className="block text-sm font-medium  text-gray-500 mb-2 tracking-wide">
            Language
          </label>

          <button
            onClick={() => router.push("/sign_auth/selectlanguage/choose")}
            className="
              w-full
              flex items-center justify-between
              px-4 py-3
              rounded-full
              bg-[#F6F8FE]
              text-gray-700
              font-['Plus_Jakarta_Sans']
              border border-gray-200
              hover:bg-[#eef2fc]
              transition
            "
          >
            <span
              className={`${!language ? "text-gray-400" : "text-gray-800"}`}
            >
              {language || "Select"}
            </span>

            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Phần dưới: nút Continue */}
      <div className="mt-10 mb-6">
        <button
          onClick={() => router.push("/main_page/home")}
          disabled={!language}
          className="w-full py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
