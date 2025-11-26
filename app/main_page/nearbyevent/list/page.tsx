"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface EventDetail {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  preview_image?: string;
  place?: {
    type: string;
    // GeoJSON [lng, lat]
    coordinates: [number, number];
  };
  creator_id?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  category_id?: {
    id: string;
    name: string;
  };
  event_schedules?: {
    id: string;
    start_time: string;
    end_time: string;
  }[];
  tickets?: {
    id: string;
    base_price: number;
  }[];
  seat_zones?: {
    id: string;
    tickets?: {
      id: string;
      base_price: number;
    }[];
  }[];
  status?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function NearbyEventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoriesRes = await apiFetch("/categories");
        setCategories(categoriesRes.data || []);

        const eventsRes = await apiFetch(
          "/events?filter[status][_eq]=published&fields=*,category_id.*,event_schedules.*,tickets.*,seat_zones.tickets.*,creator_id.first_name,creator_id.last_name"
        );
        setEvents(eventsRes.data || []);
      } catch (e) {
        console.error("Failed to load events:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = events.filter((ev) => {
    const matchCategory = selectedCategory === "all" || ev.category_id?.id === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      ev.name.toLowerCase().includes(q) ||
      (ev.city || "").toLowerCase().includes(q) ||
      (ev.address || "").toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="w-[375px] h-[812px] bg-[#FEFEFE] flex flex-col items-center justify-center mx-auto gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-[#F41F52] rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-[15px] font-medium text-[#111111]">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="relative w-[375px] h-[812px] bg-[#FEFEFE] overflow-hidden mx-auto">
      {/* Status Bar */}
      <div className="absolute w-full h-[44px] top-0 left-0 bg-transparent z-50">
        <div className="absolute right-[13.5px] top-1/2 -translate-y-1/2 flex items-center gap-[5px]">
          {/* Signal */}
          <div className="w-[17px] h-[10.67px] relative">
            <div className="absolute left-0 bottom-0 w-[3px] h-[40%] bg-black rounded-[1.2px]" />
            <div className="absolute left-[5px] bottom-0 w-[3px] h-[60%] bg-black rounded-[1.2px]" />
            <div className="absolute left-[10px] bottom-0 w-[3px] h-[80%] bg-black rounded-[1.2px]" />
            <div className="absolute left-[15px] bottom-0 w-[3px] h-[100%] bg-black rounded-[1.2px]" />
          </div>
          {/* WiFi */}
          <div className="w-[15.4px] h-[11.06px] bg-black" />
          {/* Battery */}
          <div className="w-[24.5px] h-[11.5px] relative">
            <div className="absolute inset-0 border-[1px] border-black/40 rounded-[2.5px]" />
            <div className="absolute right-[2px] top-1/2 -translate-y-1/2 w-[18px] h-[7.67px] bg-black rounded-[1.6px]" />
            <div className="absolute right-[-1.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-black/40 rounded-[0.5px]" />
          </div>
        </div>
        <div className="absolute left-[29.5px] top-1/2 -translate-y-1/2 font-bold text-[15px] leading-[19px] tracking-[-0.165px] text-black">
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-[60px] left-0 right-0 px-6 z-30 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 bg-black/8 rounded-full flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="text-[18px] font-bold leading-[26px] tracking-[0.005em] text-[#111111]">Event List</h1>

        <button className="w-12 h-12 bg-transparent">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="absolute top-[132px] left-6 right-6 z-30">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#F6F8FE] rounded-[24px] h-[52px] flex items-center px-4 gap-3 border border-transparent">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#9CA4AB" strokeWidth="2" />
              <path d="M13 13l4 4" stroke="#9CA4AB" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[16px] font-medium text-[#111111] placeholder:text-[#9CA4AB]"
            />
            <div className="w-px h-4 bg-[#E3E7EC]" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#111111" className="opacity-90">
              <path d="M10 18h4v-2h-4v2zm-7-8v2h18v-2H3zm3-6v2h12V4H6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="absolute top-[200px] left-6 z-30 overflow-x-auto hide-scrollbar max-w-[calc(100%-48px)]">
        <div className="flex gap-3 pr-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`${selectedCategory === "all" ? "bg-[#F41F52] text-white" : "border border-[#E3E7EC] text-[#66707A]"} px-3 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap`}
          >
            All Event
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`${selectedCategory === c.id ? "bg-[#F41F52] text-white" : "border border-[#E3E7EC] text-[#66707A]"} px-3 py-2 rounded-full text-[12px] font-medium whitespace-nowrap`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[260px] w-[327px] h-[520px] overflow-y-auto pb-6">
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="w-full py-16 text-center text-[#78828A]">No events found</div>
          )}
          {filtered.map((event) => {
            const directTickets = event.tickets || [];
            const zoneTickets = event.seat_zones?.flatMap((sz) => sz.tickets || []) || [];
            const allTickets = [...directTickets, ...zoneTickets];
            const basePrice = allTickets.find((t) => t.base_price > 0)?.base_price || 0;

            const eventDate = event.event_schedules?.[0]?.start_time
              ? new Date(event.event_schedules[0].start_time).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                })
              : "TBA";

            const location = event.address
              ? `${event.address}${event.city ? ", " + event.city : ""}`
              : event.city || "Location TBA";

            return (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2 rounded-2xl bg-white hover:bg-gray-50 transition border border-transparent"
                onClick={() => router.push(`/main_page/detailevent?id=${event.id}`)}
              >
                <div className="relative w-[88px] h-[88px] bg-[#D1D8DD] rounded-xl overflow-hidden flex-shrink-0">
                  {event.preview_image ? (
                    <Image
                      src={event.preview_image}
                      alt={event.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                </div>

                <div className="flex-1 flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-[12px] text-[#78828A]">{event.category_id?.name || "Event"}</span>
                    <h4 className="text-[14px] font-semibold text-[#111111] leading-tight line-clamp-2">
                      {event.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#78828A]">
                      <span className="truncate max-w-[120px]">{location}</span>
                      <span className="w-1 h-1 bg-[#78828A] rounded-full" />
                      <span>{eventDate}</span>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-[rgba(244,93,66,0.1)]">
                    <span className="text-[10px] font-medium text-[#F41F52]">
                      {basePrice > 0 ? `$${basePrice}` : "FREE"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
