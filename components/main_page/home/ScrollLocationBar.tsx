"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, MapPin } from "lucide-react";
import Image from "next/image";

interface Account {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob?: string;
  gender?: string;
  location?: string;
}

export default function ScrollLocationBar() {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState<string>("...");
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // ✅ Khi scroll xuống > 120px thì hiện thanh
  useEffect(() => {
    const container = document.querySelector(
      "[data-scroll-container]"
    ) as HTMLElement | null;

    if (container) {
      scrollContainerRef.current = container;
      const handleScroll = () => {
        setShow(container.scrollTop > 120);
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // ✅ Lấy dữ liệu người dùng hiện tại (từ file /api/account)
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch("/api/account", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load account");
        const accounts: Account[] = await res.json();

        // ✅ giả định người dùng hiện tại là account đầu tiên
        if (accounts.length > 0) {
          const currentUser = accounts[0];
          setLocation(currentUser.location || "Unknown");
        }
      } catch (err) {
        console.error("Error loading location:", err);
        setLocation("Unknown");
      }
    };

    fetchAccount();
  }, []);

  return (
    <div
      className={`absolute top-0 left-0 right-0 mx-auto transition-all duration-300 z-50
        ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        bg-[#F41F52] text-white py-[14px] px-6 rounded-b-2xl shadow-md`}
      style={{
        maxWidth: "430px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* --- Avatar + Location --- */}
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-[30px] overflow-hidden border border-white flex-shrink-0">
            <Image
              src="/main_page/home/avatar.jpg"
              alt="Avatar"
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[#ECF1F6] font-['Plus Jakarta Sans'] font-medium text-[12px] leading-[20px]">
              Location
            </span>
            <div className="flex items-center gap-[6px]">
              <MapPin size={14} stroke="#FEFEFE" className="flex-shrink-0" />
              <span className="font-['Plus Jakarta Sans'] font-semibold text-[14px] leading-[22px] text-[#FEFEFE]">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* --- Bell icon --- */}
        <div className="relative w-[44px] h-[44px] flex items-center justify-center rounded-[30px]">
          <Bell size={20} stroke="#FEFEFE" strokeWidth={1.5} />
          <span className="absolute w-[8px] h-[8px] bg-[#FACC15] rounded-full top-[13px] right-[11px]" />
        </div>
      </div>
    </div>
  );
}
