import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./typography.css";
import "./module-path.css";
import "./khan-learning.css";
import "./multiple-choice.css";
import "./multiple-choice-fix.css";
import "./multiple-choice-layout.css";
import "./course.css";
import "./tutor.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socratic Studio — Data Literacy for Clinicians",
  description: "A course-based Socratic tutor for careful, defensible clinical data reasoning.",
  openGraph: {
    title: "Socratic Studio — See the data before you trust it.",
    description: "A course-based Socratic tutor for clinical data literacy.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
