"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

export default function HelpandSupportPage() {
  const router = useRouter();

  const faqs = [
    {
      id: 1,
      question: "Lorem ipsum dolor sit amet",
      answer:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      id: 2,
      question: "Lorem ipsum dolor sit amet",
      answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
    },
    {
      id: 3,
      question: "Lorem ipsum dolor sit amet",
      answer:
        "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      id: 4,
      question: "Lorem ipsum dolor sit amet",
      answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
    },
    {
      id: 5,
      question: "Lorem ipsum dolor sit amet",
      answer: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white relative pb-24">
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Help and Support</h2>
      </div>

      {/* 🔍 Search Bar – nằm ngay dưới tiêu đề, co giãn theo chiều ngang */}
      <div className="w-full flex justify-center mb-8 px-6">
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "52px",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "16px",
            paddingRight: "16px",
            backgroundColor: "#F6F8FE",
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
              flex: 1,
              border: "none",
              outline: "none",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#98A2B3",
              backgroundColor: "transparent",
            }}
          />

          {/* Filter icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
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

      {/* FAQ List */}
      <div className="px-6">
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="py-3">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="text-gray-900 text-base font-medium">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <p className="text-gray-500 text-sm mt-2 leading-relaxed pl-1 pr-4">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
