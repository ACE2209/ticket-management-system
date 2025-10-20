"use client";

import { ArrowLeft, Search, Filter, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ParticipantPage() {
  const participants = [
    { name: "Leslie Alexander", ticket: "VVIP Ticket", img: "/avatar1.jpg" },
    { name: "Wade Warren", ticket: "VIP Ticket", img: "/avatar2.jpg" },
    { name: "Kristin Watson", ticket: "VIP Ticket", img: "/avatar3.jpg" },
    { name: "Albert Flores", ticket: "VIP Ticket", img: "/avatar4.jpg" },
    { name: "Ben Brekke", ticket: "VIP Ticket", img: "/avatar5.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-3">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <ArrowLeft className="w-5 h-5" />
        <h1 className="text-lg font-semibold">
          Event <span className="font-bold text-black">Participant</span>
        </h1>
      </div>

      {/* Event Card */}
      <div className="flex space-x-3 bg-gray-50 p-3 rounded-2xl mb-4 shadow-sm">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <Image src="/event.jpg" alt="Event" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <p className="text-xs text-gray-500">1.4 KM AWAY</p>
            <h2 className="text-base font-semibold">
              Vibe Fest: Summer Electronic Bash
            </h2>
            <p className="text-sm text-gray-500">
              South Statue Art Center
            </p>
          </div>
          <p className="text-pink-500 text-xs font-medium">250+ Joined</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
      </div>

      {/* Participant List */}
      <div className="space-y-3">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center justify-between bg-white rounded-2xl border p-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <Image src={p.img} alt={p.name} width={40} height={40} className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">{p.ticket}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
