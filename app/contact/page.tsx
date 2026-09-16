"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Halftone */}

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />

        {/* Red comic panel */}

        <div
          className="absolute right-[-18%] top-[10%] h-[650px] w-[650px] rotate-[7deg] bg-[#ff2d32] opacity-90"
          style={{
            clipPath:
              "polygon(3% 7%, 18% 2%, 34% 7%, 49% 1%, 66% 6%, 82% 3%, 98% 8%, 94% 92%, 79% 88%, 62% 97%, 46% 91%, 30% 97%, 14% 91%, 2% 96%)",
          }}
        />

        {/* Speed lines */}

        <div className="absolute left-[-5%] top-[27%] h-[3px] w-[35%] rotate-[-7deg] bg-[#ff2d32]/40" />

        <div className="absolute left-[-5%] top-[31%] h-[2px] w-[28%] rotate-[-7deg] bg-white/10" />

        <div className="absolute right-[-5%] top-[60%] h-[2px] w-[30%] rotate-[8deg] bg-black/30" />
      </div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative z-10 px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-16 lg:pb-20 lg:pt-36">
        <div className="mx-auto max-w-[1450px]">
          {/* Label */}

          <div className="mb-7 flex items-center gap-4">
            <span className="h-[3px] w-12 bg-[#ff2d32] sm:w-16" />

            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.35em] text-white/50 sm:text-[10px]">
              We&apos;re here to help
            </span>
          </div>

          {/* Heading */}

          <h1
            className="max-w-6xl text-[clamp(4rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.07em]"
            style={{
              fontFamily:
                "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
              WebkitTextStroke: "3px #000",
              textShadow:
                "8px 8px 0 #ff2d32, 14px 14px 0 #000",
            }}
          >
            TALK
            <br />
            <span className="text-[#ff2d32]">
              TO US.
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-sm font-medium leading-7 text-white/65 sm:text-base lg:text-lg">
            Got a question about an order, a product, custom
            tees or anything else?
            <br />
            Drop us a message. We&apos;ll get back to you.
          </p>
        </div>
      </section>

      {/* =========================================================
          CONTACT CONTENT
      ========================================================= */}

      <section className="relative z-10 px-5 pb-20 sm:px-8 lg:px-16 lg:pb-28">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          {/* =====================================================
              CONTACT DETAILS
          ===================================================== */}

          <div className="relative">
            {/* Red offset */}

            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#ff2d32]" />

            <div
              className="relative border-[3px] border-black bg-white p-7 text-black sm:p-9"
              style={{
                clipPath:
                  "polygon(1% 2%, 17% 0, 32% 2%, 48% 0, 64% 3%, 82% 1%, 99% 4%, 97% 96%, 82% 98%, 65% 95%, 49% 100%, 32% 96%, 17% 99%, 2% 95%)",
              }}
            >
              <div className="flex h-full flex-col">
                {/* Label */}

                <div className="mb-8">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em]">
                    Contact HQ
                  </p>

                  <div className="mt-4 h-[4px] w-14 bg-[#ff2d32]" />
                </div>

                {/* Phone */}

                <div className="border-b-2 border-black/10 py-5 first:pt-0">
                  <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.25em] text-black/45">
                    Call us
                  </p>

                  <a
                    href="tel:+917845721716"
                    className="text-lg font-black transition-colors hover:text-[#ff2d32] sm:text-xl"
                  >
                    +91 78457 21716
                  </a>
                </div>

                {/* Email */}

                <div className="border-b-2 border-black/10 py-5">
                  <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.25em] text-black/45">
                    Email us
                  </p>

                  <a
                    href="mailto:thebackstore@gmail.com"
                    className="break-all text-base font-black transition-colors hover:text-[#ff2d32] sm:text-lg"
                  >
                    thebackstore@gmail.com
                  </a>
                </div>

                {/* Location */}

                <div className="py-5">
                  <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.25em] text-black/45">
                    Find us
                  </p>

                  <p className="text-base font-black sm:text-lg">
                    Thanjavur,
                    <br />
                    Tamil Nadu, India
                  </p>
                </div>

                {/* Social */}

                <div className="mt-auto pt-6">
                  <p className="mb-4 font-mono text-[9px] font-black uppercase tracking-[0.25em] text-black/45">
                    Follow the pack
                  </p>

                  <div className="flex gap-2">
                    <a
                      href="#"
                      aria-label="YouTube"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-white transition-all hover:-translate-y-1 hover:bg-[#ff2d32] hover:text-black"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.5 3.9-6.5 3.9Z" />
                      </svg>
                    </a>

                    <a
                      href="#"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-white transition-all hover:-translate-y-1 hover:bg-[#ff2d32] hover:text-black"
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

                    <a
                      href="#"
                      aria-label="X"
                      className="flex h-10 w-10 items-center justify-center border-2 border-black bg-black text-white transition-all hover:-translate-y-1 hover:bg-[#ff2d32] hover:text-black"
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
              </div>
            </div>
          </div>

          {/* =====================================================
              CONTACT FORM
          ===================================================== */}

          <div className="relative">
            {/* Comic shadow */}

            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#ff2d32]" />

            <div className="relative border-[3px] border-black bg-white p-6 text-black sm:p-9 lg:p-11">
              {/* Form header */}

              <div className="mb-8 flex items-end justify-between gap-5 border-b-2 border-black pb-6">
                <div>
                  <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.3em] text-black/45">
                    Message us
                  </p>

                  <h2
                    className="text-4xl font-black uppercase leading-none sm:text-5xl"
                    style={{
                      fontFamily:
                        "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                    }}
                  >
                    SEND A
                    <br />
                    MESSAGE.
                  </h2>
                </div>

                <span className="hidden font-mono text-[10px] font-black text-black/30 sm:block">
                  01 / 01
                </span>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Name + Email */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block font-mono text-[9px] font-black uppercase tracking-[0.25em]"
                    >
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="ENTER YOUR NAME"
                      className="w-full border-2 border-black bg-[#f5f5f5] px-4 py-3 text-xs font-bold uppercase outline-none transition-all placeholder:text-black/35 focus:border-[#ff2d32] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-mono text-[9px] font-black uppercase tracking-[0.25em]"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="YOUR EMAIL"
                      className="w-full border-2 border-black bg-[#f5f5f5] px-4 py-3 text-xs font-bold uppercase outline-none transition-all placeholder:text-black/35 focus:border-[#ff2d32] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Subject */}

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block font-mono text-[9px] font-black uppercase tracking-[0.25em]"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    defaultValue=""
                    required
                    className="w-full appearance-none border-2 border-black bg-[#f5f5f5] px-4 py-3 text-xs font-bold uppercase outline-none transition-all focus:border-[#ff2d32] focus:bg-white"
                  >
                    <option
                      value=""
                      disabled
                    >
                      SELECT A TOPIC
                    </option>

                    <option value="order">
                      Order Enquiry
                    </option>

                    <option value="product">
                      Product Enquiry
                    </option>

                    <option value="custom">
                      Custom Tee
                    </option>

                    <option value="bulk">
                      Bulk Order
                    </option>

                    <option value="other">
                      Something Else
                    </option>
                  </select>
                </div>

                {/* Message */}

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-[9px] font-black uppercase tracking-[0.25em]"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="TELL US WHAT'S ON YOUR MIND..."
                    className="w-full resize-none border-2 border-black bg-[#f5f5f5] px-4 py-3 text-xs font-bold uppercase leading-6 outline-none transition-all placeholder:text-black/35 focus:border-[#ff2d32] focus:bg-white"
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center border-[3px] border-black bg-[#ff2d32] px-6 py-4 text-sm font-black uppercase shadow-[5px_5px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_#000]"
                >
                  <span>
                    {submitted
                      ? "MESSAGE SENT ✓"
                      : "SEND MESSAGE"}
                  </span>

                  {!submitted && (
                    <span className="ml-5 text-xl transition-transform duration-200 group-hover:translate-x-2">
                      →
                    </span>
                  )}
                </button>

                {submitted && (
                  <p className="text-center font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#ff2d32]">
                    Thanks! We&apos;ll get back to you soon.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          QUICK HELP STRIP
      ========================================================= */}

      <section className="relative z-10 bg-[#ff2d32] px-5 py-10 text-black sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em]">
              Looking for something else?
            </p>

            <h2
              className="mt-2 text-4xl font-black uppercase leading-none sm:text-5xl"
              style={{
                fontFamily:
                  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
              }}
            >
              CHECK THE FAQS.
            </h2>
          </div>

          <Link
            href="/faqs"
            className="group flex w-fit items-center border-[3px] border-black bg-white px-6 py-3 text-sm font-black uppercase shadow-[5px_5px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#000]"
          >
            View FAQs

            <span className="ml-5 text-xl transition-transform group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* =========================================================
          BOTTOM TORN EDGE
      ========================================================= */}

      <div
        className="relative z-10 h-6 bg-white"
        style={{
          clipPath:
            "polygon(0 35%, 8% 10%, 16% 45%, 24% 15%, 33% 48%, 42% 12%, 51% 45%, 60% 17%, 69% 50%, 78% 15%, 87% 45%, 94% 12%, 100% 42%, 100% 100%, 0 100%)",
        }}
      />
    </main>
  );
}