"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { listEventsData } from "../../../data/events";

type EventType = (typeof listEventsData)[0];

function EventCard({ event }: { event: EventType }) {
  return (
    <div className="flex items-center gap-4 w-full mb-4">
      {/* Hình ảnh */}
      <div className="w-[88px] h-[88px] rounded-[12px] overflow-hidden flex-shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          width={88}
          height={88}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        <p className="text-[#78828A] text-[12px] leading-[140%] mb-[2px] truncate">
          {event.category}
        </p>
        <h3 className="text-[#111111] text-[14px] font-semibold leading-[1.2] mb-[4px] truncate">
          {event.title}
        </h3>
        <p className="text-[#78828A] text-[12px] leading-[160%] truncate">
          {event.location} • {event.date}
        </p>
      </div>

      {/* Giá */}
      <div className="flex-shrink-0 ml-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F45D421A] text-[#F41F52] text-[10px] font-medium">
          {event.price}
        </span>
      </div>
    </div>
  );
}

export default function EventListPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Event");

  const filters = [
    "All Event",
    "Live Concert",
    "Art Exhibition",
    "Workshop",
    "Festival",
    "Food Festival",
  ];

  const filteredEvents =
    activeFilter === "All Event"
      ? listEventsData
      : listEventsData.filter((ev) => ev.category === activeFilter);

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center">
      <div className="w-full h-screen mx-auto font-['PlusJakartaSans'] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div
            onClick={() => router.push("/main_page/home")}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>

          <h1 className="text-[18px] font-bold text-[#111111]">Event List</h1>

          <div className="w-[48px] h-[48px] flex items-center justify-center">
            <div className="flex flex-col justify-between h-4">
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="px-6">
          {/* Ô tìm kiếm */}
          <div className="flex items-center justify-between bg-[#F6F8FE] rounded-[24px] px-4 h-[52px]">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15.2"
                height="15.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA4AB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span className="text-[#9CA4AB] font-medium text-[16px]">
                Search...
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-[18px] border-l border-[#E3E7EC]" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13.1"
                height="11.9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
              </svg>
            </div>
          </div>

          {/* Nút filter */}
          <div className="hide-scrollbar flex gap-3 mt-4 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-[40px] border border-[#E3E7EC] font-semibold transition-all duration-200 px-4 ${
                  activeFilter === filter
                    ? "bg-[#F41F52] text-[#FEFEFE] border-[#F41F52]"
                    : "bg-[#FEFEFE] text-[#66707A] hover:bg-[#F6F8FE]"
                }`}
                style={{
                  height: "36px",
                  fontSize: "12px",
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách event */}
        <div className="flex-1 overflow-y-auto px-6 mt-6 pb-6 hide-scrollbar">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => <EventCard key={idx} event={event} />)
          ) : (
            <p className="text-center text-[#9CA4AB] text-[14px] mt-10">
              No events found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
