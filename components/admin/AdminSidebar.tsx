"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function DashboardIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v4H6z" />
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

function CouponIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z" />
      <path d="M12 8v1" />
      <path d="M12 11v1" />
      <path d="M12 14v1" />
      <path d="M12 17v-1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 4v16" />
    </svg>
  );
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <ProductsIcon />,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <OrdersIcon />,
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: <CouponIcon />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("backstore-admin-auth");
    }

    router.push("/admin/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-[100] flex w-[240px] flex-col border-r border-[#e5e7eb] bg-white">
      {/* =========================================================
          BRAND
      ========================================================= */}
      <div className="flex h-[124px] shrink-0 flex-col items-center justify-center border-b border-[#e5e7eb] px-6">
        <div className="relative flex h-[58px] w-[150px] items-center justify-center">
          <div
            className="absolute inset-x-[-4px] inset-y-[4px] z-0 bg-[#ff2d32]"
            style={{
              clipPath:
                "polygon(3% 8%, 18% 4%, 34% 7%, 51% 3%, 67% 7%, 84% 4%, 98% 8%, 94% 91%, 77% 87%, 60% 95%, 42% 90%, 25% 95%, 7% 90%)",
            }}
          />

          <img
            src="/logo/backstore-logo.png"
            alt="The Backstore"
            className="relative z-10 h-[58px] w-auto max-w-[145px] object-contain"
          />
        </div>

        <div className="mt-2 rounded-full bg-black px-5 py-[6px]">
          <span className="font-bebas-neue text-[11px] tracking-[0.18em] text-white">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
        <div className="flex flex-col gap-2">
          {sidebarItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative flex h-[52px] w-full shrink-0 items-center",
                  "rounded-[13px] px-4",
                  "transition-all duration-200",
                  active
                    ? "bg-black shadow-[0_3px_8px_rgba(0,0,0,0.14)]"
                    : "bg-transparent hover:bg-[#f5f6f8]",
                ].join(" ")}
              >
                {/* Icon */}
                <div
                  className={[
                    "relative z-10 flex h-[24px] w-[24px] shrink-0 items-center justify-center",
                    active
                      ? "!text-white"
                      : "!text-[#52627a] hover:!text-black",
                  ].join(" ")}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <div
                  className={[
                    "relative z-10 ml-4 block min-w-0 flex-1",
                    "!whitespace-nowrap",
                    "!text-[14px]",
                    "!leading-none",
                    "!font-medium",
                    active ? "!text-white" : "!text-[#52627a]",
                  ].join(" ")}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* =========================================================
          LOGOUT
      ========================================================= */}
      <div className="shrink-0 border-t border-[#e5e7eb] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex h-[52px] w-full items-center rounded-[13px] px-4 text-left transition-colors duration-200 hover:bg-[#f5f6f8]"
        >
          <div className="relative z-10 flex h-[24px] w-[24px] shrink-0 items-center justify-center !text-[#52627a] transition-colors group-hover:!text-black">
            <LogoutIcon />
          </div>

          <div className="relative z-10 ml-4 !whitespace-nowrap !text-[14px] !font-medium !leading-none !text-[#52627a] group-hover:!text-black">
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
}
