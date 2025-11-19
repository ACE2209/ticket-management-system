/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { X, Calendar } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (
    payload: {
      category?: string;
      date_from?: string;
      date_to?: string;
      price_min?: number;
      price_max?: number;
      location?: string;
    },
    results?: unknown
  ) => void;
}

const Filter: React.FC<FilterProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedCategory, setSelectedCategory] = useState("Live Concert");
  const [minPrice, setMinPrice] = useState(40);
  const [maxPrice, setMaxPrice] = useState(120);
  const [dateText, setDateText] = useState("");
  const [categories, setCategories] = useState<string[]>([
    "Live Concert",
    "Art Exhibition",
    "Workshop",
    "Tour",
    "Sports",
    "Conference",
  ]);

  // Fetch categories from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await apiFetch("/categories");
        // Handle response format: could be { data: [...] } or [...]
        const categoriesList = data?.data || data;
        // Expecting [{ id, name, ... }]
        const names: string[] = Array.isArray(categoriesList)
          ? categoriesList.map((c: any) => c?.name).filter(Boolean)
          : [];
        if (isMounted && names.length) {
          setCategories(names);
          if (!names.includes(selectedCategory)) {
            setSelectedCategory(names[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // ignore and keep fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMinPriceChange = (value: number) => {
    setMinPrice(value);
    if (value > maxPrice) {
      setMaxPrice(value);
    }
  };

  const handleMaxPriceChange = (value: number) => {
    setMaxPrice(value);
    if (value < minPrice) {
      setMinPrice(value);
    }
  };

  const applyFilter = async () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (dateText) {
      // If single date provided, use for both from/to
      params.append("date_from", dateText);
      params.append("date_to", dateText);
    }
    if (typeof minPrice === "number")
      params.append("price_min", String(minPrice));
    if (typeof maxPrice === "number")
      params.append("price_max", String(maxPrice));


    let results: unknown = undefined;
    try {
      const data = await apiFetch(`/events?${params.toString()}`);
      // Handle response format: could be { data: [...] } or [...]
      results = data?.data || data;

      if (typeof window !== "undefined") {
        // Expose for quick debug during integration
        (window as any).__lastFilterResults = results;
      }
    } catch (err) {
      console.error("Failed to fetch filtered events:", err);
      // Continue even if fetch fails, so onApply can still be called
    }

    if (typeof (onApply as any) === "function") {
      (onApply as NonNullable<FilterProps["onApply"]>)(
        {
          category: selectedCategory || undefined,
          date_from: dateText || undefined,
          date_to: dateText || undefined,
          price_min: minPrice,
          price_max: maxPrice,
        },
        results
      );
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end ">
      {/* Background blur overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Filter panel */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[90vh]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Filter Events</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto hide-scrollbar">          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 ">
              Categories
            </h3>
            <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category ? "#F41F52" : undefined,
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Dates</h3>
            <div className="relative">
              <input
                type="text"
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="24 October 2021"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Price Range</h3>
              <span className="font-semibold" style={{ color: "#F41F52" }}>
                ${minPrice} - ${maxPrice}
              </span>
            </div>

            {/* Simple Range Slider */}
            <div className="space-y-4">
              {/* Min Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600">Min Price</label>
                  <span className="text-sm font-medium text-gray-900">
                    ${minPrice}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="40"
                    max="120"
                    value={minPrice}
                    onChange={(e) =>
                      handleMinPriceChange(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #F41F52 0%, #F41F52 ${
                        ((minPrice - 40) / 80) * 100
                      }%, #e5e7eb ${
                        ((minPrice - 40) / 80) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600">Max Price</label>
                  <span className="text-sm font-medium text-gray-900">
                    ${maxPrice}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="40"
                    max="120"
                    value={maxPrice}
                    onChange={(e) =>
                      handleMaxPriceChange(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #F41F52 0%, #F41F52 ${
                        ((maxPrice - 40) / 80) * 100
                      }%, #e5e7eb ${
                        ((maxPrice - 40) / 80) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Filter Button */}
        <div className="px-6 pb-6">
          <button
            onClick={applyFilter}
            className="w-full text-white font-bold py-4 rounded-xl transition-colors"
            style={{
              backgroundColor: "#F41F52",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E91E63";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#F41F52";
            }}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
