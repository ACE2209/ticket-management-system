"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function OrderCompletedPage() {
  const router = useRouter();

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
        <h1 className="text-white font-semibold text-base ml-3">Order Completed</h1>
      </div>

      {/* Card Section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-lg text-center"
      >
        {/* Success Icon */}
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

        <h2 className="text-lg font-semibold text-gray-900">Payment successful!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Etiam cras nec metus laoreet. Faucibus iaculis cras ut posuere.
        </p>

        <div className="border-t border-dashed border-gray-300 my-4"></div>

        {/* Amount */}
        <p className="text-sm text-gray-400">Total Top Up</p>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">$250.00</h3>

        <hr className="border-gray-200 mb-4" />

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Date</span>
          <span className="font-medium text-gray-900">August 12, 2024</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Fee</span>
          <span className="font-medium text-gray-900">$2.00</span>
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
