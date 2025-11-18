/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import SelectTicket from "@/app/main_page/selectticket/selectticket";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectTicket event={null} onClose={() => {}} />
    </Suspense>
  );
}
