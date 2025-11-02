import { vazirFont } from "@/ui/font";
import ApplicationProviders from "@/providers/ApplicationProviders";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آزمون تولیمو",
  description: "سازمان سنجش و آموزش کشور",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="bg-primary">
      <body
        className={`${vazirFont.className} antialiased`}
        suppressHydrationWarning
      >
        <ApplicationProviders>{children}</ApplicationProviders>
      </body>
    </html>
  );
}
