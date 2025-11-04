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

type BookingDetail = {
  id: string;
  booking_date: string;
  event: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    preview_image: string;
    event_schedules: Array<{
      id: string;
      start_time: string;
      end_time: string;
    }>;
  };
  tickets: Array<{
    id: string;
    price: number;
    qr: string;
    seat: {
      id: string;
      seat_number: string;
    };
  }>;
  "price "?: number;
};

export default function OrderCompletedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBookingDetail = async () => {
      // Ưu tiên lấy từ booking ID nếu có
      if (bookingId) {
        try {
          setLoading(true);
          const data: BookingDetail = await apiFetch(`/bookings/${bookingId}`);
          
          // Tính tổng price từ tickets hoặc dùng price field
          const totalPrice = data["price "] || 
            (data.tickets?.reduce((sum, ticket) => sum + ticket.price, 0) || 0);
          
          // Format date
          const bookingDate = new Date(data.booking_date);
          const dateStr = bookingDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          // Lấy payment method từ localStorage nếu có
          const storedOrder = localStorage.getItem("orderInfo");
          const storedPaymentMethod = storedOrder 
            ? JSON.parse(storedOrder).paymentMethod 
            : "Card";

          setOrder({
            title: data.event?.name || "Event",
            price: `$${totalPrice.toFixed(2)}`,
            date: dateStr,
            paymentMethod: storedPaymentMethod || "Card",
          });
        } catch (err) {
          console.error("Error fetching booking detail:", err);
          // Fallback to localStorage nếu API fail
          loadFromLocalStorage();
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback: lấy từ localStorage nếu không có booking ID
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem("orderInfo");
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing orderInfo:", e);
        }
      }
      setLoading(false);
    };

    fetchBookingDetail();
  }, [bookingId]);

  return (
    <div className="min-h-screen w-full bg-[#1b1736] flex flex-col items-center pt-10 px-6">
      {/* Header */}
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

      {/* Card Section */}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="white"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          Payment successful!
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {loading
            ? "Processing your order..."
            : order
            ? `Your payment for "${order.title}" was successful using ${order.paymentMethod}.`
            : "Order information not available"}
        </p>

        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* Amount */}
        <p className="text-sm text-gray-400">Total Payment</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          {order?.price || "$0.00"}
        </h3>

        <hr className="border-gray-200 mb-4" />

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-900">{order?.date || "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-900">
            {order?.paymentMethod || "-"}
          </span>
        </div>
      </motion.div>

      {/* Button */}
      <button
        onClick={() => router.push("/main_page/home")}
        className="mt-8 bg-[#f83b66] text-white font-medium text-sm px-6 py-4 w-full max-w-sm rounded-full hover:opacity-90 transition"
      >
        Back to home
      </button>
    </div>
  );
}
