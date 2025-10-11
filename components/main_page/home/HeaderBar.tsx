import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeaderBar() {
  return (
    <div className="bg-[#F41F52] w-full aspect-[375/303] relative flex flex-col items-center">
      <div className="flex justify-between items-center w-11/12 max-w-sm mt-12">
        <Avatar className="w-11 h-11 border border-white">
          <AvatarImage src="/main_page/avatar.jpg" alt="Avatar" />
          <AvatarFallback>TT</AvatarFallback>
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
          Welcome Ben!
        </span>
        <h1 className="text-[#ECF1F6] text-3xl font-bold leading-tight">
          Find Amazing <br /> Events Near You
        </h1>

        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FEFEFE"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[#FEFEFE] text-xs font-semibold">
            258 Events Around You
          </span>
        </div>
      </div>
    </div>
  );
}
