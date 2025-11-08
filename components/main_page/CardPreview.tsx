/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

interface CardPreviewProps {
  brand: string;
  last4?: string;
  name?: string;
}

export default function CardPreview({ brand, last4 = "----", name = "CARD HOLDER" }: CardPreviewProps) {
  const renderBrand = () => {
    const b = brand.toLowerCase();

    if (b === "visa")
      return <span className="text-white font-bold text-sm tracking-wider">VISA</span>;

    if (b === "mastercard")
      return (
        <div className="flex gap-[2px]">
          <div className="w-4 h-4 rounded-full bg-[#EB001B]"></div>
          <div className="w-4 h-4 rounded-full bg-[#FF5F00] -ml-2"></div>
        </div>
      );

    if (b === "amex")
      return <span className="text-[#4CC6F4] font-bold text-sm">AMEX</span>;

    if (b === "paypal")
      return <span className="text-[#003087] font-bold text-sm">PayPal</span>;

    return <span className="text-gray-300 text-sm">CARD</span>;
  };

  return (
    <div className="w-[360px] h-[200px] rounded-3xl relative overflow-hidden bg-[#111827] flex flex-col p-5 text-white shadow-xl">
      {/* Circle Background Shapes */}
      <div className="absolute w-[260px] h-[260px] rounded-full bg-white/5 -bottom-14 -left-10"></div>
      <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 -bottom-8 left-14"></div>

      <div className="relative flex justify-between items-center">
        <span className="text-sm text-gray-300 font-medium">X-Card</span>
        {renderBrand()}
      </div>

      <div className="mt-6 text-gray-300 text-xs">Balance</div>
      <div className="text-2xl font-semibold mt-1">$X.XXX,XX</div>

      <div className="flex justify-between items-end mt-auto text-sm">
        <span className="tracking-widest text-gray-300">**** **** **** {last4}</span>
        <span className="text-gray-400">12/24</span>
      </div>
    </div>
  );
}
