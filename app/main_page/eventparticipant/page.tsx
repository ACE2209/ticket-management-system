// app/main_page/participant/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreVertical,
  Search,
  Sliders,
  ChevronRight,
  X,
  MapPin,
} from "lucide-react";

type TicketType = "VVIP" | "VIP" | "OTHER";

interface Participant {
  id: string;
  name: string;
  ticket: string;
  avatar?: string;
}

/* demo participants */
const PARTICIPANTS: Participant[] = [
  { id: "p1", name: "Leslie Alexander", ticket: "VVIP Ticket", avatar: "/images/avatar1.jpg" },
  { id: "p2", name: "Wade Warren", ticket: "VVIP Ticket", avatar: "/images/avatar2.jpg" },
  { id: "p3", name: "Kristin Watson", ticket: "VIP Ticket", avatar: "/images/avatar3.jpg" },
  { id: "p4", name: "Albert Flores", ticket: "VIP Ticket", avatar: "/images/avatar4.jpg" },
  { id: "p5", name: "Ben Brekke", ticket: "VIP Ticket", avatar: "/images/avatar5.jpg" },
];

/* badge nhỏ cho avatar */
function MemberBadge({ ticket }: { ticket: string }) {
  const t: TicketType = ticket.toUpperCase().includes("VVIP")
    ? "VVIP"
    : ticket.toUpperCase().includes("VIP")
    ? "VIP"
    : "OTHER";

  if (t === "VVIP") {
    return (
      <div
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center ring-2 ring-white shadow z-20"
        style={{ background: "linear-gradient(135deg,#FACC15,#F59E0B)" }}
        aria-hidden
      >
        <svg width="12" height="10" viewBox="0 0 24 20" fill="none">
          <path d="M2 17h20l-3-9-4 6-4-8-4 8-5-6-2 9z" fill="white" />
        </svg>
      </div>
    );
  }

  if (t === "VIP") {
    return (
      <div
        className="w-[22px] h-[22px] rounded-full flex items-center justify-center ring-2 ring-white shadow z-20"
        style={{ background: "linear-gradient(135deg,#FB7185,#F97316)" }}
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l2.9 6.5L22 9l-5 4.1L18 22l-6-3.4L6 22l1-8.9L2 9l7.1-.5L12 2z" fill="white" />
        </svg>
      </div>
    );
  }

  return null;
}

function EventCard() {
  const event = {
    dateDay: "21",
    dateMonth: "MAR",
    image: "/images/event.jpg",
    title: "Vibe Fest: Summer Electronic Bash",
    venue: "South Statue Art Center",
    distance: "1.4 KM AWAY",
    joined: "250+ Joined",
    avatars: ["/images/avatar1.jpg", "/images/avatar2.jpg", "/images/avatar3.jpg", "/images/avatar4.jpg"],
  };

  return (
    <div className="w-full max-w-[327px] sm:max-w-none">
      <div
        className="relative w-[327px] h-[139px] sm:w-full bg-white rounded-2xl overflow-hidden"
        aria-label="Event card"
      >
        <div className="flex h-full">
          {/* LEFT: event image */}
          <div className="relative w-[140px] h-[139px] flex-shrink-0 overflow-hidden">
            <Image
              src={event.image}
              alt="Event"
              width={140}
              height={139}
              className="object-cover w-full h-full"
              priority
            />

            {/* date badge */}
            <div className="absolute top-[10px] left-[10px] z-20">
              <div className="w-[44px] h-[48px] rounded-[12px] bg-white flex flex-col items-center justify-center shadow">
                <div className="text-[18px] font-bold text-pink-500 leading-none">{event.dateDay}</div>
                <div className="text-[10px] text-gray-400 -mt-1">{event.dateMonth}</div>
              </div>
            </div>
          </div>

          {/* RIGHT: content */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-gray-400 tracking-wide">{event.distance}</div>

              <h3 className="mt-1 text-[18px] sm:text-[20px] font-bold leading-tight text-black">
                {event.title}
              </h3>

              <div className="mt-2 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-[10px] text-gray-500 truncate whitespace-nowrap max-w-[120px] sm:max-w-none">
                  {event.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center -space-x-3">
                {event.avatars.map((a, i) => (
                  <div key={i} className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden bg-gray-200 z-10">
                    <Image src={a} alt={`avatar-${i}`} width={32} height={32} className="object-cover" />
                  </div>
                ))}
              </div>

              <div className="text-pink-500 font-medium text-sm">{event.joined}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Participant | null>(null);
  const [filterType, setFilterType] = useState<"all" | "VVIP" | "VIP">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARTICIPANTS.filter((p) => {
      if (filterType === "VVIP" && !p.ticket.toUpperCase().includes("VVIP")) return false;
      if (filterType === "VIP" && p.ticket.toUpperCase().includes("VVIP")) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.ticket.toLowerCase().includes(q);
    });
  }, [query, filterType]);

  return (
    <div className="min-h-screen overflow-y-auto hide-scrollbar bg-white text-gray-800 p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="p-2 bg-gray-100 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold flex items-center gap-2">
            Event{" "}
            <span className="px-2 py-0.5 rounded bg-yellow-300 text-black font-bold">
              Participant
            </span>
          </h1>
        </div>

        <div className="relative">
          <button
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-full bg-transparent"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow z-40">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={() => {
                  setFilterOpen(true);
                  setMenuOpen(false);
                }}
              >
                Filters
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                onClick={() => alert("Share (placeholder)")}
              >
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      {/* EVENT CARD */}
      <div className="mb-4">
        <EventCard />
      </div>

      {/* SEARCH BAR + FILTER */}
      <div className="relative mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded"
            onClick={() => setFilterOpen(true)} // ✅ filter icon mở modal filter
          >
            <Sliders className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* PARTICIPANT LIST */}
      <div className="space-y-3">
        {filtered.map((p) => {
          const isVVIP = p.ticket.toUpperCase().includes("VVIP");
          const isVIP = !isVVIP && p.ticket.toUpperCase().includes("VIP");
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full flex items-center justify-between gap-3 bg-white rounded-2xl p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={p.avatar || "/images/avatar1.jpg"}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                  <div className="absolute right-[-3px] bottom-[-3px] z-30">
                    <MemberBadge ticket={p.ticket} />
                  </div>
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[14px]">{p.name}</p>
                    <span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 text-white font-semibold">
                      {isVVIP ? "VVIP" : isVIP ? "VIP" : "Member"}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500">{p.ticket}</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* FILTER MODAL */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFilterOpen(false)}
          />
          <div className="bg-white w-full sm:w-96 rounded-t-2xl sm:rounded-2xl p-4 z-60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filters</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-2 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  filterType === "VVIP" ? "bg-blue-50" : "bg-gray-100"
                }`}
                onClick={() => {
                  setFilterType("VVIP");
                  setFilterOpen(false);
                }}
              >
                Show VVIP only
              </button>

              <button
                className={`w-full text-left px-4 py-2 rounded cursor-pointer ${
                  filterType === "VIP" ? "bg-blue-50" : "bg-gray-100"
                }`}
                onClick={() => {
                  setFilterType("VIP");
                  setFilterOpen(false);
                }}
              >
                Show VIP only
              </button>

              <button
                className="w-full text-left px-4 py-2 rounded bg-gray-100 cursor-pointer"
                onClick={() => {
                  setFilterType("all");
                  setFilterOpen(false);
                }}
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
