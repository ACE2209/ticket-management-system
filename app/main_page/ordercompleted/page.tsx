import OrderCompletedPage from "@/app/main_page/ordercompleted/ordercompleted";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderCompletedPage />
    </Suspense>
  );
}
