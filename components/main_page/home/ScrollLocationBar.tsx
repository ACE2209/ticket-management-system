"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Account {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location?: string;
  avatar?: string;
}

export default function ScrollLocationBar() {
  const [show, setShow] = useState(false);
  const [fullName, setFullName] = useState<string>("...");
  const [avatar, setAvatar] = useState<string>("");
  const scrollContainerRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user: Account = JSON.parse(storedUser);
      setFullName(`${user.lastName} ${user.firstName}`);
      setAvatar(user.avatar || "");
    }
  }, []);

  const avatarSrc =
    avatar && avatar.trim() !== "" ? avatar : "/images/avatar.jpg";

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
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-[30px] overflow-hidden border border-white flex-shrink-0">
            <Image
              src={avatarSrc}
              alt="Avatar"
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[#ECF1F6] font-['Plus Jakarta Sans'] font-medium text-[12px] leading-[20px]">
              Welcome
            </span>
            <span className="font-['Plus Jakarta Sans'] font-semibold text-[14px] leading-[22px] text-[#FEFEFE]">
              {fullName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
