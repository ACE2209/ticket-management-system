"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/splashscreen_onboarding/onboarding");
  };

  return (
    <div
      onClick={handleClick}
      className="card bg-[#F41F52] min-h-screen relative cursor-pointer"
    >
      {/* App Title */}
      <div className="absolute top-[220px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] text-center">
        <h1 className="text-[#FEFEFE] font-extrabold text-[40px] leading-[48px] tracking-[0.005em]">
          Tickla
        </h1>
        <p className="text-[#FFFFFF] font-medium text-[16px] leading-[24px] tracking-[0.005em] whitespace-nowrap">
          Seamless Event Tickets, Anytime
        </p>
      </div>

      {/* Version Text */}
      <p className="absolute left-1/2 -translate-x-1/2 bottom-[60px] text-[#FEFEFE] text-[16px] font-bold leading-[24px] tracking-[0.005em]">
        V1.1
      </p>
    </div>
  );
}
