/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface EventItemType {
  id: number;
  name: string;
  location?: { id: number; name: string } | string;
  category?: { id: number; name: string; description?: string } | string;
  base_price?: number;
  image_url?: string;
  date?: string;
}

const EventItem = ({ event }: { event: EventItemType }) => {
  const router = useRouter();

  const categoryName =
    typeof event.category === "object" ? event.category?.name : event.category;

  const locationName =
    typeof event.location === "object" ? event.location?.name : event.location;

  return (
    <div className="w-full flex gap-3 items-center">
      <div
        className="w-[88px] h-[88px] rounded-xl bg-[#D1D8DD] overflow-hidden flex-shrink-0 cursor-pointer"
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

      <div className="flex-1 flex justify-between h-[90px] py-[2px]">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[#78828A] text-[12px] leading-[19px] font-normal">
              {categoryName || "Uncategorized"}
            </span>

            <span
              onClick={() =>
                router.push(`/main_page/detailevent?id=${event.id}`)
              }
              className="text-[#111111] text-[14px] font-semibold leading-[18px] cursor-pointer hover:text-[#F41F52]"
            >
              {event.name}
            </span>
          </div>

          <span className="text-[#78828A] text-[12px] leading-[19px] font-normal">
            {locationName || "Unknown location"} • {event.date || "Updating..."}
          </span>
        </div>

        <div className="min-w-[46px] h-[25px] rounded-full bg-[#F41F521A] text-[#F41F52] flex justify-center items-center px-3 py-[6px] flex-shrink-0 self-start">
          <span className="text-[10px] font-medium text-center">
            {event.base_price
              ? `${event.base_price.toLocaleString()}₫`
              : "Free"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function OtherEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await apiFetch("/events?limit=10&sort=-date_created");
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

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Other Events
          </span>

          <span
            onClick={() => router.push("/main_page/eventList")}
            className="text-[#F41F52] text-xs font-medium cursor-pointer"
          >
            See All
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <span className="text-center text-gray-500 text-sm">
              Loading...
            </span>
          ) : events.length > 0 ? (
            events.map((event) => <EventItem key={event.id} event={event} />)
          ) : (
            <span className="text-center text-gray-400 text-sm">
              No events found.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
