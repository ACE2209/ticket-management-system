"use client";

import HeaderBar from "@/components/main_page/home/HeaderBar";
import SearchBar from "@/components/main_page/home/SearchBar";
import CategoryList from "@/components/main_page/home/CategoryList";
import PopularEvents from "@/components/main_page/home/PopularEvents";
import ClubEvent from "@/components/main_page/home/ClubEvent";
import SubscribeBanner from "@/components/main_page/home/SubscribeBanner";
import OtherEvents from "@/components/main_page/home/OtherEvents";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import ScrollLocationBar from "@/components/main_page/home/ScrollLocationBar";

import { accounts } from "@/data/accounts"; // 👈 import dữ liệu tài khoản

export default function HomePage() {
  // Giả sử bạn muốn lấy user đầu tiên (hoặc bạn có thể tìm theo email đăng nhập)
  const user = accounts[0];

  return (
    <div className="card bg-[#FEFEFE] min-h-screen relative flex flex-col items-center">
      {/* Thanh location ẩn/hiện khi cuộn */}
      <ScrollLocationBar />

      {/* Container chính */}
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
