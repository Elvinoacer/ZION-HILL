import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Replace these with your actual church information
const CHURCH_NAME = "Grace Community Church";
const CHURCH_TAGLINE = "Growing in faith, serving in love, shining God's light";
const CHURCH_DESCRIPTION =
  "Join our vibrant Christian community for worship, fellowship, and spiritual growth. Experience meaningful connections and transformative faith at Grace Community Church.";
const BASE_URL = "https://yourchurchdomain.com"; // Replace with your actual domain
const PREVIEW_IMAGE_URL = `${BASE_URL}/images/church-image.png`; // Create this image (1200x630px recommended)

export const metadata: Metadata = {
  title: {
    default: CHURCH_NAME,
    template: `%s | ${CHURCH_NAME}`,
  },
  description: CHURCH_DESCRIPTION,

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
  authors: [{ name: CHURCH_NAME }],
  creator: CHURCH_NAME,
  publisher: CHURCH_NAME,

  // Open Graph for Facebook, WhatsApp, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: CHURCH_NAME,
    title: CHURCH_NAME,
    description: CHURCH_DESCRIPTION,
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${CHURCH_NAME} - ${CHURCH_TAGLINE}`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: CHURCH_NAME,
    description: CHURCH_DESCRIPTION,
    images: [PREVIEW_IMAGE_URL],
    creator: "@yourchurchhandle", // Replace with your church's Twitter handle
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
      { url: "/church-init.svg" },
      { url: "/images/church-image.png", sizes: "16x16", type: "image/png" },
      { url: "/images/church-image.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/images/church-image.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/church-init.svg",
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
        <meta name="apple-mobile-web-app-title" content={CHURCH_NAME} />
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
