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
import "./depth.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://socraticai-two.vercel.app"),
  title: "SocraticAI — Learn the concept. Defend the why.",
  description:
    "College-level courses that pair visual and audio teaching, Socratic reasoning, and independent mastery checks.",
  openGraph: {
    title: "SocraticAI — Learn the concept. Defend the why.",
    description:
      "College-level courses in data, computing, cybersecurity, and more.",
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
