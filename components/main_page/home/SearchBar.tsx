"use client";
import { SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full flex justify-center -translate-y-1/2">
      <div
        style={{
          width: "327px",
          height: "52px",
          borderRadius: "24px",
          border: "1px solid #F41F52",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          backgroundColor: "#FEFEFE",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {/* Icon search */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15.2"
          height="15.54"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#98A2B3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Input */}
        <input
          type="text"
          placeholder="Search..."
          style={{
            width: "234px",
            height: "24px",
            border: "none",
            outline: "none",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#98A2B3",
          }}
        />

        {/* Filter icon */}
        <div
          style={{
            width: "26px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "0px",
              height: "18px",
              borderLeft: "1px solid #E3E7EC",
            }}
          ></div>

          <SlidersHorizontal size={18} stroke="#98A2B3" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
