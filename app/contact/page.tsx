"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="32" cy="39" rx="14" ry="12" fill="currentColor" />

      <ellipse
        cx="17"
        cy="25"
        rx="6.5"
        ry="9"
        transform="rotate(-24 17 25)"
        fill="currentColor"
      />

      <ellipse
        cx="27"
        cy="18"
        rx="6.5"
        ry="9"
        transform="rotate(-8 27 18)"
        fill="currentColor"
      />

      <ellipse
        cx="39"
        cy="18"
        rx="6.5"
        ry="9"
        transform="rotate(8 39 18)"
        fill="currentColor"
      />

      <ellipse
        cx="49"
        cy="25"
        rx="6.5"
        ry="9"
        transform="rotate(24 49 25)"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 19 19 5" />
      <path d="M8 5h11v11" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7.2 3.5 4.8 4.7a2 2 0 0 0-1 2.3c1.2 5.4 7.8 11 13.2 12.2a2 2 0 0 0 2.3-1l1.2-2.4a1.5 1.5 0 0 0-.6-1.9l-3.2-1.9a1.5 1.5 0 0 0-1.9.3l-1.2 1.5a14.4 14.4 0 0 1-4.8-4.8l1.5-1.2a1.5 1.5 0 0 0 .3-1.9L8.9 4.1a1.5 1.5 0 0 0-1.7-.6Z" />
    </svg>
  );
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.2 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.7h1.7L7.7 4.2H5.9l11.9 15.5Z" />
    </svg>
  );
}

function DotsPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.055]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #CBCAC8 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
      aria-hidden="true"
    />
  );
}

function SectionEyebrow({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#666362] sm:justify-start">
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-2 text-[#CBCAC8]">
        {number}
      </span>

      <span>{children}</span>

      <span className="h-px w-8 bg-[#DA0D12]/70" />
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#161616] text-[#CBCAC8]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
        <DotsPattern />

        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#DA0D12]/10 blur-[120px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#80060B]/10 blur-[110px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#DA0D12]/10 text-[#DA0D12]">
                <PawIcon className="h-5 w-5" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
                We&apos;re here to help
              </span>
            </div>

            <h1 className="font-display text-[clamp(4.5rem,12vw,10rem)] leading-[0.76] tracking-[-0.045em] text-[#CBCAC8]">
              TALK
              <span className="block text-[#DA0D12]">TO US.</span>
            </h1>

            <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#DA0D12] to-transparent" />

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-[#666362] sm:text-base sm:leading-9">
              Got a question about an order, a product, custom tees or anything
              else?
              <br className="hidden sm:block" />
              Drop us a message. We&apos;ll get back to you.
            </p>
          </div>

          {/* Quick contact pills */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+917845721716"
              className="group inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#424141]/25 px-4 py-3 text-xs text-[#CBCAC8] backdrop-blur-xl transition duration-300 hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/[0.06]"
            >
              <PhoneIcon className="h-4 w-4 text-[#DA0D12]" />
              +91 78457 21716
            </a>

            <a
              href="mailto:thebackstore@gmail.com"
              className="group inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#424141]/25 px-4 py-3 text-xs text-[#CBCAC8] backdrop-blur-xl transition duration-300 hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/[0.06]"
            >
              <MailIcon className="h-4 w-4 text-[#DA0D12]" />
              thebackstore@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CONTENT
      ========================================================= */}
      <section className="relative border-y border-white/[0.06] bg-[#080808] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <DotsPattern />

        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-8">
          {/* =====================================================
              CONTACT DETAILS
          ===================================================== */}
          <div className="flex flex-col">
            <SectionEyebrow number="01">Contact HQ</SectionEyebrow>

            <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#424141]/20 p-7 backdrop-blur-xl sm:p-9">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DA0D12]/10 text-[#DA0D12]">
                  <PawIcon className="h-6 w-6" />
                </div>

                <h2 className="mt-7 font-display text-5xl leading-[0.85] tracking-wide text-[#CBCAC8] sm:text-6xl">
                  FIND
                  <span className="block text-[#DA0D12]">THE PACK.</span>
                </h2>

                <p className="mt-6 text-sm leading-7 text-[#666362]">
                  Whether you need help with an order or simply want to say
                  hello, our inbox is open.
                </p>
              </div>

              <div className="mt-10 space-y-0">
                {/* Phone */}
                <a
                  href="tel:+917845721716"
                  className="group flex items-center gap-4 border-t border-white/[0.07] py-5 transition-colors hover:border-[#DA0D12]/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#161616] text-[#DA0D12] transition-colors group-hover:bg-[#DA0D12] group-hover:text-white">
                    <PhoneIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                      Call us
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#CBCAC8]">
                      +91 78457 21716
                    </p>
                  </div>

                  <ArrowUpRightIcon className="ml-auto h-4 w-4 text-[#666362] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#DA0D12]" />
                </a>

                {/* Email */}
                <a
                  href="mailto:thebackstore@gmail.com"
                  className="group flex items-center gap-4 border-t border-white/[0.07] py-5 transition-colors hover:border-[#DA0D12]/30"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#161616] text-[#DA0D12] transition-colors group-hover:bg-[#DA0D12] group-hover:text-white">
                    <MailIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                      Email us
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-[#CBCAC8]">
                      thebackstore@gmail.com
                    </p>
                  </div>

                  <ArrowUpRightIcon className="ml-auto h-4 w-4 shrink-0 text-[#666362] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#DA0D12]" />
                </a>

                {/* Location */}
                <div className="flex items-center gap-4 border-y border-white/[0.07] py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#161616] text-[#DA0D12]">
                    <MapPinIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                      Find us
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6 text-[#CBCAC8]">
                      Thanjavur,
                      <br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="mt-auto pt-10">
                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                  Follow the pack
                </p>

                <div className="flex gap-2">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#161616] text-[#CBCAC8] transition-all duration-300 hover:-translate-y-1 hover:border-[#DA0D12]/40 hover:bg-[#DA0D12] hover:text-white"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>

                  <a
                    href="#"
                    aria-label="YouTube"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#161616] text-[#CBCAC8] transition-all duration-300 hover:-translate-y-1 hover:border-[#DA0D12]/40 hover:bg-[#DA0D12] hover:text-white"
                  >
                    <YoutubeIcon className="h-4 w-4" />
                  </a>

                  <a
                    href="#"
                    aria-label="X"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#161616] text-[#CBCAC8] transition-all duration-300 hover:-translate-y-1 hover:border-[#DA0D12]/40 hover:bg-[#DA0D12] hover:text-white"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              CONTACT FORM
          ===================================================== */}
          <div>
            <SectionEyebrow number="02">Send a Message</SectionEyebrow>

            <div className="rounded-[2rem] border border-white/[0.07] bg-[#424141]/20 p-6 backdrop-blur-xl sm:p-9 lg:p-11">
              {/* Header */}
              <div className="flex items-start justify-between gap-6 border-b border-white/[0.07] pb-7">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
                    Message us
                  </p>

                  <h2 className="mt-3 font-display text-5xl leading-[0.82] tracking-wide text-[#CBCAC8] sm:text-6xl">
                    SEND A<span className="block text-[#DA0D12]">MESSAGE.</span>
                  </h2>
                </div>

                <div className="hidden text-right sm:block">
                  <PawIcon className="ml-auto h-8 w-8 text-[#DA0D12]/30" />

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#666362]">
                    02 / 02
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Name + Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="ENTER YOUR NAME"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-3.5 text-xs font-medium uppercase tracking-wide text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60 focus:bg-[#161616]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="YOUR EMAIL"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-3.5 text-xs font-medium uppercase tracking-wide text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60 focus:bg-[#161616]"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-3.5 text-xs font-medium uppercase tracking-wide text-[#CBCAC8] outline-none transition-all focus:border-[#DA0D12]/60"
                  >
                    <option value="" disabled>
                      SELECT A TOPIC
                    </option>

                    <option value="order">Order Enquiry</option>
                    <option value="product">Product Enquiry</option>
                    <option value="custom">Custom Tee</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="other">Something Else</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={7}
                    placeholder="TELL US WHAT'S ON YOUR MIND..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-3.5 text-xs font-medium uppercase leading-6 tracking-wide text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-4 rounded-xl bg-[#DA0D12] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#80060B]"
                >
                  <span>{submitted ? "MESSAGE SENT ✓" : "SEND MESSAGE"}</span>

                  {!submitted && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  )}
                </button>

                {submitted && (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/[0.06] px-4 py-3">
                    <PawIcon className="h-4 w-4 text-[#DA0D12]" />

                    <p className="text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12]">
                      Thanks! We&apos;ll get back to you soon.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK HELP
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#424141] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div
          className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#DA0D12]/10 blur-[100px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-black/20 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center sm:flex-row sm:text-left">
          <div>
            <div className="mb-4 flex items-center justify-center gap-3 sm:justify-start">
              <PawIcon className="h-5 w-5 text-[#DA0D12]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#CBCAC8]/50">
                Need quick answers?
              </span>
            </div>

            <h2 className="font-display text-5xl leading-[0.8] tracking-wide text-[#CBCAC8] sm:text-6xl">
              CHECK THE
              <span className="block text-[#DA0D12]">FAQS.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#CBCAC8]/50">
              Find answers about orders, shipping, products, returns and
              everything in between.
            </p>
          </div>

          <Link
            href="/faqs"
            className="group inline-flex shrink-0 items-center gap-4 rounded-full border border-[#DA0D12]/30 bg-[#161616] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#CBCAC8] transition duration-300 hover:border-[#DA0D12] hover:bg-[#DA0D12] hover:text-white"
          >
            View FAQs
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DA0D12] text-white transition-colors group-hover:bg-white group-hover:text-[#DA0D12]">
              <ArrowUpRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#080808] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <DotsPattern />

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DA0D12]/[0.045] blur-[130px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#DA0D12]/25 bg-[#DA0D12]/[0.07] text-[#DA0D12]">
            <PawIcon className="h-7 w-7" />
          </div>

          <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
            Until then
          </p>

          <h2 className="mt-6 font-display text-[clamp(3.8rem,10vw,8rem)] leading-[0.78] tracking-[-0.04em] text-[#CBCAC8]">
            KEEP
            <span className="block text-[#DA0D12]">EXPLORING.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-[#666362] sm:text-base">
            Browse the latest drops and find something that feels like you.
          </p>

          <Link
            href="/shop"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#DA0D12] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#80060B]"
          >
            Explore The Store
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
