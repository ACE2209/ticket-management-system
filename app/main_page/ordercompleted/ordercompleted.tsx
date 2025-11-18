/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface OrderInfo {
  title: string;
  price: string;
  date: string;
  paymentMethod: string;
}

export default function OrderCompletedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const bookingId = searchParams.get("bookingId");
        if (!bookingId) return router.push("/main_page/home");

        // 🔹 Lấy booking
        const bookingRes = await apiFetch(`/bookings/${bookingId}`);
        const booking = bookingRes.data || bookingRes;

        // 🔹 Lấy payment data
        const paymentData = JSON.parse(
          localStorage.getItem("payment_data") || "{}"
        );

        // 🔹 Tính total
        const basePrice =
          booking.booking_items?.[0]?.price ||
          booking.tickets?.[0]?.base_price ||
          0;
        const quantity = booking.booking_items?.length || 1;
        const total = basePrice * quantity + 5; // +tax

        // 🔹 Lấy phương thức thanh toán
        const paymentMethodId = paymentData?.payment_method_id;
        const storedCards = JSON.parse(localStorage.getItem("userCards") || "[]");
        const card = storedCards.find((c: any) => c.id === paymentMethodId);

        const formatBrand = (brand?: string) => {
          if (!brand) return "Card";
          switch (brand.toLowerCase()) {
            case "visa": return "Visa";
            case "mastercard": return "Mastercard";
            case "jcb": return "JCB";
            case "amex": return "American Express";
            default: return brand.charAt(0).toUpperCase() + brand.slice(1);
          }
        };

        setOrder({
          title: `Booking #${bookingId}`,
          price: `$${total.toFixed(2)}`,
          date: new Date().toLocaleDateString(),
          paymentMethod: card ? formatBrand(card.brand) : "Card",
        });
      } catch (err) {
        console.error("❌ Failed to fetch order:", err);
      }
    };

    fetchOrder();
  }, [router, searchParams]);

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading order...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#1b1736] flex flex-col items-center pt-10 px-6">
      {/* HEADER */}
      <div className="flex items-center w-full mb-6">
        <button
          onClick={() => router.back()}
          className="text-white p-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-white font-semibold text-base ml-3">
          Order Completed
        </h1>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-lg text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-green-200 rounded-full blur-xl opacity-70"></div>
            <div className="relative bg-green-500 w-16 h-16 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">Payment successful!</h2>
        <p className="text-gray-400 text-sm mb-6">
          {`Your payment for "${order.title}" was successful using ${order.paymentMethod}.`}
        </p>

        <div className="border-t border-dashed border-gray-300 my-4"></div>

        <p className="text-sm text-gray-400">Total Payment</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{order.price}</h3>

        <hr className="border-gray-200 mb-4" />

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-900">{order.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-900">{order.paymentMethod}</span>
        </div>
      </motion.div>

      <button
        onClick={() => router.push("/main_page/home")}
        className="mt-8 bg-[#f83b66] text-white font-medium text-sm px-6 py-4 w-full max-w-sm rounded-full hover:opacity-90 transition"
      >
        Back to home
      </button>
    </div>
  );
}
