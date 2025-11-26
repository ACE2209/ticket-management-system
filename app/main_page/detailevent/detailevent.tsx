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
  const [upcomingEvents, setUpcomingEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const [descExpanded, setDescExpanded] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        // Fetch event detail
        const eventRes = await apiFetch(`/events/${eventId}`);
        setEvent(eventRes.data || eventRes);

        // Fetch upcoming events (limit to 5)
        const eventsRes = await apiFetch(`/events?limit=5&filter[status][_eq]=published`);
        const allEvents = eventsRes.data || eventsRes;
        // Filter out current event
        const otherEvents = Array.isArray(allEvents) 
          ? allEvents.filter((e: EventDetail) => e.id !== eventId)
          : [];
        setUpcomingEvents(otherEvents.slice(0, 5));
      } catch (err) {
        console.error("❌ Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate price range from all available tickets
  const allPrices = [
    ...(event.tickets?.map((t) => t.base_price) || []),
    ...(event.seat_zones?.flatMap((z) => z.tickets?.map((t) => t.base_price) || []) || []),
  ].filter((price): price is number => typeof price === "number" && price > 0);

  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

  return (
    <div className="relative bg-[#FEFEFE] w-full max-w-[375px] h-[812px] mx-auto overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Banner with gradient overlay */}
      <div className="absolute w-full h-[335px] left-0 top-0 overflow-hidden">
        <Image
          src={event.preview_image || "/images/default-event.jpg"}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/20"></div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-[44px] z-30 flex items-center justify-between px-4">
        {/* Time */}
        <div className="text-[15px] font-bold text-white tracking-[-0.165px] leading-[19px]">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        {/* Status icons placeholder */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 opacity-80"></div>
          <div className="w-4 h-3 opacity-80"></div>
          <div className="w-6 h-3 opacity-80"></div>
        </div>
      </div>

      {/* Header Navigation */}
      <div className="absolute left-0 right-0 top-[60px] z-20 px-6">
        <div className="flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="w-[48px] h-[48px] rounded-full bg-white/8 flex items-center justify-center cursor-pointer hover:bg-white/15 transition-all"
          >
            <ArrowLeft size={24} className="text-white" strokeWidth={2} />
          </button>

          {/* Title */}
          <h1 className="text-[18px] font-bold text-white leading-[26px] tracking-[0.005em]">
            Detail Event
          </h1>

          {/* Menu button */}
          <button className="w-[48px] h-[48px] rounded-full bg-white/0 flex items-center justify-center">
            <div className="flex flex-col gap-[3px]">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Content Container with rounded top */}
      <div className="absolute left-0 right-0 top-[299px] bottom-0 bg-white rounded-t-[30px] shadow-[0px_0px_5px_rgba(0,0,0,0.15)] z-10 overflow-y-auto">
        {/* Handle bar */}
        <div className="flex justify-center pt-[15px] pb-[13px]">
          <div className="w-[48px] h-[4px] bg-[#C7C7C7] rounded-[20px]"></div>
        </div>

        <div className="px-6 pb-32">
          {/* Event Title & Location */}
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-1">
              <h2 className="text-[22px] font-semibold text-[#1A1A1A] leading-[140%] mb-1">
                {event.name}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] text-[#666666] leading-[160%]">
                  {locationName}
                </span>
                {event.category_id && (
                  <>
                    <div className="w-1 h-1 bg-[#BFC6CC] rounded-full"></div>
                    <span className="text-[12px] text-[#666666]">{event.category_id.name}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Favorite button */}
            <button className="w-[40px] h-[40px] bg-white border border-[#E3E7EC] rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#F41F52" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>

          {/* Members Join Section */}
          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-black mb-2 tracking-[0.005em]">Members Join</h3>
            <div className="flex items-center gap-3">
              {/* Avatar Group */}
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-blue-200 border-2 border-white"
                    style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-pink-300"></div>
                  </div>
                ))}
              </div>
              <span className="text-[14px] font-medium text-[#E2614B] tracking-[-0.01em]">
                {event.bookings && event.bookings.length > 0 
                  ? `${event.bookings.length} ${event.bookings.length === 1 ? 'Person is' : 'People are'} Joined`
                  : 'Be the first to join'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-[16px] font-semibold text-[#111111] mb-2">
              Description
            </h3>
            <p className="text-[12px] text-[#111111] leading-[22px] opacity-70">
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

          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-[#111111] mb-3">
              Detail Event
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {/* Column 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} strokeWidth={1.3} />
                  <span className="text-[12px] text-[#66707A]">
                    {startTime
                      ? new Date(startTime).toLocaleDateString()
                      : "Updating..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} strokeWidth={1.3} />
                  <span className="text-[12px] text-[#66707A]">
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
                  <MapPin size={16} strokeWidth={1.5} />
                  <span className="text-[12px] text-[#66707A]">
                    {event.country}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Ticket size={16} strokeWidth={1.5} />
                  <span className="text-[12px] text-[#66707A]">
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
              <h3 className="text-[16px] font-semibold text-[#111111] mb-4">Location</h3>
              
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
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="#3F74EE" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 0l-1.5 12L7 8.5 10.5 12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tags Section */}
          {event.category_id && (
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-[#111111] mb-4 tracking-[0.005em]">Tags</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                  <span className="text-[12px] font-medium text-[#78828A] tracking-[0.005em]">
                    {event.category_id.name}
                  </span>
                </div>
                {event.city && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[12px] font-medium text-[#78828A] tracking-[0.005em]">
                      {event.city} Events
                    </span>
                  </div>
                )}
                {event.country && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[12px] font-medium text-[#78828A] tracking-[0.005em]">
                      {event.country}
                    </span>
                  </div>
                )}
                {event.status && (
                  <div className="px-4 py-2.5 border border-[#E3E7EC] rounded-xl">
                    <span className="text-[12px] font-medium text-[#78828A] tracking-[0.005em] capitalize">
                      {event.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-[#E3E7EC] mb-6"></div>

          {/* Event Organiser Section */}
          {event.creator_id && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {/* Organiser info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10">
                    {event.creator_id.avatar ? (
                      <Image
                        src={event.creator_id.avatar}
                        alt={`${event.creator_id.first_name || ''} ${event.creator_id.last_name || ''}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                    )}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4ACD61] border border-[#F8F8F8] rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#111111] tracking-[0.005em]">
                      {event.creator_id.first_name || event.creator_id.last_name 
                        ? `${event.creator_id.first_name || ''} ${event.creator_id.last_name || ''}`.trim()
                        : 'Event Organiser'}
                    </p>
                    <p className="text-[10px] text-[#78828A] opacity-75 tracking-[0.005em]">Event Organiser</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <button className="w-10 h-10 bg-[#F6F8FE] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#111111" opacity="0.8" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 10c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1zm-4-3H7c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-[#F6F8FE] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#111111" opacity="0.8" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 12c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-[#111111] tracking-[0.005em]">Upcoming Events</h3>
                <span className="text-[12px] font-medium text-[#78828A] tracking-[0.005em]">
                  {upcomingEvents.length} {upcomingEvents.length === 1 ? 'Event' : 'Events'}
                </span>
              </div>
              
              {/* Horizontal scroll container */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6">
                {upcomingEvents.map((upcomingEvent) => {
                  const eventPrice = upcomingEvent.tickets?.[0]?.base_price 
                    || upcomingEvent.seat_zones?.[0]?.tickets?.[0]?.base_price 
                    || 0;
                  const eventLocation = upcomingEvent.city || upcomingEvent.address || 'Location TBA';
                  const eventDate = upcomingEvent.event_schedules?.[0]?.start_time 
                    ? new Date(upcomingEvent.event_schedules[0].start_time)
                    : null;
                  const participantCount = upcomingEvent.bookings?.length || 0;

                  return (
                    <div 
                      key={upcomingEvent.id}
                      onClick={() => router.push(`/main_page/detailevent?id=${upcomingEvent.id}`)}
                      className="flex-shrink-0 w-[300px] border border-[#E3E7EC] rounded-2xl p-3 bg-white cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="relative w-full h-[160px] rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={upcomingEvent.preview_image || '/images/default-event.jpg'}
                          alt={upcomingEvent.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                          {upcomingEvent.category_id && (
                            <div className="bg-white rounded-full px-3 py-1.5">
                              <span className="text-[12px] font-medium text-[#111111]">
                                {upcomingEvent.category_id.name}
                              </span>
                            </div>
                          )}
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                          >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="#E53935" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 15.75l-1.32-1.2C3.78 11.03 1.5 8.86 1.5 6.19c0-2.18 1.72-3.94 3.94-3.94 1.24 0 2.43.58 3.22 1.49C9.15 2.83 10.34 2.25 11.58 2.25c2.22 0 3.94 1.76 3.94 3.94 0 2.67-2.28 4.84-6.2 8.36L9 15.75z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-[15px] font-semibold text-[#111111] mb-2 leading-[130%] line-clamp-2">
                            {upcomingEvent.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-[#9CA4AB]" strokeWidth={1.5} />
                            <span className="text-[12px] font-medium text-[#9CA4AB] truncate">
                              {eventLocation}
                            </span>
                          </div>
                        </div>
                        {eventPrice > 0 && (
                          <div className="bg-[#F45D42]/10 rounded-full px-3 py-1.5 flex-shrink-0 ml-2">
                            <span className="text-[12px] font-medium text-[#F41F52]">
                              ${eventPrice}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="h-px bg-[#E3E7EC] mb-3"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111111]">
                          {participantCount} {participantCount === 1 ? 'Participant' : 'Participants'}
                        </span>
                        {eventDate && (
                          <div className="flex items-center gap-2 text-[10px] text-[#66707A]">
                            <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <div className="w-1 h-1 bg-[#BFC6CC] rounded-full"></div>
                            <span>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Booking Section */}
      <div className="absolute left-0 right-0 bottom-0 h-[96px] bg-white shadow-[0px_-10px_40px_rgba(0,0,0,0.12)] z-30">
        <div className="flex items-center gap-3 px-6 py-[18px] h-full">
          {/* Price Section */}
          <div className="flex flex-col justify-center gap-1.5">
            <p className="text-[12px] font-medium text-[#111111] tracking-[0.005em]">
              Total Prize:
            </p>
            <p className="text-[24px] font-bold text-[#F41F52] leading-[32px] tracking-[0.005em]">
              {minPrice > 0 ? (
                <>
                  ${minPrice}
                  <span className="text-[14px] font-normal text-[#111111] ml-1">/Person</span>
                </>
              ) : (
                <span className="text-[#10B981]">Free</span>
              )}
            </p>
          </div>

          {/* Booking Button */}
          <button
            onClick={() => setShowTicket(true)}
            className="flex-1 h-[56px] bg-[#F41F52] text-white text-[16px] font-semibold rounded-[24px] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center tracking-[0.005em]"
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
