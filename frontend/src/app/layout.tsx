import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Catalog | Browse Our Complete Collection",
  description:
    "Discover our extensive product catalog with easy category navigation, detailed product information, and powerful search capabilities. Find exactly what you need quickly and efficiently.",
  keywords:
    "product catalog, product categories, inventory management, product search, product database",
  authors: [{ name: "Product Catalog Team" }],
  creator: "Product Catalog",
  publisher: "Product Catalog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.affiliatelist.site/",
    title: "Product Catalog | Browse Our Complete Collection",
    description:
      "Discover our extensive product catalog with easy category navigation, detailed product information, and powerful search capabilities.",
    siteName: "Product Catalog",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Product Catalog thumbnail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Catalog | Browse Our Complete Collection",
    description:
      "Discover our extensive product catalog with easy category navigation, detailed product information, and powerful search capabilities.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://www.affiliatelist.site/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <AuthProvider>
              {children}
              <Analytics />
              <Toaster />
            </AuthProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
