import { Suspense } from "react";
import CreateAccountEmail from "./CreateAccountEmail";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAccountEmail />
    </Suspense>
  );
}
