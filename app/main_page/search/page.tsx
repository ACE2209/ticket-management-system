"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SlidersHorizontal, MapPin, Heart } from "lucide-react";
import { listEventsData, categoriesData } from "../../../data/events";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  // Lọc event theo từ khóa
  const filteredEvents = useMemo(() => {
    if (!query) return listEventsData;
    return listEventsData.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
  }, [query]);

  // 3 event gần nhất
  const recentEvents = listEventsData.slice(0, 3);

  const showFullLayout = !query; // nếu không có query thì hiện full layout

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center">
      <div className="w-full min-h-screen mx-auto font-['PlusJakartaSans'] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div
            onClick={() => router.back()}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>

          <h1 className="text-[18px] font-bold text-[#111111]">Search</h1>

          <div className="w-[48px] h-[48px] flex items-center justify-center">
            <div className="flex flex-col justify-between h-4">
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-6">
          <div className="flex justify-center mb-6">
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

              <input
                type="text"
                defaultValue={query}
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = (e.target as HTMLInputElement).value;
                    router.push(
                      value
                        ? `/main_page/search?query=${encodeURIComponent(value)}`
                        : `/main_page/search`
                    );
                  }
                }}
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

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "0px",
                    height: "18px",
                    borderLeft: "1px solid #E3E7EC",
                  }}
                ></div>
                <SlidersHorizontal
                  size={18}
                  stroke="#98A2B3"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nếu không có query → full layout */}
        {showFullLayout ? (
          <>
            {/* Categories */}
            <div className="grid grid-cols-2 gap-3 px-6">
              {categoriesData.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={100}
                    className="w-full h-[100px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-3">
                    <p className="text-white font-semibold text-[14px]">
                      {item.title}
                    </p>
                    <p className="text-white/80 text-[12px]">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recently Viewed */}
            {/* Recently Viewed */}
            <section className="px-6 mt-6 mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[16px] font-semibold text-[#111111]">
                  Recently Viewed
                </h2>
                <button className="text-[13px] text-[#5C5C5C]">
                  Clear All
                </button>
              </div>

              <div className="flex overflow-x-scroll gap-4 pb-4 hide-scrollbar">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="min-w-[260px] bg-white border border-[#E3E7EC] rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  >
                    {/* Ảnh sự kiện */}
                    <div className="relative w-full h-[150px] px-2 pt-2">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover w-full h-full"
                        />
                        {/* Category tag */}
                        <div className="absolute top-2 left-2 bg-white/90 text-[#111111] text-[11px] font-medium px-2 py-[2px] rounded-full shadow-sm">
                          {event.category}
                        </div>

                        {/* Icon tim */}
                        <div className="absolute top-2 right-2 bg-white/90 p-[6px] rounded-full shadow-sm">
                          <Heart size={15} color="#E53E3E" fill="#E53E3E" />
                        </div>
                      </div>
                    </div>

                    {/* Nội dung card */}
                    <div className="px-3 pt-3 pb-4">
                      {/* Tên + Giá */}
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[14px] font-semibold text-[#111111] leading-snug truncate max-w-[180px]">
                          {event.title}
                        </p>
                        <span className="bg-[#FFE6E6] text-[#E53E3E] text-[12px] font-semibold px-2 py-[2px] rounded-full">
                          {event.price}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[#667085] text-[12px] mb-2">
                        <MapPin size={12} />
                        <span>{event.location}</span>
                      </div>

                      {/* Participant + Date */}
                      <div className="flex justify-between items-center text-[#667085] text-[12px]">
                        <span className="font-medium">
                          {/* <strong>{event.participant}</strong> /{" "}
                          {event.capacity} Participant */}
                        </span>
                        <span>
                          {event.date}
                          {/* • {event.time} */}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        <div className="px-6 mt-4 mb-10">
          <h2 className="text-[16px] font-semibold text-[#111111] mb-3">
            {query ? `Search Results for "${query}"` : "All Events"}
          </h2>

          {filteredEvents.length === 0 ? (
            <p className="text-[#777] text-[14px] italic">
              No results found for &quot;{query}&quot;
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 bg-white shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={120}
                    height={100}
                    className="w-[120px] h-[100px] object-cover"
                  />
                  <div className="flex flex-col justify-between py-2 pr-3">
                    <div>
                      <p className="text-[12px] text-[#5C5C5C]">
                        {event.category}
                      </p>
                      <p className="text-[14px] font-semibold leading-tight text-[#111]">
                        {event.title}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[12px] text-[#667085]">
                      <span>{event.date}</span>
                      <span className="text-[#E53E3E] font-semibold text-[13px]">
                        {event.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
