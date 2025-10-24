"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  interface ProfileResponse {
    first_name?: string;
    last_name?: string;
    email: string;
    avatar?: string;
  }

  interface RefreshResponse {
    access_token: string;
  }

  const [user, setUser] = useState<Account | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (!token && !refreshToken) {
        console.warn("⚠️ No tokens found, redirecting to login");
        router.push("/sign_auth/login");
        return;
      }

      let currentToken: string | null = token;

      try {
        let res = await fetch("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${currentToken ?? ""}`,
            "Content-Type": "application/json",
          },
        });

        // Nếu access token hết hạn
        if (res.status === 401 && refreshToken) {
          console.log("🔁 Access token expired, refreshing...");

          const refreshRes = await fetch(
            "http://localhost:8080/api/auth/refresh",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            }
          );

          if (!refreshRes.ok) {
            console.log("❌ Refresh token expired, logging out");
            localStorage.clear();
            router.push("/sign_auth/login");
            return;
          }

          const refreshData: RefreshResponse = await refreshRes.json();
          currentToken = refreshData.access_token;
          localStorage.setItem("access_token", currentToken);

          // Retry fetch profile
          res = await fetch("http://localhost:8080/api/profile", {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          });
        }

        if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);

        const data: ProfileResponse = await res.json();
        console.log("📦 Raw profile response:", data);


        const parsedUser: Account = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email,
          avatar: data.avatar || "",
        };

        setUser(parsedUser);
        localStorage.setItem("currentUser", JSON.stringify(parsedUser));
      } catch (err: unknown) {
        console.error("❌ Error fetching user profile:", err);

        // fallback localStorage
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) setUser(JSON.parse(storedUser));
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

        {/* Truyền user xuống HeaderBar */}
        <HeaderBar user={user} />

        <SearchBar onFilterClick={() => setIsFilterOpen(true)} />
        <CategoryList />
        <PopularEvents />
        <ClubEvent />
        <SubscribeBanner />
        <OtherEvents />
      </div>

      <BottomNavBar />
      
      {/* Filter Overlay */}
      <Filter 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
    </div>
  );
}
