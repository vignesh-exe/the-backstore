"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import AccountModal from "@/components/account/AccountModal";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Customize", href: "/customize" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const shopItems = [
  {
    label: "T-Shirts",
    href: "/shop/t-shirts",
    number: "01",
    description: "Everyday pieces made to live in.",
  },
  {
    label: "Footwear",
    href: "/shop/footwear",
    number: "02",
    description: "Comfort for every step.",
  },
  {
    label: "Anime Toys",
    href: "/shop/anime-toys",
    number: "03",
    description: "Collect your favorite characters.",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <circle cx="10.8" cy="10.8" r="6.2" />
      <path d="m15.5 15.5 4.5 4.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <path d="M20.2 8.9c0 5.1-8.2 10.2-8.2 10.2S3.8 14 3.8 8.9a4.45 4.45 0 0 1 8.2-2.45A4.45 4.45 0 0 1 20.2 8.9Z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <path d="M5.2 8.4h13.6l1 12H4.2l1-12Z" />
      <path d="M8.5 8.4V6.2a3.5 3.5 0 0 1 7 0v2.2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="7.5" r="3.2" />
      <path d="M5.1 20.5a6.9 6.9 0 0 1 13.8 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h10" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-[11px] w-[11px]"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="7.2" cy="7.2" rx="2.1" ry="2.8" />
      <ellipse cx="12" cy="5.2" rx="2.1" ry="2.8" />
      <ellipse cx="16.8" cy="7.2" rx="2.1" ry="2.8" />

      <path d="M12 10.1c-3.3 0-5.9 2.4-5.9 5.1 0 2.1 1.6 3.2 3.5 2.6 1-.3 1.6-1 2.4-1s1.4.7 2.4 1c1.9.6 3.5-.5 3.5-2.6 0-2.7-2.6-5.1-5.9-5.1Z" />
    </svg>
  );
}

function TShirtIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m8.2 5 3.8-2 3.8 2 3.1 3.1-2.5 3-1.5-1.1v9H9.1v-9L7.6 11 5.1 8.1 8.2 5Z" />
    </svg>
  );
}

function ShoeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M4 14.5c2.8 0 4.9-1.2 6.3-3.8L12 7.5l2.1 2.7c1.2 1.6 2.6 2.3 4.6 2.3H20v5H4v-3Z" />
      <path d="M12 7.5V4.8" />
      <path d="M6.5 17.5h11" />
    </svg>
  );
}

function ToyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 9.5h10a4 4 0 0 1 4 4v4H3v-4a4 4 0 0 1 4-4Z" />
      <path d="M8 9.5V7.8a4 4 0 0 1 8 0v1.7" />
      <path d="M7.5 13.5h.01M16.5 13.5h.01" />
      <path d="M10 15.5h4" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loggedInFirstName, setLoggedInFirstName] = useState<string | null>(
    null,
  );

  const cartItems = useSelector((state: any) => state.cart?.cartItems ?? {});

  const wishlistItems = useSelector(
    (state: any) => state.wishlist?.wishlistItems ?? [],
  );

  const cartCount = useMemo(() => {
    if (!loggedInFirstName) {
      return 0;
    }

    if (!cartItems || typeof cartItems !== "object") {
      return 0;
    }

    return Object.values(cartItems).reduce(
      (total: number, item: any) =>
        total + Math.max(0, Number(item?.quantity ?? 1)),
      0,
    );
  }, [cartItems, loggedInFirstName]);

  const wishlistCount = useMemo(() => {
    if (!loggedInFirstName) {
      return 0;
    }

    if (Array.isArray(wishlistItems)) {
      return wishlistItems.length;
    }

    if (wishlistItems && typeof wishlistItems === "object") {
      return Object.keys(wishlistItems).length;
    }

    return 0;
  }, [wishlistItems, loggedInFirstName]);

  useEffect(() => {
    const storedFirstName = window.localStorage.getItem(
      "backstore_user_first_name",
    );

    if (storedFirstName) {
      setLoggedInFirstName(storedFirstName);
    }

    const handleLogin = (event: Event) => {
      const customEvent = event as CustomEvent<{ firstName?: string }>;
      const firstName =
        customEvent.detail?.firstName ||
        window.localStorage.getItem("backstore_user_first_name");

      if (firstName) {
        setLoggedInFirstName(firstName);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "backstore_user_first_name") {
        setLoggedInFirstName(event.newValue);

        if (!event.newValue) {
          setProfileMenuOpen(false);
        }
      }
    };

    const handleOpenCart = () => {
      closeMobileMenu();
      setWishlistOpen(false);
      setProfileMenuOpen(false);
      setCartOpen(true);
    };

    const handleOpenAccount = () => {
      closeMobileMenu();
      setProfileMenuOpen(false);
      setAccountOpen(true);
    };

    const handleAuthStateChange = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoggedInFirstName(null);
        setProfileMenuOpen(false);
        window.localStorage.removeItem("backstore_user_first_name");
      }
    };

    window.addEventListener("backstore:login", handleLogin);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("backstore:open-cart", handleOpenCart);
    window.addEventListener("backstore:open-account", handleOpenAccount);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setLoggedInFirstName(null);
          setProfileMenuOpen(false);
          window.localStorage.removeItem("backstore_user_first_name");
        }
      },
    );

    handleAuthStateChange();

    return () => {
      window.removeEventListener("backstore:login", handleLogin);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("backstore:open-cart", handleOpenCart);
      window.removeEventListener("backstore:open-account", handleOpenAccount);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const openWishlist = () => {
    closeMobileMenu();
    setWishlistOpen(true);
  };

  const openCart = () => {
    closeMobileMenu();
    setCartOpen(true);
  };

  const openAccount = () => {
    if (loggedInFirstName) {
      setProfileMenuOpen((prev) => !prev);
      return;
    }

    closeMobileMenu();
    setLoginOpen(true);
  };

  const openMyAccount = () => {
    setProfileMenuOpen(false);
    closeMobileMenu();
    setAccountOpen(true);
  };

  const openMyOrders = () => {
    setProfileMenuOpen(false);
    closeMobileMenu();
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      setLoggedInFirstName(null);
      setProfileMenuOpen(false);
      setAccountOpen(false);

      window.localStorage.removeItem("backstore_user_first_name");

      window.dispatchEvent(new CustomEvent("backstore:logout"));

      window.dispatchEvent(new CustomEvent("janavi-auth-changed"));

      // Refresh the page so the logged-out state is reflected everywhere.
      window.location.reload();
    } catch (error) {
      console.error("Unexpected logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isShopActive = pathname === "/shop" || pathname.startsWith("/shop/");

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileShopOpen(false);
  };

  return (
    <>
      {/* =========================================================
          DESKTOP GLASS PILL NAVBAR
      ========================================================= */}

      <header className="fixed inset-x-0 top-0 z-[100]">
        <div className="hidden px-4 pt-4 lg:block">
          <nav
            className="
              relative
              mx-auto
              flex
              h-[56px]
              max-w-[1180px]
              items-center
              rounded-full
              border
              border-[#CBCAC8]/15
              bg-[#161616]/75
              px-2
              shadow-[0_18px_45px_rgba(0,0,0,0.22)]
              backdrop-blur-2xl
              backdrop-saturate-150
            "
          >
            {/* =====================================================
                GLASS HIGHLIGHT
            ===================================================== */}

            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#CBCAC8]/25 to-transparent" />

            {/* =====================================================
                LOGO BADGE
            ===================================================== */}

            <a
              href="/"
              aria-label="The Backstore home"
              className="
                group
                relative
                flex
                h-[48px]
                w-[185px]
                shrink-0
                items-center
                justify-center
              "
            >
              {/* torn red paper */}

              <div
                className="
                  absolute
                  inset-[2px]
                  bg-[#DA0D12]
                  transition-transform
                  duration-300
                  group-hover:scale-[1.015]
                "
                style={{
                  clipPath:
                    "polygon(3% 15%, 13% 9%, 24% 13%, 36% 7%, 49% 11%, 61% 6%, 74% 12%, 86% 7%, 97% 14%, 94% 86%, 84% 92%, 73% 88%, 61% 94%, 49% 89%, 37% 94%, 24% 89%, 12% 93%, 3% 86%, 1% 24%)",
                }}
              />

              {/* subtle paper texture */}

              <div
                className="absolute inset-[3px] opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #CBCAC8 1px, transparent 1.3px)",
                  backgroundSize: "11px 11px",
                  clipPath:
                    "polygon(3% 15%, 13% 9%, 24% 13%, 36% 7%, 49% 11%, 61% 6%, 74% 12%, 86% 7%, 97% 14%, 94% 86%, 84% 92%, 73% 88%, 61% 94%, 49% 89%, 37% 94%, 24% 89%, 12% 93%, 3% 86%, 1% 24%)",
                }}
              />

              {/* logo */}

              <img
                src="/logo/backstore-logo.png"
                alt="The Backstore"
                className="
                  relative
                  z-10
                  h-[68px]
                  w-auto
                  max-w-[165px]
                  object-contain
                  transition-transform
                  duration-300
                  group-hover:scale-[1.025]
                "
              />
            </a>

            {/* =====================================================
                DIVIDER
            ===================================================== */}

            <div className="mx-3 h-6 w-px bg-[#CBCAC8]/10" />

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div className="flex h-full flex-1 items-center justify-center">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const isShop = item.label === "Shop";

                  if (isShop) {
                    return (
                      <div key={item.label} className="group relative h-full">
                        <button
                          type="button"
                          aria-haspopup="true"
                          aria-label="Open Shop menu"
                          className={`
                            relative
                            flex
                            h-[36px]
                            items-center
                            gap-1.5
                            rounded-full
                            px-4
                            border-0
                            text-[11px]
                            font-medium
                            transition-all
                            duration-200
                            ${
                              isShopActive
                                ? "bg-[#CBCAC8]/8 text-[#CBCAC8]"
                                : "text-[#666362] hover:bg-[#CBCAC8]/5 hover:text-[#CBCAC8]"
                            }
                          `}
                        >
                          {isShopActive && (
                            <PawIcon className="h-3 w-3 text-[#80060B]" />
                          )}

                          <span>Shop</span>

                          <ChevronDownIcon />
                        </button>

                        {/* =================================================
                            SHOP DROPDOWN
                        ================================================= */}

                        <div
                          className="
                            invisible
                            absolute
                            left-1/2
                            top-[53px]
                            z-[500]
                            w-[760px]
                            -translate-x-1/2
                            translate-y-2
                            opacity-0
                            transition-all
                            duration-200
                            group-hover:visible
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                        >
                          <div
                            className="
                              overflow-hidden
                              rounded-[24px]
                              border
                              border-[#CBCAC8]/15
                              bg-[#161616]/90
                              p-2
                              shadow-[0_25px_70px_rgba(0,0,0,0.3)]
                              backdrop-blur-2xl
                            "
                          >
                            {/* heading */}

                            <div className="flex items-end justify-between px-4 pb-3 pt-3">
                              <div>
                                <div className="mb-1.5 flex items-center gap-2">
                                  <PawIcon className="h-3 w-3 text-[#80060B]" />

                                  <span className="text-[7px] uppercase tracking-[0.2em] text-[#666362]">
                                    Explore collection
                                  </span>
                                </div>

                                <h3
                                  className="text-[27px] leading-none text-[#CBCAC8]"
                                  style={{
                                    fontFamily:
                                      "var(--font-bebas-neue), Impact, sans-serif",
                                  }}
                                >
                                  FIND YOUR EVERYDAY
                                </h3>
                              </div>

                              <span className="font-mono text-[7px] text-[#666362]">
                                03 / 03
                              </span>
                            </div>

                            {/* cards */}

                            <div className="grid grid-cols-3 gap-1">
                              {shopItems.map((shopItem) => {
                                const active = isActive(shopItem.href);

                                return (
                                  <a
                                    key={shopItem.label}
                                    href={shopItem.href}
                                    className={`
                                      group/card
                                      relative
                                      min-h-[170px]
                                      overflow-hidden
                                      rounded-[18px]
                                      border
                                      p-4
                                      transition-all
                                      duration-300
                                      ${
                                        active
                                          ? "border-[#80060B]/60 bg-[#80060B]/10 text-[#CBCAC8]"
                                          : "border-[#CBCAC8]/8 bg-[#CBCAC8]/[0.025] text-[#CBCAC8] hover:border-[#CBCAC8]/15 hover:bg-[#CBCAC8]/[0.06]"
                                      }
                                    `}
                                  >
                                    <span className="absolute right-4 top-4 font-mono text-[8px] text-[#666362]">
                                      {shopItem.number}
                                    </span>

                                    <div
                                      className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${
                                          active
                                            ? "bg-[#80060B]/20 text-[#CBCAC8]"
                                            : "bg-[#CBCAC8]/5 text-[#666362]"
                                        }
                                      `}
                                    >
                                      {shopItem.label === "T-Shirts" ? (
                                        <TShirtIcon />
                                      ) : shopItem.label === "Footwear" ? (
                                        <ShoeIcon />
                                      ) : (
                                        <ToyIcon />
                                      )}
                                    </div>

                                    <div className="absolute bottom-4 left-4 right-4">
                                      <div className="flex items-end justify-between">
                                        <div>
                                          <h4
                                            className="text-[26px] leading-none"
                                            style={{
                                              fontFamily:
                                                "var(--font-bebas-neue), Impact, sans-serif",
                                            }}
                                          >
                                            {shopItem.label}
                                          </h4>

                                          <p className="mt-2 max-w-[175px] text-[8px] leading-relaxed text-[#666362]">
                                            {shopItem.description}
                                          </p>
                                        </div>

                                        <span className="transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1">
                                          <ArrowUpRightIcon />
                                        </span>
                                      </div>
                                    </div>

                                    {active && (
                                      <span className="absolute bottom-0 left-5 h-[2px] w-8 rounded-full bg-[#80060B]" />
                                    )}
                                  </a>
                                );
                              })}
                            </div>

                            {/* bottom */}

                            <div className="mt-1 flex items-center justify-between rounded-[16px] bg-[#CBCAC8]/[0.035] px-4 py-2.5">
                              <span className="text-[7px] uppercase tracking-[0.18em] text-[#666362]">
                                Made for the everyday pack
                              </span>

                              <PawIcon className="h-3 w-3 text-[#80060B]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`
                        relative
                        flex
                        h-[36px]
                        no-underline
                        items-center
                        gap-1.5
                        rounded-full
                        px-4
                        text-[11px]
                        font-medium
                        transition-all
                        duration-200
                        ${
                          active
                            ? "bg-[#CBCAC8]/8 text-[#CBCAC8]"
                            : "text-[#666362] hover:bg-[#CBCAC8]/5 hover:text-[#CBCAC8]"
                        }
                      `}
                    >
                      {active && <PawIcon className="h-3 w-3 text-[#80060B]" />}

                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* =====================================================
                RIGHT ACTIONS
            ===================================================== */}

            <div className="mx-2 h-6 w-px bg-[#CBCAC8]/10" />

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#666362] transition-all hover:bg-[#CBCAC8]/8 hover:text-[#CBCAC8]"
              >
                <SearchIcon />
              </button>

              <button
                type="button"
                aria-label="Wishlist"
                onClick={() => setWishlistOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666362] transition-all hover:bg-[#CBCAC8]/8 hover:text-[#CBCAC8]"
              >
                <HeartIcon />

                <span className="absolute right-[5px] top-[4px] flex h-[10px] min-w-[10px] items-center justify-center rounded-full bg-[#80060B] px-0.5 text-[5px] text-[#CBCAC8]">
                  {wishlistCount}
                </span>
              </button>

              <button
                type="button"
                aria-label="Shopping bag"
                onClick={openCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#666362] transition-all hover:bg-[#CBCAC8]/8 hover:text-[#CBCAC8]"
              >
                <BagIcon />

                <span className="absolute right-[5px] top-[4px] flex h-[10px] min-w-[10px] items-center justify-center rounded-full bg-[#80060B] px-0.5 text-[5px] text-[#CBCAC8]">
                  {cartCount}
                </span>
              </button>

              <div className="relative ml-1">
                <button
                  type="button"
                  aria-label={
                    loggedInFirstName
                      ? `Account for ${loggedInFirstName}`
                      : "Login"
                  }
                  onClick={openAccount}
                  className={`
                  flex
                  h-8
                  min-w-8
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  px-2.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  ${
                    loggedInFirstName
                      ? "bg-[#CBCAC8] text-[#161616] hover:bg-[#424141] hover:text-[#CBCAC8]"
                      : "bg-[#DA0D12] text-[#CBCAC8] hover:bg-[#80060B]"
                  }
                `}
                >
                  <UserIcon />
                  <span className="max-w-[70px] truncate">
                    {loggedInFirstName || "Login"}
                  </span>
                </button>

                {loggedInFirstName && profileMenuOpen && (
                  <div className="absolute right-0 top-[43px] z-[700] w-[210px] overflow-hidden rounded-[18px] border border-[#CBCAC8]/12 bg-[#161616]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                    <div className="border-b border-[#CBCAC8]/8 px-3 py-2.5">
                      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#CBCAC8]">
                        {loggedInFirstName}
                      </p>
                      <p className="mt-1 text-[7px] uppercase tracking-[0.14em] text-[#666362]">
                        My account
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openMyAccount}
                      className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[9px] font-medium text-[#CBCAC8] transition-colors hover:bg-[#CBCAC8]/6"
                    >
                      <UserIcon />
                      <span>My Account</span>
                    </button>

                    <a
                      href="/my-orders"
                      onClick={openMyOrders}
                      className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[9px] font-medium text-[#CBCAC8] transition-colors hover:bg-[#CBCAC8]/6"
                    >
                      <BagIcon />
                      <span>My Orders</span>
                    </a>

                    <div className="my-1 h-px bg-[#CBCAC8]/8" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[9px] font-medium text-[#DA0D12] transition-colors hover:bg-[#DA0D12]/8 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-4 w-4 items-center justify-center text-[12px]">
                        ↪
                      </span>
                      <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* =========================================================
            MOBILE GLASS PILL
        ========================================================= */}

        <div className="px-3 pt-3 lg:hidden">
          <nav
            className="
              relative
              mx-auto
              flex
              h-[52px]
              max-w-[700px]
              items-center
              rounded-full
              border
              border-[#CBCAC8]/15
              bg-[#161616]/80
              px-1.5
              shadow-[0_15px_40px_rgba(0,0,0,0.22)]
              backdrop-blur-2xl
              backdrop-saturate-150
            "
          >
            {/* glass highlight */}

            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#CBCAC8]/25 to-transparent" />

            {/* =====================================================
                MOBILE LEFT MENU BUTTON
            ===================================================== */}

            <button
              type="button"
              aria-label={
                mobileMenuOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);

                if (mobileMenuOpen) {
                  setMobileShopOpen(false);
                }
              }}
              className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#CBCAC8] text-[#161616]"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {/* =====================================================
                MOBILE CENTER LOGO
            ===================================================== */}

            <a
              href="/"
              aria-label="The Backstore home"
              className="group absolute left-1/2 flex h-[45px] w-[145px] -translate-x-1/2 items-center justify-center"
            >
              <div
                className="absolute inset-[2px] bg-[#DA0D12]"
                style={{
                  clipPath:
                    "polygon(3% 15%, 14% 9%, 26% 13%, 39% 7%, 52% 11%, 65% 6%, 78% 12%, 90% 7%, 98% 14%, 94% 86%, 83% 92%, 71% 88%, 59% 94%, 46% 89%, 34% 94%, 22% 89%, 11% 93%, 3% 86%)",
                }}
              />

              <img
                src="/logo/backstore-logo.png"
                alt="The Backstore"
                className="relative z-10 h-[63px] w-auto max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-[1.025]"
              />
            </a>

            {/* =====================================================
                MOBILE RIGHT CART
            ===================================================== */}

            <button
              type="button"
              aria-label="Shopping bag"
              onClick={openCart}
              className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full text-[#666362] transition-colors hover:bg-[#CBCAC8]/8 hover:text-[#CBCAC8]"
            >
              <BagIcon />

              <span className="absolute right-[3px] top-[2px] flex h-[10px] min-w-[10px] items-center justify-center rounded-full bg-[#80060B] px-0.5 text-[5px] text-[#CBCAC8]">
                {cartCount}
              </span>
            </button>
          </nav>

          {/* =======================================================
              MOBILE MENU
          ======================================================= */}

          <div
            className={`
              mx-auto
              max-w-[700px]
              overflow-hidden
              transition-all
              duration-300
              ${
                mobileMenuOpen
                  ? "max-h-[650px] pt-2 opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-[#CBCAC8]/10
                bg-[#161616]/90
                p-2
                shadow-[0_20px_50px_rgba(0,0,0,0.28)]
                backdrop-blur-2xl
              "
            >
              {/* header */}

              <div className="flex items-center justify-between border-b border-[#CBCAC8]/8 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <PawIcon className="h-3 w-3 text-[#80060B]" />

                  <span className="text-[7px] uppercase tracking-[0.2em] text-[#666362]">
                    The Backstore
                  </span>
                </div>

                <span className="font-mono text-[7px] text-[#666362]">
                  EST. 2026
                </span>
              </div>

              {/* navigation */}

              <div className="mt-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const isShop = item.label === "Shop";

                  if (isShop) {
                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          aria-expanded={mobileShopOpen}
                          onClick={() => setMobileShopOpen((prev) => !prev)}
                          className={`
                            flex
                            h-[45px]
                            w-full
                            items-center
                            justify-between
                            rounded-[14px]
                            px-3
                            ${
                              isShopActive
                                ? "bg-[#CBCAC8]/8 text-[#CBCAC8]"
                                : "text-[#666362]"
                            }
                          `}
                        >
                          <span className="flex items-center gap-3">
                            {isShopActive ? (
                              <PawIcon className="h-3 w-3 text-[#80060B]" />
                            ) : (
                              <span className="h-1 w-1 rounded-full bg-[#424141]" />
                            )}

                            <span className="text-[10px] font-medium">
                              Shop
                            </span>
                          </span>

                          <span
                            className={`transition-transform duration-200 ${
                              mobileShopOpen ? "rotate-180" : ""
                            }`}
                          >
                            <ChevronDownIcon />
                          </span>
                        </button>

                        <div
                          className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ${
                              mobileShopOpen
                                ? "max-h-[155px] opacity-100"
                                : "max-h-0 opacity-0"
                            }
                          `}
                        >
                          <div className="ml-3 border-l border-[#80060B]/50">
                            {shopItems.map((shopItem) => (
                              <a
                                key={shopItem.label}
                                href={shopItem.href}
                                onClick={closeMobileMenu}
                                className="flex h-[43px] items-center justify-between rounded-r-[12px] px-4 text-[#666362] transition-colors hover:bg-[#CBCAC8]/5 hover:text-[#CBCAC8]"
                              >
                                <span className="flex items-center gap-3">
                                  {shopItem.label === "T-Shirts" ? (
                                    <TShirtIcon />
                                  ) : shopItem.label === "Footwear" ? (
                                    <ShoeIcon />
                                  ) : (
                                    <ToyIcon />
                                  )}

                                  <span className="text-[9px]">
                                    {shopItem.label}
                                  </span>
                                </span>

                                <ArrowRightIcon />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`
                        flex
                        h-[45px]
                        items-center
                        justify-between
                        rounded-[14px]
                        px-3
                        transition-colors
                        ${
                          active
                            ? "bg-[#CBCAC8]/8 text-[#CBCAC8]"
                            : "text-[#666362] hover:bg-[#CBCAC8]/5 hover:text-[#CBCAC8]"
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        {active ? (
                          <PawIcon className="h-3 w-3 text-[#80060B]" />
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-[#424141]" />
                        )}

                        <span className="text-[10px]">{item.label}</span>
                      </span>

                      <ArrowRightIcon />
                    </a>
                  );
                })}

                {loggedInFirstName && (
                  <a
                    href="/my-orders"
                    onClick={openMyOrders}
                    className={`
                      flex
                      h-[45px]
                      items-center
                      justify-between
                      rounded-[14px]
                      px-3
                      transition-colors
                      ${
                        pathname === "/my-orders" ||
                        pathname.startsWith("/my-orders/")
                          ? "bg-[#CBCAC8]/8 text-[#CBCAC8]"
                          : "text-[#666362] hover:bg-[#CBCAC8]/5 hover:text-[#CBCAC8]"
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      {pathname === "/my-orders" ||
                      pathname.startsWith("/my-orders/") ? (
                        <PawIcon className="h-3 w-3 text-[#80060B]" />
                      ) : (
                        <BagIcon />
                      )}

                      <span className="text-[10px]">My Orders</span>
                    </span>

                    <ArrowRightIcon />
                  </a>
                )}
              </div>

              {/* mobile utilities */}

              <div className="mt-1 grid grid-cols-3 gap-1">
                <button
                  type="button"
                  className="flex h-[40px] items-center justify-center gap-2 rounded-[13px] bg-[#CBCAC8]/[0.035] text-[7px] uppercase tracking-[0.1em] text-[#666362]"
                >
                  <SearchIcon />
                  Search
                </button>

                <button
                  type="button"
                  aria-label="Open wishlist"
                  onClick={openWishlist}
                  className="flex h-[40px] items-center justify-center gap-2 rounded-[13px] bg-[#CBCAC8]/[0.035] text-[7px] uppercase tracking-[0.1em] text-[#666362] transition-colors hover:bg-[#DA0D12]/10 hover:text-[#CBCAC8]"
                >
                  <HeartIcon />
                  Wishlist
                </button>

                <button
                  type="button"
                  aria-label={
                    loggedInFirstName
                      ? `Account for ${loggedInFirstName}`
                      : "Login"
                  }
                  onClick={openAccount}
                  className={`
                    flex
                    h-[40px]
                    items-center
                    justify-center
                    gap-2
                    rounded-[13px]
                    px-2
                    text-[7px]
                    uppercase
                    tracking-[0.1em]
                    transition-colors
                    ${
                      loggedInFirstName
                        ? "bg-[#CBCAC8]/[0.035] text-[#666362] hover:bg-[#CBCAC8]/10 hover:text-[#CBCAC8]"
                        : "bg-[#DA0D12] text-[#CBCAC8] hover:bg-[#80060B]"
                    }
                  `}
                >
                  <UserIcon />
                  <span className="max-w-[72px] truncate">
                    {loggedInFirstName || "Login"}
                  </span>
                </button>
              </div>

              {loggedInFirstName && profileMenuOpen && (
                <div className="mt-1 overflow-hidden rounded-[16px] border border-[#CBCAC8]/10 bg-[#080808]/70 p-1.5">
                  <div className="border-b border-[#CBCAC8]/8 px-3 py-2">
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-[#CBCAC8]">
                      {loggedInFirstName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openMyAccount}
                    className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left text-[8px] uppercase tracking-[0.12em] text-[#CBCAC8] transition-colors hover:bg-[#CBCAC8]/6"
                  >
                    <UserIcon />
                    My Account
                  </button>

                  <div className="my-1 h-px bg-[#CBCAC8]/8" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left text-[8px] uppercase tracking-[0.12em] text-[#DA0D12] transition-colors hover:bg-[#DA0D12]/8 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex h-4 w-4 items-center justify-center text-[12px]">
                      ↪
                    </span>
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </button>
                </div>
              )}

              {/* bottom */}

              <div className="flex items-center justify-center gap-2 py-2.5">
                <span className="h-px w-7 bg-[#CBCAC8]/8" />

                <PawIcon className="h-2.5 w-2.5 text-[#80060B]" />

                <span className="text-[6px] uppercase tracking-[0.2em] text-[#666362]">
                  Made for the pack
                </span>

                <span className="h-px w-7 bg-[#CBCAC8]/8" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </>
  );
}
