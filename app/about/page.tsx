"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-white">
      {/* =========================================================
          GLOBAL COMIC BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div className="absolute left-0 top-[12%] h-[1px] w-[35%] rotate-[-8deg] bg-[#ff2d32]/40" />

        <div className="absolute right-0 top-[35%] h-[1px] w-[30%] rotate-[7deg] bg-[#ff2d32]/40" />

        <div className="absolute left-[5%] top-[65%] h-[1px] w-[25%] rotate-[4deg] bg-white/10" />
      </div>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative z-10 px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-36 lg:px-16 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-[1450px]">
          {/* Small comic label */}

          <div className="mb-8 flex items-center gap-4">
            <span className="h-[3px] w-12 bg-[#ff2d32] sm:w-20" />

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-white/60 sm:text-xs">
              The Story Behind The Brand
            </span>
          </div>

          {/* Main title */}

          <div className="relative max-w-[1100px]">
            <h1
              className="text-[clamp(4.2rem,13vw,12rem)] font-black uppercase leading-[0.75] tracking-[-0.07em]"
              style={{
                fontFamily:
                  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                WebkitTextStroke: "3px #000",
                textShadow:
                  "9px 9px 0 #ff2d32, 15px 15px 0 #000",
              }}
            >
              <span className="block text-white">
                ABOUT
              </span>

              <span
                className="block text-[#ff2d32]"
                style={{
                  WebkitTextStroke: "3px #000",
                }}
              >
                THE BACKSTORE.
              </span>
            </h1>

            {/* Comic underline */}

            <div className="mt-8 h-4 w-[75%] rotate-[-2deg] bg-white sm:mt-10 sm:h-5">
              <div className="relative -right-3 -top-1 ml-auto h-7 w-12 -skew-x-12 bg-white" />
            </div>
          </div>

          {/* Intro statement */}

          <p className="mt-12 max-w-2xl text-base font-bold uppercase leading-relaxed tracking-[0.08em] text-white/80 sm:text-lg lg:text-xl">
            A creative idea that started with passion,
            became clothing, and grew into a brand.
          </p>
        </div>
      </section>

      {/* =========================================================
          ORIGIN SECTION
      ========================================================= */}

      <section className="relative z-10 px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-stretch">
          {/* =====================================================
              LEFT — ORIGIN CARD
          ===================================================== */}

          <div className="relative">
            {/* Red offset */}

            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#ff2d32]" />

            {/* Main card */}

            <div
              className="relative h-full min-h-[360px] border-[4px] border-black bg-white p-7 text-black sm:p-10"
              style={{
                clipPath:
                  "polygon(1% 2%, 17% 0, 31% 2%, 47% 0, 64% 3%, 81% 1%, 99% 4%, 97% 94%, 82% 98%, 65% 95%, 49% 100%, 32% 96%, 17% 99%, 2% 95%)",
              }}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">
                    Origin Story
                  </p>

                  <div className="mt-5 h-[4px] w-16 bg-[#ff2d32]" />
                </div>

                <div className="my-10">
                  <span
                    className="block text-[clamp(6rem,15vw,11rem)] font-black leading-[0.75] tracking-[-0.08em]"
                    style={{
                      fontFamily:
                        "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                    }}
                  >
                    2026
                  </span>

                  <p className="mt-5 text-lg font-black uppercase tracking-[0.08em] sm:text-xl">
                    Started in
                    <br />
                    Thanjavur.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t-2 border-black pt-4">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em]">
                    Tamil Nadu
                  </span>

                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em]">
                    India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — STORY
          ===================================================== */}

          <div className="relative border-l-4 border-[#ff2d32] pl-6 sm:pl-10 lg:pl-14">
            {/* Section label */}

            <div className="mb-7 inline-block border-2 border-black bg-[#ff2d32] px-5 py-3 text-black shadow-[5px_5px_0_#fff]">
              <span
                className="text-xl font-black uppercase sm:text-2xl"
                style={{
                  fontFamily:
                    "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                }}
              >
                HOW IT STARTED
              </span>
            </div>

            <div className="space-y-7 text-sm font-medium leading-[1.9] text-white/75 sm:text-base lg:text-lg">
              <p>
                The Backstore was born from a simple passion —
                creating designs around the things I genuinely
                love.
              </p>

              <p>
                I started my creative journey by making fan-made
                edits inspired by cinema, sports, iconic
                personalities and the culture around me. What
                began as a creative outlet slowly turned into
                something I wanted to put on clothing.
              </p>

              <p>
                With my experience in graphic design and DTF
                printing, I started bringing these ideas to life
                through T-shirts. Every design is created,
                refined and printed with the intention of making
                something that feels personal — not just another
                piece of clothing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FULL-WIDTH RED COMIC PANEL
      ========================================================= */}

      <section className="relative z-10 my-16 overflow-hidden bg-[#ff2d32] px-5 py-20 text-black sm:px-10 lg:my-24 lg:px-16 lg:py-28">
        {/* Halftone */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.3px, transparent 1.3px)",
            backgroundSize: "13px 13px",
          }}
        />

        {/* Decorative burst */}

        <div
          className="pointer-events-none absolute right-[-10%] top-[-30%] h-[600px] w-[600px] opacity-[0.12]"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, #000 0deg 5deg, transparent 5deg 14deg)",
          }}
        />

        <div className="relative mx-auto max-w-[1450px]">
          <div className="max-w-5xl">
            <div className="mb-8 flex items-center gap-4">
              <span className="h-[3px] w-16 bg-black" />

              <span className="font-mono text-[10px] font-black uppercase tracking-[0.35em]">
                The Philosophy
              </span>
            </div>

            <h2
              className="text-[clamp(3.5rem,9vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]"
              style={{
                fontFamily:
                  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                textShadow:
                  "7px 7px 0 #fff, 12px 12px 0 #000",
              }}
            >
              CREATIVITY.
              <br />
              STREETWEAR.
              <br />
              FANDOM.
            </h2>

            <div className="mt-12 max-w-3xl border-l-[6px] border-black pl-6 sm:pl-10">
              <p className="text-base font-black uppercase leading-relaxed tracking-[0.06em] sm:text-lg lg:text-xl">
                The Backstore is my way of combining creativity,
                streetwear and fandom into something people can
                actually wear and connect with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          DESIGN PHILOSOPHY
      ========================================================= */}

      <section className="relative z-10 px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1450px]">
          {/* Heading */}

          <div className="mb-14 flex items-end justify-between gap-5">
            <div>
              <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#ff2d32]">
                Built Different
              </p>

              <h2
                className="text-[clamp(3rem,7vw,7rem)] font-black uppercase leading-[0.8] tracking-[-0.06em]"
                style={{
                  fontFamily:
                    "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  textShadow:
                    "5px 5px 0 #ff2d32, 9px 9px 0 #000",
                }}
              >
                THE IDEA
              </h2>
            </div>

            <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 sm:block">
              01 / 03
            </span>
          </div>

          {/* Comic cards */}

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 01 */}

            <div className="group relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#ff2d32]" />

              <div className="relative min-h-[260px] border-[3px] border-black bg-white p-7 text-black transition-transform duration-300 group-hover:-translate-y-2">
                <span className="font-mono text-xs font-black">
                  01
                </span>

                <h3
                  className="mt-10 text-4xl font-black uppercase leading-none"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  CREATE
                  <br />
                  WHAT YOU
                  <br />
                  LOVE.
                </h3>
              </div>
            </div>

            {/* Card 02 */}

            <div className="group relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-white" />

              <div className="relative min-h-[260px] border-[3px] border-black bg-[#ff2d32] p-7 text-black transition-transform duration-300 group-hover:-translate-y-2">
                <span className="font-mono text-xs font-black">
                  02
                </span>

                <h3
                  className="mt-10 text-4xl font-black uppercase leading-none"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  MAKE IT
                  <br />
                  PERSONAL.
                </h3>
              </div>
            </div>

            {/* Card 03 */}

            <div className="group relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#ff2d32]" />

              <div className="relative min-h-[260px] border-[3px] border-white bg-black p-7 text-white transition-transform duration-300 group-hover:-translate-y-2">
                <span className="font-mono text-xs font-black text-[#ff2d32]">
                  03
                </span>

                <h3
                  className="mt-10 text-4xl font-black uppercase leading-none"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  WEAR
                  <br />
                  YOUR
                  <br />
                  IDENTITY.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOUNDER SECTION
      ========================================================= */}

      <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1450px]">
          <div className="relative overflow-hidden border-[4px] border-white bg-black">
            {/* Red side */}

            <div className="absolute right-0 top-0 h-full w-[28%] bg-[#ff2d32]" />

            {/* Halftone */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />

            <div className="relative grid items-center lg:grid-cols-[0.65fr_1.35fr]">
              {/* Founder badge */}

              <div className="relative flex min-h-[350px] items-center justify-center p-8">
                <div className="relative">
                  <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-full bg-black" />

                  <div className="relative flex h-56 w-56 rotate-[-5deg] items-center justify-center rounded-full border-[6px] border-black bg-[#ff2d32] text-center shadow-[8px_8px_0_#fff] sm:h-64 sm:w-64">
                    <div>
                      <p className="font-mono text-[9px] font-black uppercase tracking-[0.3em]">
                        Founder
                      </p>

                      <h3
                        className="mt-3 text-5xl font-black uppercase leading-none"
                        style={{
                          fontFamily:
                            "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                        }}
                      >
                        NIVAS
                      </h3>

                      <p className="mt-4 font-mono text-[9px] font-black uppercase tracking-[0.25em]">
                        The Backstore
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder story */}

              <div className="relative p-8 sm:p-12 lg:p-16">
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-[3px] w-12 bg-[#ff2d32]" />

                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                    From The Founder
                  </span>
                </div>

                <p className="max-w-3xl text-base font-medium leading-[1.9] text-white/75 sm:text-lg">
                  This brand is built from my own ideas,
                  experiments and love for design — and it&apos;s
                  still growing, one design at a time.
                </p>

                <div className="mt-10">
                  <p
                    className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] text-white"
                    style={{
                      fontFamily:
                        "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                    }}
                  >
                    MADE FROM
                    <br />
                    <span className="text-[#ff2d32]">
                      PASSION.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL STATEMENT
      ========================================================= */}

      <section className="relative z-10 overflow-hidden px-5 pb-28 pt-10 sm:px-8 lg:px-16 lg:pb-36">
        <div className="mx-auto max-w-[1450px]">
          <div className="relative border-t-4 border-[#ff2d32] pt-12">
            <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">
              And this is only the beginning.
            </p>

            <h2
              className="max-w-6xl text-[clamp(3.5rem,9vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.07em]"
              style={{
                fontFamily:
                  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                WebkitTextStroke: "2px #000",
                textShadow:
                  "7px 7px 0 #ff2d32, 13px 13px 0 #000",
              }}
            >
              THIS IS
              <br />
              THE BACKSTORE.
            </h2>

            <div className="mt-12 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm font-bold uppercase leading-relaxed tracking-[0.1em] text-white/70 sm:text-base">
                Made from passion.
                <br />
                Worn with identity.
              </p>

              <Link
                href="/shop"
                className="group inline-flex w-fit items-center border-[3px] border-black bg-[#ff2d32] px-7 py-4 font-black uppercase text-black shadow-[6px_6px_0_#fff] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_#fff]"
              >
                <span>
                  Explore The Store
                </span>

                <span className="ml-5 text-xl transition-transform duration-200 group-hover:translate-x-2">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM COMIC EDGE
      ========================================================= */}

      <div
        className="relative z-10 h-8 bg-white"
        style={{
          clipPath:
            "polygon(0 15%, 7% 45%, 14% 25%, 22% 55%, 31% 20%, 40% 50%, 50% 15%, 60% 52%, 70% 22%, 80% 48%, 90% 18%, 100% 45%, 100% 100%, 0 100%)",
        }}
      />
    </main>
  );
}