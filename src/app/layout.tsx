import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { churchConfig } from "@/lib/church-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://church-web-v2.vercel.app"; // Replace with your actual domain
const PREVIEW_IMAGE_URL = `${BASE_URL}/images/church-image.png`; // Create this image (1200x630px recommended)

export const metadata: Metadata = {
  title: {
    default: churchConfig.name,
    template: `%s | ${churchConfig.name}`,
  },
  description: churchConfig.mission,

  keywords: [
    "church",
    "christian",
    "worship",
    "faith",
    "community",
    "bible study",
    "prayer",
    "fellowship",
  ],
  authors: [{ name: churchConfig.name }],
  creator: churchConfig.name,
  publisher: churchConfig.name,

  // Open Graph for Facebook, WhatsApp, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: churchConfig.name,
    title: churchConfig.name,
    description: churchConfig.mission,
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${churchConfig.name} - ${churchConfig.vision}`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: churchConfig.name,
    description: churchConfig.mission,
    images: [PREVIEW_IMAGE_URL],
    creator: churchConfig.socials.twitter,
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Manifest for PWA
  manifest: `${BASE_URL}/manifest.json`,

  // Icons
  icons: {
    icon: [
      { url: churchConfig.logo },
      { url: "/images/church-image.png", sizes: "16x16", type: "image/png" },
      { url: "/images/church-image.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/images/church-image.png" }],
    other: [
      {
        rel: "mask-icon",
        url: churchConfig.logo,
        color: "#5bbad5",
      },
    ],
  },

  // Verification for search engines (optional)
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console code
    yandex: "your-yandex-verification-code", // Add if using Yandex
  },

  // Additional metadata
  category: "religion",
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles/AnnotationLayer.css" />
        <link rel="stylesheet" href="/styles/TextLayer.css" />

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Canonical URL */}
        <link rel="canonical" href={BASE_URL} />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1a365d" />

        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-title" content={churchConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
