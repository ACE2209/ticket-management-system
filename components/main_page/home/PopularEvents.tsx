/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface PopularEventItem {
  id: string;
  name: string;
  preview_image?: string;
  location?: string;
  date_created?: string;
  base_price?: number;
  bookingsCount?: number;
}

export default function PopularEvents() {
  const router = useRouter();
  const [popularEvents, setPopularEvents] = useState<PopularEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const res = await apiFetch("/events?limit=20");
        const data = res.data || res;

        // Normalize events to match what this component expects.
        // Real API schema puts prices under `tickets[]` and times under `event_schedules[]`.
        const normalized = (data || []).map((e: any) => {
          const tickets = Array.isArray(e.tickets) ? e.tickets : [];
          const schedules = Array.isArray(e.event_schedules)
            ? e.event_schedules
            : [];

          const base_price = tickets.length ? tickets[0].base_price : undefined;
          const date_created = schedules.length
            ? schedules[0].start_time
            : e.earliest_start_time;
          const location =
            e.address || e.city || (e.place && e.place.type) || undefined;
          const bookingsCount = Array.isArray(e.bookings)
            ? e.bookings.length
            : 0;

          return {
            ...e,
            id: e.id,
            name: e.name,
            preview_image: e.preview_image,
            base_price,
            date_created,
            location,
            bookingsCount,
          } as PopularEventItem;
        });

        // Choose top 5 by bookings count (popularity). Fallback to base_price if bookings are equal.
        const top5 = normalized
          .sort((a: any, b: any) => {
            const byBookings = (b.bookingsCount || 0) - (a.bookingsCount || 0);
            if (byBookings !== 0) return byBookings;
            const aPrice = a.base_price ?? 0;
            const bPrice = b.base_price ?? 0;
            return bPrice - aPrice;
          })
          .slice(0, 5);

        setPopularEvents(top5);
      } catch (err) {
        console.error("❌ Failed to load popular events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Popular Event
          </span>
          <span
            onClick={() => router.push("/main_page/eventList")}
            className="text-[#F41F52] text-xs font-medium cursor-pointer"
          >
            See All
          </span>
        </div>

        {/* Danh sách sự kiện */}
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory hide-scrollbar">
          {loading ? (
            <span className="text-center text-gray-500 text-sm">
              Loading...
            </span>
          ) : popularEvents.length > 0 ? (
            popularEvents.map((event) => {
              const locationName = event.location || "Unknown";
              const date = event.date_created
                ? new Date(event.date_created).toLocaleDateString()
                : "Updating...";

              return (
                <div
                  key={event.id}
                  className="min-w-[260px] sm:min-w-[300px] h-[180px] sm:h-[196px] rounded-2xl relative flex-shrink-0 snap-start bg-cover bg-center shadow-md"
                  style={{
                    backgroundImage: `url(${
                      event.preview_image || "/images/default-event.jpg"
                    })`,
                  }}
                  onClick={() =>
                    router.push(`/main_page/detailevent?id=${event.id}`)
                  }
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/40" />

                  {/* Date + Location ở trên */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-medium text-white">
                    {/* Calendar icon */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{date}</span>

                    {/* Location icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{locationName}</span>
                  </div>

                  {/* Event Name ở dưới */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-sm sm:text-lg font-bold leading-tight">
                      {event.name}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-center text-gray-400 text-sm">
              No popular events found.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
