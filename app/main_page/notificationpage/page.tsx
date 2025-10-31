import NotificationPage from "@/app/main_page/notificationpage/notification";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationPage />
    </Suspense>
  );
}
