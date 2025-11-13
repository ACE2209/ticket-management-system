/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface StoredCard {
  id: string;
  name: string;
  icon: string;
  card: string;
  brand?: string;
}

interface PaymentSelectorProps {
  onClose: () => void;
  onConfirm?: (paymentMethod: string) => void; // optional
}

export default function PaymentSelector({ onClose }: PaymentSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [payments, setPayments] = useState<StoredCard[]>([]);

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const stored: StoredCard[] = JSON.parse(
      localStorage.getItem("userCards") || "[]"
    );
    setPayments(stored);
  }, []);

  const getIcon = (p: StoredCard) => p.icon || "/images/card.png";

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

  const handleConfirm = async () => {
    if (!selected) {
      alert("Please select a payment method!");
      return;
    }

    const selectedCard = payments.find((p) => p.id === selected);
    if (!selectedCard) return;

    try {
      const paymentData = JSON.parse(
        localStorage.getItem("payment_data") || "{}"
      );
      if (!paymentData?.payment?.id || !paymentData?.payment?.transaction_id) {
        alert("No payment data found!");
        return;
      }

      const paymentId = paymentData.payment.id; 
      const transactionId = paymentData.payment.transaction_id; 
      const body = {
        payment_intent_id: transactionId,
        payment_method_id: selectedCard.id,
      };

      console.log("📦 Confirming payment:", body);

      // 🔸 Gọi API xác nhận thanh toán
      const response = await apiFetch(`/payments/${paymentId}/confirm`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      console.log("✅ Payment confirmed:", response);

      const orderInfo = {
        title: "Booking #" + bookingId,
        price: "$120.00", 
        date: new Date().toLocaleDateString(),
        paymentMethod: formatBrand(selectedCard.brand),
        status: "confirmed",
      };
      localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

      onClose();
      router.push("/main_page/ordercompleted");
    } catch (err: any) {
      console.error("❌ Confirm payment failed:", err);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end z-50">
      <div onClick={onClose} className="absolute inset-0 bg-black/40"></div>

      <div className="relative w-full bg-white rounded-t-[32px] p-6 z-10">
        <div className="w-[36px] h-[4px] bg-[#E3E7EC] rounded-full mx-auto mb-6"></div>

        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">
          Payment Method
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`flex items-center justify-between border rounded-[16px] p-3 cursor-pointer ${
                  selected === p.id
                    ? "border-[#F41F52] bg-[#FFF3F6]"
                    : "border-[#E3E7EC]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image src={getIcon(p)} alt={p.name} width={32} height={32} />
                  <div>
                    <p className="text-[14px] font-medium">
                      {formatBrand(p.brand)}
                    </p>
                    <p className="text-[12px] text-[#78828A]">{p.card}</p>
                  </div>
                </div>

                <div
                  className={`w-[20px] h-[20px] rounded-full border flex items-center justify-center ${
                    selected === p.id
                      ? "border-[#F41F52] bg-[#F41F52]"
                      : "border-[#E3E7EC]"
                  }`}
                >
                  {selected === p.id && (
                    <span className="text-white text-[14px] leading-[14px]">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[13px] text-[#78828A]">
              No cards added yet.
            </p>
          )}

          <div
            onClick={() =>
              router.push(`/main_page/addnewcard?bookingId=${bookingId}`)
            }
            className="flex items-center gap-3 border border-[#E3E7EC] rounded-[16px] p-3 cursor-pointer"
          >
            <div className="w-[28px] h-[28px] rounded-full bg-[#F6F7F9] flex items-center justify-center text-[20px] font-medium">
              +
            </div>
            <p className="text-[14px] font-medium">Add Payment Method</p>
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
}
