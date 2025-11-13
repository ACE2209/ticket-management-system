/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import CardPreview from "@/components/main_page/CardPreview";

export default function AddCardPage() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);

  const [brand] = useState("visa");
  const [last4] = useState("0000");

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement!,
      billing_details: {
        name,
        address: { postal_code: zip },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const brandIconMap: any = {
      visa: "/images/visa.png",
      mastercard: "/images/mastercard.png",
      amex: "/images/amex.png",
      card: "/images/card.png",
    };

    const cardBrand = (paymentMethod.card?.brand || "card").toLowerCase();

    const newCard = {
      id: paymentMethod.id,
      name: name || "CARD HOLDER",
      brand: cardBrand,
      card: paymentMethod.card?.last4
        ? `**** **** **** ${paymentMethod.card.last4}`
        : "**** **** ****",
      icon: brandIconMap[cardBrand],
    };

    const existing = JSON.parse(localStorage.getItem("userCards") || "[]");
    localStorage.setItem("userCards", JSON.stringify([...existing, newCard]));

    alert("✅ Card added successfully!");
    router.push(
      `/main_page/checkout?bookingId=${bookingId}&openPaymentSelector=1`
    );
    setLoading(false);
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
      <div className="flex items-center w-full mb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-semibold ml-3 px-2 py-1 rounded">
          Add New Card
        </h1>
      </div>

      <div className="w-full flex justify-center mb-3">
        <CardPreview brand={brand} last4={last4} name={name || "CARD HOLDER"} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {/* Card holder name */}
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

        {/* Card Number */}
        <div>
          <label className="text-gray-600 text-sm">Card Number</label>
          <div className="bg-gray-100 mt-1 p-3 rounded-2xl border">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Expiry + CVC */}
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

        {/* ZIP Code */}
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

        <button
          type="submit"
          disabled={!stripe || !name}
          className={`mt-2 w-full py-3 rounded-2xl font-semibold text-white transition ${
            !stripe || !name
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FF2C55] hover:bg-[#ff1e4a]"
          }`}
        >
          {loading ? "Processing..." : "Add Card"}
        </button>
      </form>
    </div>
  );
}
