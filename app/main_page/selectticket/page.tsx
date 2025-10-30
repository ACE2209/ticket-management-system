"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { listEventsData } from "@/data/events";
import { useRouter, useParams } from "next/navigation";

export default function SelectTicket() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const event = listEventsData.find((e) => e.id === eventId);
  
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<"vip" | "vvip" | null>("vip");

  const handleKey = (e: React.KeyboardEvent, id: "vip" | "vvip") => {
    if (e.key === "Enter" || e.key === " ") setSelected(id);
  };

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center justify-end font-['PlusJakartaSans'] relative">
      {/* Overlay background - match changepaymentpage */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Bottom Sheet (no fixed height; follow changepaymentpage) */}
      <div className="relative w-full max-w-[375px] bg-white rounded-t-[32px] p-6 z-10">
        {/* Handle bar */}
        <div className="w-[36px] h-[4px] bg-[#E3E7EC] rounded-full mx-auto mb-4" />

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#111111]">{event?.title || 'Choose Ticket'}</h2>
          <button 
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center bg-[#F6F8FE] rounded-full"
          >
            <IoClose size={16} className="text-[#78828A]" />
          </button>
        </div>

        {/* Ticket Options - using event data */}
        <div className="flex gap-4 mb-6">
          {event?.areas?.map((area) => (
            <div
              key={area.name}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')}
              onKeyDown={(e) => handleKey(e, area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')}
              className={`w-[156px] h-[219px] relative rounded-[14px] p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                selected === (area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')
                  ? 'border-[#F41F52] border bg-[#FFF3F6]'
                  : 'border border-[#E3E7EC] bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg" />
                <div className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center ${
                  selected === (area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')
                    ? 'border-[#F41F52] bg-[#F41F52]'
                    : 'border-[#E3E7EC]'
                }`}>
                  {selected === (area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip') && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm text-[#111111]">{area.name}</p>
                <p className="text-[10px] text-[#78828A] mt-1">
                  {area.tickets.length} seats available
                </p>
              </div>

              <div>
                <div className={`w-full border-dashed border-t-2 mt-2 mb-2 ${
                  selected === (area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')
                    ? 'border-[#F41F52]'
                    : 'border-[#E3E7EC]'
                }`} />
                <p className={`text-center font-bold text-lg ${
                  selected === (area.name.toLowerCase().includes('vip') ? 'vip' : 'vvip')
                    ? 'text-[#F41F52]'
                    : 'text-[#111111]'
                }`}>
                  {event.price}/pax
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quantity Selection */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-bold text-sm text-[#111111]">Ticket Quantity</p>
          <div className="flex items-center gap-2">
            <button
              aria-label="decrease"
              className="w-[32px] h-[32px] flex items-center justify-center bg-[#F6F8FE] rounded-[8px]"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <span className="w-[12px] h-[2px] bg-[#78828A] block" />
            </button>
            <span className="w-10 text-center font-bold text-base text-[#111111]">{quantity}</span>
            <button
              aria-label="increase"
              className="w-[32px] h-[32px] flex items-center justify-center bg-[#F41F52] rounded-[8px] text-white text-xl"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Choose Seat Button */}
        <Button
          className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
          onClick={() => {
            if (event && selected) {
              router.push(`/main_page/chooseseat/${event.id}?type=${selected}&quantity=${quantity}`);
            }
          }}
        >
          Choose Seat
        </Button>
      </div>
    </div>
  );
}
