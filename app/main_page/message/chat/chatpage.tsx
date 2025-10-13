"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mic, Send, Phone, Video, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface ChatPageProps {
  chatId?: string;
  onBack?: () => void;
}

export default function ChatPage({ chatId, onBack }: ChatPageProps) {
  const router = useRouter();

  const me = {
    id: "me",
    name: "Trương Trân",
    avatar: "/main_page/message/avatar.jpg",
  };

  const users = [
    {
      id: "1",
      name: "Esther Howard",
      avatar: "/main_page/message/avatar1.jpg",
      online: true,
    },
    {
      id: "2",
      name: "Wade Warren",
      avatar: "/main_page/message/avatar2.jpg",
      online: false,
    },
    {
      id: "3",
      name: "Chance Septimus",
      avatar: "/main_page/message/avatar3.jpg",
      online: true,
    },
    {
      id: "4",
      name: "Robert Fox",
      avatar: "/main_page/message/avatar4.jpg",
      online: false,
    },
  ];

  const user = users.find((u) => u.id === chatId) || users[0];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "them",
      text: `Hi, I'm ${user.name}. How’s it going?`,
      time: "15:42 PM",
      avatar: user.avatar,
    },
    {
      id: 2,
      sender: "me",
      text: "All good! How about you?",
      time: "15:43 PM",
      avatar: me.avatar,
    },
  ]);

  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: me.avatar,
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
  };

  return (
    <div className="card flex flex-col min-h-screen bg-white font-['PlusJakartaSans']">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-10 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack || (() => router.back())}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition"
          >
            <ArrowLeft className="w-6 h-6 text-[#111111]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
                  user.online ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                {user.name}
              </h2>
              <p className="text-sm text-gray-400 -mt-[2px]">
                {user.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pr-1">
          <Video className="w-5 h-5 text-gray-700 cursor-pointer hover:text-[#F41F52]" />
          <Phone className="w-5 h-5 text-gray-700 cursor-pointer hover:text-[#F41F52]" />
        </div>
      </div>

      {/* Chat content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "them" && (
              <div className="relative w-8 h-8">
                <Image
                  src={msg.avatar}
                  alt="avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === "me"
                  ? "bg-[#F41F52] text-white rounded-tr-none"
                  : "bg-[#F6F8FE] text-gray-800 rounded-tl-none"
              }`}
            >
              {msg.text}
              <div
                className={`text-[10px] mt-1 ${
                  msg.sender === "me"
                    ? "text-[#fff]/80 text-right"
                    : "text-gray-400 text-left"
                }`}
              >
                {msg.time}
              </div>
            </div>

            {msg.sender === "me" && (
              <div className="relative w-8 h-8">
                <Image
                  src={msg.avatar}
                  alt="me-avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="w-full border-t border-gray-100 px-4 py-3 flex items-center justify-center bg-white">
        <div className="flex items-center w-full max-w-[400px] bg-[#F6F8FE] rounded-full px-4 py-2 shadow-md">
          <Send className="w-5 h-5 text-[#F41F52]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 px-3"
          />
          <button
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-[#F41F52] flex items-center justify-center hover:bg-[#e01948] transition"
          >
            <Mic className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
