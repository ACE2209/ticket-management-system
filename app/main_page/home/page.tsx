"use client";

import { useEffect, useState } from "react";
import HeaderBar from "@/components/main_page/home/HeaderBar";
import SearchBar from "@/components/main_page/home/SearchBar";
import CategoryList from "@/components/main_page/home/CategoryList";
import PopularEvents from "@/components/main_page/home/PopularEvents";
import ClubEvent from "@/components/main_page/home/ClubEvent";
import SubscribeBanner from "@/components/main_page/home/SubscribeBanner";
import OtherEvents from "@/components/main_page/home/OtherEvents";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import ScrollLocationBar from "@/components/main_page/home/ScrollLocationBar";

export default function HomePage() {
  interface Account {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob?: string;
    gender?: string;
    location?: string;
  }

  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    // Lấy user hiện tại từ localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <div>Loading...</div>; // Hoặc spinner

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

        {/* 👇 Truyền user xuống HeaderBar */}
        <HeaderBar user={user} />

        <SearchBar />
        <CategoryList />
        <PopularEvents />
        <ClubEvent />
        <SubscribeBanner />
        <OtherEvents />
      </div>

      <BottomNavBar />
    </div>
  );
}
