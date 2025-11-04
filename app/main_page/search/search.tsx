/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, MapPin, Heart } from "lucide-react";
import Filter from "@/components/main_page/home/Filter";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [likedEvents, setLikedEvents] = useState<number[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = searchParams.get("query")?.toLowerCase() || "";
    setQuery(q);
  }, [searchParams]);

  // ✅ Lấy danh sách event từ API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiFetch("/events?sort=-date_created");
        const data = res.data || res;
        setEvents(data);
      } catch (err) {
        console.error("❌ Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Lưu + load likedEvents (tim)
  useEffect(() => {
    const stored = localStorage.getItem("likedEvents");
    if (stored) setLikedEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("likedEvents", JSON.stringify(likedEvents));
  }, [likedEvents]);

  // ✅ Lưu + load recently viewed (những event đã bấm vào xem)
  useEffect(() => {
    const stored = localStorage.getItem("recentEvents");
    if (stored) setRecentEvents(JSON.parse(stored));
  }, []);

  const handleViewEvent = (event: EventType) => {
    // Lưu lại lịch sử xem gần nhất (tối đa 10 event)
    setRecentEvents((prev) => {
      const updated = [event, ...prev.filter((e) => e.id !== event.id)].slice(
        0,
        10
      );
      localStorage.setItem("recentEvents", JSON.stringify(updated));
      return updated;
    });

    router.push(`/main_page/detailevent?id=${event.id}`);
  };

  // ✅ Toggle tim
  const toggleLike = (eventId: number) => {
    setLikedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // ✅ Lọc theo từ khóa
  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => {
      const name = event.name.toLowerCase();
      const category =
        typeof event.category === "object"
          ? event.category?.name?.toLowerCase()
          : (event.category as string)?.toLowerCase();
      const location =
        typeof event.location === "object"
          ? event.location?.name?.toLowerCase()
          : (event.location as string)?.toLowerCase();

      return name.includes(q) || category?.includes(q) || location?.includes(q);
    });
  }, [query, events]);

  // ✅ Random 4 events cho phần trên
  const randomFour = useMemo(() => {
    if (events.length === 0) return [];
    return [...events].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [events]);

  const showFullLayout = !query;

  return (
    <div
      key={query}
      className="bg-[#FEFEFE] min-h-screen flex flex-col items-center"
    >
      <div className="w-full min-h-screen mx-auto font-['PlusJakartaSans'] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div
            onClick={() => router.back()}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>

          <h1 className="text-[18px] font-bold text-[#111111]">Search</h1>

          <div className="w-[48px] h-[48px] flex items-center justify-center">
            <div className="flex flex-col justify-between h-4">
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-6">
          <div className="flex justify-center mb-6">
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
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                defaultValue={query}
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
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
                  fontFamily: "Plus Jakarta Sans, sans-serif",
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
                  onClick={() => setIsFilterOpen(true)}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout khi không search */}
        {showFullLayout && (
          <>
            {/* 4 random event cards */}
            <div className="grid grid-cols-2 gap-3 px-6">
              {loading ? (
                <p className="text-center text-gray-500 col-span-2">
                  Loading...
                </p>
              ) : (
                randomFour.map((event) => (
                  <div
                    key={event.id}
                    className="relative rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => handleViewEvent(event)}
                  >
                    <Image
                      src={event.image_url || "/images/default-event.jpg"}
                      alt={event.name}
                      width={200}
                      height={100}
                      className="w-full h-[100px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-3">
                      <p className="text-white font-semibold text-[14px]">
                        {event.name}
                      </p>
                      <p className="text-white/80 text-[12px]">
                        {typeof event.category === "object"
                          ? event.category?.name
                          : event.category || "Event"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Recently Viewed */}
            <section className="px-6 mt-6 mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[16px] font-semibold text-[#111111]">
                  Recently Viewed
                </h2>
                {recentEvents.length > 0 && (
                  <button
                    className="text-[13px] text-[#5C5C5C]"
                    onClick={() => {
                      localStorage.removeItem("recentEvents");
                      setRecentEvents([]);
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {recentEvents.length === 0 ? (
                <p className="text-[#777] text-[14px] italic">
                  No recently viewed events.
                </p>
              ) : (
                <div className="flex overflow-x-scroll gap-4 pb-4 hide-scrollbar">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="min-w-[260px] bg-white border border-[#E3E7EC] rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div className="relative w-full h-[150px] px-2 pt-2">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          <Image
                            src={
                              event.image_url || (event as any).preview_image
                            }
                            alt={event.name}
                            fill
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 text-[#111111] text-[11px] font-medium px-2 py-[2px] rounded-full shadow-sm">
                            {typeof event.category === "object"
                              ? event.category?.name
                              : event.category || "Event"}
                          </div>
                          <div
                            className="absolute top-2 right-2 bg-white/90 p-[6px] rounded-full shadow-sm cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(event.id);
                            }}
                          >
                            <Heart
                              size={15}
                              color={
                                likedEvents.includes(event.id)
                                  ? "#E53E3E"
                                  : "#999"
                              }
                              fill={
                                likedEvents.includes(event.id)
                                  ? "#E53E3E"
                                  : "none"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-3 pt-3 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-[14px] font-semibold text-[#111111] leading-snug truncate max-w-[180px]">
                            {event.name}
                          </p>
                          <span className="bg-[#FFE6E6] text-[#E53E3E] text-[12px] font-semibold px-2 py-[2px] rounded-full">
                            {event.base_price
                              ? `${event.base_price.toLocaleString()}₫`
                              : "Free"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[#667085] text-[12px] mb-2">
                          <MapPin size={12} />
                          <span>
                            {typeof event.location === "object"
                              ? event.location?.name
                              : event.location || "Unknown"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[#667085] text-[12px]">
                          <span></span>
                          <span>{event.date || "Updating..."}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Khi có query */}
        {query && (
          <div className="px-6 mt-4 mb-10">
            <h2 className="text-[16px] font-semibold text-[#111111] mb-3">
              Search Results for "{query}"
            </h2>

            {filteredEvents.length === 0 ? (
              <p className="text-[#777] text-[14px] italic">
                No results found for &quot;{query}&quot;
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-3 bg-white shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleViewEvent(event)}
                  >
                    <div className="relative">
                      <Image
                        src={event.image_url || (event as any).preview_image}
                        alt={event.name}
                        width={120}
                        height={100}
                        className="w-[120px] h-[100px] object-cover"
                      />
                      <div
                        className="absolute top-2 right-2 bg-white/80 p-[4px] rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(event.id);
                        }}
                      >
                        <Heart
                          size={14}
                          color={
                            likedEvents.includes(event.id) ? "#E53E3E" : "#999"
                          }
                          fill={
                            likedEvents.includes(event.id) ? "#E53E3E" : "none"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between py-2 pr-3">
                      <div>
                        <p className="text-[12px] text-[#5C5C5C]">
                          {typeof event.category === "object"
                            ? event.category?.name
                            : event.category || "Event"}
                        </p>
                        <p className="text-[14px] font-semibold leading-tight text-[#111]">
                          {event.name}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[12px] text-[#667085]">
                        <span>{event.date || "Updating..."}</span>
                        <span className="text-[#E53E3E] font-semibold text-[13px]">
                          {event.base_price
                            ? `${event.base_price.toLocaleString()}₫`
                            : "Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
      </div>
    </div>
  );
}
