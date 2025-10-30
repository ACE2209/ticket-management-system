"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PaymentSelectorProps {
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
}

export default function PaymentSelector({ onClose, onConfirm }: PaymentSelectorProps) {
  const [selected, setSelected] = useState("mastercard");

  const payments = [
    {
      id: "paypal",
      name: "PayPal",
      email: "sask****@mail.com",
      icon: "/images/paypal.png",
    },
    {
      id: "mastercard",
      name: "MasterCard",
      card: "4827 8472 7424 ****",
      icon: "/images/mastercard.png",
    },
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end font-['PlusJakartaSans'] z-50">
      {/* Overlay background */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Bottom Sheet */}
      <div className="relative w-full max-w-[375px] bg-white rounded-t-[32px] p-6 z-10">
        {/* Handle bar */}
        <div className="w-[36px] h-[4px] bg-[#E3E7EC] rounded-full mx-auto mb-6"></div>

        {/* Title */}
        <h2 className="text-[16px] font-semibold text-[#111111] mb-4">
          Payment Method
        </h2>

        {/* Payment Options */}
        <div className="flex flex-col gap-3 mb-4">
          {payments.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`flex items-center justify-between border rounded-[16px] p-3 transition-all duration-200 cursor-pointer ${
                selected === p.id
                  ? "border-[#F41F52] bg-[#FFF3F6]"
                  : "border-[#E3E7EC] bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Image src={p.icon} alt={p.name} width={32} height={32} />
                <div>
                  <p className="text-[14px] font-medium text-[#111111]">
                    {p.name}
                  </p>
                  <p className="text-[12px] text-[#78828A]">
                    {p.email || p.card}
                  </p>
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
                  <span className="text-white text-[14px] leading-[14px]">✓</span>
                )}
              </div>
            </div>
          ))}

          {/* Add Payment Method */}
          <div className="flex items-center gap-3 border border-[#E3E7EC] rounded-[16px] p-3 cursor-pointer">
            <div className="w-[28px] h-[28px] rounded-full bg-[#F6F7F9] flex items-center justify-center text-[#111111] text-[20px] font-medium">
              +
            </div>
            <p className="text-[14px] font-medium text-[#111111]">
              Add Payment Method
            </p>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={() => {
            onConfirm(selected);
            onClose();
          }}
          className="w-full h-[56px] rounded-full bg-[#F41F52] text-white text-[16px] font-semibold mt-2"
        >
          Confirm Payment
        </Button>
      </div>
    </div>
  );
}