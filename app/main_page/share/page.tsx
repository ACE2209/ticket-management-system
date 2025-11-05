import SharePage from "@/app/main_page/share/share";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharePage />
    </Suspense>
  );
}
