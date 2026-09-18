import type { Metadata } from "next";
import { Bebas_Neue, Outfit, Geist } from "next/font/google";

import "./globals.css";
import StorefrontChrome from "@/components/layout/StorefrontChrome";
import PageTransition from "@/components/PageTransition";
import ReduxProvider from "@/components/ReduxProvider";
import CookieBanner from "@/components/cookie/CookieBanner";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Backstore",
  description:
    "The Backstore — bold tees, oversized fits and original streetwear. Made in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        outfit.variable,
        bebasNeue.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-screen bg-[#080808] font-sans antialiased">
        <ReduxProvider>
          <PageTransition>
            <StorefrontChrome>{children}</StorefrontChrome>
          </PageTransition>
        </ReduxProvider>

        {/* Floating WhatsApp */}
        {/* <FloatingWhatsApp /> */}

        <CookieBanner />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
