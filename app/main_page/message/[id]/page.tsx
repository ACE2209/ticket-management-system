"use client";

import { useParams, useRouter } from "next/navigation";
import ChatPage from "../../chat/page";

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useParams(); // 👈 Lấy id từ URL

  return (
    <ChatPage
      chatId={Array.isArray(id) ? id[0] : id}
      onBack={() => router.push("/main_page/message")}
    />
  );
}
