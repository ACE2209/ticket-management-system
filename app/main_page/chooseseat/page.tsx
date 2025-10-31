"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { listEventsData } from "@/data/events";


export default function ChooseSeatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);

  // Read eventId from query param ?eventId=NUM and load the event from data/events.ts
  const idParam = searchParams?.get("eventId") ?? "0";
  const eventId = Number.isNaN(Number(idParam)) ? 0 : parseInt(idParam, 10);
  const event = listEventsData.find((e) => e.id === eventId) || listEventsData[0];
  const bookedSeats = Array.isArray(event.bookedSeats) ? event.bookedSeats : [];

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return; // không cho click ghế đã đặt
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const rows = Array.from({ length: 5 }, (_, i) => String.fromCharCode(65 + i)); // A–E
  const cols = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans'] relative">
      <div className="w-full max-w-[375px] h-screen mx-auto flex flex-col px-6">
        {/* HEADER */}
        <div className="flex items-center justify-between pt-6 pb-4">
          <div
            onClick={() => router.back()}
            className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer"
          >
            <span className="text-[#111111] text-[20px] select-none">←</span>
          </div>
          <h1 className="text-[18px] font-bold text-[#111111]">Choose Seat</h1>
          <div className="w-[48px] h-[48px] flex items-center justify-center">
            <div className="flex flex-col justify-between h-4">
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* EVENT INFO */}
        <div className="flex gap-3 mt-2">
          <div className="relative w-[35%]">
            <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
              <p className="text-[#F41F52] font-bold text-[12px] leading-none">
                {event?.date?.split(" ")[0] || ""}
              </p>
              <p className="text-[#F41F52] text-[8px] uppercase">
                {event?.date?.split(" ")[1]?.slice(0, 3) || ""}
              </p>
            </div>
            <Image
              src={event?.image || "/images/event-sample.jpg"}
              alt={event?.title || "Event"}
              width={200}
              height={200}
              className="w-full h-[100px] object-cover rounded-xl"
            />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-[1px] bg-[#E3E7EC]" />
              </div>

              <p className="text-[13px] font-semibold text-[#111111] leading-snug mb-1 line-clamp-2">
                {event?.title || "Event Title"}
              </p>
              <p className="text-[11px] text-[#78828A] truncate">
                {event?.location || "Event Location"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Image
                    key={i}
                    src={`/images/avatar${(i % 5) + 1}.jpg`}
                    alt="avatar"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-[10px] text-[#F41F52] font-semibold">250+ Joined</p>
            </div>
          </div>
        </div>

        {/* SEAT MAP */}
        <div className="flex flex-col items-center mt-10 gap-4">
          {/* Stage arc */}
          <svg width="240" height="40" viewBox="0 0 240 40" fill="none">
            <path
              d="M10 30 C80 0 160 0 230 30"
              stroke="#F41F52"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* Seat grid */}
          <div className="flex flex-col gap-3">
            {rows.map((r) => (
              <div key={r} className="flex gap-2 justify-center">
                {cols.map((c) => {
                  const id = `${r}${c}`;
                  const isSelected = selected.includes(id);
                  const isBooked = bookedSeats.includes(id);

                  return (
                    <button
                      key={id}
                      onClick={() => toggleSeat(id)}
                      disabled={isBooked}
                      className={`w-[28px] h-[28px] text-[10px] font-medium rounded-sm flex items-center justify-center transition-all duration-200 
                        ${
                          isBooked
                            ? "bg-[#D3D3D3] text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-[#F41F52] text-white"
                            : "bg-[#F2F2F2] text-[#9CA4AB]"
                        }`}
                    >
                      {id}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[12px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-[#D3D3D3] inline-block" />
              <span>Reserved</span>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-white border border-[#EAEAEA] inline-block" />
              <span>Available</span>
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#66707A]">
              <span className="w-3 h-3 rounded-full bg-[#F41F52] inline-block" />
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-auto pb-6">
          <div className="flex justify-between text-[14px] text-[#66707A] mb-3">
            <p>Selected {selected.length} Seat</p>
            <p className="font-medium text-[#111111]">
              {selected.join(", ") || "-"}
            </p>
          </div>

          <Button
            className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
            onClick={() => {
              if (selected.length === 0) {
                alert("Please select at least one seat");
                return;
              }
              router.push(`/main_page/checkout?eventId=${event.id}&seats=${selected.join(",")}`)
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
