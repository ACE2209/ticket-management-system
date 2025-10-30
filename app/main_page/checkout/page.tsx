"use client";

import Image from "next/image";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listEventsData, EventItem } from "@/data/events";
import { useEffect, useState } from "react";
import PaymentSelector from "@/components/main_page/PaymentSelector";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState({
    type: "mastercard",
    icon: "/images/mastercard.png",
    name: "Master Card",
    detail: "**** **** 1234"
  });
  
  useEffect(() => {
    const eventId = searchParams.get('eventId');
    const seats = searchParams.get('seats')?.split(',') || [];
    
    if (eventId) {
      const foundEvent = listEventsData.find(e => e.id === parseInt(eventId));
      if (foundEvent) {
        setEvent(foundEvent);
        setSelectedSeats(seats);
      } else {
        router.push('/main_page/home');
      }
    } else {
      router.push('/main_page/home');
    }
  }, [searchParams, router]);

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
          <h1 className="text-[18px] font-bold text-[#111111]">Checkout</h1>
          <div className="w-[48px] h-[48px] flex items-center justify-center">
            <div className="flex flex-col justify-between h-4">
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
              <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            </div>
          </div>
        </div>

        {/* EVENT INFO */}
        {event && (
          <div className="flex gap-3 mt-2">
            <div className="relative w-[35%]">
              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[12px] leading-none">
                  {event.date.split(' ')[0]}
                </p>
                <p className="text-[#F41F52] text-[8px] uppercase">
                  {event.date.split(' ')[1].replace(',', '')}
                </p>
              </div>
              <Image
                src={event.image}
                alt={event.title}
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
                  {event.title}
                </p>
                <p className="text-[11px] text-[#78828A] truncate">
                  {event.location}
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
                <p className="text-[10px] text-[#F41F52] font-semibold">
                  {event.areas?.reduce((total, area) => total + area.tickets.length, 0)}+ Available
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTIONS */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Contact</p>
            <div 
              onClick={() => router.push('/main_page/contactinformation')}
              className="flex items-center gap-1.5 text-[#66707A] text-[12px] cursor-pointer hover:text-[#F41F52]"
            >
              Add Contact Info <span className="text-[14px]">›</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Quantity</p>
            <div className="flex items-center gap-1.5 text-[#66707A] text-[12px]">
              {selectedSeats.length}-E Ticket
              <span className="text-[14px]">›</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Notes</p>
            <div className="flex items-center gap-1.5 text-[#66707A] text-[12px]">
              Flash Seat Mobile Entry <span className="text-[14px]">›</span>
            </div>
          </div>
        </div>

        {/* PRICE */}
        {event && (
          <div className="mt-4 text-[13px] text-[#66707A]">
            <div className="flex justify-between mb-1.5">
              <p>Price <span className="text-[#9CA4AB]">({selectedSeats.length}×{event.price} each)</span></p>
              <p className="text-[#111111] font-medium">{event.price}</p>
            </div>
            <div className="flex justify-between mb-1.5">
              <p>Taxes</p>
              <p className="text-[#111111] font-medium">5 USD</p>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-[#E3E7EC] text-[14px]">
              <p className="font-medium text-[#111111]">Total</p>
              <p className="font-semibold text-[#111111]">
                {(parseFloat(event.price.replace('$', '')) * selectedSeats.length + 5).toFixed(2)} USD
              </p>
            </div>
          </div>
        )}

        {/* PAYMENT METHOD */}
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-[#111111] mb-2">
            Payment Method
          </p>
          <div 
            onClick={() => setShowPaymentSelector(true)}
            className="w-full border border-[#E3E7EC] rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-[#F41F52]"
          >
            <div className="flex items-center gap-2.5">
              <Image
                src={selectedPayment.icon}
                alt={selectedPayment.name}
                width={25}
                height={25}
                className="object-contain"
              />
              <div>
                <p className="text-[13px] text-[#111111] font-medium">{selectedPayment.name}</p>
                <p className="text-[11px] text-[#9CA4AB]">{selectedPayment.detail}</p>
              </div>
            </div>
            <span className="text-[14px] text-[#66707A]">›</span>
          </div>
        </div>

        {/* PAY NOW BUTTON */}
        <div className="mt-auto pb-6">
          <Button className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold">
            Pay Now
          </Button>
        </div>
      </div>

      {/* Payment Selector Modal */}
      {showPaymentSelector && (
        <PaymentSelector
          onClose={() => setShowPaymentSelector(false)}
          onConfirm={(method) => {
            const paymentMethods = {
              paypal: {
                type: "paypal",
                icon: "/images/paypal.png",
                name: "PayPal",
                detail: "sask****@mail.com"
              },
              mastercard: {
                type: "mastercard",
                icon: "/images/mastercard.png",
                name: "Master Card",
                detail: "**** **** 1234"
              }
            };
            setSelectedPayment(paymentMethods[method as keyof typeof paymentMethods]);
          }}
        />
      )}
    </div>
  );
}
