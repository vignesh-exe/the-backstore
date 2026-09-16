import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
      className={`${dmSans.variable} ${bebasNeue.variable}`}
    >
      <body className="min-h-screen bg-[#080808] font-sans antialiased">
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
