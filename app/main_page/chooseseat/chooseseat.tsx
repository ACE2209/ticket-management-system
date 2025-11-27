/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

interface Seat {
  id: string;
  seat_number: string;
  status: string;
  seat_zone_id: string;
  ticket_id?: string;
}

interface SeatZone {
  id: string;
  description: string;
  total_seats: number;
  seats: Seat[];
}

interface EventSchedule {
  id: string;
  start_time: string;
  end_time: string;
  start_checkin_time: string;
  end_checkin_time: string;
}

interface Ticket {
  id: string;
  rank: string;
  description: string;
  base_price: number;
  seat_zone_id: string;
}

interface EventType {
  id: string;
  name: string;
  city: string;
  address: string;
  preview_image: string;
  seat_zones: SeatZone[];
  tickets: Ticket[];
  event_schedules: EventSchedule[];
}

export default function ChooseSeatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("eventId") ?? "";
  const quantity = Number(searchParams.get("quantity") || 1); // số lượng vé mua

  const [event, setEvent] = useState<EventType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [apiSeats, setApiSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (!event) return;

    const loadSeatsFromApi = async () => {
      try {
        const scheduleId =
          searchParams.get("scheduleId") || event.event_schedules?.[0]?.id;
        if (!scheduleId) return console.log("⛔ No schedule for event");

        const ticketIdFromUrl = searchParams.get("ticketId");
        const ticketsToLoad = ticketIdFromUrl
          ? event.tickets.filter((t) => t.id === ticketIdFromUrl)
          : event.tickets;

        const allSeats: Seat[] = [];

        for (const ticket of ticketsToLoad) {
          const url = `/seats?ticket_id=${ticket.id}&event_schedule_id=${scheduleId}`;
          const res = await apiFetch(url);
          const data = res.data || res;

          // Nếu API trả object, convert thành array
          const seatsArray = Array.isArray(data) ? data : [data];

          seatsArray.forEach((zoneOrSeatBlock: any) => {
            if (zoneOrSeatBlock.seats?.length) {
              const seatsForThisTicket = zoneOrSeatBlock.seats.map(
                (s: any) => ({
                  id: s.id,
                  seat_number: s.seat_number,
                  status: s.status,
                  seat_zone_id: s.seat_zone_id || ticket.seat_zone_id,
                  ticket_id: ticket.id,
                })
              );
              allSeats.push(...seatsForThisTicket);
            }
          });
        }

        setApiSeats(allSeats);
      } catch (err) {
        console.error("❌ Failed to load seats from /api/seats:", err);
      }
    };

    loadSeatsFromApi();
  }, [event, searchParams]);

  // 🔹 Load event details
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/events/${eventId}`);
        const data: EventType = res.data || res;
        setEvent(data);
      } catch (err) {
        console.error("❌ Failed to load event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // 🔹 Toggle seat selection (fix logic chọn nhiều ghế)
  const toggleSeat = (seat: Seat) => {
    if (seat.status === "BOOKED") return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);

      // Nếu đã chọn → bỏ chọn
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      }

      // Nếu chưa đủ số lượng → thêm ghế mới
      if (prev.length < quantity) {
        return [...prev, seat];
      }

      // Nếu đã đủ số lượng → thay ghế cũ nhất bằng ghế mới
      const newArr = [...prev];
      newArr.shift(); // bỏ ghế đầu tiên
      newArr.push(seat);
      return newArr;
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading event...
      </div>
    );

  if (!event)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Event not found
      </div>
    );

  // 🔹 Handle confirm booking
  const handleConfirmBooking = async () => {
    setErrorMessage(""); // reset error
    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least one seat");
      return;
    }
    const schedule = event.event_schedules?.[0];
    if (!schedule) {
      setErrorMessage("Missing event schedule");
      return;
    }
    try {
      // Prepare booking items
      const items = selectedSeats.map((seat) => {
        let ticket = event.tickets.find((t) => t.id === seat.ticket_id);
        if (!ticket) {
          ticket = event.tickets.find(
            (t) => t.seat_zone_id === seat.seat_zone_id
          );
        }
        if (!ticket) {
          setErrorMessage(`No ticket found for seat ${seat.seat_number}`);
          throw new Error(`No ticket for seat ${seat.id}`);
        }
        return {
          event_schedule_id: schedule.id,
          seat_id: seat.id,
          ticket_id: ticket.id,
        };
      });
      const body = {
        event_id: event.id,
        items,
      };
      const res = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // ✅ In toàn bộ dữ liệu booking ra console
      console.log("🎉 Booking created successfully:");
      console.log(JSON.stringify(res.data || res, null, 2));

      localStorage.setItem("currentBooking", JSON.stringify(res.data || res));
      router.push("/main_page/checkout?openPaymentSelector=1");
    } catch (err) {
      console.error("❌ Failed to create booking:", err);
      setErrorMessage("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans']">
      <div className="w-full max-w-[375px] min-h-screen mx-auto flex flex-col px-6">
        {/* HEADER */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div
            onClick={() => router.back()}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>
          <h1 className="text-[18px] font-bold text-[#111111]">Choose Seat</h1>
          <div className="w-[48px] h-[48px]" />
        </div>

        {/* EVENT INFO */}
        <div className="flex gap-3 mt-2">
          <div className="relative w-[35%] flex-shrink-0">
            <Image
              src={event.preview_image || "/images/event-sample.jpg"}
              alt={event.name || "Event"}
              width={200}
              height={200}
              className="w-full h-[100px] object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 break-words">
            <div>
              <p className="text-[16px] font-semibold text-[#111111] leading-snug mb-1">
                {event.name}
              </p>
              <p className="text-[14px] text-[#78828A] break-words">
                {event.address}, {event.city}
              </p>
            </div>
            <p className="text-[14px] text-[#F41F52] font-semibold mt-2">
              {event.seat_zones.length} Zones
            </p>
          </div>
        </div>

        {/* SEAT MAP */}
        <div className="flex flex-col items-center mt-10 gap-4 flex-1 overflow-auto hide-scrollbar">
          <svg width="240" height="40" viewBox="0 0 240 40" fill="none">
            <path
              d="M10 30 C80 0 160 0 230 30"
              stroke="#F41F52"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* SEAT GRID */}
          <div className="grid grid-cols-8 gap-2 justify-center mt-4">
            {apiSeats.map((seat) => {
              const status = seat.status?.toLowerCase();
              const isBooked = status === "booked";
              const isSelected = selectedSeats.some((s) => s.id === seat.id);

              return (
                <button
                  key={seat.id}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  className={`w-[28px] h-[28px] text-[10px] font-medium rounded-sm flex items-center justify-center transition-all duration-200
            ${isBooked ? "bg-[#D3D3D3] text-white cursor-not-allowed" : ""}
            ${isSelected ? "bg-[#F41F52] text-white" : ""}
            ${!isBooked && !isSelected ? "bg-[#ffffff] text-[#9CA4AB]" : ""}`}
                >
                  {seat.seat_number}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[14px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-[#D3D3D3] inline-block" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-white border border-[#EAEAEA] inline-block" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-[#F41F52] inline-block" />
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pb-6">
          <div className="flex justify-between text-[16px] text-[#66707A] mb-3">
            <p>Selected {selectedSeats.length} Seat</p>
            <p className="font-medium text-[#111111]">
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.seat_number).join(", ")
                : "-"}
            </p>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center text-[13px] mb-2">
              {errorMessage}
            </p>
          )}

          <Button
            className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
            onClick={handleConfirmBooking}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
