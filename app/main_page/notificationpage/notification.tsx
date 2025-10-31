"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NotificationPage() {
  const router = useRouter();

  type Notification = {
    id: number;
    avatar?: string;
    icon?: string;
    text: string;
    time?: string;
    date?: string;
    isRead?: boolean; // ✅ thêm trạng thái đọc
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let mounted = true;

    import("@/data/notifications")
      .then((mod) => {
        if (!mounted) return;
        const data = (mod && (mod.notifications || [])) as Notification[];
        setNotifications(
          Array.isArray(data)
            ? data.map((n) => ({ ...n, isRead: n.isRead ?? false }))
            : []
        );
      })
      .catch(() => {
        if (mounted) setNotifications([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const today = notifications.filter((n) => n.date === "today");
  const yesterday = notifications.filter((n) => n.date === "yesterday");

  return (
    <div className="bg-[#FEFEFE] min-h-screen font-['PlusJakartaSans'] text-[#111111] relative max-w-[375px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#11111114] flex items-center justify-center"
        >
          <span className="text-[#111111] text-lg">←</span>
        </button>
        <h1 className="text-[18px] font-bold">Notification</h1>
        <button className="text-[#111111] text-xl">☰</button>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 overflow-y-auto h-[calc(100vh-120px)] hide-scrollbar">
        {today.length === 0 && yesterday.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-20 h-20 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[32px] mb-4">
              🔔
            </div>
            <p className="text-[16px] font-medium text-[#78828A] text-center">
              No notifications yet
            </p>
          </div>
        ) : (
          <>
            {today.length > 0 && (
              <Section
                title="Today"
                notifications={today}
                onRead={handleRead}
              />
            )}
            {yesterday.length > 0 && (
              <Section
                title="Yesterday"
                notifications={yesterday}
                onRead={handleRead}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  notifications,
  onRead,
}: {
  title: string;
  notifications: {
    id: number;
    avatar?: string;
    icon?: string;
    text: string;
    time?: string;
    isRead?: boolean;
  }[];
  onRead: (id: number) => void;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-semibold mb-4 px-6">{title}</h2>
      <div className="flex flex-col">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onRead(n.id)}
            className={`flex gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition ${
              n.isRead ? "opacity-50" : "opacity-100"
            }`}
          >
            {/* Avatar/Icon */}
            {n.avatar ? (
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={n.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-xl flex-shrink-0">
                {n.icon}
              </div>
            )}

            {/* Text */}
            <div className="flex-1">
              <p className="text-[14px] font-medium leading-[22px] text-[#111111]">
                {n.text}
              </p>
              {n.time && (
                <p className="text-[12px] text-[#78828A] mt-1">{n.time}</p>
              )}
              <div className="h-[1px] bg-[#E3E7EC] mt-3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
