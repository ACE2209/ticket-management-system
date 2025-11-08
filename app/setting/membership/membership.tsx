"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import { rankLevels, getUserRank, RankInfo } from "@/data/membership";
import { apiFetch } from "@/lib/api";

export default function MembershipPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ points: number; spent: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembership() {
      try {
        // ✅ Không dùng id nữa — dùng token (Bearer) để lấy data
        const data = await apiFetch(`/memberships/me`, { method: "GET" });

        // API trả về: { discount, early_buy_time, points, tier }
        const points = data.points ?? 0;

        setUser({
          points,
          spent: points * 10000, // 1 point = 10.000 VND
        });
      } catch (err) {
        console.error("⚠️ Failed to fetch membership info:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembership();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No user data found.
      </div>
    );

  const rank = getUserRank(user.points, user.spent);
  const currentRankInfo = rankLevels.find((r) => r.name === rank)!;
  const nextRankIndex = rankLevels.findIndex((r) => r.name === rank) + 1;
  const nextRank = rankLevels[nextRankIndex];

  let pointsLeft = 0;
  let spentLeft = 0;
  if (nextRank) {
    pointsLeft = Math.max(0, nextRank.minPoints - user.points);
    spentLeft = Math.max(0, nextRank.minSpent - user.spent);
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-white relative pb-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Membership</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 hide-scrollbar">
        {/* Rank hiện tại */}
        <div className="text-center mt-6">
          <div className="inline-block px-6 py-3 rounded-2xl bg-[#F41F52] shadow-md">
            <p className="text-3xl font-bold text-white drop-shadow-sm">
              {currentRankInfo.icon} {currentRankInfo.name}
            </p>
          </div>
          <p className="mt-3 text-gray-500 text-sm">
            {currentRankInfo.description}
          </p>
        </div>

        {/* Thông tin user */}
        <div className="mt-8 bg-gray-50 p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Your Progress</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Points:</span>{" "}
              <span className="text-[#F41F52] font-semibold">
                {user.points}
              </span>
            </p>
            <p>
              <span className="font-medium">Total Spent:</span>{" "}
              <span className="text-[#F41F52] font-semibold">
                {(user.spent ?? 0).toLocaleString("vi-VN")} VND
              </span>
            </p>
          </div>
        </div>

        {/* Rank tiếp theo */}
        {nextRank ? (
          <div className="mt-6 bg-[#F41F52]/10 p-5 rounded-2xl shadow-sm border border-[#F41F52]/30">
            <p className="font-semibold text-[#F41F52] mb-2">
              🚀 Next Rank: {nextRank.icon} {nextRank.name}
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Cần thêm{" "}
              <span className="font-semibold text-black">
                {pointsLeft.toLocaleString("vi-VN")} điểm
              </span>{" "}
              hoặc{" "}
              <span className="font-semibold text-black">
                {spentLeft.toLocaleString("vi-VN")} VND
              </span>{" "}
              để lên hạng {nextRank.name}.
            </p>
          </div>
        ) : (
          <div className="mt-6 bg-green-100 p-5 rounded-2xl shadow-md text-green-700 font-medium border border-green-200">
            🎉 You’ve reached the highest rank — Platinum!
          </div>
        )}

        {/* Danh sách toàn bộ rank */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            All Membership Ranks
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {rankLevels.map((r: RankInfo) => (
              <div
                key={r.name}
                className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-300 ${
                  r.name === rank
                    ? "border-[#F41F52] bg-[#F41F52]/10 shadow-sm"
                    : "border-gray-200 hover:border-[#F41F52]/50"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold text-base ${
                      r.name === rank ? "text-[#F41F52]" : "text-gray-900"
                    }`}
                  >
                    {r.icon} {r.name}
                  </p>
                  <p className="text-sm text-gray-500">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2">
        <BottomNavBar />
      </div>
    </div>
  );
}
