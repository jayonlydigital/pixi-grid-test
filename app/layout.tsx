import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixi Demo",
  description: "Next.js + Pixi.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
