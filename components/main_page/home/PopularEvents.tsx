"use client";

import { popularEventsData } from "@/data/events"; // 🟩 import từ file TS

export default function PopularEvents() {
  
  const popularEvents = popularEventsData;

  // 🟦 sau này có thể đổi thành fetch API
  // const [popularEvents, setPopularEvents] = useState<PopularEventItem[]>([]);

  // useEffect(() => {
  //   fetch("/api/popular-events")
  //     .then((res) => res.json())
  //     .then((data) => setPopularEvents(data));
  // }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Tiêu đề */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Popular Event
          </span>
          <span className="text-[#F41F52] text-xs font-medium cursor-pointer">
            See All
          </span>
        </div>

        {/* Danh sách sự kiện */}
        <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory hide-scrollbar">
          {popularEvents.map((event, index) => (
            <div
              key={index}
              className="min-w-[260px] sm:min-w-[300px] h-[180px] sm:h-[196px] rounded-2xl relative flex-shrink-0 snap-start bg-cover bg-center shadow-md"
              style={{ backgroundImage: `url(${event.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/40" />

              {/* Nội dung */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white">
                <div className="flex items-center gap-2 text-[10px] font-medium">
                  {/* Calendar icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{event.date}</span>

                  {/* Location icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{event.location}</span>
                </div>

                <span className="text-sm sm:text-lg font-bold leading-tight">
                  {event.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
