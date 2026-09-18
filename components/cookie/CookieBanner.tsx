"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "the-backstore-cookie-consent";

type CookieConsent = "accepted" | "rejected";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const existingConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!existingConsent) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, consent);
    setVisible(false);
  };

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-[9999]
        px-3
        pb-3
        sm:px-5
        sm:pb-5
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1180px]
          overflow-hidden
          rounded-[22px]
          border
          border-[#CBCAC8]/12
          bg-[#161616]/95
          shadow-[0_-20px_80px_rgba(0,0,0,0.45)]
          backdrop-blur-2xl
        "
      >
        {/* Comic / dog themed accent */}
        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-[#DA0D12]/10
            blur-[60px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-10
            h-36
            w-36
            rounded-full
            bg-[#DA0D12]/5
            blur-[55px]
          "
        />

        <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          {/* Content */}
          <div className="flex min-w-0 items-start gap-4">
            {/* Paw */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#DA0D12]/20
                bg-[#DA0D12]/10
                text-[#DA0D12]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <ellipse cx="7.1" cy="7.1" rx="2.05" ry="2.75" />
                <ellipse cx="12" cy="5.1" rx="2.05" ry="2.8" />
                <ellipse cx="16.9" cy="7.1" rx="2.05" ry="2.75" />
                <path d="M12 10.2c-3.25 0-5.85 2.3-5.85 5.05 0 2.15 1.7 3.25 3.6 2.65 1-.3 1.55-1.05 2.25-1.05s1.25.75 2.25 1.05c1.9.6 3.6-.5 3.6-2.65 0-2.75-2.6-5.05-5.85-5.05Z" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="
                    font-mono
                    text-[7px]
                    uppercase
                    tracking-[0.28em]
                    text-[#DA0D12]
                  "
                >
                  The Backstore
                </span>

                <span className="h-1 w-1 rounded-full bg-[#424141]" />

                <span
                  className="
                    font-mono
                    text-[7px]
                    uppercase
                    tracking-[0.22em]
                    text-[#666362]
                  "
                >
                  Cookies
                </span>
              </div>

              <h2
                className="
                  text-[22px]
                  leading-none
                  tracking-[0.01em]
                  text-[#CBCAC8]
                  sm:text-[26px]
                "
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                GOOD COOKIES.{" "}
                <span className="text-[#DA0D12]">GOOD EXPERIENCE.</span>
              </h2>

              <p
                className="
                  mt-2
                  max-w-[680px]
                  text-[10px]
                  leading-[1.7]
                  text-[#666362]
                  sm:text-[11px]
                "
              >
                We use cookies and similar technologies to keep The Backstore
                working smoothly, remember your preferences and understand how
                the site is used.
              </p>

              <a
                href="/privacy-policy"
                className="
    mt-2
    inline-block
    font-mono
    text-[7px]
    uppercase
    tracking-[0.2em]
    underline
    transition-opacity
    duration-300
    hover:opacity-70
  "
                style={{
                  color: "#DA0D12",
                }}
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Actions */}
          <div
            className="
              flex
              shrink-0
              flex-col
              gap-2
              sm:flex-row
              lg:justify-end
            "
          >
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-full
                border
                border-[#CBCAC8]/10
                bg-[#CBCAC8]/[0.035]
                px-5
                font-mono
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-[#CBCAC8]/65
                transition-all
                duration-300
                hover:border-[#CBCAC8]/20
                hover:bg-[#CBCAC8]/[0.07]
                hover:text-[#CBCAC8]
              "
            >
              Reject
            </button>

            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="
                inline-flex
                h-10
                items-center
                justify-center
                rounded-full
                bg-[#DA0D12]
                px-6
                font-mono
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-[#CBCAC8]
                shadow-[0_8px_30px_rgba(218,13,18,0.18)]
                transition-all
                duration-300
                hover:bg-[#b80b10]
                hover:shadow-[0_10px_35px_rgba(218,13,18,0.28)]
              "
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Bottom comic line */}
        <div
          className="
            h-[2px]
            w-full
            bg-[#DA0D12]
            opacity-80
          "
        />
      </div>
    </div>
  );
}
