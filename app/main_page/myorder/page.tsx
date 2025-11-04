"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import { MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Định nghĩa kiểu dữ liệu từ API (backend trả về field "event" với "event_schedules" trong JSON)
type BookingHistory = {
  id: string;
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
};

// ✅ Định nghĩa kiểu dữ liệu cho UI
type EventType = {
  id: string;
  title: string;
  date: string;
  time: string;
  image: string;
  location: string;
};

export default function MyOrderPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar state
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
      return; // không chọn ngày đã qua
    setSelectedDate(day);
  };

  // ✅ Fetch booking history từ API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🚀 Starting to fetch bookings...");
        const data = await apiFetch("/bookings");
        
        // Debug: Log response để kiểm tra
        console.log("📦 Raw API Response:", data);
        console.log("📦 Response Type:", typeof data);
        console.log("📦 Is Array:", Array.isArray(data));
        console.log("📦 Response Keys:", data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        
        // Xử lý response - có thể là array trực tiếp hoặc wrap trong object
        let bookingsList: BookingHistory[] = [];
        if (Array.isArray(data)) {
          bookingsList = data;
          console.log("✅ Response is array, length:", data.length);
        } else if (data?.data && Array.isArray(data.data)) {
          bookingsList = data.data;
          console.log("✅ Found data in response.data, length:", data.data.length);
        } else if (data?.bookings && Array.isArray(data.bookings)) {
          bookingsList = data.bookings;
          console.log("✅ Found data in response.bookings, length:", data.bookings.length);
        } else if (data && typeof data === 'object') {
          console.warn("⚠️ Response is object but not array or wrapped:", data);
          // Có thể response là object với các field khác
          bookingsList = [];
        } else {
          console.warn("⚠️ Unexpected response format:", data);
          bookingsList = [];
        }
        
        console.log("📦 Processed Bookings List:", bookingsList);
        console.log("📦 Final Bookings Count:", bookingsList.length);
        
        if (bookingsList.length > 0) {
          console.log("📋 First Booking Sample:", JSON.stringify(bookingsList[0], null, 2));
        }
        
        setBookings(bookingsList);
      } catch (err: any) {
        console.error("❌ Error fetching bookings:", err);
        console.error("❌ Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Map booking data từ API sang format UI và tách theo thời gian
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: EventType[] = [];
    const past: EventType[] = [];

    // Reset time về 00:00:00 để so sánh chỉ ngày
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    console.log("🔄 Starting to process bookings, total:", bookings.length);
    console.log("🔄 Current date (for comparison):", nowDateOnly);
    
    bookings.forEach((booking, index) => {
      console.log(`\n🔍 [${index + 1}/${bookings.length}] Processing booking ID:`, booking.id);
      console.log("🔍 Full booking object:", JSON.stringify(booking, null, 2));
      
      // Backend trả về field "event" (lowercase) trong JSON
      const event = booking.event;
      
      console.log("🔍 Event data:", event);
      console.log("🔍 Event type:", typeof event);
      
      if (!event) {
        console.warn("⚠️ No event data for booking:", booking.id);
        console.warn("⚠️ Booking structure:", Object.keys(booking));
        return; // Bỏ qua nếu không có event info
      }
      
      // Backend trả về "event_schedules" (không phải "schedules")
      const schedules = event.event_schedules || [];
      const schedule = schedules.length > 0 ? schedules[0] : null;
      
      console.log("🔍 Schedules found:", schedules.length);
      console.log("🔍 Schedules data:", schedules);
      console.log("🔍 Selected schedule:", schedule);
      
      // Lấy event date từ schedule, nếu không có thì bỏ qua
      if (!schedule || !schedule.start_time) {
        console.warn("⚠️ No schedule or start_time for booking:", booking.id);
        return;
      }
      
      const eventDate = new Date(schedule.start_time);
      
      // Kiểm tra date hợp lệ
      if (isNaN(eventDate.getTime())) {
        console.warn("⚠️ Invalid date for booking:", booking.id, "start_time:", schedule.start_time);
        return;
      }
      
      // So sánh chỉ date (không tính time) để xác định upcoming/past
      // Reset time về 00:00:00 để so sánh chỉ ngày
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      // nowDateOnly đã được tính ở trên, không cần tính lại
      
      console.log("📅 Event date (full):", eventDate);
      console.log("📅 Event date (date only):", eventDateOnly);
      console.log("📅 Now date (full):", now);
      console.log("📅 Now date (date only):", nowDateOnly);
      console.log("📅 Comparison (eventDateOnly >= nowDateOnly):", eventDateOnly >= nowDateOnly);
      console.log("📅 Difference in days:", Math.floor((eventDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24)));
      
      const timeStr = schedule
        ? new Date(schedule.start_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "TBA";

      const dateStr = schedule
        ? new Date(schedule.start_time).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "TBA";

      const location = `${event.address || ""}, ${event.city || ""}, ${event.country || ""}`.replace(/^,\s*|,\s*$/g, "").trim() || "Location TBA";

      const eventItem: EventType = {
        id: booking.id, // Sử dụng booking ID để navigate
        title: event.name || "Untitled Event",
        date: dateStr,
        time: timeStr,
        image: event.preview_image || "/images/event.jpg",
        location: location,
      };
      
      // So sánh chỉ date để phân loại upcoming/past
      // Event là upcoming nếu event date >= today
      const isUpcoming = eventDateOnly >= nowDateOnly;
      
      console.log("✅ Mapped event item:", eventItem);
      console.log("📊 Classification result:", isUpcoming ? "UPCOMING" : "PAST");

      if (isUpcoming) {
        upcoming.push(eventItem);
        console.log("✅ Added to UPCOMING events (event date >= today)");
      } else {
        past.push(eventItem);
        console.log("✅ Added to PAST events (event date < today)");
      }
    });
    
    console.log("\n📊 Final Results:");
    console.log("📊 Upcoming events:", upcoming.length);
    console.log("📊 Past events:", past.length);
    
    // Log summary để debug
    if (bookings.length > 0 && upcoming.length === 0 && past.length === 0) {
      console.warn("⚠️ WARNING: Có bookings nhưng không có events nào được map thành công!");
      console.warn("⚠️ Có thể do cấu trúc dữ liệu không khớp hoặc thiếu schedules");
    }

    upcoming.sort((a, b) => {
      const dateA = a.date !== "TBA" ? new Date(a.date).getTime() : Infinity;
      const dateB = b.date !== "TBA" ? new Date(b.date).getTime() : Infinity;
      return dateA - dateB;
    });
    past.sort((a, b) => {
      const dateA = a.date !== "TBA" ? new Date(a.date).getTime() : -Infinity;
      const dateB = b.date !== "TBA" ? new Date(b.date).getTime() : -Infinity;
      return dateB - dateA;
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [bookings]);

  const eventsToShow = tab === "upcoming" ? upcomingEvents : pastEvents;

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
          <div className="text-center text-gray-500 mt-6">
            Loading bookings...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-6">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            <p className="mb-2">No bookings found.</p>
            <p className="text-xs text-gray-400">Please check console for debugging info.</p>
          </div>
        ) : eventsToShow.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            <p className="mb-2">No {tab === "upcoming" ? "upcoming" : "past"} events.</p>
            {tab === "upcoming" && pastEvents.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  You have {pastEvents.length} past event{pastEvents.length > 1 ? "s" : ""}.
                </p>
                <button
                  onClick={() => setTab("past")}
                  className="text-[#F41F52] text-sm font-semibold underline"
                >
                  View Past Events →
                </button>
              </div>
            )}
            {tab === "past" && upcomingEvents.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  You have {upcomingEvents.length} upcoming event{upcomingEvents.length > 1 ? "s" : ""}.
                </p>
                <button
                  onClick={() => setTab("upcoming")}
                  className="text-[#F41F52] text-sm font-semibold underline"
                >
                  View Upcoming Events →
                </button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">
              Total bookings: {bookings.length} | 
              Upcoming: {upcomingEvents.length} | 
              Past: {pastEvents.length}
            </p>
          </div>
        ) : (
          eventsToShow.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-sm rounded-2xl border border-gray-100 p-3 flex gap-3 mb-4"
            >
              <div className="relative w-[40%]">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={200}
                  height={200}
                  className="w-full h-[140px] object-cover rounded-xl"
                />
                <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                  <p className="text-[#F41F52] font-bold text-[14px] leading-none">
                    {event.date.split(" ")[0] || "TBA"}
                  </p>
                  <p className="text-[#F41F52] text-[10px] uppercase">
                    {event.date.split(" ")[1]?.slice(0, 3) || ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-[1px] bg-[#E3E7EC]" />
                  </div>

                  <p className="text-[15px] font-semibold text-[#111111] leading-snug mb-1 line-clamp-2">
                    {event.title}
                  </p>
                  <div className="flex items-center text-[#6B7280] text-[12px] mb-2">
                    <MapPin size={12} className="mr-1" />
                    {event.location}
                  </div>
                  {event.time && (
                    <p className="text-[#9CA4AB] text-[12px] mb-2">{event.time}</p>
                  )}

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

      {/* Calendar Modal */}
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
