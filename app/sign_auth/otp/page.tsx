import OtpPage from "@/app/sign_auth/otp/otp";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpPage />
    </Suspense>
  );
}
