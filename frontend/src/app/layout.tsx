import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
          <div suppressHydrationWarning={true}>
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
