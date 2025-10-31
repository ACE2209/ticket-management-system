/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function SelectTicket({
  event,
  onClose,
}: {
  event: any;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<"vip" | "vvip" | null>("vip");

  const handleKey = (e: React.KeyboardEvent, id: "vip" | "vvip") => {
    if (e.key === "Enter" || e.key === " ") setSelected(id);
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-[375px] bg-white rounded-t-[32px] p-6 z-10 animate-slide-up">
        <div className="w-[36px] h-[4px] bg-[#E3E7EC] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#111111]">
            {event?.title || "Choose Ticket"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#F6F8FE] rounded-full"
          >
            <IoClose size={16} className="text-[#78828A]" />
          </button>
        </div>

        {/* Ticket options */}
        <div className="flex gap-4 mb-6">
          {event?.areas?.map((area: any) => {
            const key = area.name.toLowerCase().includes("vip")
              ? "vip"
              : "vvip";
            return (
              <div
                key={area.name}
                role="button"
                tabIndex={0}
                onClick={() => setSelected(key)}
                onKeyDown={(e) => handleKey(e, key)}
                className={`w-[156px] h-[219px] rounded-[14px] p-4 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                  selected === key
                    ? "border-[#F41F52] border bg-[#FFF3F6]"
                    : "border border-[#E3E7EC] bg-white"
                }`}
              >
                <div className="flex justify-end">
                  <div
                    className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center ${
                      selected === key
                        ? "border-[#F41F52] bg-[#F41F52]"
                        : "border-[#E3E7EC]"
                    }`}
                  >
                    {selected === key && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-sm text-[#111111]">
                    {area.name}
                  </p>
                  <p className="text-[10px] text-[#78828A] mt-1">
                    {area.tickets.length} seats available
                  </p>
                </div>

                <div>
                  <div
                    className={`w-full border-dashed border-t-2 mt-2 mb-2 ${
                      selected === key ? "border-[#F41F52]" : "border-[#E3E7EC]"
                    }`}
                  />
                  <p
                    className={`text-center font-bold text-lg ${
                      selected === key ? "text-[#F41F52]" : "text-[#111111]"
                    }`}
                  >
                    {event.price}/pax
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quantity */}
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
            <span className="w-10 text-center font-bold text-base text-[#111111]">
              {quantity}
            </span>
            <button
              aria-label="increase"
              className="w-[32px] h-[32px] flex items-center justify-center bg-[#F41F52] rounded-[8px] text-white text-xl"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Choose Seat */}
        <Button
          className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
          onClick={() => {
            if (event && selected) {
              window.location.href = `/main_page/chooseseat?eventId=${event.id}&type=${selected}&quantity=${quantity}`;
            }
          }}
        >
          Choose Seat
        </Button>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
