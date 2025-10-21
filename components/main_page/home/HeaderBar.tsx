import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderBarProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string; // ✅ thêm avatar vào props
  };
}

export default function HeaderBar({ user }: HeaderBarProps) {
  const firstName = user?.firstName || "Guest";
  const initials =
    user?.firstName?.[0]?.toUpperCase() +
    (user?.lastName?.[0]?.toUpperCase() || "");

  // ✅ Nếu user.avatar rỗng → dùng ảnh mặc định
  const avatarSrc = user?.avatar && user.avatar.trim() !== ""
    ? user.avatar
    : "/images/avatar.jpg";

  return (
    <div className="bg-[#F41F52] w-full aspect-[375/303] relative flex flex-col items-center">
      <div className="flex justify-between items-center w-11/12 max-w-sm mt-12">
        <Avatar className="w-11 h-11 border border-white">
          <AvatarImage src={avatarSrc} alt="Avatar" />
          <AvatarFallback>{initials || "?"}</AvatarFallback>
        </Avatar>

        {/* Bell icon */}
        <div className="relative w-6 h-6 flex justify-center items-center">
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
          <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full" />
        </div>
      </div>

      {/* Text content */}
      <div className="w-11/12 max-w-sm flex flex-col gap-3 mt-8">
        <span className="text-[#ECF1F6] text-sm font-semibold">
          👋 Welcome {firstName}!
        </span>
        <h1 className="text-[#ECF1F6] text-3xl font-bold leading-tight">
          Find Amazing <br /> Events Near You
        </h1>
      </div>
    </div>
  );
}
