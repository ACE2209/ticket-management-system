import ContactInformation from "@/app/main_page/contactinformation/contact";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactInformation />
    </Suspense>
  );
}
