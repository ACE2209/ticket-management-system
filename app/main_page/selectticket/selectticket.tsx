 
"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { apiFetch } from "@/lib/api";

// Kiểu vé
type TicketSellingSchedule = {
  available?: number;
};

type Ticket = {
  id: string | number;
  base_price?: number;
  rank?: string;
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

  // Lấy data event từ API
  useEffect(() => {
    if (!event?.id) return;

    const fetchEvent = async () => {
      try {
        const res = await apiFetch(`/events/${event.id}`);
        const data = (res as { data?: EventType }).data ?? (res as EventType);

        setTickets(data.tickets ?? []);
        setSchedules(data.event_schedules ?? []);

        // Reset chọn
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
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
          <p className="font-bold text-sm text-[#111111] mb-3">
            Select Event Date
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
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
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
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
            <p className="text-sm text-[#78828A]">
              Please select a date first.
            </p>
          ) : tickets.length > 0 ? (
            tickets.map((ticket) => {
              const isSelected = selectedTicket === ticket.id;
              const available =
                ticket.ticket_selling_schedules?.[0]?.available ?? 0;
              const price = ticket.base_price ?? 0;
              const rank = ticket.rank ?? "Normal";

              return (
                <div
                  key={ticket.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTicket(ticket.id)}
                  onKeyDown={(e) => handleKey(e, ticket.id)}
                  className={`w-[156px] h-[219px] rounded-[14px] p-4 cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? "border-[#F41F52] border bg-[#FFF3F6]"
                      : "border border-[#E3E7EC] bg-white"
                  }`}
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
                    <p className="font-semibold text-sm text-[#111111]">
                      {rank}
                    </p>
                    <p className="text-[10px] text-[#78828A] mt-1">
                      {available} seats available
                    </p>
                  </div>

                  <div>
                    <div
                      className={`w-full border-dashed border-t-2 mt-2 mb-2 ${
                        isSelected ? "border-[#F41F52]" : "border-[#E3E7EC]"
                      }`}
                    />
                    <p
                      className={`text-center font-bold text-lg ${
                        isSelected ? "text-[#F41F52]" : "text-[#111111]"
                      }`}
                    >
                      {price.toLocaleString()}₫/pax
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

      {/* Animation */}
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
