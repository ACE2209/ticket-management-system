import { Suspense } from "react";
import SignInEmail from "./SignInEmail";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInEmail />
    </Suspense>
  );
}
