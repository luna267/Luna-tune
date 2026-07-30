import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { entity } from "@/lib/entity";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: entity.appName,
  description: `${entity.department} · 内部登记表`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={plex.variable}>
      <body>{children}</body>
    </html>
  );
}
