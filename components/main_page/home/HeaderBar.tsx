"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";

interface HeaderBarProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  hasNotification?: boolean;
}

export default function HeaderBar({
  user,
  hasNotification = false,
}: HeaderBarProps) {
  const router = useRouter();
  const [eventCount, setEventCount] = useState(0);
  const [userLocation, setUserLocation] = useState("Hanoi, Vietnam");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Fetch event count
    const fetchEventCount = async () => {
      try {
        const res = await apiFetch("/events?filter[status][_eq]=published");
        const data = res.data || res;
        setEventCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Error fetching event count:", err);
      }
    };

    fetchEventCount();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Successfully got location
          setUserLocation("Your Location");
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const firstName = user?.firstName || "Guest";
  const initials =
    user?.firstName?.[0]?.toUpperCase() +
    (user?.lastName?.[0]?.toUpperCase() || "");

  const avatarSrc =
    user?.avatar && user.avatar.trim() !== "" ? user.avatar : "";

  const handleBellClick = () => {
    router.push("/main_page/notificationpage");
  };

  const handleLocationClick = () => {
    if (coords) {
      const { lat, lng } = coords;
      router.push(`/main_page/nearbyevent?lat=${lat}&lng=${lng}`);
    } else {
      router.push("/main_page/nearbyevent");
    }
  };

  return (
    <div className="bg-[#F41F52] w-full aspect-[375/303] relative flex flex-col items-center">
      <div className="flex justify-between items-center w-11/12 max-w-sm mt-12">
        <Avatar className="w-11 h-11 border border-white">
          <AvatarImage src={avatarSrc} alt="Avatar" />
          <AvatarFallback>{initials || "?"}</AvatarFallback>
        </Avatar>

        {/* Bell icon */}
        <div
          onClick={handleBellClick}
          className="relative w-6 h-6 flex justify-center items-center cursor-pointer hover:scale-110 transition-transform"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FEFEFE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {hasNotification && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
          )}
        </div>
      </div>

      <div className="w-11/12 max-w-sm flex flex-col gap-3 mt-8">
        <span className="text-[#ECF1F6] text-sm font-semibold">
          👋 Welcome {firstName}!
        </span>
        <h1 className="text-[#ECF1F6] text-3xl font-bold leading-tight">
          Your Next Great Event Starts Here
        </h1>
        
        {/* Location with event count - clickable */}
        <div 
          onClick={handleLocationClick}
          className="flex items-center gap-2 mt-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            className="flex-shrink-0"
          >
            <path 
              d="M8 1.5C5.51472 1.5 3.5 3.51472 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51472 10.4853 1.5 8 1.5Z" 
              fill="white"
            />
            <circle cx="8" cy="6" r="1.5" fill="#F41F52"/>
          </svg>
          <span className="text-white text-sm font-semibold">
            {eventCount} Events Around You • {userLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
