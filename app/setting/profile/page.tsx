"use client";

import { useState } from "react"; // 🟢 BỊ THIẾU DÒNG NÀY
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import {
  ArrowLeft,
  User,
  CreditCard,
  Lock,
  Globe,
  Trash2,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SettingPage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const menuItems = [
    {
      title: "Personal Info",
      items: [
        { icon: <User size={18} />, text: "Profile", route: "/profile" },
        {
          icon: <CreditCard size={18} />,
          text: "Payment Method",
          route: "/setting/notifications",
        },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: <Lock size={18} />, text: "Change Password", route: "/change-password" },
        { icon: <Lock size={18} />, text: "Forgot Password", route: "/forgot-password" },
        { icon: <Shield size={18} />, text: "Security", route: "/setting/security" },
      ],
    },
    {
      title: "General",
      items: [
        { icon: <Globe size={18} />, text: "Language", route: "/language" },
        { icon: <Trash2 size={18} />, text: "Clear Cache", extra: "88 MB" },
      ],
    },
    {
      title: "About",
      items: [
        { icon: <FileText size={18} />, text: "Legal and Policies", route: "/setting/legalandpolicies" },
        { icon: <HelpCircle size={18} />, text: "Help & Support", route: "/setting/helpandsupport" },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-24 font-['PlusJakartaSans']">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft className="text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold">Setting</h2>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* User Info */}
        <div className="flex items-center gap-3 py-3">
          <div className="relative h-12 w-12">
            <Image
              src="/main_page/home/avatar.jpg"
              alt="avatar"
              fill
              className="rounded-full object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <h3 className="text-base font-semibold">Wade Warren</h3>
            <p className="text-sm text-gray-500">@WadeWarren</p>
          </div>
        </div>

        {/* Menu sections */}
        {menuItems.map((section) => (
          <div key={section.title} className="mt-4">
            <p className="mb-1 text-sm font-medium text-gray-400">{section.title}</p>
            <div className="divide-y divide-gray-200 rounded-xl bg-white shadow-sm">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.route) router.push(item.route);
                    if (item.text === "Clear Cache") alert("Cache cleared ✅");
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                  {item.extra ? (
                    <span className="text-xs text-gray-500">{item.extra}</span>
                  ) : (
                    <ChevronRight className="text-gray-400" size={18} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Log Out Button */}
        <div className="mt-8 mb-8 flex justify-center">
          <button
            aria-label="Log out"
            onClick={() => setShowLogoutModal(true)}
            className="w-[90%] rounded-full border border-[#FF3B30] bg-white py-3 text-[#FF3B30] font-medium hover:bg-[#FF3B30] hover:text-white transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[85%] max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#FF3B30]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0a2 2 0 112 2h-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Log out</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out?</p>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full rounded-full border border-gray-200 bg-white py-3 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    setLoadingLogout(true);
                    setTimeout(() => {
                      setLoadingLogout(false);
                      setShowLogoutModal(false);
                      localStorage.clear();
                      sessionStorage.clear();
                      document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                          .replace(/^ +/, "")
                          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                      });
                      router.push("/sign_auth/signin");
                    }, 1000);
                  }}
                  disabled={loadingLogout}
                  className="w-full rounded-full bg-[#FF3B30] py-3 text-white font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {loadingLogout ? "Logging out..." : "Log Out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
