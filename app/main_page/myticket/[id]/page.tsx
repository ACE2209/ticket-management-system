/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Bell, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface BookingResponse {
  booking_date: string;
  event: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    preview_image: string;
    category: {
      id: string;
      name: string;
      description: string;
    };
    event_schedules: {
      id: string;
      start_time: string;
      end_time: string;
      start_checkin_time: string;
      end_checkin_time: string;
    }[];
  };
  id: string;
  price: number;
  tickets: {
    id: string;
    price: number;
    qr: string;
    seat: {
      id: string;
      seat_number: string;
      status: string;
    };
  }[];
}

export default function MyTicketPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // 🔹 Fetch booking API
  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    apiFetch(`/bookings/${bookingId}`)
      .then((raw: any) => {
        console.log("✅ Raw booking:", raw);

        const event = raw.event_id;

        const tickets = (raw.booking_items || []).map((item: any) => ({
          id: item.id,
          price: item.price,
          qr: item.qr,
          seat: {
            id: item.seat_id?.id,
            seat_number: item.seat_id?.seat_number,
            status: item.seat_id?.status,
          },
        }));

        // Lấy schedule từ event hoặc booking_items
        const schedule =
          event?.event_schedules?.[0] ||
          raw.booking_items?.[0]?.event_schedule_id ||
          null;

        // Chuẩn hóa theo BookingResponse bạn đang dùng UI
        const bookingData: BookingResponse = {
          id: raw.id,
          booking_date:
            raw.booking_date || raw.created_at || new Date().toISOString(),
          price:
            raw.price ??
            raw["price "] ??
            tickets.reduce((sum: number, t: any) => sum + (t.price || 0), 0),
          event: {
            id: event.id,
            name: event.name,
            address: event.address,
            city: event.city,
            country: event.country,
            preview_image: event.preview_image,
            category: event.category_id,
            event_schedules: schedule ? [schedule] : [],
          },
          tickets,
        };

        setBooking(bookingData);

        const eventDate = new Date(bookingData.booking_date);
        setMonth(eventDate.getMonth());
        setYear(eventDate.getFullYear());
        setSelectedDate(eventDate.getDate());
      })
      .catch((err) => {
        console.error("❌ Error loading booking:", err);
        setError("Failed to load booking data");
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>{error || "Booking not found."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#F41F52] text-white rounded-full text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const eventDate = new Date(booking.booking_date);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const visibleDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isCurrentBookingMonth =
    eventDate.getMonth() === month && eventDate.getFullYear() === year;

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans'] relative pb-10 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 pt-6 pb-4">
        <div
          onClick={() => router.back()}
          className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
        >
          <ChevronLeft className="text-[#111111]" />
        </div>
        <h1 className="text-[18px] font-bold text-[#111111]">My Ticket</h1>
        <div className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center opacity-90">
          <Bell size={20} className="text-[#111111]" />
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between w-[90%] mb-4">
        <button onClick={goPrevMonth}>
          <ChevronLeft size={18} className="text-[#111111] opacity-70" />
        </button>
        <div className="flex items-center space-x-2">
          <p className="text-[#111111] font-semibold text-[15px]">
            {new Date(year, month).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            onClick={() => setShowFullCalendar((prev) => !prev)}
            className={`p-2 rounded-full transition ${
              showFullCalendar
                ? "bg-[#F41F52] text-white"
                : "bg-[#F3F4F6] text-[#111111]"
            }`}
          >
            <Calendar size={16} />
          </button>
        </div>
        <button onClick={goNextMonth}>
          <ChevronRight size={18} className="text-[#111111] opacity-70" />
        </button>
      </div>

      {/* Calendar */}
      {showFullCalendar && (
        <div className="grid grid-cols-7 gap-2 text-center w-[90%] mb-5 transition-all duration-300 overflow-hidden">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {visibleDays.map((day) => {
            const isEventDay =
              isCurrentBookingMonth && eventDate.getDate() === day;
            return (
              <button
                key={day}
                onClick={() => isEventDay && setSelectedDate(day)}
                className={`w-[40px] h-[40px] rounded-full text-sm transition ${
                  isEventDay
                    ? selectedDate === day
                      ? "bg-[#F41F52] text-white"
                      : "bg-[#F3F4F6] text-[#111111]"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* --- EVENT CARD --- */}
      {selectedDate === eventDate.getDate() && (
        <>
          <div className="w-[90%] bg-white rounded-2xl overflow-hidden mb-4 flex items-center gap-3 p-3 shadow-sm flex-shrink-0">
            <div className="relative w-[110px] h-[120px] flex-shrink-0">
              <Image
                src={booking.event.preview_image}
                alt={booking.event.name}
                fill
                className="object-cover rounded-xl"
              />
              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[12px] leading-none">
                  {eventDate.getDate()}
                </p>
                <p className="text-[#F41F52] text-[10px] uppercase">
                  {eventDate.toLocaleString("en-US", { month: "short" })}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[#111111] text-[16px] font-semibold leading-snug mb-1">
                  {booking.event.name}
                </h2>
                <p className="text-[#66707A] text-[14px] mb-2">
                  {booking.event.address}, {booking.event.city}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-[13px] text-[#F41F52] font-semibold">
                    {booking.tickets.length}+ Tickets
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- TICKET LIST --- */}
          <div className="w-[90%] flex-1 overflow-y-auto max-h-[60vh] pr-1 space-y-4 hide-scrollbar">
            {booking.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="relative flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <h3 className="text-[15px] font-semibold text-[#111111]">
                    {booking.event.name}
                  </h3>
                  <p className="text-[13px] text-[#66707A] mt-1">
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <div className="flex items-center gap-3 text-[13px] text-[#66707A] mt-2">
                    <span>🎟️ Seat: {ticket.seat.seat_number}</span>
                    <span>•</span>
                    <span className="text-[#111111] font-medium">
                      ID: {ticket.id}
                    </span>
                  </div>
                </div>
                <div
                  className="relative flex items-center justify-center bg-[#003366] w-[100px] rounded-l-none rounded-r-2xl"
                  onClick={() =>
                    router.push(
                      `/main_page/ticketdetail?id=${booking.id}&ticketId=${ticket.id}`
                    )
                  }
                >
                  <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-white rounded-full z-10" />
                  <div className="bg-white w-[66px] h-[86%] flex items-center justify-center rounded-lg shadow-inner overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full">
                      <Image
                        src={ticket.qr || "/images/no-qr.png"}
                        alt="QR Code"
                        width={80}
                        height={80}
                        className="object-contain rounded-lg border border-gray-200"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
