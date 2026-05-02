import type { Metadata } from "next";
import { Rajdhani, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://crm.flodon.in'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: "%s | Flodon CRM",
    default: "Flodon — Internal Operations Platform",
  },
  description:
    "Flodon is a high-performance internal CRM and operations platform built for elite sales teams. Manage clients, track pipeline stages, deploy tasks, and analyse agent performance — all in one brutalist-grade interface.",
  applicationName: "Flodon CRM",
  authors: [{ name: "Flodon", url: APP_URL }],
  keywords: [
    "Flodon",
    "CRM",
    "Sales CRM",
    "Internal Operations",
    "Pipeline Management",
    "Sales Intelligence",
    "Lead Management",
    "Agent Dashboard",
  ],
  creator: "Flodon",
  publisher: "Flodon",
  robots: {
    index: false,        // Private internal tool — no public indexing
    follow: false,
    googleBot: { index: false, follow: false },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "Flodon CRM",
    title: "Flodon — Internal Operations Platform",
    description:
      "High-performance internal CRM for elite sales teams. Pipeline tracking, agent telemetry, client intelligence — all in one brutalist-grade interface.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flodon — Internal Operations Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flodon — Internal Operations Platform",
    description:
      "High-performance internal CRM for elite sales teams. Pipeline tracking, agent telemetry, client intelligence.",
    images: ["/og-image.png"],
    creator: "@flodon",
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark",
    "msapplication-TileColor": "#000000",
    "format-detection": "telephone=no",
  },
};

import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import FlodonCursor from '@/components/FlodonCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(rajdhani.variable, spaceGrotesk.variable)}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-foreground selection:text-background min-h-screen">
        <FlodonCursor />
        <NextTopLoader color="#000000" showSpinner={false} shadow="none" height={4} />
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
