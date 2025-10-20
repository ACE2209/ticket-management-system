import CreateNewPasswordPage from "@/app/sign_auth/createnewpassword/NewPass";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewPasswordPage />
    </Suspense>
  );
}
