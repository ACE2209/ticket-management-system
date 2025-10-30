"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack, IoEllipsisVertical, IoHeart } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import React from "react";
import { listEventsData } from "@/data/events";
import Barcode from "react-barcode";

export default function TicketDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id") ?? "0";
  const eventId = Number.isNaN(Number(idParam)) ? 0 : parseInt(idParam, 10);
  const event = listEventsData.find((e) => e.id === eventId) || listEventsData[0];

  return (
    <div className="min-h-screen bg-[#24223B] text-white font-['PlusJakartaSans'] relative flex flex-col items-center">
      {/* Status / Header area */}
      <div className="w-full max-w-[375px] px-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            aria-label="back"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <IoArrowBack size={20} />
          </button>

          <h1 className="text-[18px] font-semibold">Ticket Detail</h1>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <IoEllipsisVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="w-full max-w-[375px] px-4 mt-6">
        <div className="mx-auto w-[335px] bg-white rounded-[16px] text-black relative overflow-hidden">
          {/* Cover image */}
          <div className="relative h-[160px] w-full bg-gray-200">
            <Image src={event.image} alt={event.title} fill style={{ objectFit: 'cover' }} />
            <div className="absolute left-4 top-4 bg-white rounded-full px-3 py-1">
              <span className="text-xs font-medium text-black">Live Concert</span>
            </div>
            <button className="absolute right-4 top-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <IoHeart size={16} className="text-[#E53935]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pt-4 pb-6">
            <div className="flex items-start justify-between">
              <h2 className="text-[14px] font-semibold text-black max-w-[220px]">{event.title}</h2>
              <div className="bg-[#FFF0F3] text-[#F41F52] rounded-full px-3 py-1 text-[12px] font-medium">{event.price}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[#78828A]">
              <div>
                <div className="text-[12px] text-[#78828A]">Ticket Holder</div>
                <div className="text-[12px] text-black font-medium">Jonatan Levian</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#78828A]">Date</div>
                <div className="text-[12px] text-black font-medium">{event.date} at {event.time}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#78828A]">
              <div>
                <div className="text-[12px] text-[#78828A]">Location</div>
                <div className="text-[12px] text-black font-medium">{event.location}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#78828A]">Seat</div>
                <div className="text-[12px] text-black font-medium">{(event.bookedSeats && event.bookedSeats.slice(0,2).join(", ")) || "-"}</div>
              </div>
            </div>

            {/* Divider with semicircles */}
            <div className="relative mt-6">
              <div className="absolute left-[-19px] top-[28px] w-[38px] h-[38px] bg-white rounded-full" />
              <div className="absolute right-[-19px] top-[28px] w-[38px] h-[38px] bg-white rounded-full" />
              <div className="border-t-2 border-dashed border-[#E3E7EC] w-[265px] mx-auto" />
            </div>

            {/* Barcode area */}
            <div className="mt-6 bg-[#F6F8FE] rounded-md p-4">
              <div className="bg-white rounded-sm flex items-center justify-center p-3">
                <Barcode
                  value={event.barcode}
                  height={60}
                  width={1.2}
                  displayValue={false}
                  background="#FFFFFF"
                  lineColor="#111111"
                  margin={0}
                />
              </div>
              <p className="text-center text-[12px] text-[#111111] mt-3 font-medium">
                Scan the barcode
                <span className="text-[#78828A] ml-1">— {event.barcode}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button fixed to bottom similar to design */}
      <div className="w-full max-w-[375px] px-4 mt-6 mb-6">
        <Button
          className="w-full h-[56px] rounded-[24px] bg-[#F41F52] text-white text-[16px] font-semibold"
          onClick={() => {
            // TODO: implement download behavior
          }}
        >
          Download Ticket
        </Button>
      </div>
    </div>
  );
}
