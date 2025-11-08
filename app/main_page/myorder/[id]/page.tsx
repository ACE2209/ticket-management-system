/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Barcode from "react-barcode";
import { apiFetch } from "@/lib/api";

interface Seat {
  id: string;
  seat_number: string;
  status: string;
}

interface Ticket {
  id: string;
  price: number;
  qr: string;
  seat: Seat;
}

interface EventSchedule {
  id: string;
  start_time: string;
  end_time: string;
  start_checkin_time: string;
  end_checkin_time: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Event {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  category: Category;
  preview_image: string;
  event_schedules: EventSchedule[];
}

interface BookingDetail {
  id: string;
  booking_date: string;
  price: number;
  event: Event;
  tickets: Ticket[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const raw = await apiFetch(`/bookings/${id}`);

        // Chuẩn hóa dữ liệu từ API mới
        const event = raw.event_id;
        const bookingItems = raw.booking_items || [];

        const tickets = bookingItems.map((item: any) => ({
          id: item.id,
          price: item.price,
          qr: item.qr,
          seat: {
            id: item.seat_id?.id,
            seat_number: item.seat_id?.seat_number,
            status: item.seat_id?.status,
          },
        }));

        const schedule =
          event?.event_schedules?.[0] ||
          bookingItems[0]?.event_schedule_id ||
          null;

        const data = {
          id: raw.id,
          booking_date: raw.created_at || new Date().toISOString(),
          price:
            raw.price ??
            raw["price "] ??
            bookingItems.reduce((s: number, it: any) => s + (it.price || 0), 0),
          event: {
            id: event.id,
            name: event.name,
            address: event.address,
            city: event.city,
            country: event.country,
            preview_image: event.preview_image,
            category: event.category_id,
            event_schedules: event.event_schedules,
          },
          tickets: tickets,
          schedule: schedule,
        };

        setBooking(data);
      } catch (err) {
        console.error("❌ Lỗi tải booking:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading booking...</div>
    );

  if (!booking)
    return <div className="text-center mt-10">Booking not found 😢</div>;

  const event = booking.event;
  const schedule = event.event_schedules?.[0];
  const totalTickets = booking.tickets?.length || 0;

  const eventDate = schedule?.start_time
    ? new Date(schedule.start_time)
    : new Date(booking.booking_date);
  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = eventDate.toLocaleString("en-US", { month: "short" });

  const location = `${event.address}, ${event.city}`;
  const noteText = "E-ticket valid for single entry only";

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans']">
      {/* Header */}
      <div className="w-full max-w-[420px] px-6 pt-6 pb-4 flex items-center justify-between">
        <div
          onClick={() => router.back()}
          className="w-[40px] h-[40px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="text-[#111111] text-[20px] select-none">←</span>
        </div>

        <h1 className="text-[18px] font-semibold text-[#111111]">
          Order Detail
        </h1>

        <div className="w-[40px] h-[40px] flex items-center justify-center">
          <div className="flex flex-col justify-between h-4">
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Bill container */}
      <div className="relative w-full max-w-[350px] bg-white rounded-[24px] shadow-md mt-4 overflow-hidden border border-[#E3E7EC]">
        <div className="p-5">
          {/* Event header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative w-[45%]">
              <Image
                src={event.preview_image || "/images/default-event.jpg"}
                alt={event.name}
                width={200}
                height={200}
                className="w-full h-[150px] object-cover rounded-[16px]"
              />
              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[14px] leading-none">
                  {day}
                </p>
                <p className="text-[#F41F52] text-[10px] uppercase leading-none">
                  {month}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[#111111] text-[17px] font-semibold leading-snug mb-1">
                  {event.name}
                </h2>
                <p className="text-[#66707A] text-[13px] mb-1">{location}</p>
                <p className="text-[#9CA4AB] text-[14px]">
                  {new Date(schedule?.start_time || "").toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Răng cưa */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute left-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="absolute right-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="w-full border-t border-dashed border-[#E3E7EC]"></div>
        </div>

        {/* Bill content */}
        <div className="p-5 pt-3 space-y-3 text-[13px] text-[#111111] bg-[#FFFBFC]">
          <div className="flex justify-between">
            <span className="text-[#78828A]">Quantity</span>
            <span>
              {totalTickets} – E Ticket{totalTickets > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#78828A]">Date Order</span>
            <span>
              {new Date(booking.booking_date).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#78828A]">Notes</span>
            <span className="text-right">{noteText}</span>
          </div>

          {/* ✅ Total — sạch TypeScript */}
          <div className="border-t border-[#E3E7EC] pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#F41F52]">${booking.price.toFixed(2)}</span>
          </div>

          {/* ✅ Barcode */}
          <div className="flex flex-col items-center mt-4">
            <div className="bg-white p-2 rounded-md max-w-[200px] overflow-hidden">
              <Barcode
                value={booking.tickets?.[0]?.qr || "UNKNOWN"}
                height={60}
                width={1.2}
                displayValue={false}
                background="#FFFBFC"
                lineColor="#111"
                margin={0}
              />
            </div>
            <p className="text-[12px] text-[#9CA4AB] mt-1">
              {booking.tickets?.[0]?.qr || "No QR"}
            </p>
          </div>
        </div>
      </div>

      <button className="mt-10 mb-10 bg-[#F41F52] text-white font-semibold text-[16px] px-8 py-3 rounded-full shadow-md w-[80%] max-w-[360px]">
        Download PDF
      </button>
    </div>
  );
}
