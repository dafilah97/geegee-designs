import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://geegeedesigns.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GeeGee Designs | Bespoke Bridal & Fashion in Botswana",
    template: "%s | GeeGee Designs",
  },
  description:
    "Exquisite bespoke wedding gowns, traditional wear, and fashion crafted in Tlokweng, Botswana. Elegance defined for your special day.",
  keywords: [
    "bespoke bridal",
    "wedding gowns Botswana",
    "bridal fashion Tlokweng",
    "traditional wear Botswana",
    "GeeGee Designs",
    "wedding dress Gaborone",
    "custom wedding gown",
    "African bridal fashion",
  ],
  authors: [{ name: "GeeGee Designs" }],
  creator: "GeeGee Designs",
  openGraph: {
    type: "website",
    locale: "en_BW",
    url: BASE_URL,
    siteName: "GeeGee Designs",
    title: "GeeGee Designs | Bespoke Bridal & Fashion in Botswana",
    description:
      "Exquisite bespoke wedding gowns, traditional wear, and fashion crafted in Tlokweng, Botswana.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeeGee Designs | Bespoke Bridal & Fashion in Botswana",
    description:
      "Exquisite bespoke wedding gowns, traditional wear, and fashion crafted in Tlokweng, Botswana.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
