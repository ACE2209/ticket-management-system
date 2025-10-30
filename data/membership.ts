// utils/membership.ts

export type Rank = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface RankInfo {
  name: Rank;
  icon: string;
  description: string;
  minPoints: number;
  minSpent: number;
}

export const rankLevels: RankInfo[] = [
  {
    name: "Bronze",
    icon: "🥉",
    description: "Default rank for new users.",
    minPoints: 0,
    minSpent: 0,
  },
  {
    name: "Silver",
    icon: "🥈",
    description: "≥ 500 points or ≥ 5,000,000 VND.",
    minPoints: 500,
    minSpent: 5000000,
  },
  {
    name: "Gold",
    icon: "🥇",
    description: "≥ 2,000 points or ≥ 20,000,000 VND.",
    minPoints: 2000,
    minSpent: 20000000,
  },
  {
    name: "Platinum",
    icon: "💎",
    description: "≥ 5,000 points or ≥ 50,000,000 VND.",
    minPoints: 5000,
    minSpent: 50000000,
  },
];

// ✅ Hàm tính rank hiện tại của user
export function getUserRank(points: number, spent: number): Rank {
  if (points >= 5000 || spent >= 50000000) return "Platinum";
  if (points >= 2000 || spent >= 20000000) return "Gold";
  if (points >= 500 || spent >= 5000000) return "Silver";
  return "Bronze";
}
