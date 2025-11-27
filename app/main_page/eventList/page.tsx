/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import Filter from "@/components/main_page/home/Filter";
import { apiFetch } from "@/lib/api";

interface EventType {
  id: number;
  name: string;
  category?: { id: number; name: string } | string;
  location?: { id: number; name: string } | string;
  base_price?: number;
  image_url?: string;
  date?: string;
}

function EventCard({ event }: { event: EventType }) {
  const router = useRouter();

  const categoryName =
    typeof event.category === "object" ? event.category?.name : event.category;

  return (
    <div className="card flex items-center gap-4 w-full mb-4">
      <div
        className="w-[88px] h-[88px] rounded-[12px] overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={() => router.push(`/main_page/detailevent?id=${event.id}`)}
      >
        <Image
          src={
            event.image_url ||
            (event as any).preview_image ||
            "/images/default-event.jpg"
          }
          alt={event.name}
          width={88}
          height={88}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#78828A] text-[12px] mb-[2px] truncate">
          {categoryName || "Uncategorized"}
        </p>

        <h3
          onClick={() => router.push(`/main_page/detailevent?id=${event.id}`)}
          className="text-[#111111] text-[14px] font-semibold mb-[4px] truncate cursor-pointer hover:text-[#F41F52]"
        >
          {event.name}
        </h3>

        <p className="text-[#78828A] text-[12px] truncate">
          {event.date || "Updating..."}
        </p>
      </div>

      <div className="flex-shrink-0 ml-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F45D421A] text-[#F41F52] text-[10px] font-medium">
          {event.base_price ? `${event.base_price.toLocaleString()}₫` : "Free"}
        </span>
      </div>
    </div>
  );
}

export default function EventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventType[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Event");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 Format date DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return "Updating...";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Updating...";
    return d.toLocaleDateString("vi-VN");
  };

  // 🔹 Lấy danh sách event từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiFetch("/events?sort=-date_created");
        const raw = res.data || res;

        const normalized = raw.map((e: any) => {
          const minPrice =
            e.tickets?.[0]?.base_price ??
            e.seat_zones
              ?.flatMap((sz: any) => sz.tickets || [])
              .filter((t: any) => t.base_price > 0)
              .sort((a: any, b: any) => a.base_price - b.base_price)?.[0]
              ?.base_price ??
            e.min_base_price ??
            0;

          return {
            id: e.id,
            name: e.name,
            category: e.category?.name, // ✔ giống file OtherEvents
            location:
              e.address ||
              (e.city && e.country ? `${e.city}, ${e.country}` : "Unknown"),
            base_price: minPrice,
            image_url: e.preview_image,
            date: formatDate(e.earliest_start_time || e.date_created), // ✔ format DD/MM/YYYY
          };
        });

        setEvents(normalized);
      } catch (err) {
        console.error("❌ Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 🔹 Danh sách category
  const filters = useMemo(() => {
    const categories = Array.from(
      new Set(events.map((e) => e.category).filter(Boolean))
    );
    return ["All Event", ...categories];
  }, [events]);

  // 🔹 Lọc theo category
  const filteredEvents = useMemo(() => {
    if (activeFilter === "All Event") return events;
    return events.filter((e) => e.category === activeFilter);
  }, [activeFilter, events]);

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center relative">
      <div className="w-full h-screen mx-auto font-['PlusJakartaSans'] flex flex-col">
        {/* 🧭 Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div
            onClick={() => router.back()}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>

          <h1 className="text-[18px] font-bold text-[#111111]">Event List</h1>

          <div className="w-[48px] h-[48px] flex items-center justify-center"></div>
        </div>

        {/* 🔍 Search + Filter */}
        <div className="px-6">
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "52px",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingLeft: "16px",
                paddingRight: "16px",
                backgroundColor: "#F6F8FE",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15.2"
                height="15.54"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98A2B3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer"
                onClick={() => {
                  const input = document.getElementById(
                    "event-search-input"
                  ) as HTMLInputElement;
                  const value = input?.value?.trim();
                  router.push(
                    value
                      ? `/main_page/search?query=${encodeURIComponent(value)}`
                      : `/main_page/search`
                  );
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                id="event-search-input"
                type="text"
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value.trim();
                    router.push(
                      value
                        ? `/main_page/search?query=${encodeURIComponent(value)}`
                        : `/main_page/search`
                    );
                  }
                }}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#98A2B3",
                  backgroundColor: "transparent",
                }}
              />

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "0px",
                    height: "18px",
                    borderLeft: "1px solid #E3E7EC",
                  }}
                ></div>

                <SlidersHorizontal
                  size={18}
                  stroke="#98A2B3"
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  onClick={() => setIsFilterOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Filter buttons */}
          <div className="hide-scrollbar flex gap-3 mt-4 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={typeof filter === "string" ? filter : filter?.name}
                onClick={() =>
                  setActiveFilter(
                    typeof filter === "string"
                      ? filter
                      : filter?.name || "All Event"
                  )
                }
                className={`rounded-[40px] border border-[#E3E7EC] font-semibold transition-all duration-200 px-4 ${
                  activeFilter ===
                  (typeof filter === "string" ? filter : filter?.name)
                    ? "bg-[#F41F52] text-[#FEFEFE] border-[#F41F52]"
                    : "bg-[#FEFEFE] text-[#66707A] hover:bg-[#F6F8FE]"
                }`}
                style={{
                  height: "36px",
                  fontSize: "12px",
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                {typeof filter === "string" ? filter : filter?.name}
              </button>
            ))}
          </div>
        </div>

        {/* 📅 Event list */}
        <div className="flex-1 overflow-y-auto px-6 mt-6 pb-6 hide-scrollbar">
          {loading ? (
            <p className="text-center text-gray-500 text-[14px] mt-10">
              Loading...
            </p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-center text-[#9CA4AB] text-[14px] mt-10">
              No events found.
            </p>
          )}
        </div>
      </div>

      {/* ⚙️ Modal Filter */}
      <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
