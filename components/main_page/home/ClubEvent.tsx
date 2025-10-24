"use client";
import Image from "next/image";
import { categoriesData } from "../../../data/events"; // 🟩 sửa lại đúng đường dẫn file bạn lưu

export default function ClubEvent() {
  // 🟦 Lấy 3 sự kiện đầu tiên (hoặc tùy bạn muốn bao nhiêu)
  const events = categoriesData.slice(0, 3);

  // sau mún đổi để lấy api thật thì dùng code sau
  // const [events, setEvents] = useState<EventItem[]>([]);

  // useEffect(() => {
  //   fetch("/api/events")
  //     .then((res) => res.json())
  //     .then((data) => setEvents(data.slice(0, 3)));
  // }, []);

  return (
    <div className="w-full flex justify-center mt-6 px-5">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[#111111] text-base font-semibold">
            Club Event
          </span>
          <span className="text-[#F41F52] text-xs font-medium cursor-pointer">
            See All
          </span>
        </div>

        {/* Event list */}
        <div className="flex justify-between gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div className="w-full aspect-[104/137] rounded-xl bg-[#F2F1F8] overflow-hidden shadow-sm">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={104}
                  height={137}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-semibold text-[#272841] text-center leading-tight">
                {event.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
