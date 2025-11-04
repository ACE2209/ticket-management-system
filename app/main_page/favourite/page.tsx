 
/* eslint-disable react/no-unescaped-entities */

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import { apiFetch } from "@/lib/api";

interface EventType {
  id: number;
  name: string;
  category?: { id: number; name: string } | string;
  base_price?: number;
  image_url?: string;
  preview_image?: string;
  date?: string;
}

export default function FavouritePage() {
  const router = useRouter();

  const [likedEvents, setLikedEvents] = useState<number[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

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

  // ✅ Lấy dữ liệu tim từ localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem("likedEvents");
    if (storedLikes) setLikedEvents(JSON.parse(storedLikes));
  }, []);

  // ✅ Lọc các event đã tim
  const favouriteList = events.filter((e) => likedEvents.includes(e.id));

  const handleViewEvent = (event: EventType) => {
    router.push(`/main_page/detailevent?id=${event.id}`);
  };

  const toggleLike = (id: number) => {
    setLikedEvents((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("likedEvents", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans']">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 w-full">
        <div
          onClick={() => router.back()}
          className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
        >
          <span className="text-[#111111] text-[20px] select-none">←</span>
        </div>

        <h1 className="text-[18px] font-bold text-[#111111]">Favourites</h1>

        <div className="w-[48px] h-[48px]" />
      </div>

      {/* Content */}
      <div className="w-full px-6 mb-20">
        {/* ❤️ Favourite Events */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[16px] font-semibold text-[#111111]">
              Favourite Events
            </h2>
            {favouriteList.length > 0 && (
              <button
                className="text-[13px] text-[#5C5C5C]"
                onClick={() => {
                  localStorage.removeItem("likedEvents");
                  setLikedEvents([]);
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : favouriteList.length === 0 ? (
            <p className="text-[#777] italic text-[14px]">
              You haven't liked any events yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {favouriteList.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 bg-white shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handleViewEvent(event)}
                >
                  <div className="relative">
                    <Image
                      src={
                        event.image_url ||
                        event.preview_image ||
                        "/images/default-event.jpg"
                      }
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
        </section>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
      </div>
    </div>
  );
}
