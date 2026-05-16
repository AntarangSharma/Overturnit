import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://overturnit.vercel.app"),
  title: "OverturnIt — Spell check for health insurance denials",
  description:
    "Paste your denial letter. We tell you whether it will be overturned and draft the appeal — in 60 seconds, free.",
  openGraph: {
    title: "OverturnIt — Spell check for health insurance denials",
    description:
      "75% of appeals win. Less than 1% are filed. Paste your denial — get a drafted appeal in 60 seconds.",
    type: "website",
    url: "https://overturnit.vercel.app",
    siteName: "OverturnIt",
  },
  twitter: {
    card: "summary_large_image",
    title: "OverturnIt — Spell check for health insurance denials",
    description:
      "75% of appeals win. Less than 1% are filed. Paste your denial — get a drafted appeal in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
