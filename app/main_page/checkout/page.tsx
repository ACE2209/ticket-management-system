/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import PaymentSelector from "@/components/main_page/PaymentSelector";
import { apiFetch } from "@/lib/api";

interface SeatZone {
  id: string;
  description: string;
  event_id: string;
  seats: string[];
  status: string;
  tickets: { base_price: number }[];
  total_seats: number;
}

interface EventData {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  address: string;
  city: string;
  country: string;
  tickets: { base_price: number }[];
  seat_zones?: SeatZone[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  brand?: string;
  card?: string;
  email?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  );
  const [basePrice, setBasePrice] = useState<number>(0);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return router.push("/main_page/home");

    apiFetch(`/bookings/${bookingId}`)
      .then((res) => {
        const booking = res.data || res;

        console.log("🚀 Full booking data:", booking);

        const eventData: EventData =
          booking.event ||
          booking.event_id ||
          booking.event_data ||
          booking.tickets?.[0]?.event_id;

        const seats =
          booking.booking_items?.map(
            (item: any) => item.seat_id?.seat_number
          ) || [];

        if (!eventData.tickets || eventData.tickets.length === 0) {
          eventData.tickets = booking.tickets || [];
        }

        setEvent(eventData);
        setSelectedSeats(seats);

        // ✅ LẤY GIÁ ĐÚNG TỪ BOOKING
        const price =
          booking.booking_items?.[0]?.price ??
          eventData.tickets?.[0]?.base_price ??
          eventData.seat_zones?.[0]?.tickets?.[0]?.base_price ??
          0;

        console.log("💵 Base price:", price);

        setBasePrice(price);
      })
      .catch((err) => {
        console.error("❌ Error fetching booking:", err);
        router.push("/main_page/home");
      });
  }, [searchParams, router]);

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("userCards") || "[]");
    if (storedCards.length > 0) setSelectedPayment(storedCards[0]);
  }, []);

  if (!event)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading event...
      </div>
    );

  const total = basePrice * selectedSeats.length + 5;

  const getSafeIcon = (p: PaymentMethod) =>
    p.icon ||
    (p.brand === "visa"
      ? "/images/visa.png"
      : p.brand === "mastercard"
      ? "/images/mastercard.png"
      : p.brand === "amex"
      ? "/images/amex.png"
      : "/images/card.png");

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
          <div className="w-[48px] h-[48px]"></div>
        </div>

        {/* EVENT INFO */}
        <div className="flex gap-3 mt-2">
          <Image
            src={event.preview_image}
            alt={event.name}
            width={200}
            height={200}
            className="w-[35%] h-[100px] object-cover rounded-xl"
          />
          <div className="flex flex-col justify-between flex-1">
            <p className="text-[13px] font-semibold text-[#111111] leading-snug mb-1 line-clamp-2">
              {event.name}
            </p>
            <p className="text-[11px] text-[#78828A] truncate">
              {event.address}, {event.city}, {event.country}
            </p>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Contact</p>
            <div
              onClick={() => router.push("/main_page/contactinformation")}
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
        <div className="mt-4 text-[13px] text-[#66707A]">
          <div className="flex justify-between mb-1.5">
            <p>
              Price{" "}
              <span className="text-[#9CA4AB]">
                ({selectedSeats.length}×${basePrice})
              </span>
            </p>
            <p className="text-[#111111] font-medium">${basePrice}</p>
          </div>
          <div className="flex justify-between mb-1.5">
            <p>Taxes</p>
            <p className="text-[#111111] font-medium">$5</p>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-[#E3E7EC] text-[14px]">
            <p className="font-medium text-[#111111]">Total</p>
            <p className="font-semibold text-[#111111]">${total.toFixed(2)}</p>
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-[#111111] mb-2">
            Payment Method
          </p>
          <div
            onClick={() => setShowPaymentSelector(true)}
            className="w-full border border-[#E3E7EC] rounded-xl p-2.5 flex items-center justify-between cursor-pointer hover:border-[#F41F52]"
          >
            {selectedPayment ? (
              <div className="flex items-center gap-2.5">
                <Image
                  src={getSafeIcon(selectedPayment)}
                  alt="payment"
                  width={25}
                  height={25}
                />
                <div>
                  <p className="text-[13px] text-[#111111] font-medium">
                    {selectedPayment.name}
                  </p>
                  <p className="text-[11px] text-[#9CA4AB]">
                    {selectedPayment.email || selectedPayment.card}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#66707A]">Add payment method</p>
            )}
            <span className="text-[14px] text-[#66707A]">›</span>
          </div>
        </div>

        {/* PAY NOW */}
        <div className="mt-auto pb-6">
          <Button
            className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
            onClick={async () => {
              if (!selectedPayment)
              return alert("⚠️ Please add a payment method first.");
              const bookingId = searchParams.get("bookingId");
              if (!bookingId) return alert("❌ Missing bookingId");

              try {
                const response = await apiFetch(`/payments`, {
                  method: "POST",
                  body: JSON.stringify({
                    amount: total,
                    booking_id: bookingId,
                  }),
                });

                localStorage.setItem(
                  "orderInfo",
                  JSON.stringify({
                    title: event.name,
                    price: `$${total.toFixed(2)}`,
                    date: new Date().toLocaleDateString(),
                    paymentMethod: selectedPayment.name,
                    paymentId: response.payment?.id,
                  })
                );

                router.push("/main_page/ordercompleted");
              } catch (error: any) {
                console.error("❌ Payment Error:", error);
                alert("Payment failed. Please try again.");
              }
            }}
          >
            Pay Now
          </Button>
        </div>
      </div>

      {showPaymentSelector && (
        <PaymentSelector
          onClose={() => setShowPaymentSelector(false)}
          onConfirm={(id) => {
            const stored = JSON.parse(
              localStorage.getItem("userCards") || "[]"
            );
            const chosen = stored.find((c: any) => c.id === id);
            if (chosen) setSelectedPayment(chosen);
            setShowPaymentSelector(false);
          }}
        />
      )}
    </div>
  );
}
