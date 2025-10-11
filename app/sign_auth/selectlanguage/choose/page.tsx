'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function ChooseLanguagePage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('');

  const languages = [
    'English (UK)',
    'English',
    'Bahasa Indonesia',
    'Chineses',
    'Croatian',
    'Czech',
    'Danish',
    'Filipino',
    'Finland',
  ];

  // Lấy ngôn ngữ đã lưu
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) setSelectedLang(saved);
  }, []);

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    localStorage.setItem('language', lang);
    setTimeout(() => router.back(), 250);
  };

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-6 flex flex-col">
      {/* Header */}
      <div className="relative mb-8">
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-0 p-2"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-center text-lg font-semibold">Select a Language</h1>
      </div>

      {/* Danh sách ngôn ngữ */}
    <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto ">

        {languages.map((lang) => {
          const isActive = selectedLang === lang;
          return (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-full border transition
                ${
                  isActive
                    ? 'border-pink-500 bg-[#fff0f6]'
                    : 'border-gray-200 bg-[#F6F8FE] hover:bg-[#eef2fc]'
                }`}
            >
              {/* Vòng tròn chọn */}
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2
                  ${
                    isActive
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-gray-300 bg-white'
                  }`}
              >
                {isActive && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Tên ngôn ngữ */}
              <span
                className={`text-base ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-700'
                }`}
              >
                {lang}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
