"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface CategoryType {
  id: number | string;
  name: string;
  description?: string;
}

export default function ClubEvent() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/categories");
        const data = res.data || res;
        setCategories(data.slice(0, 3)); // 🔹 Lấy 3 category đầu tiên
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Club Event
          </span>
          <span
            onClick={() => router.push("/main_page/eventList")}
            className="text-[#F41F52] text-xs font-medium cursor-pointer"
          >
            See All
          </span>
        </div>

        {/* Category list */}
        <div className="flex justify-between gap-3">
          {loading ? (
            <span className="text-gray-500 text-sm text-center w-full">
              Loading...
            </span>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div className="w-full aspect-[104/137] rounded-xl bg-[#F2F1F8] overflow-hidden shadow-sm flex justify-center items-center">
                  <Image
                    src="/images/default-event.jpg"
                    alt={cat.name}
                    width={104}
                    height={137}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-semibold text-[#272841] text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm text-center w-full">
              No categories found.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
