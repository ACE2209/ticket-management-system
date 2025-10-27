"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api"; // ✅ Import API helper

import HeaderBar from "@/components/main_page/home/HeaderBar";
import SearchBar from "@/components/main_page/home/SearchBar";
import CategoryList from "@/components/main_page/home/CategoryList";
import PopularEvents from "@/components/main_page/home/PopularEvents";
import ClubEvent from "@/components/main_page/home/ClubEvent";
import SubscribeBanner from "@/components/main_page/home/SubscribeBanner";
import OtherEvents from "@/components/main_page/home/OtherEvents";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import ScrollLocationBar from "@/components/main_page/home/ScrollLocationBar";
import Filter from "@/components/main_page/home/Filter";

export default function HomePage() {
  interface Account {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  }

  const [user, setUser] = useState<Account | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/profile"); // ✅ Dùng helper

        console.log("📦 Raw profile response:", data);

        const parsedUser: Account = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email,
          avatar: data.avatar || "",
        };

        setUser(parsedUser);
        localStorage.setItem("currentUser", JSON.stringify(parsedUser));
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        localStorage.clear();
        router.push("/sign_auth/signin");
      }
    };

    fetchProfile();
  }, [router]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="card bg-[#FEFEFE] min-h-screen relative flex flex-col items-center">
      <ScrollLocationBar />

      <div
        data-scroll-container
        style={{
          position: "absolute",
          top: 0,
          bottom: "64px",
          left: 0,
          right: 0,
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <HeaderBar user={user} />
        <SearchBar onFilterClick={() => setIsFilterOpen(true)} />
        <CategoryList />
        <PopularEvents />
        <ClubEvent />
        <SubscribeBanner />
        <OtherEvents />
      </div>

      <BottomNavBar />

      <Filter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
