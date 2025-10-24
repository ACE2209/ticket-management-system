"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Bell, Calendar } from "lucide-react";
import { useState, useMemo } from "react";
import { listEventsData } from "../../../../data/events";
import Barcode from "react-barcode";

export default function MyTicketPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const event = listEventsData.find((e) => e.id === eventId);

  const defaultDate = event ? new Date(event.date) : new Date();
  const [month, setMonth] = useState(defaultDate.getMonth());
  const [year, setYear] = useState(defaultDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(
    defaultDate.getDate()
  );

  // 👇 Toggle calendar
  const [showFullCalendar, setShowFullCalendar] = useState(false);

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

  const eventsInMonth = useMemo(() => {
    return listEventsData.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [month, year]);

  const daysWithEvents = eventsInMonth.map((e) => new Date(e.date).getDate());

  const eventOfSelectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return eventsInMonth.find(
      (e) => new Date(e.date).getDate() === selectedDate
    );
  }, [selectedDate, eventsInMonth]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>Event not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#F41F52] text-white rounded-full text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 🧮 Xử lý danh sách ngày hiển thị
  const visibleDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

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

      {/* Calendar — chỉ hiện khi showFullCalendar = true */}
      {showFullCalendar && (
        <div className="grid grid-cols-7 gap-2 text-center w-[90%] mb-5 transition-all duration-300 overflow-hidden">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {visibleDays.map((day) => {
            const hasEvent = daysWithEvents.includes(day);
            return (
              <button
                key={day}
                disabled={!hasEvent}
                onClick={() => hasEvent && setSelectedDate(day)}
                className={`w-[40px] h-[40px] rounded-full text-sm transition ${
                  hasEvent
                    ? selectedDate === day
                      ? "bg-[#F41F52] text-white"
                      : "bg-[#F3F4F6] text-[#111111] hover:bg-[#F41F52]/10"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      )}

      {/* Event card */}
      {eventOfSelectedDay ? (
        <div className="w-[90%] bg-white rounded-2xl overflow-hidden mb-5 transition-all duration-300 flex items-center gap-3 p-3">
          {/* Ảnh bên trái */}
          <div className="relative w-[110px] h-[120px] flex-shrink-0">
            <Image
              src={eventOfSelectedDay.image}
              alt={eventOfSelectedDay.title}
              fill
              className="object-cover rounded-xl"
            />
            <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
              <p className="text-[#F41F52] font-bold text-[12px] leading-none">
                {new Date(eventOfSelectedDay.date).getDate()}
              </p>
              <p className="text-[#F41F52] text-[10px] uppercase">
                {new Date(eventOfSelectedDay.date).toLocaleString("en-US", {
                  month: "short",
                })}
              </p>
            </div>
          </div>

          {/* Thông tin bên phải */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-[1px] bg-[#F6F8F]"></div>
              </div>

              <h2 className="text-[#111111] text-[16px] font-semibold leading-snug mb-1">
                {eventOfSelectedDay.title}
              </h2>
              <p className="text-[#66707A] text-[14px] mb-2">
                {eventOfSelectedDay.location}
              </p>

              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={`/images/avatar${(i % 5) + 1}.jpg`}
                      alt="avatar"
                      width={24}
                      height={24}
                      className="w-7 h-7 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-[13px] text-[#F41F52] font-semibold">
                  250+ Joined
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-8">No event on this day.</p>
      )}

      {/* thanh màu xám cách giữ chi tiết event và chi tiết vé  */}
      {eventOfSelectedDay && (
        <div className="w-full">
          {/* Tạo một div 1px, màu xám nhạt, nằm giữa 90% chiều rộng của container chính */}
          <div className="w-[90%] mx-auto h-[5px] bg-[#F6F8FE]" />
        </div>
      )}

      {eventOfSelectedDay && (
        <div className="w-[90%] mt-4 space-y-4">
          {eventOfSelectedDay.areas?.map((area) =>
            area.tickets.map((ticket) => {
              const code = ticket.barcode;
              const barcodeMetrics = (() => {
                const len = Math.max(1, code.length);
                const baseWidth = Math.max(0.55, Math.min(1.25, 70 / len));
                const estWidth = len * baseWidth;
                const targetWidth = 46;
                const scale = Math.min(1, targetWidth / estWidth);
                return { baseWidth, height: 70, scale };
              })();

              return (
                <div
                  key={ticket.id}
                  className="relative flex bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
                >
                  {/* Thông tin vé bên trái */}
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <h3 className="text-[15px] font-semibold text-[#111111]">
                      {eventOfSelectedDay.title}
                    </h3>

                    <p className="text-[13px] text-[#66707A] mt-1">
                      {new Date(eventOfSelectedDay.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                      · {eventOfSelectedDay.time}
                    </p>

                    <div className="flex items-center gap-3 text-[13px] text-[#66707A] mt-2">
                      <span className="flex items-center gap-1">
                        🎟️ 1 ticket
                      </span>
                      <span>•</span>
                      <span>{area.name}</span>
                      <span>•</span>
                      <span className="text-[#111111] font-medium">
                        ID: {ticket.id}
                      </span>
                    </div>
                  </div>

                  {/* Cột Barcode bên phải: nền xanh đậm */}
                  <div className="relative flex items-center justify-center bg-[#003366] w-[100px] rounded-l-none rounded-r-2xl">
                    <div className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] bg-white rounded-full z-10" />

                    <div className="bg-white w-[66px] h-[86%] flex items-center justify-center rounded-lg shadow-inner">
                      <div
                        style={{
                          transform: `rotate(90deg) scale(${barcodeMetrics.scale})`,
                          transformOrigin: "center",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Barcode
                          value={code}
                          height={barcodeMetrics.height}
                          width={barcodeMetrics.baseWidth}
                          displayValue={false}
                          background="transparent"
                          lineColor="#000"
                          margin={0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
