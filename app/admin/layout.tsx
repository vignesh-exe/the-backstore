"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Admin login should remain a standalone page.
  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-[#f4f7fb]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      {/* Admin navigation */}
      <AdminSidebar />

      {/* Admin top bar */}
      <AdminHeader />

      {/* Main content */}
      <main className="ml-[240px] min-h-screen pt-[72px]">
        <div className="min-h-[calc(100vh-72px)] px-7 py-7">{children}</div>
      </main>
    </div>
  );
}
