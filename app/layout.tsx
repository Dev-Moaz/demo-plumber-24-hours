import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plumber — The Last Plumber You'll Ever Need to Call",
  description:
    "Expert plumbing. Upfront pricing. Licensed & insured. Same-day service guaranteed. Serving Greater Metro Denver and surrounding areas.",
  openGraph: {
    title: "Plumber — The Last Plumber You'll Ever Need to Call",
    description: "Expert plumbing. Upfront pricing. Licensed & insured. Same-day service guaranteed.",
    url: "https://plumber.com",
    siteName: "Plumber",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Professional plumber at work",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumber — The Last Plumber You'll Ever Need to Call",
    description: "Expert plumbing. Upfront pricing. Licensed & insured.",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}