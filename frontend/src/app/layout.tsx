import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NavImpact Dashboard",
  description: "NavImpact Grant Management Platform",
};

// Dynamically import QueryProvider to avoid clientModules error
const QueryProvider = dynamic(() => import('../components/QueryProvider'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

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
