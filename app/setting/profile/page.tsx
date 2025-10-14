"use client";

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

  const menuItems = [
    {
      title: "Personal Info",
      items: [
        { icon: <User size={18} />, text: "Profile", route: "/profile" },
        { icon: <CreditCard size={18} />, text: "Payment Method", route: "/setting/notifications" },
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
    <div className="card flex flex-col min-h-screen bg-white relative pb-10 font-['PlusJakartaSans']">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => router.back()} aria-label="Back">
          <ArrowLeft className="text-gray-800" />
        </button>
        <h2 className="text-lg font-semibold">Setting</h2>
      </div>

      {/* Scrollable content */}
      <div
        className="h-[calc(812px-90px)] overflow-y-auto px-4"
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
            <p className="mb-1 text-sm font-medium text-gray-400">
              {section.title}
            </p>
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
                    <span className="text-sm font-medium text-gray-700">
                      {item.text}
                    </span>
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

        {/* Log Out Button (scrolls with content) */}
        <div className="mt-8 mb-8 flex justify-center">
          <button
            aria-label="Log out"
            onClick={() => {
              console.log("Logging out...");
              // Add your logout logic here
            }}
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
    </div>
  );
}

// Note: Ensure you have the necessary styles and components for BottomNavBar and other icons used in the menu items.