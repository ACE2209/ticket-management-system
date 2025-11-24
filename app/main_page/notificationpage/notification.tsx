/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";

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
    let ably: any;
    let channel: any;

    const setupAbly = async () => {
      const Ably = await import("ably");

      ably = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_KEY!,
        clientId: "client-" + Date.now(),
      });

      ably.connection.on("connected", () => {
        console.log("✅ Ably connected:", ably.connection.state);
      });

      ably.connection.on("failed", () => {
        console.log("❌ Ably connection failed");
      });

      channel = ably.channels.get("notifications");

      channel.subscribe("new_noti", (message: any) => {
        console.log("📩 Received message:", message.data);

        const newNoti: Notification = {
          id: Date.now(),
          icon: "🔔",
          text: message.data,
          time: new Date().toLocaleTimeString(),
          date: "today",
          isRead: false,
        };

        setNotifications((prev) => [newNoti, ...prev]);
      });

      console.log("ℹ️ Subscribed to channel:", channel.name);
    };

    setupAbly();

    return () => {
      try {
        channel?.unsubscribe();
        ably?.connection.close();
        console.log("ℹ️ Ably connection closed");
      } catch {}
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
    <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-10">
      <div className="bg-[#F1F3F5] flex items-center justify-center text-[40px] sm:text-[56px] text-[#6B7280] shadow-sm">
        🔔
      </div>
      <h2 className="text-lg sm:text-xl font-semibold mt-6 text-[#111111]">
        No notifications yet
      </h2>
      <p className="text-[#78828A] text-sm sm:text-base mt-2 max-w-[250px] sm:max-w-[300px] leading-relaxed">
        You don’t have any notifications at the moment. New updates will appear
        here when available.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE] font-['PlusJakartaSans'] text-[#111111]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
        <button
          onClick={() => router.back()}
          className="w-[48px] h-[48px] rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EDEDED] transition"
        >
          <span className="text-[#111111] text-lg">←</span>
        </button>
        <h1 className="text-[18px] font-bold">Notifications</h1>
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

      {/* Bottom Navbar */}
      <div className="border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
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
      <h2 className="text-[15px] sm:text-[16px] font-semibold mb-3 px-6 text-[#374151]">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-[#E5E7EB]">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => onRead(n.id)}
            className={`flex gap-3 px-6 py-3 hover:bg-[#FAFAFA] cursor-pointer transition ${
              n.isRead ? "opacity-50" : "opacity-100"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-xl flex-shrink-0">
              {n.icon}
            </div>

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
