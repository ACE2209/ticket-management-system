import SignInEmail from "./SignInEmail";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInEmail />
    </Suspense>
  );
}
