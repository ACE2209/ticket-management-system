"use client";

import { useParams, useRouter } from "next/navigation";
import ChatPage from "../chat/chatpage";

export default function ChatDetail() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <ChatPage
      chatId={Array.isArray(id) ? id[0] : id}
      onBack={() => router.push("/main_page/message")}
    />
  );
}
