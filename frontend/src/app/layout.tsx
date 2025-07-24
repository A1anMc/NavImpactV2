import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NavImpact Dashboard",
  description: "NavImpact Grant Management Platform",
};

// Error boundary component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning={true}>
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <QueryProvider>
            <div suppressHydrationWarning={true}>
              {children}
            </div>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
