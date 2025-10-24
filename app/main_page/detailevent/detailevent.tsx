"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { listEventsData } from "../../../data/events";
import { Star } from "lucide-react";

export default function DetailEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = Number(searchParams.get("id")) || 0;

  const event = listEventsData.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="relative bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans'] overflow-hidden">
      {/* Ảnh banner nền */}
      <div className="absolute inset-0 w-full h-[420px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Header trên ảnh */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 pt-10 z-20">
        <div
          onClick={() => router.back()}
          className="w-[44px] h-[44px] rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center cursor-pointer"
        >
          <span className="text-white text-[22px] select-none">←</span>
        </div>

        <h1 className="text-[18px] font-semibold text-white">Detail Event</h1>

        <div className="w-[44px] h-[44px] rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center cursor-pointer">
          <div className="flex flex-col justify-between h-4">
            <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-white rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Thông tin event (bottom sheet scrollable) */}
      <div className="relative z-10 mt-[260px] w-full flex-1 overflow-y-auto scrollbar-hide">
        <div className="bg-white rounded-t-[32px] px-6 pt-3 pb-32 shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
          {/* Thanh kéo nhỏ */}
          <div className="flex justify-center mb-4">
            <div className="w-[50px] h-[5px] bg-gray-300 rounded-full"></div>
          </div>

          {/* Tiêu đề */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-[20px] font-bold text-[#111111] leading-snug">
                {event.title}
              </h2>
              <p className="text-[#6B6B6B] text-[14px] mt-1 flex items-center">
                {event.location}
                <span className="flex items-center ml-2 text-[#F5A623]">
                  <Star size={14} className="mr-1 fill-[#F5A623]" /> 4.4 (532)
                </span>
              </p>
            </div>
            <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#FFEDF1] rounded-full">
              <span className="text-[#FF3366] text-[20px]">♥</span>
            </div>
          </div>

          {/* Members Join */}
          <div className="mt-5">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-2">
              Members Join
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Image
                      key={i}
                      src={`/images/avatar_${i + 1}.png`}
                      alt="member"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                  ))}
              </div>
              <p className="text-[#6B6B6B] text-[13px]">
                <span className="text-[#FF3366] font-semibold">250K</span> People are Joined
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-2">
              Description
            </h3>
            <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
              Ultricies arcu venenatis in lorem faucibus lobortis at. 
              Est odio varius nisl congue aliquam nunc est sit pulvinar magna. 
              Est scelerisque dignissim non nibh vitae nisl. 
              Vestibulum at lorem ut orci pharetra ullamcorper. 
              Vivamus et urna vitae velit tempus congue.{" "}
              <span className="text-[#FF3366] cursor-pointer font-medium">
                Read More
              </span>
            </p>
          </div>

          {/* Detail Event Info */}
          <div className="mt-6">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-3">
              Detail Event
            </h3>
            <div className="flex flex-col gap-3 text-[13px] text-[#6B6B6B]">
              <div className="flex items-center gap-3">
                📅 <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-3">
                🎤 <span>{event.category}</span>
              </div>
              <div className="flex items-center gap-3">
                🕒 <span>07:30 pm - 11:30 pm</span>
              </div>
              <div className="flex items-center gap-3">
                ⏳ <span>4 Hours Duration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between rounded-t-3xl">
        <div>
          <p className="text-[13px] text-[#6B6B6B]">Total Price:</p>
          <p className="text-[20px] font-bold text-[#FF3366]">
            {event.price}
            <span className="text-[14px] text-[#6B6B6B] font-normal"> /Person</span>
          </p>
        </div>
        <button className="bg-[#FF3366] text-white text-[15px] font-semibold px-6 py-3 rounded-full">
          Booking Now
        </button>
      </div>
    </div>
  );
}
