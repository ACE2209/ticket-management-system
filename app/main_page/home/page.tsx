"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

import HeaderBar from "@/components/main_page/home/HeaderBar";
import SearchBar from "@/components/main_page/home/SearchBar";
import PopularEvents from "@/components/main_page/home/PopularEvents";
import ClubEvent from "@/components/main_page/home/ClubEvent";
import SubscribeBanner from "@/components/main_page/home/SubscribeBanner";
import OtherEvents from "@/components/main_page/home/OtherEvents";
import BottomNavBar from "@/components/main_page/home/BottomNavBar";
import ScrollLocationBar from "@/components/main_page/home/ScrollLocationBar";
import Filter from "@/components/main_page/home/Filter";

export default function HomePage() {
  interface Account {
    id: number;
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
        const data = await apiFetch("/profile");

        console.log("📦 Raw profile response:", data);

        // chuyển đổi dữ liệu nhận được thành định dạng Account
        const parsedUser: Account = {
          id: data.id, 
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email,
          avatar: data.avatar || "",
        };
        // lưu vào state và localStorage
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
    <div className="bg-[#FEFEFE] min-h-screen relative flex flex-col items-center">
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
        <PopularEvents />
        <ClubEvent />
        <SubscribeBanner />
        <OtherEvents />
      </div>

      <BottomNavBar />

      <Filter 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        onApply={(payload) => {
          // Navigate to eventList with filter params
          const params = new URLSearchParams();
          if (payload.category) params.append('category', payload.category);
          if (payload.date_from) params.append('date_from', payload.date_from);
          if (payload.date_to) params.append('date_to', payload.date_to);
          if (payload.price_min) params.append('price_min', String(payload.price_min));
          if (payload.price_max) params.append('price_max', String(payload.price_max));
          if (payload.location) params.append('location', payload.location);
          
          router.push(`/main_page/eventList?${params.toString()}`);
        }}
      />
    </div>
  );
}
