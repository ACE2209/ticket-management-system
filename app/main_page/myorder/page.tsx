/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import { MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

/** -----------------------------
 * 🧩 Kiểu dữ liệu API Booking & Event
 * ----------------------------- */
type EventSchedule = {
  id: string;
  start_time: string;
  end_time: string;
  start_checkin_time?: string;
  end_checkin_time?: string;
};

type Category = {
  id: string;
  name: string;
  description: string;
};

type Event = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  preview_image: string;
  category: Category;
  event_schedules: EventSchedule[];
};

type Booking = {
  id: string;
  event: Event;
};

/** -----------------------------
 * 🧩 Dữ liệu format cho UI
 * ----------------------------- */
type EventUI = {
  id: string;
  title: string;
  date: string;
  image: string;
  location: string;
};

export default function MyOrderPage() {
  const router = useRouter();

  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [bookings, setBookings] = useState<EventUI[]>([]);
  const [loading, setLoading] = useState(true);

  /** -----------------------------
   * 🧮 Gọi API & xử lý dữ liệu
   * ----------------------------- */
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const data = await apiFetch("/bookings");
        console.log("✅ Dữ liệu trả về:", data);

        // ✅ unwrap nếu API trả về mảng lồng mảng
        const raw = data?.data || data;
        const list = Array.isArray(raw?.[0]) ? raw[0] : raw;

        const formatted: EventUI[] = list.map((item: any) => {
          const event = item.event_id; // ✅ đổi event -> event_id
          const schedule = event?.event_schedules?.[0];

          return {
            id: item.id,
            title: event?.name ?? "Unnamed Event",
            date: schedule?.start_time ?? "N/A",
            image: event?.preview_image || "/images/default-event.jpg",
            location: `${event?.address ?? ""}, ${event?.city ?? ""}`,
          };
        });

        setBookings(formatted);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu booking:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  /** -----------------------------
   * 📅 State lịch
   * ----------------------------- */
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay =
    month === today.getMonth() && year === today.getFullYear()
      ? today.getDate()
      : 0;

  const goToPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleDateClick = (day: number) => {
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day < currentDay
    )
      return;
    setSelectedDate(day);
  };

  /** -----------------------------
   * 🧮 Phân loại sự kiện (upcoming & past)
   * ----------------------------- */
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: EventUI[] = [];
    const past: EventUI[] = [];

    bookings.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate >= now) upcoming.push(event);
      else past.push(event);
    });

    upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    past.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [bookings]);

  const eventsToShow = tab === "upcoming" ? upcomingEvents : pastEvents;

  /** -----------------------------
   * 🎨 Giao diện
   * ----------------------------- */
  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans'] relative">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 pt-6 pb-4">
        <div
          onClick={() => router.back()}
          className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
        >
          <span className="text-[#111111] text-[20px] select-none">←</span>
        </div>
        <h1 className="text-[18px] font-bold text-[#111111]">My Order</h1>
        <div
          onClick={() => setShowCalendar(true)}
          className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
        >
          <Calendar size={20} className="text-[#111111]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-[90%] bg-[#F3F4F6] rounded-full mb-4">
        <button
          onClick={() => setTab("upcoming")}
          className={`w-1/2 py-2 rounded-full text-sm font-semibold transition ${
            tab === "upcoming"
              ? "bg-white text-[#111111] shadow"
              : "text-[#9CA3AF]"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab("past")}
          className={`w-1/2 py-2 rounded-full text-sm font-semibold transition ${
            tab === "past" ? "bg-white text-[#111111] shadow" : "text-[#9CA3AF]"
          }`}
        >
          Past Event
        </button>
      </div>

      {/* Event List */}
      <div className="hide-scrollbar flex-1 overflow-y-auto w-[90%] pb-28">
        {loading ? (
          <p className="text-center text-gray-400 mt-6">Loading...</p>
        ) : eventsToShow.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No {tab === "upcoming" ? "upcoming" : "past"} events.
          </p>
        ) : (
          eventsToShow.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-sm rounded-2xl border border-gray-100 p-3 flex gap-3 mb-4"
            >
              <div className="relative w-[30%]">
                <Image
                  src={event.image || "/images/default-event.jpg"}
                  alt={event.title}
                  width={200}
                  height={200}
                  className="w-full h-[120px] object-cover rounded-xl"
                />
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="text-[17px] font-semibold text-[#111111] leading-snug mb-1 line-clamp-2">
                    {event.title}
                  </p>
                  <div className="flex items-center text-[#6B7280] text-[15px] mb-2">
                    <MapPin size={12} className="mr-1" />
                    {event.location}
                  </div>
                  <p className="text-[#F41F52] text-[16px] font-medium">
                    {new Date(event.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() =>
                      router.push(`/main_page/myorder/${event.id}`)
                    }
                    className="w-[48%] py-1.5 border border-[#F41F52] rounded-full text-[#F41F52] text-[12px] font-semibold"
                  >
                    Detail Order
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/main_page/myticket/${event.id}`)
                    }
                    className="w-[48%] py-1.5 bg-[#F41F52] rounded-full text-white text-[12px] font-semibold"
                  >
                    My Ticket
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🗓 Calendar Modal */}
      {showCalendar && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[9999]">
          <div className="bg-white rounded-3xl w-[90%] max-w-[380px] p-6 shadow-xl">
            <h2 className="text-[18px] font-semibold text-center mb-4">
              Select Date
            </h2>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={goToPrevMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <span className="text-[15px] font-medium text-gray-800">
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[13px] text-gray-400 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const isPast =
                    year === today.getFullYear() &&
                    month === today.getMonth() &&
                    day < currentDay;
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={isPast}
                      className={`w-9 h-9 rounded-full text-sm transition ${
                        isPast
                          ? "text-gray-400 opacity-50 cursor-not-allowed"
                          : selectedDate === day
                          ? "bg-[#F41F52] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                }
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowCalendar(false)}
                className="text-[#F41F52] font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-[#F41F52] text-white font-semibold text-sm px-6 py-2 rounded-full"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
}
