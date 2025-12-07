import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Option for a specific font later, for now we use system fonts
import "./globals.css";
import Navbar from "@/components/Navbar";
import CursorBackground from "@/components/CursorBackground";

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" }); // If we choose Inter later

export const metadata: Metadata = {
  title: "Pharma Scout Copilot",
  description: "AI Copilot for Pharma Opportunity Scouting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <CursorBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
