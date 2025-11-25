/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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

interface EventCategory {
  id: string;
  name: string;
  description: string;
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
  category_id?: EventCategory;
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
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const open = searchParams.get("openPaymentSelector");
    if (open === "1") setShowPaymentSelector(true);
  }, [searchParams]);

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return router.push("/main_page/home");

    apiFetch(`/bookings/${bookingId}`)
      .then((res) => {
        const booking = res.data || res;

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

        const price =
          booking.booking_items?.[0]?.price ??
          eventData.tickets?.[0]?.base_price ??
          eventData.seat_zones?.[0]?.tickets?.[0]?.base_price ??
          0;

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

  const total = basePrice * selectedSeats.length + 5000;

  const getSafeIcon = (p: PaymentMethod) =>
    p.icon ||
    (p.brand === "visa"
      ? "/images/visa.png"
      : p.brand === "mastercard"
      ? "/images/mastercard.png"
      : p.brand === "amex"
      ? "/images/amex.png"
      : "/images/card.png");

  const handlePayNow = async () => {
    setErrorMessage(""); // reset thông báo

    try {
      const bookingId = searchParams.get("bookingId");
      if (!bookingId) {
        setErrorMessage("❌ Missing booking ID");
        return;
      }

      const bookingRes = await apiFetch(`/bookings/${bookingId}`);
      const booking = bookingRes.data || bookingRes;

      const amount = Number(
        booking.total_price_paid ||
          booking.fee_charged ||
          booking.booking_items?.[0]?.price ||
          booking.tickets?.[0]?.price ||
          0
      );

      const booking_id =
        typeof booking.id === "object"
          ? booking.id?.id || bookingId
          : String(booking.id || bookingId);

      const payment_id =
        booking.payment_id && typeof booking.payment_id === "string"
          ? booking.payment_id
          : undefined;

      const payload = {
        amount,
        booking_id,
        ...(payment_id ? { payment_id } : {}),
      };

      const paymentRes = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (paymentRes) {
        const paymentData = {
          publishable_key: paymentRes.publishable_key,
          payment_id: paymentRes.payment_id || paymentRes.payment?.id,
          transaction_id:
            paymentRes.transaction_id ||
            paymentRes.client_secret?.split("_secret")[0],
          client_secret: paymentRes.client_secret,
        };

        localStorage.setItem("payment_data", JSON.stringify(paymentData));
      }

      setErrorMessage("✅ Payment created successfully!");
      router.push(`/main_page/addnewcard?bookingId=${bookingId}`);
    } catch (error: any) {
      console.error("❌ Payment failed:", error);
      setErrorMessage(error.message || "Payment failed! Please try again.");
    }
  };

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
            className="w-[35%] h-[100px] object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex flex-col justify-between flex-1 break-words">
            <p className="text-[13px] font-semibold text-[#111111] leading-snug mb-1 break-words">
              {event.name}
            </p>
            {event.category_id?.description && (
              <p className="text-[11px] text-[#9CA4AB] mt-1">
                {event.category_id.description}
              </p>
            )}
            <p className="text-[11px] text-[#78828A] break-words">
              {event.address}, {event.city}, {event.country}
            </p>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Quantity</p>
            <div className="flex items-center gap-1.5 text-[#66707A] text-[12px]">
              {selectedSeats.length}-E Ticket
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[#E3E7EC]">
            <p className="text-[13px] text-[#111111] font-medium">Notes</p>
            <div className="flex items-center gap-1.5 text-[#66707A] text-[12px]">
              Flash Seat Mobile Entry
            </div>
          </div>
        </div>

        {/* PRICE */}
        <div className="mt-4 text-[13px] text-[#66707A]">
          <div className="flex justify-between mb-1.5">
            <p>
              Price{" "}
              <span className="text-[#9CA4AB]">
                ({selectedSeats.length}×{basePrice.toLocaleString("vi-VN")}₫)
              </span>
            </p>
            <p className="text-[#111111] font-medium">
              {(basePrice * Math.max(1, selectedSeats.length)).toLocaleString(
                "vi-VN"
              )}₫
            </p>
          </div>
          <div className="flex justify-between mb-1.5">
            <p>Taxes</p>
            <p className="text-[#111111] font-medium">
              {(5000).toLocaleString("vi-VN")}₫
            </p>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-[#E3E7EC] text-[14px]">
            <p className="font-medium text-[#111111]">Total</p>
            <p className="font-semibold text-[#111111]">
              {total.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        {/* PAY NOW */}
        <div className="mt-auto pb-6">
          {errorMessage && (
            <p className="text-red-500 text-center text-[13px] mb-2">
              {errorMessage}
            </p>
          )}
          <Button
            className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
            onClick={handlePayNow}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
}
