import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media Player",
  description: "Play your audio/video files with custom player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
