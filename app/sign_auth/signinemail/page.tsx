import SignInEmail from "@/app/sign_auth/signinemail/SignInEmail";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInEmail />
    </Suspense>
  );
}
