import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Hub",
  description: "Courses and homework management for students",
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
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100">
        <nav className="border-b border-slate-700 bg-slate-800 px-6 py-4 flex gap-6">
          <Link href="/" className="font-medium text-slate-300 hover:text-blue-400">
            Home
          </Link>
          <Link href="/courses" className="font-medium text-slate-300 hover:text-blue-400">
            Courses
          </Link>
          <Link href="/homework" className="font-medium text-slate-300 hover:text-blue-400">
            Homework
          </Link>
        </nav>
        <main className="max-w-2xl mx-auto w-full p-6">{children}</main>
      </body>
    </html>
  );
}
