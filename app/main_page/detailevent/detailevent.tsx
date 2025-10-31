"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { listEventsData } from "../../../data/events";
import { Star, Calendar, Clock, Video, Timer, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import SharePage from "../share/page";
import SelectTicket from "../selectticket/page"; // ✅ import popup ticket

export default function DetailEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = Number(searchParams.get("id")) || 0;

  const event = useMemo(
    () => listEventsData.find((e) => e.id === eventId),
    [eventId]
  );

  const [descExpanded, setDescExpanded] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showTicket, setShowTicket] = useState(false); // ✅ popup ticket control

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="relative bg-[#FEFEFE] w-full max-w-screen-sm min-h-dvh mx-auto overflow-x-hidden font-['Plus_Jakarta_Sans'] hide-scrollbar">
      {/* Banner */}
      <div className="relative w-full h-[40vh] min-h-[220px] max-h-[420px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10"></div>
      </div>

      {/* Header */}
      <div
        className="absolute left-0 right-0 mx-auto max-w-screen-sm px-6 h-[48px] flex items-center justify-between z-20"
        style={{ top: "max(16px, calc(env(safe-area-inset-top, 0px) + 12px))" }}
      >
        <button
          onClick={() => router.back()}
          className="w-[48px] h-[48px] rounded-full bg-[#FEFEFE] bg-opacity-[0.08] flex items-center justify-center cursor-pointer hover:bg-opacity-[0.15] transition-all"
        >
          <ArrowLeft size={24} className="text-[#111111]" strokeWidth={2} />
        </button>

        <h1 className="text-[18px] font-bold text-[#FEFEFE] leading-[26px] tracking-[0.005em]">
          Detail Event
        </h1>

        <button
          onClick={() => setShowShare(true)}
          className="w-[48px] h-[48px] rounded-full bg-[#FEFEFE] bg-opacity-[0.08] flex items-center justify-center cursor-pointer hover:bg-opacity-[0.15] transition-all"
        >
          <div className="flex flex-col items-center gap-[3px]">
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
          </div>
        </button>
      </div>

      {/* Content */}
      <section className="relative -mt-6 bg-[#FFFFFF] rounded-t-[30px] shadow-[0px_0px_5px_rgba(0,0,0,0.15)] z-10">
        <div className="flex justify-center pt-3">
          <div className="w-[48px] h-[4px] bg-[#C7C7C7] rounded-[20px]"></div>
        </div>

        <div className="px-6 pb-28">
          {/* Title */}
          <div className="flex items-start gap-3 mb-[18px]">
            <div className="flex-1">
              <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1A1A1A] leading-[140%] mb-1">
                {event.title}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-normal text-[#666666] leading-[160%]">
                  {event.location}
                </span>
                <div className="w-[4px] h-[4px] rounded-full bg-[#BFC6CC]"></div>
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className="text-[#FACC15] fill-[#FACC15]"
                    strokeWidth={0}
                  />
                  <span className="text-[12px] font-semibold text-[#FACC15] leading-[130%]">
                    4.4 (532)
                  </span>
                </div>
              </div>
            </div>
            <button className="w-[40px] h-[40px] rounded-full bg-[#FEFEFE] border border-[#E3E7EC] flex items-center justify-center hover:bg-[#FFF5F7] transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                  fill="#F41F52"
                />
              </svg>
            </button>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-[16px] font-semibold text-[#111111] mb-2">
              Description
            </h3>
            <p className="text-[12px] text-[#111111] leading-[22px] opacity-70">
              {(() => {
                const full =
                  event.note ||
                  "Ultricies arcu venenatis in lorem faucibus lobortis at.";
                if (descExpanded) return full;
                const max = 140;
                return full.length > max ? full.slice(0, max) + "..." : full;
              })()}
              {event.note && event.note.length > 140 && (
                <button
                  onClick={() => setDescExpanded((v) => !v)}
                  className="ml-1 inline text-[#F41F52] font-semibold cursor-pointer"
                >
                  {descExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </p>
          </div>

          {/* Detail Event */}
          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-[#111111] mb-3">
              Detail Event
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-[9px]">
                  <Calendar size={17} strokeWidth={1.3} />
                  <span className="text-[12px] font-semibold text-[#66707A]">
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center gap-[7px]">
                  <Clock size={17} strokeWidth={1.3} />
                  <span className="text-[12px] font-semibold text-[#66707A]">
                    {event.time}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-[7px]">
                  <Video size={17} strokeWidth={1.3} />
                  <span className="text-[12px] font-semibold text-[#66707A]">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer size={17} strokeWidth={1.3} />
                  <span className="text-[12px] font-semibold text-[#66707A]">
                    4 Hours Duration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[#FEFEFE] shadow-[0px_-10px_40px_rgba(0,0,0,0.12)] z-20">
        <div
          className="mx-auto max-w-screen-sm flex items-center gap-3 px-6 py-[18px]"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          }}
        >
          <div className="flex flex-col justify-center gap-[6px]">
            <p className="text-[12px] font-medium text-[#111111]">Total Price:</p>
            <p className="flex items-baseline gap-0">
              <span className="text-[24px] font-bold text-[#F41F52]">
                {event.price}
              </span>
              <span className="text-[14px] text-[#6B6B6B]">/Person</span>
            </p>
          </div>

          {/* ✅ Booking Now mở SelectTicket */}
          <button
            onClick={() => setShowTicket(true)}
            className="flex-1 h-[56px] bg-[#F41F52] text-[#FEFEFE] text-[16px] font-semibold rounded-[24px] hover:bg-[#D91A46] transition-all flex items-center justify-center"
          >
            Booking Now
          </button>
        </div>
      </div>

      {/* ✅ Popup share */}
      {showShare && (
        <SharePage onClose={() => setShowShare(false)} title={event.title} />
      )}

      {/* ✅ Popup ticket */}
      {showTicket && (
        <SelectTicket
          event={event}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
