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

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/notifications/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("❌ Failed to fetch notifications");
          return;
        }

        const data = await res.json();

        const mapped = data.map((n: any) => ({
          id: Date.now() + Math.random(),
          icon: "🔔",
          text: n.notification_id?.id ?? "No content",
          time: new Date(n.date_created).toLocaleTimeString(),
          date:
            new Date(n.date_created).toDateString() === new Date().toDateString()
              ? "today"
              : "yesterday",
          isRead: false,
        }));

        setNotifications((prev) => [...mapped, ...prev]);
      } catch (err) {
        console.error("🔴 Error fetching notifications:", err);
      }
    };

    const setupAbly = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("❌ No user ID found in localStorage");
        return;
      }

      const Ably = await import("ably");

      ably = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_KEY!,
        clientId: "client-" + Date.now(),
      });

      ably.connection.on("connected", () => {
        console.log("✅ Ably connected");
      });

      ably.connection.on("failed", () => {
        console.log("❌ Ably connection failed");
      });

      const channelName = `notification:${userId}`;
      channel = ably.channels.get(channelName);

      console.log("📡 Subscribing to:", channelName);

      channel.subscribe("test", (message: any) => {
        console.log("📩 Received:", message.data);

        const newNoti = {
          id: Date.now(),
          icon: "🔔",
          text: message.data?.data?.body ?? message.data?.data ?? message.data,
          time: new Date().toLocaleTimeString(),
          date: "today",
          isRead: false,
        };

        setNotifications((prev) => [newNoti, ...prev]);
      });
    };

    const init = async () => {
      await fetchNotifications(); // 🔹 Lấy danh sách notification từ API
      setupAbly(); // 🔹 Kết nối realtime Ably
    };

    init();

    return () => {
      try {
        channel?.unsubscribe();
        ably?.connection.close();
        console.log("ℹ️ Ably disconnected");
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
        You don’t have any notifications at the moment.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFEFE] font-['PlusJakartaSans'] text-[#111111]">
      <div className="relative px-6 pt-6 pb-4 border-b border-[#E5E7EB] flex items-center">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-[48px] h-[48px] rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EDEDED] transition"
        >
          <span className="text-[#111111] text-lg">←</span>
        </button>
        <h1 className="mx-auto text-[18px] font-bold text-center">
          Notifications
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {today.length === 0 && yesterday.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="pb-6">
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
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
      </div>
    </div>
  );
}

function Section({ title, notifications, onRead }: any) {
  return (
    <div className="mt-4">
      <h2 className="text-[15px] sm:text-[16px] font-semibold mb-3 px-6 text-[#374151]">
        {title}
      </h2>
      <div className="flex flex-col divide-y divide-[#E5E7EB]">
        {notifications.map((n: any) => (
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
