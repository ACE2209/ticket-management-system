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
    time?: string; // optional — do not auto-generate if missing
    date?: string; // e.g. 'today' | 'yesterday'
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let mounted = true;

    // Dynamically import project data if present. If file doesn't exist, we keep empty data.
    import("@/data/notifications")
      .then((mod) => {
        if (!mounted) return;
        const data = (mod && (mod.notifications || [])) as Notification[];
        setNotifications(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // No data file or import failed — keep notifications empty.
        if (mounted) setNotifications([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
      <div className="px-6 pb-6 overflow-y-auto h-[calc(100vh-120px)]">
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
            {/* Today */}
            {today.length > 0 && <Section title="Today" notifications={today} />}

            {/* Yesterday */}
            {yesterday.length > 0 && <Section title="Yesterday" notifications={yesterday} />}
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  notifications,
}: {
  title: string;
  notifications: {
    id: number;
    avatar?: string;
    icon?: string;
    text: string;
    time?: string;
  }[];
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-semibold mb-4 px-6">{title}</h2>
      <div className="flex flex-col">
        {notifications.map((n) => (
          <div key={n.id} className="flex gap-3 px-6 py-3 hover:bg-gray-50">
            {/* Avatar/Icon */}
            {n.avatar ? (
              <div className="relative w-10 h-10">
                <Image
                  src={n.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#4FDF91] to-[#F9DE97] opacity-20"></div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center text-xl">
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
