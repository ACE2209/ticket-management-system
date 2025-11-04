"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as Ably from "ably";

export default function NotificationPage() {
  const router = useRouter();

  type Notification = {
    id: number;
    avatar?: string;
    icon?: string;
    text: string;
    time?: string;
    date?: string;
    isRead?: boolean;
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

    const ably = new Ably.Realtime("0nbAoQ.jOV2aQ:FJ0fW6HwEep4PYs89qbPUCwKOVr5J8I-a_bN6nniiW8");
    ably.connection.once("connected", () => {
      console.log("✅ Connected to Ably!");
    });

    const channel = ably.channels.get("get-started");

    channel.subscribe("first", (message) => {
      console.log("📩 Realtime message:", message.data);

      setNotifications((prev) => [
        {
          id: Date.now(),
          icon: "🔔",
          text: message.data,
          time: new Date().toLocaleTimeString(),
          date: "today",
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => {
      mounted = false;
      channel.unsubscribe();
      ably.connection.close();
    };
  }, []);

  const handleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const today = notifications.filter((n) => n.date === "today");
  const yesterday = notifications.filter((n) => n.date === "yesterday");

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-10 ">
      <div className="bg-[#F1F3F5] flex items-center justify-center text-[40px] sm:text-[56px] text-[#6B7280] shadow-sm">
        🔔
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-[#111111]">
        No notifications yet
      </h2>
      <p className="text-[#78828A] text-sm sm:text-base mt-2 max-w-[250px] sm:max-w-[300px] leading-relaxed">
        You don’t have any notifications at the moment.
        New updates will appear here when available.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col bg-[#FEFEFE] min-h-screen font-['PlusJakartaSans'] text-[#111111] relative border border-[#F1F1F1]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-10 pb-4 sm:px-6 sm:pt-12 border-b border-[#E5E7EB]">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EDEDED] transition"
        >
          <span className="text-[#111111] text-lg">←</span>
        </button>
        <h1 className="text-[18px] sm:text-[20px] font-bold">Notifications</h1>
        <button className="text-[#111111] text-xl opacity-50 hover:opacity-100 transition">
          ☰
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {today.length === 0 && yesterday.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="pb-6">
            {today.length > 0 && (
              <Section title="Today" notifications={today} onRead={handleRead} />
            )}
            {yesterday.length > 0 && (
              <Section
                title="Yesterday"
                notifications={yesterday}
                onRead={handleRead}
              />
            )}
          </div>
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
    <div className="mt-4">
      <h2 className="text-[15px] sm:text-[16px] font-semibold mb-3 px-5 sm:px-6 text-[#374151]">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-[#E5E7EB]">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onRead(n.id)}
            className={`flex gap-3 px-5 sm:px-6 py-3 hover:bg-[#FAFAFA] cursor-pointer transition ${
              n.isRead ? "opacity-50" : "opacity-100"
            }`}
          >
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
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xl flex-shrink-0">
                {n.icon}
              </div>
            )}

            <div className="flex-1">
              <p className="text-[14px] sm:text-[15px] font-medium text-[#111111] leading-[22px]">
                {n.text}
              </p>
              {n.time && (
                <p className="text-[12px] text-[#9CA3AF] mt-1">{n.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
