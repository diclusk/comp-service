import type { Metadata } from "next"; 
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBubble from "./components/ChatBubble";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Servis Komputer & Laptop — Booking Online, Chat AI Diagnosa Cepat",
  description: "Servis komputer & laptop. Booking online, chat AI diagnosa cepat.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="w-full min-h-screen flex flex-col">
        <Navbar />
        <main className="w-full flex-1">{children}</main>
        <ChatBubble />
        <Footer />
      </body>
    </html>
  );
}