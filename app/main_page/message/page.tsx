"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";

export default function MessagePage() {
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Esther Howard",
      message: "Lorem ipsum dolor sit amet...",
      time: "10:20",
      unread: 2,
      avatar: "/main_page/message/avatar1.jpg",
    },
    {
      id: 2,
      name: "Wade Warren",
      message: "Lorem ipsum dolor sit amet...",
      time: "10:20",
      unread: 2,
      avatar: "/main_page/message/avatar2.jpg",
    },
    {
      id: 3,
      name: "Chance Septimus",
      message: "Lorem ipsum dolor sit amet...",
      time: "10:20",
      unread: 0,
      avatar: "/main_page/message/avatar3.jpg",
    },
    {
      id: 4,
      name: "Robert Fox",
      message: "Lorem ipsum dolor sit amet...",
      time: "10:20",
      unread: 0,
      avatar: "/main_page/message/avatar4.jpg",
    },
  ]);

  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="card flex flex-col min-h-screen bg-white relative pb-24">
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Message</h2>
      </div>

      {/* Search Bar */}
      <div className="w-full px-6 mt-2 mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-full border border-gray-200 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2 flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search Message..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="w-[1px] h-5 bg-gray-200 mx-2" />
          <button className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Message List with swipe-to-delete */}
      <div className="flex flex-col w-full px-6 space-y-4 overflow-hidden">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
            >
              {/* Nút delete nền sau - giống UI hình bạn gửi */}
              <div className="absolute inset-0 flex justify-end items-center pr-6 bg-[#FFF1EA] rounded-xl">
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-[#F5523D] hover:scale-110 transition-transform"
                >
                  <Trash2 size={22} strokeWidth={2.2} />
                </button>
              </div>

              {/* Khung tin nhắn có thể vuốt */}
              <motion.div
                drag="x"
                dragConstraints={{ left: -100, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) handleDelete(msg.id);
                }}
                className="flex items-center justify-between bg-white border-b border-gray-100 pb-4 cursor-pointer hover:bg-gray-50 rounded-xl px-2 transition relative z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={msg.avatar}
                      alt={msg.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    {msg.unread > 0 && (
                      <span className="absolute bottom-0 right-0 block w-3 h-3 bg-pink-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {msg.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate w-40">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">{msg.time}</span>
                  {msg.unread > 0 && (
                    <span className="mt-1 text-[10px] font-semibold bg-pink-500 text-white px-2 py-[1px] rounded-full">
                      {msg.unread}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Chat Button */}
      <button
        onClick={() => alert("New Chat Clicked")}
        className="absolute bottom-24 right-4 bg-[#F41F52] text-white text-sm font-medium px-6 py-3 rounded-full flex items-center gap-2 shadow-md hover:bg-[#e01948] transition"
      >
        <Plus size={16} /> New Chat
      </button>

      <BottomNavBar />
    </div>
  );
}
