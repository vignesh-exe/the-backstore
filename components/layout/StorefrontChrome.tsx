"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import PromoMarquee from "@/components/PromoMarquee";
import FirstOrderPromo from "@/components/FirstOrderPromo";

export default function StorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  /*
   * Admin pages have their own layout.
   * Never render the storefront Navbar/Footer inside /admin.
   */
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoMarquee />

      <Navbar />

      {children}

      <Footer />

      <FirstOrderPromo />
    </>
  );
}
