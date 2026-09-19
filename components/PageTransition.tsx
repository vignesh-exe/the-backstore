"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const pageNames: Record<string, string> = {
  "/": "Home",
  "/shop": "Shop",
  "/customize": "Customize",
  "/about": "About Us",
  "/contact": "Contact",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
  "/cart": "Cart",
  "/orders": "My Orders",
  "/terms": "Terms & Conditions",
  "/privacy": "Privacy Policy",
  "/faqs": "FAQs",
};

function getPageName(href: string) {
  const path = href.split("#")[0];

  return pageNames[path] ?? "The Backstore";
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [pageName, setPageName] = useState("The Backstore");

  /*
   * iOS Safari and iOS Chrome both use WebKit. The full-screen
   * Framer Motion transition can create a large composited layer
   * and make the page unresponsive when combined with the site's
   * blur/backdrop effects.
   *
   * Keep the transition on desktop/Android, but bypass the overlay
   * completely on iOS. Navigation still happens normally.
   */
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;

    const isiOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    setIsIOS(isiOSDevice);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      const link = target?.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href) return;

      // =========================================================
      // IGNORE EXTERNAL LINKS
      // =========================================================

      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // =========================================================
      // IGNORE MODIFIED CLICKS / NEW TAB
      // =========================================================

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      // =========================================================
      // IGNORE SAME-PAGE ANCHORS
      // =========================================================

      if (href.startsWith("#")) {
        return;
      }

      // =========================================================
      // CURRENT PAGE
      // =========================================================

      const currentPath = window.location.pathname;
      const targetPath = href.split("#")[0];

      if (targetPath === currentPath) {
        return;
      }

      // =========================================================
      // START TRANSITION
      // =========================================================

      /*
       * iOS-safe path:
       * Do not create the full-screen Framer Motion overlay.
       * Let Next.js navigate normally so Safari/WebKit does not
       * have to composite another full-screen animated layer.
       */
      if (isIOS) {
        return;
      }

      event.preventDefault();

      setPageName(getPageName(href));
      setTargetUrl(href);
      setIsTransitioning(true);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isIOS]);

  // =============================================================
  // NAVIGATE AFTER TRANSITION
  // =============================================================

  useEffect(() => {
    if (!isTransitioning || !targetUrl) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push(targetUrl);

      setIsTransitioning(false);
      setTargetUrl(null);
    }, 1100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isTransitioning, targetUrl, router]);

  return (
    <>
      {/* ========================================================= */}
      {/* ACTUAL WEBSITE CONTENT */}
      {/* ========================================================= */}

      {children}

      {/* ========================================================= */}
      {/* PAGE TRANSITION */}
      {/* ========================================================= */}

      {isTransitioning && !isIOS && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 0.65,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[99999] overflow-hidden bg-[#080808]"
        >
          {/* =================================================== */}
          {/* RED ACCENT LINE */}
          {/* =================================================== */}

          <motion.div
            initial={{
              scaleY: 0,
            }}
            animate={{
              scaleY: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute right-0 top-0 h-full w-[4px] origin-top bg-[#DA0D12]"
          />

          {/* =================================================== */}
          {/* RED GLOW */}
          {/* =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DA0D12]/10 blur-[130px]"
          />

          {/* =================================================== */}
          {/* TOP DIAGONAL LINE */}
          {/* =================================================== */}

          <motion.div
            initial={{
              x: "-110%",
              rotate: -3,
            }}
            animate={{
              x: "0%",
              rotate: -3,
            }}
            transition={{
              duration: 0.75,
              delay: 0.05,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="pointer-events-none absolute left-[-10%] top-[18%] h-[2px] w-[120%] bg-[#DA0D12]/30"
          />

          {/* =================================================== */}
          {/* BOTTOM DIAGONAL LINE */}
          {/* =================================================== */}

          <motion.div
            initial={{
              x: "110%",
              rotate: -3,
            }}
            animate={{
              x: "0%",
              rotate: -3,
            }}
            transition={{
              duration: 0.75,
              delay: 0.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="pointer-events-none absolute bottom-[18%] left-[-10%] h-[2px] w-[120%] bg-[#DA0D12]/20"
          />

          {/* =================================================== */}
          {/* CENTER CONTENT */}
          {/* =================================================== */}

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              {/* ================================================= */}
              {/* BRAND LABEL */}
              {/* ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.32,
                }}
                className="mb-5 flex items-center justify-center gap-3"
              >
                <span className="h-px w-8 bg-[#DA0D12]" />

                <span className="font-[var(--font-outfit)] text-[9px] font-semibold uppercase tracking-[0.32em] text-white/40">
                  The Backstore
                </span>

                <span className="h-px w-8 bg-[#DA0D12]" />
              </motion.div>

              {/* ================================================= */}
              {/* PAGE NAME */}
              {/* ================================================= */}

              <motion.h2
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-[var(--font-bebas-neue)] text-[clamp(3.5rem,9vw,7rem)] uppercase leading-none tracking-[0.02em] text-white"
              >
                {pageName}
              </motion.h2>

              {/* ================================================= */}
              {/* LOADING LINE */}
              {/* ================================================= */}

              <div className="mx-auto mt-7 h-[2px] w-20 overflow-hidden bg-white/10">
                <motion.div
                  initial={{
                    x: "-100%",
                  }}
                  animate={{
                    x: "0%",
                  }}
                  transition={{
                    duration: 0.85,
                    delay: 0.35,
                    ease: "easeInOut",
                  }}
                  className="h-full w-full bg-[#DA0D12]"
                />
              </div>
            </motion.div>
          </div>

          {/* =================================================== */}
          {/* BOTTOM LEFT */}
          {/* =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.5,
            }}
            className="absolute bottom-8 left-8 sm:bottom-10 sm:left-10"
          >
            <span className="font-[var(--font-outfit)] text-[8px] font-semibold uppercase tracking-[0.28em] text-white/25">
              Made For The Streets
            </span>
          </motion.div>

          {/* =================================================== */}
          {/* TOP RIGHT */}
          {/* =================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.5,
            }}
            className="absolute right-8 top-8 sm:right-10 sm:top-10"
          >
            <span className="font-[var(--font-bebas-neue)] text-sm tracking-[0.2em] text-white/20">
              01
            </span>
          </motion.div>

          {/* =================================================== */}
          {/* BOTTOM RIGHT DOTS */}
          {/* =================================================== */}

          <div className="absolute bottom-8 right-8 flex items-center gap-1.5 sm:bottom-10 sm:right-10">
            <motion.span
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.45,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#DA0D12]"
            />

            <motion.span
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.55,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#DA0D12]/50"
            />

            <motion.span
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.65,
              }}
              className="h-1.5 w-1.5 rounded-full bg-[#DA0D12]/20"
            />
          </div>
        </motion.div>
      )}
    </>
  );
}
