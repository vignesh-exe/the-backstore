"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#080808] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "13px 13px",
          }}
        />

        <div
          className="absolute -bottom-32 -right-24 h-[350px] w-[350px] rotate-[-8deg] bg-[#ff2d32] opacity-15"
          style={{
            clipPath:
              "polygon(5% 8%, 18% 2%, 32% 7%, 47% 1%, 63% 6%, 78% 2%, 96% 8%, 91% 94%, 76% 89%, 60% 97%, 44% 91%, 28% 97%, 13% 91%, 2% 96%)",
          }}
        />
      </div>

      {/* =========================================================
          TOP TORN EDGE
      ========================================================= */}

      <div
        className="relative z-10 h-4 bg-white"
        style={{
          clipPath:
            "polygon(0 15%, 8% 45%, 16% 20%, 24% 50%, 33% 18%, 42% 45%, 51% 15%, 60% 48%, 69% 20%, 78% 45%, 87% 15%, 94% 48%, 100% 20%, 100% 100%, 0 100%)",
        }}
      />

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1450px] px-5 pb-5 pt-7 sm:px-8 sm:pt-8 lg:px-12 lg:pt-9">
        {/* =======================================================
            TOP CONTENT
        ======================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-x-6
            gap-y-8
            pb-7
            sm:gap-x-10
            sm:gap-y-9
            lg:grid-cols-[1.7fr_0.65fr_0.65fr_0.9fr]
            lg:gap-8
          "
        >
          {/* =====================================================
              BRAND
          ===================================================== */}

          <div className="col-span-2 lg:col-span-1">
            {/* Logo */}

            <Link
              href="/"
              className="group inline-block"
            >
              <div className="relative">
                <div
                  className="absolute -left-2 top-1 h-[62px] w-[135px] bg-[#ff2d32] transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    clipPath:
                      "polygon(4% 8%, 20% 4%, 37% 7%, 54% 3%, 72% 7%, 96% 5%, 92% 93%, 75% 89%, 56% 96%, 38% 91%, 19% 96%, 3% 90%)",
                  }}
                />

                <img
                  src="/logo/backstore-logo.png"
                  alt="The Backstore"
                  className="relative z-10 h-[88px] w-auto max-w-[230px] object-contain object-left"
                />
              </div>
            </Link>

            {/* Description */}

            <p className="mt-4 max-w-[570px] text-[11px] leading-[1.65] text-white/55 sm:text-[12px] sm:leading-5">
              The Backstore is a streetwear brand built around
              bold designs, oversized fits, fandom, creativity
              and original ideas.
              <br />
              We create pieces that are made to feel personal —
              designed with passion and made for people who wear
              their identity.
            </p>

            {/* Social Icons */}

            <div className="mt-4 flex items-center gap-2">
              {/* YouTube */}

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#ff2d32] hover:bg-[#ff2d32]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                </svg>
              </a>

              {/* Instagram */}

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#ff2d32] hover:bg-[#ff2d32]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* X */}

              <a
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#ff2d32] hover:bg-[#ff2d32]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.2 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.7h1.7L7.7 4.2H5.9l11.9 15.5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* =====================================================
              SHOP
          ===================================================== */}

          <div className="col-span-1">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide">
              Shop
            </h3>

            <nav className="flex flex-col gap-2">
              <Link
                href="/shop"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                Collections
              </Link>

              <Link
                href="/customize"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                Custom Tees
              </Link>

              <Link
                href="/shop"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                New Arrivals
              </Link>

              <Link
                href="/contact"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                Bulk Orders
              </Link>
            </nav>
          </div>

          {/* =====================================================
              COMPANY
          ===================================================== */}

          <div className="col-span-1">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide">
              Company
            </h3>

            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                About Us
              </Link>

              <Link
                href="/privacy"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/faqs"
                className="text-[12px] text-white/55 transition-colors hover:text-[#ff2d32]"
              >
                FAQs
              </Link>
            </nav>
          </div>

          {/* =====================================================
              CONTACT
          ===================================================== */}

          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-sm font-black uppercase tracking-wide">
              Contact
            </h3>

            <div className="flex flex-col gap-2.5">
              {/* Phone */}

              <a
                href="tel:+917845721716"
                className="flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"
                  />
                </svg>

                <span>+91 78457 21716</span>
              </a>

              {/* Email */}

              <a
                href="mailto:thebackstore@gmail.com"
                className="flex items-center gap-2 text-[12px] text-white/55 transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4 7 8 6 8-6"
                  />
                </svg>

                <span className="break-all">
                  thebackstore@gmail.com
                </span>
              </a>

              {/* Location */}

              <div className="flex items-center gap-2 text-[12px] text-white/55">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0 stroke-current"
                  fill="none"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                  />
                </svg>

                <span>Thanjavur, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            PAYMENT + SHIPPING
        ========================================================= */}

        <div className="border-y border-white/10 py-5">
          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              sm:gap-6
              xl:flex
              xl:items-center
              xl:justify-between
            "
          >
            {/* Payment */}

            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5 xl:items-center">
                <h3
                  className="whitespace-nowrap text-xl font-black uppercase"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  100% SECURE PAYMENT
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold text-white/50">
                  <span>Razorpay</span>
                  <span>G Pay</span>
                  <span>PhonePe</span>
                  <span>paytm</span>
                  <span>UPI</span>
                  <span>BHIM</span>
                  <span>VISA</span>
                  <span>Mastercard</span>
                  <span>RuPay</span>
                </div>
              </div>
            </div>

            {/* Shipping */}

            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <h3
                  className="whitespace-nowrap text-xl font-black uppercase"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  SHIPPING PARTNERS
                </h3>

                <div className="flex items-center gap-5 text-[11px] font-bold text-white/50">
                  <span>INDIA POST</span>

                  <span className="font-black text-[#ff2d32]">
                    FRANCH
                    <span className="text-white/55">
                      EXPRESS
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================= */}

        <div className="flex flex-col gap-2 pt-4 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright 2026 © The Backstore. All Rights Reserved.
          </p>

          <p>
            Made with{" "}
            <span className="text-red-500">❤️</span>{" "}
            in Chennai —{" "}
            <a
              href="https://vigneshashokan.site"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#ff2d32] transition-colors hover:text-white"
            >
              Vicky
            </a>
          </p>
        </div>
      </div>

      {/* =========================================================
          BOTTOM TORN EDGE
      ========================================================= */}

      <div
        className="relative z-10 h-4 bg-white"
        style={{
          clipPath:
            "polygon(0 40%, 8% 10%, 16% 45%, 24% 15%, 33% 48%, 42% 12%, 51% 45%, 60% 17%, 69% 50%, 78% 15%, 87% 45%, 94% 12%, 100% 42%, 100% 100%, 0 100%)",
        }}
      />
    </footer>
  );
}