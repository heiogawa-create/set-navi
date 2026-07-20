import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "セットナビ｜自分に合う髪型とワックスがわかる",
  description:
    "写真や理想のイメージから、自分に合うメンズヘア・市販ワックス・付け方を提案する無料診断Webアプリ。",
  keywords: ["メンズヘア", "ワックス", "髪型診断", "ヘアセット", "スタイリング"],
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={geistSans.variable}>{children}</body>
    </html>
  );
}
