/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { apiFetch } from "@/lib/api";

type TicketSellingSchedule = {
  start_selling_time?: string;
  end_selling_time?: string;
};

type Ticket = {
  id: string | number;
  base_price?: number;
  rank?: string;
  description?: string;
  ticket_selling_schedules?: TicketSellingSchedule[];
};

// Kiểu lịch sự kiện
type EventSchedule = {
  id: string;
  start_time: string;
  end_time: string;
};

// Kiểu sự kiện
type EventType = {
  id: string | number;
  name?: string;
  tickets?: Ticket[];
  event_schedules?: EventSchedule[];
};

interface SelectTicketProps {
  event: EventType;
  onClose: () => void;
}

export default function SelectTicket({ event, onClose }: SelectTicketProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTicket, setSelectedTicket] = useState<string | number | null>(
    null
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [schedules, setSchedules] = useState<EventSchedule[]>([]);

  useEffect(() => {
    if (!event?.id) return;

    const fetchEvent = async () => {
      try {
        const res = await apiFetch(`/events/${event.id}`);
        const data = (res as { data?: EventType }).data ?? (res as EventType);

        setTickets(data.tickets ?? []);
        setSchedules(data.event_schedules ?? []);

        setSelectedTicket(null);
        setSelectedSchedule(null);
      } catch (err) {
        console.error("❌ Failed to load tickets:", err);
      }
    };

    fetchEvent();
  }, [event]);

  const handleKey = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string | number
  ) => {
    if (e.key === "Enter" || e.key === " ") setSelectedTicket(id);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="absolute inset-0 flex items-end justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative w-full bg-white rounded-t-[32px] p-6 z-10 animate-slide-up">
        <div className="w-[36px] h-[4px] bg-[#E3E7EC] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold text-[#111111]">
            {event?.name || "Choose Ticket"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-[#F6F8FE] rounded-full"
          >
            <IoClose size={16} className="text-[#78828A]" />
          </button>
        </div>

        {/* Select Event Date */}
        <div className="mb-6">
          <p className="font-bold text-[16px] text-[#111111] mb-2">
            Select Event Date
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {schedules.map((sch) => {
              const label = `${formatDate(sch.start_time)} - ${formatDate(
                sch.end_time
              )}`;
              const active = selectedSchedule === sch.id;
              return (
                <button
                  key={sch.id}
                  onClick={() => {
                    setSelectedSchedule(sch.id);
                    setSelectedTicket(null);
                  }}
                  className={`flex-shrink-0 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium ${
                    active
                      ? "bg-[#F41F52] text-white"
                      : "border border-[#E3E7EC] text-[#111111]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticket options */}
        <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar hide-scrollbar">
          {!selectedSchedule ? (
            <p className="text-[16px] text-[#78828A]">
              Please select a date first.
            </p>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => {
              const isSelected = selectedTicket === ticket.id;
              const price = ticket.base_price ?? 0;
              const rank = ticket.rank ?? "Normal";
              const description = ticket.description ?? "";

              const now = new Date();
              const sellingSchedule = ticket.ticket_selling_schedules?.[0];
              const startSelling = sellingSchedule
                ? new Date(sellingSchedule.start_selling_time)
                : null;
              const endSelling = sellingSchedule
                ? new Date(sellingSchedule.end_selling_time)
                : null;
              const isAvailable =
                startSelling && endSelling
                  ? now >= startSelling && now <= endSelling
                  : true;

              return (
                <div
                  key={ticket.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => isAvailable && setSelectedTicket(ticket.id)}
                  onKeyDown={(e) => isAvailable && handleKey(e, ticket.id)}
                  className={`w-[156px] h-auto rounded-[14px] p-4 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? "border-[#F41F52] border bg-[#FFF3F6]"
                      : "border border-[#E3E7EC] bg-white"
                  } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex justify-end">
                    <div
                      className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#F41F52] bg-[#F41F52]"
                          : "border-[#E3E7EC]"
                      }`}
                    >
                      {isSelected && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-[16px] text-[#111111]">
                      {rank}
                    </p>
                    {description && (
                      <p className="text-[12px] text-[#78828A] mt-1">
                        {description}
                      </p>
                    )}
                  </div>

                  {!isAvailable && startSelling && (
                    <p className="text-[12px] font-semibold text-[#F41F52] mt-1 text-center">
                      Bắt đầu bán vé: {formatDate(startSelling.toISOString())}
                    </p>
                  )}

                  <div>
                    <div
                      className={`w-full border-dashed border-t-2 mt-2 mb-2 ${
                        isSelected ? "border-[#F41F52]" : "border-[#E3E7EC]"
                      }`}
                    />
                    <p className="text-center">
                      <span
                        className={`font-bold text-lg ${
                          isSelected ? "text-[#F41F52]" : "text-[#111111]"
                        }`}
                      >
                        {price.toLocaleString()}₫
                      </span>
                      <span className="text-xs text-[#78828A]">/pax</span>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[#78828A]">No tickets available</p>
          )}
        </div>

        {/* Quantity */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-bold text-[16px] text-[#111111]">Ticket Quantity</p>
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
          disabled={!selectedTicket || !selectedSchedule}
          className="w-full h-[56px] rounded-full bg-[#F41F52] disabled:bg-[#E3E7EC] text-white text-[16px] font-semibold"
          onClick={() => {
            if (selectedTicket && selectedSchedule) {
              window.location.href = `/main_page/chooseseat?eventId=${event.id}&scheduleId=${selectedSchedule}&ticketId=${selectedTicket}&quantity=${quantity}`;
            }
          }}
        >
          Choose Seat
        </Button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
