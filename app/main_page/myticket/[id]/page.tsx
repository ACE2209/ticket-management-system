"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Calendar, MapPin } from "lucide-react";
import { listEventsData } from "../../../../data/events";

export default function MyTicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);

  const event = listEventsData.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>Event not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#F41F52] text-white rounded-full text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans'] relative pb-10">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 pt-6 pb-4">
        <div
          onClick={() => router.back()}
          className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer opacity-90"
        >
          <ChevronLeft className="text-[#111111]" />
        </div>
        <h1 className="text-[18px] font-bold text-[#111111]">My Ticket</h1>
        <div className="w-[48px] h-[48px] bg-[#11111114] rounded-full flex items-center justify-center opacity-90">
          <Calendar size={20} className="text-[#111111]" />
        </div>
      </div>

      {/* Event Card */}
      <div className="w-[90%] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
        <div className="relative">
          <Image
            src={event.image}
            alt={event.title}
            width={500}
            height={300}
            className="w-full h-[180px] object-cover"
          />
          <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
            <p className="text-[#F41F52] font-bold text-[14px] leading-none">
              {event.date.split(" ")[0]}
            </p>
            <p className="text-[#F41F52] text-[10px] uppercase">
              {event.date.split(" ")[1]?.slice(0, 3)}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-[16px] font-semibold text-[#111111] mb-1">
            {event.title}
          </h2>
          <div className="flex items-center text-[#6B7280] text-[12px] mb-2">
            <MapPin size={12} className="mr-1" />
            {event.location}
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <Image
                  key={i}
                  src={`/images/avatar${(i % 5) + 1}.jpg`}
                  alt="avatar"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="text-[12px] text-[#F41F52] font-semibold">
              250+ Joined
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="w-[90%] space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center px-4 py-3">
          <div>
            <p className="text-[15px] font-semibold text-[#111111]">
              {event.title}
            </p>
            <p className="text-[12px] text-[#6B7280] mt-1">
              {event.date} • 07:30 PM
            </p>
            <p className="text-[12px] text-[#6B7280]">
              Ballroom 001 • 1 Ticket
            </p>
          </div>
          <div className="w-[50px] h-[50px] flex items-center justify-center">
            <Image
              src="/images/barcode.png"
              alt="barcode"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center px-4 py-3">
          <div>
            <p className="text-[15px] font-semibold text-[#111111]">
              {event.title}
            </p>
            <p className="text-[12px] text-[#6B7280] mt-1">
              {event.date} • 07:00 PM
            </p>
            <p className="text-[12px] text-[#6B7280]">
              The Living Gallery • 2 Tickets
            </p>
          </div>
          <div className="w-[50px] h-[50px] flex items-center justify-center">
            <Image
              src="/images/barcode.png"
              alt="barcode"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
