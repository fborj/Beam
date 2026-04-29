import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beam",
  description: "Beam app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-slate-950 text-slate-100">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
