"use client";

export default function SubscribeBanner() {
  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm bg-[#F41F52] rounded-2xl flex items-center justify-between px-4 py-4 shadow-sm">
        {/* Left side: icon + text */}
        <div className="flex items-center gap-3">
          {/* Icon box */}
          <div className="w-[43px] h-[42px] bg-white rounded-lg flex justify-center items-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F41F52"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Text content */}
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm leading-tight">
              Subscribe Now
            </span>
            <span className="text-white/80 font-semibold text-sm leading-tight">
              Get the latest information
            </span>
          </div>
        </div>

        {/* Arrow icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FEFEFE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
}
