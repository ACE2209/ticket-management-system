import AddCardPage from "@/app/main_page/addnewcard/addnewcard";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCardPage />
    </Suspense>
  );
}
