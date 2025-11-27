"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar, Clock, ArrowLeft, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import SelectTicket from "../selectticket/selectticket";
import { apiFetch } from "@/lib/api";

interface EventDetail {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  preview_image?: string;
  slug?: string;
  status?: string;
  place?: {
    coordinates: [number, number]; // [longitude, latitude] theo GeoJSON format
    type: string; // "Point"
  };
  creator_id?: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    email?: string;
  };
  category_id?: {
    id: string;
    name: string;
    description?: string;
  };
  event_schedules?: {
    id: string;
    start_time: string;
    end_time: string;
  }[];
  tickets?: {
    id: string;
    rank: string;
    description?: string;
    base_price: number;
    status?: string;
  }[];
  seat_zones?: {
    id: string;
    description?: string;
    total_seats?: number;
    tickets?: {
      id: string;
      base_price: number;
    }[];
  }[];
  bookings?: {
    id: string;
  }[];
}

export default function DetailEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [descExpanded, setDescExpanded] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetail = async () => {
      try {
        const res = await apiFetch(`/events/${eventId}`);
        setEvent(res.data || res);
      } catch (err) {
        console.error("❌ Failed to load event detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Event not found
      </div>
    );
  }

  const locationName = event.address
    ? `${event.address}, ${event.city || ""}`.trim()
    : event.city || "Unknown location";

  // Extract latitude & longitude from backend response (GeoJSON format: [lng, lat])
  const latitude = event.place?.coordinates?.[1]; // latitude is index 1
  const longitude = event.place?.coordinates?.[0]; // longitude is index 0

  console.log("📍 Location from backend:", {
    address: event.address,
    city: event.city,
    country: event.country,
    latitude,
    longitude,
    place: event.place,
  });

  const startTime = event.event_schedules?.[0]?.start_time;

  const basePrice =
    event.tickets?.[0]?.base_price ??
    event.seat_zones?.[0]?.tickets?.[0]?.base_price ??
    0;

  return (
    <div className="relative bg-[#FEFEFE] w-full min-h-dvh mx-auto overflow-x-hidden font-['Plus_Jakarta_Sans'] hide-scrollbar">
      {/* Banner */}
      <div className="relative w-full h-[40vh] min-h-[220px] max-h-[420px]">
        <Image
          src={event.preview_image || "/images/default-event.jpg"}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      </div>

      {/* Header */}
      <div
        className="absolute left-0 right-0 mx-auto px-6 h-[48px] flex items-center justify-center z-20"
        style={{ top: "max(16px, calc(env(safe-area-inset-top, 0px) + 12px))" }}
      >
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-[48px] h-[48px] rounded-full bg-[#FEFEFE] bg-opacity-[0.08] flex items-center justify-center cursor-pointer hover:bg-opacity-[0.15] transition-all"
        >
          <ArrowLeft size={24} className="text-[#111111]" strokeWidth={2} />
        </button>

        {/* Title */}
        <h1 className="text-[18px] font-bold text-[#FEFEFE] leading-[26px] tracking-[0.005em]">
          Detail Event
        </h1>
      </div>

      {/* Content */}
      <section className="relative -mt-6 bg-[#FFFFFF] rounded-t-[30px] shadow-[0px_0px_5px_rgba(0,0,0,0.15)] z-10 h-[65vh] flex flex-col">
        {/* Thanh xám cố định */}
        <div className="flex justify-center pt-4 shrink-0">
          <div className="w-[48px] h-[6px] bg-[#C7C7C7] rounded-[20px]"></div>
        </div>
        <div className="px-6 pb-28 overflow-y-auto hide-scrollbar flex-1">
          {/* Title */}
          <div className="flex items-start gap-3 mb-[18px]">
            <div className="flex-1">
              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1A1A1A] leading-[140%] mb-1">
                {event.name}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[19px] font-semibold text-[#666666] leading-[160%]">
                  {locationName}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-[18px] font-semibold text-[#111111] mb-2">
              Description
            </h3>
            <p className="text-[16px] text-[#111111] leading-[22px] opacity-70">
              {(() => {
                const full =
                  event.description ||
                  "Ultricies arcu venenatis in lorem faucibus lobortis at.";
                if (descExpanded) return full;
                const max = 140;
                return full.length > max ? full.slice(0, max) + "..." : full;
              })()}
              {event.description && event.description.length > 140 && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="ml-1 inline text-[#F41F52] font-semibold cursor-pointer"
                >
                  {descExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          {event.creator_id && (
            <div className="mb-6">
              <div className="flex flex-col gap-1">
                {/* Name */}
                <p className="text-[18px] font-semibold text-[#111111] mb-2">
                  {`${event.creator_id.first_name || ""} ${
                    event.creator_id.last_name || ""
                  }`.trim() || "Event Organiser"}
                </p>
                {/* Email */}
                {event.creator_id.email && (
                  <p className="text-[16px] text-[#78828A] opacity-75 tracking-[0.005em]">
                    {event.creator_id.email}
                  </p>
                )}
                {/* Role */}
                <p className="text-[16px] text-[#78828A] opacity-75 tracking-[0.005em]">
                  Event Organiser
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-[18px] font-semibold text-[#111111] mb-3">
              Detail Event
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} strokeWidth={1.3} />
                  <span className="text-[15px] text-[#66707A]">
                    {startTime
                      ? new Date(startTime).toLocaleDateString()
                      : "Updating..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={1.3} />
                  <span className="text-[15px] text-[#66707A]">
                    {startTime
                      ? new Date(startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Updating..."}
                  </span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} strokeWidth={1.3} />
                  <span className="text-[15px] text-[#66707A]">
                    {event.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket size={16} strokeWidth={1.3} />
                  <span className="text-[15px] text-[#66707A]">
                    {(event.tickets ?? []).map((t) => t.rank).join(", ") ||
                      "No Tickets"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Map Section */}
          {latitude && longitude && (
            <div className="mb-6">
              <h3 className="text-[18px] font-semibold text-[#111111] mb-4">
                Location
              </h3>

              {/* Map Container with overlay */}
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-[#EFEFF4]">
                <iframe
                  src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Event Location Map"
                ></iframe>

                {/* Map overlay with direction button */}
                <div className="absolute top-3 right-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white border border-[#3F74EE] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="#3F74EE"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0l-1.5 12L7 8.5 10.5 12z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tags Section */}
          {event.category_id && (
            <div className="mb-6">
              <h3 className="text-[18px] font-semibold text-[#111111] mb-4 tracking-[0.005em]">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                  <span className="text-[16px] font-medium text-[#78828A] tracking-[0.005em]">
                    {event.category_id.name}
                  </span>
                </div>
                {event.city && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[16px] font-medium text-[#78828A] tracking-[0.005em]">
                      {event.city} Events
                    </span>
                  </div>
                )}
                {event.country && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[16px] font-medium text-[#78828A] tracking-[0.005em]">
                      {event.country}
                    </span>
                  </div>
                )}
                {event.status && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[16px] font-medium text-[#78828A] tracking-[0.005em] capitalize">
                      {event.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="absolute left-0 right-0 bottom-0 bg-[#FEFEFE] shadow-[0px_-10px_40px_rgba(0,0,0,0.12)] z-20">
        <div
          className="mx-auto flex items-center gap-3 px-6 py-[18px]"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          }}
        >
          <div className="flex flex-col justify-center gap-[6px]">
            <p className="text-[12px] font-medium text-[#111111]">
              Total Price:
            </p>
            <p className="flex items-baseline gap-0">
              <span className="text-[24px] font-bold text-[#F41F52]">
                {basePrice > 0
                  ? `${Number(basePrice).toLocaleString()}₫`
                  : "Free"}
              </span>

              <span className="text-[14px] text-[#6B6B6B]">/Person</span>
            </p>
          </div>

          <button
            onClick={() => setShowTicket(true)}
            className="flex-1 h-[56px] bg-[#F41F52] text-[#FEFEFE] text-[16px] font-semibold rounded-[24px] hover:bg-[#D91A46] transition-all flex items-center justify-center"
          >
            Booking Now
          </button>
        </div>
      </div>

      {showTicket && (
        <SelectTicket
          event={
            event
              ? {
                  ...event,
                  event_schedules: event.event_schedules
                    ? event.event_schedules.map((schedule) => ({
                        ...schedule,
                        id: String(schedule.id),
                      }))
                    : undefined,
                }
              : event
          }
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
