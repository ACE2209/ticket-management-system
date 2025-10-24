import DetailEventPage from "@/app/main_page/detailevent/detailevent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailEventPage />
    </Suspense>
  );
}
