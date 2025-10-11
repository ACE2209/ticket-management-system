import ForgotPasswordPage from "@/app/sign_auth/forgotpassword/ForgotPassword";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
