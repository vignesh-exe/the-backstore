"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Customize", href: "/customize" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopItems = [
  { label: "T-Shirts", href: "/shop/t-shirts" },
  { label: "Footwear", href: "/shop/footwear" },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h11" />
      <path d="M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function DownArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  /*
   * ACTIVE ROUTE
   *
   * "/"                  -> Home
   * "/shop"              -> Shop
   * "/shop/t-shirts"     -> Shop
   * "/shop/footwear"     -> Shop
   * "/customize"         -> Customize
   * "/about"             -> About
   * "/contact"           -> Contact
   */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isShopActive =
    pathname === "/shop" || pathname.startsWith("/shop/");

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100]">
        {/* =========================================================
            MAIN NAVBAR
        ========================================================= */}

        <nav className="relative h-[64px] bg-[#080808] text-white shadow-[0_4px_0_rgba(0,0,0,0.35)] sm:h-[68px]">
          {/* =====================================================
              HALFTONE BACKGROUND
          ===================================================== */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "9px 9px",
            }}
          />

          {/* =====================================================
              RED TOP SCRIBBLE
          ===================================================== */}

          <div className="pointer-events-none absolute right-[16%] top-[8px] hidden h-[2px] w-24 rotate-[-3deg] bg-[#ff2d32] lg:block" />

          <div className="pointer-events-none absolute right-[13%] top-[14px] hidden h-[1px] w-12 rotate-[4deg] bg-white/30 lg:block" />

          {/* =====================================================
              NAV CONTENT
          ===================================================== */}

          <div className="relative mx-auto flex h-full max-w-[1600px] items-center px-4 sm:px-7 lg:px-10">
            {/* =================================================
                LOGO
            ================================================= */}

            <a
              href="/"
              aria-label="The Backstore home"
              className="group relative z-20 flex h-full shrink-0 items-center"
            >
              <div className="relative flex h-[50px] items-center sm:h-[54px]">
                {/* Small red paper behind logo */}

                <div
                  className="absolute -left-3 inset-y-[3px] w-[82px] bg-[#ff2d32]"
                  style={{
                    clipPath:
                      "polygon(4% 8%, 22% 4%, 39% 7%, 56% 3%, 76% 7%, 96% 4%, 92% 93%, 74% 89%, 55% 96%, 37% 91%, 18% 96%, 3% 90%)",
                  }}
                />

                {/* Logo */}

                <img
                  src="/logo/backstore-logo.png"
                  alt="The Backstore"
                  className="relative z-10 h-[68px] w-auto max-w-[210px] object-contain object-left transition-transform duration-300 group-hover:scale-[1.03] sm:h-[76px] sm:max-w-[230px]"
                />
              </div>
            </a>

            {/* =================================================
                DESKTOP NAVIGATION
                TRUE CENTER
            ================================================= */}

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex">
              <div className="flex items-center gap-1 xl:gap-2">
                {navItems.map((item, index) => {
                  const isShop = item.label === "Shop";
                  const active = isActive(item.href);

                  {/* =================================================
                      SHOP
                  ================================================= */}

                  if (isShop) {
                    return (
                      <div
                        key={item.label}
                        className="group relative"
                      >
                        {/* Shop button */}

                        <a
                          href={item.href}
                          className="relative flex h-[42px] items-center px-4"
                        >
                          {/* Paper shape */}

                          <span
                            className={`absolute inset-[3px] transition-all duration-200 group-hover:-translate-y-[2px] ${
                              isShopActive
                                ? "bg-[#ff2d32]"
                                : "bg-white/95 group-hover:bg-[#ff2d32]"
                            }`}
                            style={{
                              clipPath:
                                "polygon(4% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 88% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 3% 95%)",
                            }}
                          />

                          <span
                            className={`relative z-10 flex items-center gap-1 text-[12px] uppercase tracking-[0.05em] ${
                              isShopActive
                                ? "text-white"
                                : "text-black"
                            }`}
                            style={{
                              fontFamily:
                                "var(--font-bebas-neue), Impact, sans-serif",
                            }}
                          >
                            Shop

                            <DownArrowIcon />
                          </span>
                        </a>

                        {/* =================================================
                            DESKTOP SHOP DROPDOWN
                        ================================================= */}

                        <div className="invisible absolute left-1/2 top-[45px] z-[200] w-[190px] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                          {/* Dropdown shadow */}

                          <div className="absolute left-[6px] top-[6px] h-full w-full bg-[#ff2d32]" />

                          {/* Dropdown paper */}

                          <div
                            className="relative overflow-hidden border-[3px] border-black bg-white px-2 py-2"
                            style={{
                              clipPath:
                                "polygon(2% 4%, 17% 1%, 33% 4%, 50% 2%, 67% 5%, 84% 2%, 98% 5%, 96% 94%, 82% 98%, 65% 95%, 49% 98%, 32% 94%, 17% 98%, 2% 94%)",
                            }}
                          >
                            {/* Halftone */}

                            <div
                              className="pointer-events-none absolute inset-0 opacity-[0.06]"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle, #000 1px, transparent 1px)",
                                backgroundSize: "7px 7px",
                              }}
                            />

                            <div className="relative z-10">
                              {shopItems.map((shopItem, shopIndex) => (
                                <a
                                  key={shopItem.label}
                                  href={shopItem.href}
                                  className="group/item relative flex h-[44px] items-center justify-between border-b-2 border-black/10 px-3 last:border-b-0 hover:bg-[#ff2d32]"
                                >
                                  <span
                                    className="text-[16px] text-black"
                                    style={{
                                      fontFamily:
                                        "var(--font-bebas-neue), Impact, sans-serif",
                                    }}
                                  >
                                    {shopItem.label}
                                  </span>

                                  <span className="text-black transition-transform duration-200 group-hover/item:translate-x-1">
                                    <ArrowIcon />
                                  </span>

                                  {shopIndex === 0 && (
                                    <span className="absolute bottom-0 left-3 h-[2px] w-6 bg-[#ff2d32]" />
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  {/* =================================================
                      OTHER DESKTOP ITEMS
                  ================================================= */}

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group relative flex h-[42px] items-center px-4"
                    >
                      {/* Paper shape */}

                      <span
                        className={`absolute inset-[3px] transition-all duration-200 group-hover:-translate-y-[2px] ${
                          active
                            ? "bg-[#ff2d32]"
                            : "bg-white/95 group-hover:bg-[#ff2d32]"
                        }`}
                        style={{
                          clipPath:
                            index % 2 === 0
                              ? "polygon(3% 9%, 18% 4%, 35% 7%, 52% 3%, 69% 7%, 86% 4%, 97% 9%, 94% 90%, 80% 95%, 63% 91%, 47% 97%, 30% 92%, 14% 96%, 4% 89%)"
                              : "polygon(4% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 88% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 3% 95%)",
                        }}
                      />

                      <span
                        className={`relative z-10 text-[12px] uppercase tracking-[0.05em] ${
                          active ? "text-white" : "text-black"
                        }`}
                        style={{
                          fontFamily:
                            "var(--font-bebas-neue), Impact, sans-serif",
                        }}
                      >
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================= */}

            <div className="ml-auto hidden items-center gap-1 lg:flex">
              {/* Search */}

              <button
                type="button"
                aria-label="Search"
                className="group relative flex h-9 w-9 items-center justify-center text-white transition-all duration-200 hover:bg-[#ff2d32] hover:text-black"
              >
                <SearchIcon />
              </button>

              {/* Wishlist */}

              <button
                type="button"
                aria-label="Wishlist"
                className="group relative flex h-9 w-9 items-center justify-center text-white transition-all duration-200 hover:bg-[#ff2d32] hover:text-black"
              >
                <HeartIcon />

                <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ff2d32] px-1 text-[7px] font-black text-black">
                  0
                </span>
              </button>

              {/* Cart */}

              <button
                type="button"
                aria-label="Shopping bag"
                className="group relative flex h-9 w-9 items-center justify-center text-white transition-all duration-200 hover:bg-[#ff2d32] hover:text-black"
              >
                <BagIcon />

                <span className="absolute -right-1 -top-1 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ff2d32] px-1 text-[7px] font-black text-black">
                  0
                </span>
              </button>

              {/* Account */}

              <button
                type="button"
                aria-label="Account"
                className="ml-1 flex h-9 w-9 items-center justify-center text-white transition-all duration-200 hover:bg-[#ff2d32] hover:text-black"
              >
                <UserIcon />
              </button>
            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div className="ml-auto flex items-center gap-1 lg:hidden">
              {/* Cart */}

              <button
                type="button"
                aria-label="Shopping bag"
                className="relative flex h-9 w-9 items-center justify-center text-white"
              >
                <BagIcon />

                <span className="absolute right-0 top-0 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ff2d32] px-1 text-[7px] font-black text-black">
                  0
                </span>
              </button>

              {/* Menu */}

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => {
                  setMobileMenuOpen((prev) => !prev);

                  if (mobileMenuOpen) {
                    setMobileShopOpen(false);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center bg-[#ff2d32] text-black transition-transform duration-200 hover:rotate-2"
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* =====================================================
              SMALL COMIC MESSAGE
          ===================================================== */}

          <div className="pointer-events-none absolute bottom-[2px] left-1/2 hidden -translate-x-1/2 lg:block">
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.3em] text-white/30">
              GOOD TEES • BAD RULES
            </span>
          </div>

          {/* =====================================================
              TORN PAPER BOTTOM
          ===================================================== */}

          <div className="absolute bottom-[-8px] left-0 h-[12px] w-full overflow-hidden">
            {/* Black shadow */}

            <div
              className="absolute inset-0 bg-black"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 58%, 98% 38%, 96% 70%, 94% 42%, 92% 68%, 90% 35%, 88% 72%, 86% 43%, 84% 65%, 82% 37%, 80% 71%, 78% 40%, 76% 66%, 74% 34%, 72% 70%, 70% 41%, 68% 67%, 66% 36%, 64% 72%, 62% 42%, 60% 65%, 58% 34%, 56% 70%, 54% 40%, 52% 68%, 50% 35%, 48% 72%, 46% 41%, 44% 66%, 42% 36%, 40% 70%, 38% 40%, 36% 66%, 34% 34%, 32% 71%, 30% 41%, 28% 65%, 26% 36%, 24% 70%, 22% 40%, 20% 66%, 18% 35%, 16% 72%, 14% 42%, 12% 67%, 10% 37%, 8% 70%, 6% 41%, 4% 65%, 2% 35%, 0 62%)",
              }}
            />

            {/* White torn edge */}

            <div
              className="absolute inset-x-0 top-[-2px] h-[9px] bg-white"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 55%, 98% 34%, 96% 68%, 94% 39%, 92% 64%, 90% 31%, 88% 70%, 86% 40%, 84% 62%, 82% 34%, 80% 68%, 78% 37%, 76% 64%, 74% 30%, 72% 69%, 70% 39%, 68% 63%, 66% 32%, 64% 71%, 62% 40%, 60% 62%, 58% 30%, 56% 68%, 54% 38%, 52% 64%, 50% 32%, 48% 70%, 46% 39%, 44% 63%, 42% 31%, 40% 68%, 38% 37%, 36% 63%, 34% 30%, 32% 69%, 30% 39%, 28% 62%, 26% 32%, 24% 68%, 22% 38%, 20% 64%, 18% 31%, 16% 70%, 14% 40%, 12% 63%, 10% 34%, 8% 68%, 6% 39%, 4% 64%, 2% 33%, 0 58%)",
              }}
            />

            {/* Red paint stroke */}

            <div className="absolute bottom-0 left-[10%] h-[2px] w-[80%] rotate-[-0.5deg] bg-[#ff2d32]" />
          </div>
        </nav>

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}

        <div
          className={`overflow-hidden bg-[#080808] transition-all duration-300 lg:hidden ${
            mobileMenuOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="relative border-b-2 border-[#ff2d32] px-4 pb-5 pt-4">
            {/* Halftone */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "9px 9px",
              }}
            />

            <div className="relative z-10">
              {/* Mobile header */}

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-[3px] w-7 rotate-[-3deg] bg-[#ff2d32]" />

                  <span
                    className="text-xl text-white"
                    style={{
                      fontFamily:
                        "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    THE PACK
                  </span>
                </div>

                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white/40">
                  GOOD TEES / BAD RULES
                </span>
              </div>

              {/* =================================================
                  MOBILE NAVIGATION
              ================================================= */}

              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isShop = item.label === "Shop";
                  const active = isActive(item.href);

                  {/* =================================================
                      MOBILE SHOP
                  ================================================= */}

                  if (isShop) {
                    return (
                      <div key={item.label}>
                        {/* Shop main item */}

                        <button
                          type="button"
                          aria-expanded={mobileShopOpen}
                          onClick={() =>
                            setMobileShopOpen((prev) => !prev)
                          }
                          className="group relative flex h-12 w-full items-center justify-between px-4"
                        >
                          {/* Paper */}

                          <span
                            className={`absolute inset-0 ${
                              isShopActive
                                ? "bg-[#ff2d32]"
                                : "bg-white"
                            }`}
                            style={{
                              clipPath:
                                "polygon(3% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 89% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 2% 95%)",
                            }}
                          />

                          {/* Active / hover red layer */}

                          <span
                            className={`absolute inset-0 transition-opacity duration-200 ${
                              mobileShopOpen || isShopActive
                                ? "bg-[#ff2d32] opacity-100"
                                : "bg-[#ff2d32] opacity-0 group-hover:opacity-100"
                            }`}
                            style={{
                              clipPath:
                                "polygon(3% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 89% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 2% 95%)",
                            }}
                          />

                          <span
                            className={`relative z-10 text-xl ${
                              isShopActive
                                ? "text-white"
                                : "text-black"
                            }`}
                            style={{
                              fontFamily:
                                "var(--font-bebas-neue), Impact, sans-serif",
                            }}
                          >
                            Shop
                          </span>

                          <span
                            className={`relative z-10 transition-transform duration-200 ${
                              isShopActive
                                ? "text-white"
                                : "text-black"
                            } ${
                              mobileShopOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            <DownArrowIcon />
                          </span>
                        </button>

                        {/* =========================================
                            MOBILE SHOP DROPDOWN
                        ========================================= */}

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            mobileShopOpen
                              ? "max-h-[120px] py-1 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-4 border-l-[3px] border-[#ff2d32] pl-2">
                            {shopItems.map((shopItem) => (
                              <a
                                key={shopItem.label}
                                href={shopItem.href}
                                onClick={closeMobileMenu}
                                className="group relative mb-1 flex h-11 items-center justify-between bg-white px-4 text-black last:mb-0"
                              >
                                <span
                                  className="relative z-10 text-lg text-black"
                                  style={{
                                    fontFamily:
                                      "var(--font-bebas-neue), Impact, sans-serif",
                                  }}
                                >
                                  {shopItem.label}
                                </span>

                                <span className="relative z-10 text-black transition-transform duration-200 group-hover:translate-x-1">
                                  <ArrowIcon />
                                </span>

                                {/* Hover red overlay */}

                                <span className="absolute inset-0 bg-[#ff2d32] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                                {/* Text above hover overlay */}

                                <span
                                  className="absolute left-4 z-20 text-lg text-black opacity-0 group-hover:opacity-100"
                                  style={{
                                    fontFamily:
                                      "var(--font-bebas-neue), Impact, sans-serif",
                                  }}
                                >
                                  {shopItem.label}
                                </span>

                                <span className="absolute right-4 z-20 text-black opacity-0 group-hover:opacity-100">
                                  <ArrowIcon />
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  {/* =================================================
                      OTHER MOBILE ITEMS
                  ================================================= */}

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="group relative flex h-12 items-center justify-between px-4"
                    >
                      {/* Paper */}

                      <span
                        className={`absolute inset-0 ${
                          active
                            ? "bg-[#ff2d32]"
                            : "bg-white"
                        }`}
                        style={{
                          clipPath:
                            index % 2 === 0
                              ? "polygon(2% 7%, 18% 3%, 34% 7%, 52% 3%, 69% 7%, 87% 4%, 98% 8%, 95% 92%, 80% 96%, 63% 92%, 47% 97%, 30% 93%, 13% 97%, 3% 90%)"
                              : "polygon(3% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 89% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 2% 95%)",
                        }}
                      />

                      {/* Hover red layer */}

                      {!active && (
                        <span
                          className="absolute inset-0 bg-[#ff2d32] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          style={{
                            clipPath:
                              index % 2 === 0
                                ? "polygon(2% 7%, 18% 3%, 34% 7%, 52% 3%, 69% 7%, 87% 4%, 98% 8%, 95% 92%, 80% 96%, 63% 92%, 47% 97%, 30% 93%, 13% 97%, 3% 90%)"
                                : "polygon(3% 5%, 20% 8%, 38% 3%, 55% 7%, 72% 3%, 89% 7%, 97% 4%, 94% 94%, 78% 90%, 61% 96%, 44% 92%, 27% 97%, 11% 91%, 2% 95%)",
                          }}
                        />
                      )}

                      {/* Text */}

                      <span
                        className={`relative z-10 text-xl ${
                          active
                            ? "text-white"
                            : "text-black"
                        }`}
                        style={{
                          fontFamily:
                            "var(--font-bebas-neue), Impact, sans-serif",
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Arrow */}

                      <span
                        className={`relative z-10 transition-transform duration-200 group-hover:translate-x-2 ${
                          active
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        <ArrowIcon />
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================= */}

              <div className="mt-4 grid grid-cols-3 gap-1">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 border border-white/20 bg-black text-[8px] font-black uppercase tracking-wider text-white"
                >
                  <SearchIcon />
                  Search
                </button>

                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 border border-white/20 bg-black text-[8px] font-black uppercase tracking-wider text-white"
                >
                  <HeartIcon />
                  Wishlist
                </button>

                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 border border-white/20 bg-black text-[8px] font-black uppercase tracking-wider text-white"
                >
                  <UserIcon />
                  Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}