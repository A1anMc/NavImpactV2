import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NavImpact Dashboard",
  description: "NavImpact Grant Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
