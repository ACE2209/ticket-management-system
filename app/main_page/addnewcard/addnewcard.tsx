 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import CardPreview from "@/components/main_page/CardPreview";
import { apiFetch } from "@/lib/api";

export default function AddCardPageWrapper() {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const paymentData = JSON.parse(
      localStorage.getItem("payment_data") || "{}"
    );
    if (paymentData?.publishable_key) {
      setStripePromise(loadStripe(paymentData.publishable_key));
    }
  }, []);

  if (!stripePromise) return <div>Loading...</div>;

  return (
    <Elements stripe={stripePromise}>
      <AddCardPage />
    </Elements>
  );
}

function AddCardPage() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // thông báo lỗi

  const [brand] = useState("visa");
  const [last4] = useState("0000");

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const paymentData = JSON.parse(
        localStorage.getItem("payment_data") || "{}"
      );

      if (!paymentData?.publishable_key) {
        setMessage("❌ Thiếu publishable key. Vui lòng thử lại.");
        setLoading(false);
        return;
      }
      if (!paymentData?.transaction_id || !paymentData?.payment_id) {
        setMessage("❌ Thiếu dữ liệu thanh toán từ server.");
        setLoading(false);
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) throw new Error("CardNumberElement not found");

      // Tạo payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name,
          address: { postal_code: zip },
        },
      });

      // ⭐ PHÂN BIỆT LỖI USER & LỖI STRIPE
      if (error) {
        console.error("Stripe createPaymentMethod error:", error);

        if (error.type === "card_error") {
          setMessage(`❌ ${error.message}`); // lỗi người dùng nhập sai
        } else {
          setMessage("❌ Lỗi Stripe. Vui lòng thử lại.");
        }

        setLoading(false);
        return;
      }

      // Gửi confirm PaymentIntent đến server
      const confirmRes = await apiFetch(
        `/payments/${paymentData.payment_id}/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_intent_id: paymentData.transaction_id,
            payment_method_id: paymentMethod.id,
          }),
        }
      );

      // Nếu server trả error code
      if (confirmRes?.error) {
        setMessage("❌ Server xác nhận thanh toán thất bại.");
        setLoading(false);
        return;
      }

      setMessage("✅ Payment confirmed successfully!");
      router.push(`/main_page/ordercompleted?bookingId=${bookingId}`);

    } catch (err: any) {
      console.error("Payment error details:", err);

      // ⭐ PHÂN BIỆT LỖI MẠNG
      if (err?.message?.includes("Failed to fetch")) {
        setMessage("❌ Không thể kết nối server. Kiểm tra mạng.");
      }
      // ⭐ LỖI 500 TỪ BACKEND
      else if (err?.status >= 500) {
        setMessage("❌ Server gặp lỗi. Vui lòng thử lại sau.");
      }
      // ⭐ LỖI CHUNG
      else {
        setMessage("❌ Thanh toán thất bại. Vui lòng kiểm tra lại thông tin.");
      }

    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "14px",
        color: "#333",
        "::placeholder": { color: "#999" },
      },
      invalid: { color: "#e11d48" },
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-6">
      <div className="flex items-center w-full mb-3 justify-center">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 absolute left-4"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-semibold px-2 py-1 rounded text-center">
          Enter Card Details
        </h1>
      </div>

      <div className="w-full flex justify-center mb-3">
        <CardPreview brand={brand} last4={last4} name={name || "CARD HOLDER"} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        <div>
          <label className="text-gray-600 text-sm">Card Holder Name</label>
          <input
            type="text"
            placeholder="FULL NAME"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            className="mt-1 w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        <div>
          <label className="text-gray-600 text-sm">Card Number</label>
          <div className="bg-gray-100 mt-1 p-3 rounded-2xl border">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-gray-600 text-sm">Expiry Date</label>
            <div className="bg-gray-100 mt-1 p-3 rounded-2xl border">
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-gray-600 text-sm">CVC</label>
            <div className="bg-gray-100 mt-1 p-3 rounded-2xl border">
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-gray-600 text-sm">ZIP / Postal Code</label>
          <input
            type="text"
            placeholder="ZIP CODE"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="mt-1 w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
        </div>

        {message && (
          <p className="text-center text-sm mb-2 text-red-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={!stripe || !name || loading}
          className={`mt-2 w-full py-3 rounded-2xl font-semibold text-white transition ${
            !stripe || !name || loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FF2C55] hover:bg-[#ff1e4a]"
          }`}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </form>
    </div>
  );
}
