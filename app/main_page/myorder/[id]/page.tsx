"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import Barcode from "react-barcode";

// ✅ Định nghĩa kiểu dữ liệu từ API (backend trả về "event" với "event_schedules" và "tickets" trong JSON)
type BookingDetail = {
  id: string;
  booking_date: string;
  event: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    preview_image: string;
    event_schedules: Array<{
      id: string;
      start_time: string;
      end_time: string;
    }>;
  };
  tickets: Array<{
    id: string;
    price: number;
    qr: string;
    seat: {
      id: string;
      seat_number: string;
    };
  }>;
  "price "?: number; // Backend trả về field này với khoảng trắng
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch booking detail từ API
  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch(`/bookings/${id}`);
        setBooking(data);
      } catch (err: any) {
        console.error("Error fetching booking detail:", err);
        setError(err.message || "Failed to load booking detail");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#FEFEFE] min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Loading booking details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-[#FEFEFE] min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          {error || "Booking not found 😢"}
        </div>
      </div>
    );
  }

  const event = booking.event; // Backend trả về field "event" (lowercase)
  // Backend trả về "event_schedules" (không phải "schedules")
  const schedules = event?.event_schedules || [];
  const schedule = schedules.length > 0 ? schedules[0] : null;
  
  console.log("🔍 Booking detail - Event:", event);
  console.log("🔍 Booking detail - Schedules:", schedules);
  console.log("🔍 Booking detail - Selected schedule:", schedule);

  // ✅ Format date và time từ API
  const bookingDate = new Date(booking.booking_date);
  const dateStr = isNaN(bookingDate.getTime())
    ? "Date TBA"
    : bookingDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const eventDate = schedule 
    ? new Date(schedule.start_time)
    : bookingDate;
  
  const dateParts = !isNaN(eventDate.getTime())
    ? eventDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }).split(" ")
    : ["", ""];
  const [day, month] = dateParts;

  const timeStr = schedule && !isNaN(new Date(schedule.start_time).getTime())
    ? new Date(schedule.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "TBA";

  const location = `${event?.address || ""}, ${event?.city || ""}, ${event?.country || ""}`.replace(/^,\s*|,\s*$/g, "").trim() || "Location TBA";

  // ✅ Tính tổng số vé
  const totalTickets = booking.tickets?.length || 0;

  // ✅ Lấy QR code đầu tiên cho barcode (hoặc booking ID)
  // QR code có thể là URL từ backend, cần extract ID hoặc dùng booking ID
  const firstTicket = booking.tickets && booking.tickets.length > 0 ? booking.tickets[0] : null;
  const qrValue = firstTicket?.qr;
  // Nếu QR là URL, lấy phần cuối hoặc dùng booking ID
  const barcodeValue = qrValue 
    ? (qrValue.includes("/") ? qrValue.split("/").pop() || booking.id : qrValue)
    : booking.id;

  // ✅ Format price (backend trả về field "price " với khoảng trắng)
  const totalPrice = booking["price "] || 0;
  const priceStr = `$${totalPrice}`;

  // ✅ Ghi chú mặc định
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
            {/* Left: Image + Date Badge */}
            <div className="relative w-[40%]">
              <Image
                src={event?.preview_image || "/images/event.jpg"}
                alt={event?.name || "Event"}
                width={200}
                height={200}
                className="w-full h-[120px] object-cover rounded-[16px]"
              />
              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[14px] leading-none">
                  {day}
                </p>
                <p className="text-[#F41F52] text-[10px] uppercase leading-none">
                  {month?.slice(0, 3) || ""}
                </p>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[#111111] text-[14px] font-semibold leading-snug mb-1">
                  {event?.name || "Untitled Event"}
                </h2>
                <p className="text-[#66707A] text-[12px] mb-1">
                  {location}
                </p>
                <p className="text-[#9CA4AB] text-[12px]">{timeStr}</p>
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
            <span>{dateStr}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#78828A]">Notes</span>
            <span className="text-right">{noteText}</span>
          </div>

          <div className="border-t border-[#E3E7EC] pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#F41F52]">{priceStr}</span>
          </div>

          {/* ✅ Barcode */}
          <div className="flex flex-col items-center mt-4">
            <div className="bg-white p-2 rounded-md max-w-[200px] overflow-hidden">
              <Barcode
                value={barcodeValue}
                height={60}
                width={1.2}
                displayValue={false}
                background="#FFFBFC"
                lineColor="#111"
                margin={0}
              />
            </div>
            <p className="text-[12px] text-[#9CA4AB] mt-1">{barcodeValue}</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button className="mt-10 mb-10 bg-[#F41F52] text-white font-semibold text-[16px] px-8 py-3 rounded-full shadow-md w-[80%] max-w-[360px]">
        Download PDF
      </button>
    </div>
  );
}
