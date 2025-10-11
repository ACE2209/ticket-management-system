"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { listEventsData } from "../../../data/events"; // 👈 import từ file data.ts

// 🧩 Component hiển thị 1 event
const EventItem = ({ event }: { event: (typeof listEventsData)[0] }) => {
  return (
    <div className="w-[327px] h-[90px] flex gap-3 items-center">
      {/* Ảnh event */}
      <div className="w-[88px] h-[88px] rounded-xl bg-[#D1D8DD] overflow-hidden flex-shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          width={88}
          height={88}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nội dung event */}
      <div className="flex-1 flex justify-between h-[90px] py-[2px]">
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[#78828A] text-[12px] leading-[19px] font-normal">
              {event.category}
            </span>
            <span className="text-[#111111] text-[14px] font-semibold leading-[18px]">
              {event.title}
            </span>
          </div>

          <span className="text-[#78828A] text-[12px] leading-[19px] font-normal">
            {event.location} • {event.date}
          </span>
        </div>

        <div className="min-w-[46px] h-[25px] rounded-full bg-[#F41F521A] text-[#F41F52] flex justify-center items-center px-3 py-[6px] flex-shrink-0 self-start">
          <span className="text-[10px] font-medium text-center">{event.price}</span>
        </div>
      </div>
    </div>
  );
};

// 🧩 Component chính
export default function OtherEvents() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Other Events
          </span>
          <span
            onClick={() => router.push("/main_page/eventList")}
            className="text-[#F41F52] text-xs font-medium cursor-pointer"
          >
            See All
          </span>
        </div>

        {/* Danh sách sự kiện */}
        <div className="flex flex-col gap-4">
          {listEventsData.slice(0, 10).map((event, index) => (
            <EventItem key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
