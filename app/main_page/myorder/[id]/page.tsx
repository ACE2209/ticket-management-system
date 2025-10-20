"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { listEventsData } from "../../../../data/events";
import Barcode from "react-barcode";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const event = listEventsData[id];
  if (!event)
    return <div className="text-center mt-10">Event not found 😢</div>;

  const [day, month] = event.date.split(" ");

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans']">
      {/* Header */}
      <div className="w-full max-w-[420px] px-6 pt-6 pb-4 flex items-center justify-between">
        <div
          onClick={() => router.back()}
          className="w-[40px] h-[40px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="text-[#111111] text-[20px] select-none">←</span>
        </div>

        <h1 className="text-[18px] font-semibold text-[#111111]">
          Order Detail
        </h1>

        <div className="w-[40px] h-[40px] flex items-center justify-center">
          <div className="flex flex-col justify-between h-4">
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Bill container */}
      <div className="relative w-full max-w-[350px] bg-white rounded-[24px] shadow-md mt-4 overflow-hidden border border-[#E3E7EC]">
        {/* Bill header */}
        <div className="p-5">
          {/* Event header */}
          <div className="flex items-start gap-4 mb-5">
            {/* Left: Image + Date Badge */}
            <div className="relative w-[40%]">
              <Image
                src={event.image}
                alt={event.title}
                width={200}
                height={200}
                className="w-full h-[120px] object-cover rounded-[16px]"
              />
              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[14px] leading-none">
                  {day}
                </p>
                <p className="text-[#F41F52] text-[10px] uppercase leading-none">
                  {month?.slice(0, 3)}
                </p>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-[1px] bg-[#E3E7EC]"></div>
                </div>

                <h2 className="text-[#111111] text-[14px] font-semibold leading-snug mb-1">
                  {event.title}
                </h2>
                <p className="text-[#66707A] text-[12px] mb-2">
                  {event.location}
                </p>
                <div className="flex items-center space-x-2">
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
          </div>
        </div>

        {/* Răng cưa */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute left-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="absolute right-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="w-full border-t border-dashed border-[#E3E7EC]"></div>
        </div>

        {/* Bill content */}
        <div className="p-5 pt-3 space-y-3 text-[13px] text-[#111111] bg-[#FFFBFC]">
          <div className="flex justify-between">
            <span className="text-[#78828A]">Quantity</span>
            <span>2 – E Ticket</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78828A]">Date Order</span>
            <span>{event.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78828A]">Notes</span>
            <span>Flash Seat Mobile Entry</span>
          </div>

          <div className="border-t border-[#E3E7EC] pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#F41F52]">{event.price}</span>
          </div>

          {/* ✅ Barcode lấy từ file data */}
          <div className="flex flex-col items-center mt-4">
            <div className="bg-white p-2 rounded-md max-w-[200px] overflow-hidden">
              <Barcode
                value={event.barcode} // ✅ lấy trực tiếp từ data
                height={60}
                width={1.2}
                displayValue={false}
                background="#FFFBFC"
                lineColor="#111"
                margin={0}
              />
            </div>
            <p className="text-[12px] text-[#9CA4AB] mt-1">{event.barcode}</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button className="mt-10 mb-10 bg-[#F41F52] text-white font-semibold text-[16px] px-8 py-3 rounded-full shadow-md w-[80%] max-w-[360px]">
        Download PDF
      </button>
    </div>
  );
}
