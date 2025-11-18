import ChooseSeatPage from "@/app/main_page/chooseseat/chooseseat";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChooseSeatPage />
    </Suspense>
  );
}
