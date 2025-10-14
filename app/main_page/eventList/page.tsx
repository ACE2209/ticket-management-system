"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import { listEventsData } from "../../../data/events";

type EventType = (typeof listEventsData)[0];

function EventCard({ event }: { event: EventType }) {
  return (
    <div className="card flex items-center gap-4 w-full mb-4">
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

        {/* 🔍 Search + Filters */}
        <div className="px-6">
          {/* Thanh Search giống SearchBar */}
          <div className="flex justify-center mb-4">
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "52px",
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingLeft: "16px",
                paddingRight: "16px",
                backgroundColor: "#F6F8FE",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* Icon search */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15.2"
                height="15.54"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98A2B3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              {/* Input */}
              <input
                type="text"
                placeholder="Search..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#98A2B3",
                  backgroundColor: "transparent",
                }}
              />

              {/* Filter icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "0px",
                    height: "18px",
                    borderLeft: "1px solid #E3E7EC",
                  }}
                ></div>

                <SlidersHorizontal size={18} stroke="#98A2B3" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
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
