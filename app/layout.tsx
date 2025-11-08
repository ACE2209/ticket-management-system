import StripeProvider from "@/app/main_page/addnewcard/StripeProvider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </head>
      <body>
        <SpeedInsights />
        <StripeProvider>
          <div id="app">{children}</div>
        </StripeProvider>
      </body>
    </html>
  );
}
