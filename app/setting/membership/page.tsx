import MembershipPage from "@/app/setting/membership/membership";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MembershipPage />
    </Suspense>
  );
}
