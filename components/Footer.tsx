"use client";

import Link from "next/link";

/* ============================================================
   ICONS
============================================================ */

function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="7.1" cy="7.1" rx="2.05" ry="2.75" />
      <ellipse cx="12" cy="5.1" rx="2.05" ry="2.8" />
      <ellipse cx="16.9" cy="7.1" rx="2.05" ry="2.75" />
      <path d="M12 10.2c-3.25 0-5.85 2.3-5.85 5.05 0 2.15 1.7 3.25 3.6 2.65 1-.3 1.55-1.05 2.25-1.05s1.25.75 2.25 1.05c1.9.6 3.6-.5 3.6-2.65 0-2.75-2.6-5.05-5.85-5.05Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .4 5.2.4 11.7c0 2 .5 4 1.5 5.7L.3 23.7l6.5-1.6a11.7 11.7 0 0 0 5.3 1.3h.1c6.4 0 11.7-5.2 11.7-11.7 0-3.1-1.2-6-3.4-8.2Z" />
      <path d="M8.1 6.6c-.3-.6-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .5-.3.4-1.3 1.2-1.3 3s1.3 3.5 1.5 3.7c.2.3 2.5 4 6.1 5.4 3 .? 3.6.3 4.2.2.6-.1 2-0.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.7-.4-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-.9 1.3-.2.2-.3.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.7-.9-2.3Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
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
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

/* ============================================================
   PAYMENT BADGES
============================================================ */

const paymentMethods = [
  { name: "BHIM", src: "/images/footer/bhim.png" },
  { name: "G Pay", src: "/images/footer/gpay.png" },
  { name: "Paytm", src: "/images/footer/paytm.png" },
  { name: "PhonePe", src: "/images/footer/phonepe.png" },
  { name: "Razorpay", src: "/images/footer/razorpay.png" },
  { name: "RuPay", src: "/images/footer/rupay.png" },
  { name: "UPI", src: "/images/footer/upi.png" },
  { name: "VISA", src: "/images/footer/visa.png" },
];

/* ============================================================
   FOOTER
============================================================ */

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#424141] text-[#CBCAC8]">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                #CBCAC8 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                #CBCAC8 1px,
                transparent 1px
              )
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Paw/dot texture */}

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #CBCAC8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Very subtle red glow */}

        <div className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-[#DA0D12]/[0.035] blur-[130px]" />

        <div className="absolute -left-40 bottom-[-200px] h-[400px] w-[400px] rounded-full bg-[#80060B]/[0.03] blur-[130px]" />
      </div>

      {/* ======================================================
          PACK PROMISE STRIP
      ====================================================== */}

      <div className="relative z-10 border-y border-[#CBCAC8]/8 bg-[#424141]/30">
        <div className="mx-auto flex max-w-[1450px] items-center justify-center gap-3 px-5 py-3 sm:px-8">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/10">
            <PawIcon className="h-3 w-3 text-[#DA0D12]" />
          </span>

          <div>
            <p className="font-mono text-[6px] uppercase tracking-[0.28em] text-[#DA0D12]">
              The Backstore Promise
            </p>

            <p className="mt-0.5 text-[9px] text-[#CBCAC8]/65">
              Original designs. Relaxed fits. Made for the pack.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN FOOTER CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1450px] px-5 py-9 sm:px-8 sm:py-10 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr] lg:gap-12">
          {/* ==================================================
              BRAND
          ================================================== */}

          <div>
            {/* Logo */}

            <Link
              href="/"
              className="group relative inline-block h-[72px] w-[155px]"
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-[#DA0D12]
                  transition-transform
                  duration-300
                  group-hover:scale-[1.025]
                "
                style={{
                  clipPath:
                    "polygon(4% 10%, 17% 5%, 31% 9%, 46% 3%, 62% 8%, 78% 4%, 96% 9%, 92% 91%, 76% 87%, 60% 96%, 44% 90%, 28% 97%, 12% 90%, 3% 95%)",
                }}
              />

              <img
                src="/logo/backstore-logo.png"
                alt="The Backstore"
                className="relative z-10 h-[82px] w-full object-contain"
              />
            </Link>

            <p className="mt-4 max-w-[300px] text-[10px] leading-[1.7] text-[#666362]">
              Original designs for people who move differently. Relaxed fits,
              bold identity and a little attitude — made for the ones who have
              their own way.
            </p>

            {/* Social */}

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.instagram.com/backstore.in?stkn=c2F4d3NmNHZtNDIz&utm_source=qr"
                aria-label="Instagram"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#CBCAC8]/10
                  bg-[#424141]/20
                  text-[#666362]
                  transition-all
                  duration-300
                  hover:border-[#DA0D12]/40
                  hover:bg-[#DA0D12]
                  hover:text-[#CBCAC8]
                "
              >
                <InstagramIcon />
              </a>

              <a
                href="https://wa.me/message/EHQ3ZIHL7VS2C1"
                aria-label="WhatsApp"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#CBCAC8]/10
                  bg-[#424141]/20
                  text-[#666362]
                  transition-all
                  duration-300
                  hover:border-[#DA0D12]/40
                  hover:bg-[#DA0D12]
                  hover:text-[#CBCAC8]
                "
              >
                <WhatsappIcon />
              </a>

              <a
                href="https://youtube.com/@allways_chiro?si=5rlQfviNSwXrzxwH"
                aria-label="YouTube"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#CBCAC8]/10
                  bg-[#424141]/20
                  text-[#666362]
                  transition-all
                  duration-300
                  hover:border-[#DA0D12]/40
                  hover:bg-[#DA0D12]
                  hover:text-[#CBCAC8]
                "
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* ==================================================
              EXPLORE
          ================================================== */}

          <div className="col-span-1 col-start-1 lg:col-span-1 lg:col-start-2">
            <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.28em] text-[#DA0D12]">
              Explore
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Shop
              </Link>

              <Link
                href="/about"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                About
              </Link>

              <Link
                href="/customize"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Customize
              </Link>

              <Link
                href="/contact"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* ==================================================
              SHOP / CUSTOMER CARE
          ================================================== */}

          <div className="col-span-1 col-start-2 lg:col-span-1 lg:col-start-3">
            <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.28em] text-[#DA0D12]">
              Shop
            </p>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                All Products
              </Link>

              <Link
                href="/shop"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                New Arrivals
              </Link>

              <Link
                href="/customize"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Custom Tees
              </Link>
            </nav>

            <p className="mt-7 font-mono text-[7px] font-semibold uppercase tracking-[0.28em] text-[#DA0D12]">
              Customer Care
            </p>

            <nav className="mt-4 flex flex-col gap-3">
              <Link
                href="#"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/contact"
                className="text-[10px] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                FAQs
              </Link>
            </nav>
          </div>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <div className="col-span-2 lg:col-span-1">
            <p className="font-mono text-[7px] font-semibold uppercase tracking-[0.28em] text-[#DA0D12]">
              Contact Us
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {/* Phone */}

              <a href="tel:+917845721716" className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#424141]/70 text-[#DA0D12]">
                  <PhoneIcon />
                </span>

                <span>
                  <span className="block font-mono text-[6px] uppercase tracking-[0.18em] text-[#666362]">
                    Phone
                  </span>

                  <span className="mt-0.5 block text-[9px] text-[#CBCAC8]/70">
                    +91 78457 21716
                  </span>
                </span>
              </a>

              {/* Email */}

              <a
                href="mailto:thebackstore@gmail.com"
                className="flex items-center gap-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#424141]/70 text-[#DA0D12]">
                  <MailIcon />
                </span>

                <span>
                  <span className="block font-mono text-[6px] uppercase tracking-[0.18em] text-[#666362]">
                    Email
                  </span>

                  <span className="mt-0.5 block break-all text-[9px] text-[#CBCAC8]/70">
                    thebackstore@gmail.com
                  </span>
                </span>
              </a>

              {/* Location */}

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#424141]/70 text-[#DA0D12]">
                  <LocationIcon />
                </span>

                <span>
                  <span className="block font-mono text-[6px] uppercase tracking-[0.18em] text-[#666362]">
                    Location
                  </span>

                  <span className="mt-0.5 block text-[9px] text-[#CBCAC8]/70">
                    Thanjavur, Tamil Nadu, India
                  </span>
                </span>
              </div>
            </div>

            {/* Location link */}

            <a
              href="https://maps.google.com/?q=Thanjavur,Tamil+Nadu,India"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4
                inline-flex
                items-center
                gap-1
                font-mono
                text-[6px]
                uppercase
                tracking-[0.18em]
                text-[#DA0D12]
                transition-colors
                hover:text-[#CBCAC8]
              "
            >
              View on Google Maps
              <ArrowUpRightIcon />
            </a>

            {/* Map */}

            <a
              href="https://maps.google.com/?q=Thanjavur,Tamil+Nadu,India"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                relative
                mt-4
                block
                h-[105px]
                overflow-hidden
                rounded-[14px]
                border
                border-[#CBCAC8]/10
                bg-[#424141]
              "
            >
              {/* Map-style background */}

              <div
                className="
                  absolute
                  inset-0
                  opacity-30
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
                style={{
                  backgroundImage: `
                    linear-gradient(
                      25deg,
                      transparent 42%,
                      #CBCAC8 43%,
                      #CBCAC8 44%,
                      transparent 45%
                    ),
                    linear-gradient(
                      110deg,
                      transparent 35%,
                      #CBCAC8 36%,
                      #CBCAC8 37%,
                      transparent 38%
                    ),
                    linear-gradient(
                      90deg,
                      transparent 70%,
                      #666362 71%,
                      #666362 72%,
                      transparent 73%
                    )
                  `,
                  backgroundColor: "#424141",
                  backgroundSize: "90px 70px",
                }}
              />

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#CBCAC8 1px, transparent 1px), linear-gradient(90deg, #CBCAC8 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Location pin */}

              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DA0D12] shadow-lg shadow-black/30">
                  <PawIcon className="h-4 w-4 text-[#CBCAC8]" />
                </div>

                <div className="mt-1 rounded-full bg-[#161616]/80 px-2 py-0.5 font-mono text-[5px] uppercase tracking-[0.15em] text-[#CBCAC8] backdrop-blur-sm">
                  The Backstore
                </div>
              </div>

              {/* Map overlay */}

              <div className="absolute bottom-2 left-2 rounded-md bg-[#161616]/75 px-2 py-1 font-mono text-[5px] uppercase tracking-[0.15em] text-[#CBCAC8]/60 backdrop-blur-sm">
                Thanjavur · India
              </div>
            </a>
          </div>
        </div>

        {/* ======================================================
            PAYMENT / SHIPPING
        ====================================================== */}

        <div className="mt-9 border-t border-[#CBCAC8]/10 pt-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Payments */}

            <div>
              <div className="mb-2">
                <p className="font-mono text-[6px] font-semibold uppercase tracking-[0.25em] text-[#DA0D12]">
                  Secure Payments
                </p>

                <p className="mt-0.5 text-[7px] text-[#666362]">
                  Multiple payment options
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="
                      flex
                      h-9
                      min-w-[52px]
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-[#CBCAC8]/10
                      bg-[#CBCAC8]/5
                      px-2.5
                      transition-all
                      duration-300
                      hover:border-[#DA0D12]/30
                      hover:bg-[#CBCAC8]/10
                    "
                  >
                    <img
                      src={method.src}
                      alt={method.name}
                      className="h-6 w-auto max-w-[48px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}

            <div
              className="
                flex
                items-center
                gap-4
                rounded-[14px]
                border
                border-[#CBCAC8]/10
                bg-[#424141]/30
                px-4
                py-3
              "
            >
              <div>
                <p className="font-mono text-[6px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12]">
                  Shipping Partner
                </p>

                <p className="mt-1 text-[7px] text-[#666362]">
                  Delivering across India
                </p>
              </div>

              <div className="flex h-10 min-w-[92px] items-center justify-center rounded-lg border border-[#CBCAC8]/10 bg-[#CBCAC8]/5 px-3">
                <img
                  src="/images/footer/st-courier.png"
                  alt="ST Courier"
                  className="h-7 w-auto max-w-[76px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="mt-5 flex flex-col items-center justify-center gap-3 border-t border-[#CBCAC8]/10 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-center text-[11px] font-medium text-[#8A8886] sm:text-left">
            © 2026 The Backstore. All Rights Reserved.
          </p>

          <div className="flex items-center justify-center gap-2 text-center">
            <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />

            <span className="text-[11px] font-medium text-[#8A8886]">
              Made with <span className="text-[#DA0D12]">♥</span> in Chennai —{" "}
              <a
                href="https://vigneshashokan.site"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#DA0D12",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  fontWeight: 600,
                }}
                className="transition-opacity hover:opacity-75"
              >
                Vicky
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================
          BOTTOM ACCENT
      ====================================================== */}

      <div className="relative z-10 h-[2px] bg-[#DA0D12]/50" />
    </footer>
  );
}
