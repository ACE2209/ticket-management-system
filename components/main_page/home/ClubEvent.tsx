"use client";
import Image from "next/image";

export default function ClubEvent() {
  const events = [
    { img: "/main_page/home/clup1.jpg", title: "Vibe Beat Lounge" },
    { img: "/main_page/home/clup2.jpg", title: "Night Pulse Club" },
    { img: "/main_page/home/clup3.jpg", title: "Neon Glow Party" },
  ];

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Club Event
          </span>
          <span className="text-[#F41F52] text-xs font-medium cursor-pointer">
            See All
          </span>
        </div>

        {/* Event list */}
        <div className="flex justify-between gap-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div className="w-full aspect-[104/137] rounded-xl bg-[#F2F1F8] overflow-hidden shadow-sm">
                <Image
                  src={event.img}
                  alt={event.title}
                  width={104}
                  height={137}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-semibold text-[#272841] text-center leading-tight">
                {event.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
