"use client";

export default function CategoryList() {
  const categories = [
    { label: "Local Art Culture", icon: "🏛️" },
    { label: "Performing Arts", icon: "🎭" },
    { label: "Foods and Drinks", icon: "🍔" },
    { label: "Creative Clubs", icon: "💡" },
  ];

  return (
    <div className="w-full flex justify-center mt-3 sm:mt-4 mb-3 px-5">
      <div className="w-full max-w-sm grid grid-cols-4 gap-4">
        {categories.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <div className="w-12 h-12 bg-[#F41F52] rounded-full flex justify-center items-center text-white text-xl shadow-sm">
              {item.icon}
            </div>
            <span className="text-[10px] font-semibold text-[#111111] text-center leading-[13px] tracking-[0.02em]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
