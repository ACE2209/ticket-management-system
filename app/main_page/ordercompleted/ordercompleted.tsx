/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface OrderInfo {
  title: string; // Hiển thị UI
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

        // 🔹 Lấy thông tin vé
        const basePrice =
          booking.booking_items?.[0]?.price ||
          booking.tickets?.[0]?.base_price ||
          0;
        const quantity = booking.booking_items?.length || 1;
        const total = basePrice * quantity;

        // 🔹 Lấy tên event và ghế
        const eventName =
          booking.event?.name || booking.tickets?.[0]?.event_name || "Ticket";
        const seatNames =
          booking.booking_items
            ?.map((item: any) => item.seat_id?.seat_number)
            .join(", ") || "";

        // 🔹 Lấy phương thức thanh toán
        const paymentData = JSON.parse(
          localStorage.getItem("payment_data") || "{}"
        );
        const paymentMethodId = paymentData?.payment_method_id;
        const storedCards = JSON.parse(
          localStorage.getItem("userCards") || "[]"
        );
        const card = storedCards.find((c: any) => c.id === paymentMethodId);

        const formatBrand = (brand?: string) => {
          if (!brand) return "Card";
          switch (brand.toLowerCase()) {
            case "visa":
              return "Visa";
            case "mastercard":
              return "Mastercard";
            case "jcb":
              return "JCB";
            case "amex":
              return "American Express";
            default:
              return brand.charAt(0).toUpperCase() + brand.slice(1);
          }
        };

        // 🔹 Set order
        setOrder({
          title: `${eventName} - Seats: ${seatNames}`,
          price: total.toLocaleString("vi-VN") + "₫",
          date: new Date().toLocaleDateString(),
          paymentMethod: card ? formatBrand(card.brand) : "Card",
        });

        console.log(
          `Your payment for "Booking #${bookingId}" was successful using ${
            card ? formatBrand(card.brand) : "Card"
          }.`
        );
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
      <div className="min-h-screen w-full bg-[#1b1736] flex flex-col items-center pt-20 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-sm"
        >
          {/* Glow xung quanh card */}
          <div className="absolute -inset-1 bg-green-300 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>

          {/* Card chính */}
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center relative z-10">
            {/* circle tick nổi trên đầu */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="relative flex items-center justify-center">
                {/* Vòng nhạt bên ngoài tick */}
                <div className="absolute w-24 h-24 bg-green-300 rounded-full blur-3xl opacity-50 animate-pulse"></div>

                {/* Vòng trung tâm tick */}
                <div className="absolute w-20 h-20 bg-green-200 rounded-full blur-xl opacity-70"></div>

                {/* Tick */}
                <div className="relative bg-green-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="white"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Nội dung card */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment successful!
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {`Your payment for "${order.title}" was successful using ${order.paymentMethod}.`}
              </p>

              <div className="border-t border-dashed border-gray-300 my-4"></div>

              <p className="text-sm text-gray-400">Total Payment</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {order.price}
              </h3>

              <hr className="border-gray-200 mb-4" />

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">{order.date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <button
          onClick={() => router.push("/main_page/home")}
          className="mt-8 bg-[#f83b66] text-white font-medium text-sm px-6 py-4 w-full max-w-sm rounded-full hover:opacity-90 transition"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
