import TicketDetailPage from "@/app/main_page/ticketdetail/ticketdetail";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TicketDetailPage />
    </Suspense>
  );
}
