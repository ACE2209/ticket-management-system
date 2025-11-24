"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface EventType {
  id: string;
  name: string;
  category?: { id: string; name: string };
  address?: string;
  city?: string;
  country?: string;
  min_base_price?: number;
  preview_image?: string;
  earliest_start_time?: string;
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
}

const Filter: React.FC<FilterProps> = ({ isOpen, onClose }) => {
  const [minPrice, setMinPrice] = useState(40);
  const [maxPrice, setMaxPrice] = useState(120);
  const [dateText, setDateText] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);

  const applyFilter = async () => {
    const params = new URLSearchParams();
    if (dateText) params.append("filtered_date", dateText);
    params.append("min_price", String(minPrice * 1000));
    params.append("max_price", String(maxPrice * 1000));
    params.append("sort", "-date_created");

    setLoading(true);
    try {
      const data = await apiFetch(`/events?${params.toString()}`);
      const results = data?.data || data;
      setFilteredEvents(results);
    } catch (err) {
      console.error("Failed to fetch filtered events:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Filter Events</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-6 space-y-6 overflow-y-auto hide-scrollbar flex-1">
          {/* Date */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Date</h3>
            <input
              type="date"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
            />
          </div>

          {/* Price */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Price Range</h3>
              <span className="font-semibold text-[#F41F52]">
                {(minPrice * 1000).toLocaleString("vi-VN")}₫ -{" "}
                {(maxPrice * 1000).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="space-y-4">
              {/* Min Price */}
              <input
                type="range"
                min={40}
                max={1000}
                step={10}
                value={minPrice}
                onChange={(e) => {
                  const value = +e.target.value;
                  setMinPrice(value);
                  if (value > maxPrice) setMaxPrice(value);
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer
      bg-gradient-to-r from-[#F41F52] to-gray-200"
                style={{
                  background: `linear-gradient(to right, #F41F52 0%, #F41F52 ${
                    ((minPrice - 40) / (1000 - 40)) * 100
                  }%, #E5E7EB ${
                    ((minPrice - 40) / (1000 - 40)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />

              {/* Max Price */}
              <input
                type="range"
                min={40}
                max={1000}
                step={10}
                value={maxPrice}
                onChange={(e) => {
                  const value = +e.target.value;
                  setMaxPrice(value);
                  if (value < minPrice) setMinPrice(value);
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #F41F52 0%, #F41F52 ${
                    ((maxPrice - 40) / (1000 - 40)) * 100
                  }%, #E5E7EB ${
                    ((maxPrice - 40) / (1000 - 40)) * 100
                  }%, #E5E7EB 100%)`,
                }}
              />
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={applyFilter}
            className="w-full text-white font-bold py-4 rounded-xl bg-[#F41F52] hover:bg-[#E91E63] transition-colors"
          >
            Apply Filter
          </button>

          {/* Filtered results */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Results</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-gray-500">No results</p>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-3 bg-white shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="relative w-[120px] h-[100px]">
                      <Image
                        src={event.preview_image || "/images/default-event.jpg"}
                        alt={event.name}
                        fill
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col justify-between py-2 pr-3">
                      <div>
                        <p className="text-[12px] text-[#5C5C5C]">
                          {event.category?.name || "Event"}
                        </p>
                        <p className="text-[14px] font-semibold leading-tight text-[#111]">
                          {event.name}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[12px] text-[#667085]">
                        <span>
                          {event.earliest_start_time || "Updating..."}
                        </span>
                        <span className="text-[#E53E3E] font-semibold text-[13px]">
                          {event.min_base_price
                            ? `${event.min_base_price.toLocaleString()}₫`
                            : "Free"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
