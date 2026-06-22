import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLACK4ME - نظام التسويق الذكي",
  description: "المنصة المتكاملة للتسويق الذكي والمبيعات الرقمية المتقدمة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-full font-sans bg-brand-black text-brand-white">
        {children}
      </body>
    </html>
  );
}
