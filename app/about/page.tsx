"use client";

import Image from "next/image";
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

function TagIcon({ className = "" }: { className?: string }) {
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
      <path d="M20 13 13 20 4 11V4h7l9 9Z" />
      <circle cx="8" cy="8" r="1.2" />
    </svg>
  );
}

function SparkIcon({ className = "" }: { className?: string }) {
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
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m4.9 4.9 14.2 14.2" />
      <path d="m19.1 4.9-14.2 14.2" />
    </svg>
  );
}

function ShirtIcon({ className = "" }: { className?: string }) {
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
      <path d="m9 4-5 3 3 4 2-1v10h6V10l2 1 3-4-5-3c-.8 1.2-1.8 2-3 2s-2.2-.8-3-2Z" />
      <path d="M9 4c.8 1.2 1.8 2 3 2s2.2-.8 3-2" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
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
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function DotsPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
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
    <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#666362] sm:justify-start">
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-2 text-[#CBCAC8]">
        {number}
      </span>

      <span>{children}</span>

      <span className="h-px w-8 bg-[#DA0D12]/70" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#161616] text-[#CBCAC8]">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative isolate px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-12 lg:pb-32 lg:pt-24">
        <DotsPattern />

        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#DA0D12]/10 blur-[120px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-32 top-32 h-72 w-72 rounded-full bg-[#80060B]/10 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#DA0D12]/10 text-[#DA0D12]">
                <PawIcon className="h-5 w-5" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
                The story behind the brand
              </span>
            </div>

            <h1 className="font-display text-[clamp(4.5rem,13vw,10rem)] leading-[0.78] tracking-[-0.045em] text-[#CBCAC8]">
              ABOUT
              <span className="block text-[#DA0D12]">THE BACKSTORE.</span>
            </h1>

            <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-[#DA0D12] to-transparent" />

            <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-[#666362] sm:text-base sm:leading-8">
              A creative idea that started with passion, became clothing, and
              grew into a brand.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-[#424141]/30 p-5 text-center backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666362]">
                Founded
              </p>

              <p className="mt-2 font-display text-3xl tracking-wide text-[#CBCAC8]">
                2026
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#424141]/30 p-5 text-center backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666362]">
                Born in
              </p>

              <p className="mt-2 font-display text-3xl tracking-wide text-[#CBCAC8]">
                INDIA
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-[#DA0D12]/20 bg-[#DA0D12]/[0.045] p-5 text-center backdrop-blur-xl sm:col-span-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#666362]">
                Built around
              </p>

              <p className="mt-2 font-display text-3xl tracking-wide text-[#DA0D12]">
                PASSION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ORIGIN STORY
      ========================================================= */}
      <section className="relative border-y border-white/[0.06] bg-[#080808] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <DotsPattern />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-24">
            <div className="text-center lg:sticky lg:top-28 lg:text-left">
              <SectionEyebrow number="01">Origin Story</SectionEyebrow>

              <h2 className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.8] tracking-[-0.035em] text-[#CBCAC8]">
                WHERE
                <span className="block text-[#DA0D12]">IT BEGAN.</span>
              </h2>

              <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3 lg:mx-0 lg:justify-start">
                <div className="h-px flex-1 bg-white/10" />
                <PawIcon className="h-7 w-7 text-[#DA0D12]" />
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                  Started in
                </p>

                <p className="mt-2 text-lg font-semibold text-[#CBCAC8]">
                  Thanjavur, Tamil Nadu
                </p>

                <p className="mt-1 text-xs text-[#666362]">India</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[2rem] border border-white/[0.07] bg-[#424141]/25 p-7 backdrop-blur-xl sm:p-10">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                    The beginning
                  </span>

                  <span className="font-display text-2xl text-[#DA0D12]">
                    01
                  </span>
                </div>

                <p className="text-lg font-medium leading-8 text-[#CBCAC8] sm:text-xl sm:leading-9">
                  The Backstore was born from a simple passion — creating
                  designs around the things I genuinely love.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/[0.07] bg-[#424141]/15 p-7 sm:p-10">
                <p className="text-sm leading-8 text-[#666362] sm:text-base sm:leading-9">
                  I started my creative journey by making fan-made edits
                  inspired by cinema, sports, iconic personalities and the
                  culture around me. What began as a creative outlet slowly
                  turned into something I wanted to put on clothing.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#DA0D12]/15 bg-gradient-to-br from-[#DA0D12]/[0.07] to-transparent p-7 sm:p-10">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#DA0D12]/10 text-[#DA0D12]">
                  <ShirtIcon className="h-5 w-5" />
                </div>

                <p className="text-sm leading-8 text-[#666362] sm:text-base sm:leading-9">
                  With my experience in graphic design and DTF printing, I
                  started bringing these ideas to life through T-shirts. Every
                  design is created, refined and printed with the intention of
                  making something that feels personal — not just another piece
                  of clothing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOUNDER - SECTION 03
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#161616] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <DotsPattern />

        <div
          className="pointer-events-none absolute left-0 top-1/3 h-80 w-80 rounded-full bg-[#DA0D12]/[0.06] blur-[110px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#80060B]/[0.08] blur-[130px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <SectionEyebrow number="03">The Founder</SectionEyebrow>

          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* Founder photo */}
            <div className="relative mx-auto w-full max-w-[480px]">
              <div className="absolute -inset-3 rounded-[2.5rem] border border-[#DA0D12]/10" />

              <div className="absolute -right-4 -top-4 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#161616] text-[#DA0D12] shadow-2xl">
                <PawIcon className="h-8 w-8" />
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#424141]">
                <Image
                  src="/founder.jpg"
                  alt="Nivas - Founder of The Backstore"
                  fill
                  priority
                  className="object-cover object-center transition duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 90vw, 480px"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-2xl border border-white/10 bg-[#161616]/70 p-4 backdrop-blur-xl">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                      Founder &amp; Creator
                    </p>

                    <p className="mt-1 font-display text-3xl tracking-wide text-[#CBCAC8]">
                      NIVAS
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                <span className="h-px w-8 bg-[#DA0D12]" />
                Built from passion
                <span className="h-px w-8 bg-[#DA0D12]" />
              </div>
            </div>

            {/* Founder content */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
                Meet the person behind the brand
              </p>

              <h2 className="mt-5 font-display text-[clamp(4.5rem,9vw,8rem)] leading-[0.76] tracking-[-0.04em] text-[#CBCAC8]">
                THIS IS
                <span className="block text-[#DA0D12]">NIVAS.</span>
              </h2>

              <div className="mt-9 h-px w-20 bg-[#DA0D12]" />

              <p className="mt-8 max-w-2xl text-lg font-medium leading-9 text-[#CBCAC8] sm:text-xl sm:leading-10">
                This brand is built from my own ideas, experiments and love for
                design — and it&apos;s still growing, one design at a time.
              </p>

              <p className="mt-6 max-w-2xl text-sm leading-8 text-[#666362] sm:text-base sm:leading-9">
                The Backstore is more than just putting graphics on T-shirts. It
                is a creative space where ideas, fandom, streetwear and personal
                identity come together.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.07] bg-[#424141]/20 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#DA0D12]/10 text-[#DA0D12]">
                    <SparkIcon className="h-5 w-5" />
                  </div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#666362]">
                    Creative direction
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-[#CBCAC8]">
                    Ideas become designs.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-[#424141]/20 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#DA0D12]/10 text-[#DA0D12]">
                    <ShirtIcon className="h-5 w-5" />
                  </div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#666362]">
                    The craft
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-[#CBCAC8]">
                    Designs become clothing.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="font-display text-5xl text-[#DA0D12]">
                  PASSION.
                </span>

                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PHILOSOPHY - SECTION 04
      ========================================================= */}
      <section className="relative border-y border-white/[0.06] bg-[#080808] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <SectionEyebrow number="04">Our Philosophy</SectionEyebrow>

            <h2 className="font-display text-[clamp(3.8rem,9vw,8rem)] leading-[0.8] tracking-[-0.04em]">
              CREATIVITY.
              <span className="block text-[#DA0D12]">STREETWEAR.</span>
              <span className="block text-[#CBCAC8]">FANDOM.</span>
            </h2>

            <p className="mx-auto mt-9 max-w-2xl text-sm leading-8 text-[#666362] sm:text-base">
              The Backstore is my way of combining creativity, streetwear and
              fandom into something people can actually wear and connect with.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            <article className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#424141]/25 p-7 transition duration-500 hover:-translate-y-1 hover:border-[#DA0D12]/25 sm:p-8">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#DA0D12]/5 blur-3xl transition duration-500 group-hover:bg-[#DA0D12]/10" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DA0D12]/10 text-[#DA0D12]">
                    <SparkIcon className="h-5 w-5" />
                  </div>

                  <span className="font-display text-4xl text-white/10">
                    01
                  </span>
                </div>

                <h3 className="mt-12 font-display text-4xl tracking-wide text-[#CBCAC8]">
                  CREATE WHAT
                  <span className="block text-[#DA0D12]">YOU LOVE.</span>
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#666362]">
                  Start with an idea that means something. The best designs come
                  from genuine interests, curiosity and creativity.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#424141]/25 p-7 transition duration-500 hover:-translate-y-1 hover:border-[#DA0D12]/25 sm:p-8">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#DA0D12]/5 blur-3xl transition duration-500 group-hover:bg-[#DA0D12]/10" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DA0D12]/10 text-[#DA0D12]">
                    <TagIcon className="h-5 w-5" />
                  </div>

                  <span className="font-display text-4xl text-white/10">
                    02
                  </span>
                </div>

                <h3 className="mt-12 font-display text-4xl tracking-wide text-[#CBCAC8]">
                  MAKE IT
                  <span className="block text-[#DA0D12]">PERSONAL.</span>
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#666362]">
                  Clothing can say something about you without saying a word.
                  Every piece should feel like it belongs to the person wearing
                  it.
                </p>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#424141]/25 p-7 transition duration-500 hover:-translate-y-1 hover:border-[#DA0D12]/25 sm:p-8">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#DA0D12]/5 blur-3xl transition duration-500 group-hover:bg-[#DA0D12]/10" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DA0D12]/10 text-[#DA0D12]">
                    <HeartIcon className="h-5 w-5" />
                  </div>

                  <span className="font-display text-4xl text-white/10">
                    03
                  </span>
                </div>

                <h3 className="mt-12 font-display text-4xl tracking-wide text-[#CBCAC8]">
                  WEAR YOUR
                  <span className="block text-[#DA0D12]">IDENTITY.</span>
                </h3>

                <p className="mt-5 text-sm leading-7 text-[#666362]">
                  Streetwear is more than a fit. It is a way of expressing
                  personality, interests and the things that make you, you.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          PACK STATEMENT
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#424141] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#DA0D12]/10 blur-[100px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-black/20 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
              <PawIcon className="h-6 w-6 text-[#DA0D12]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#CBCAC8]/60">
                Find your pack
              </span>
            </div>

            <h2 className="font-display text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.82] tracking-[-0.035em] text-[#CBCAC8]">
              WEAR WHAT
              <span className="block text-[#DA0D12]">FEELS LIKE YOU.</span>
            </h2>
          </div>

          <div className="shrink-0">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-4 rounded-full border border-[#DA0D12]/40 bg-[#161616] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#CBCAC8] transition duration-300 hover:border-[#DA0D12] hover:bg-[#DA0D12] hover:text-white"
            >
              Explore the store
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DA0D12] text-white transition duration-300 group-hover:bg-white group-hover:text-[#DA0D12]">
                <ArrowUpRightIcon className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL STATEMENT
      ========================================================= */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:px-12">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DA0D12]/[0.055] blur-[130px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#DA0D12]/25 bg-[#DA0D12]/[0.07] text-[#DA0D12]">
            <PawIcon className="h-7 w-7" />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
            And this is only the beginning.
          </p>

          <h2 className="mt-7 font-display text-[clamp(4rem,12vw,10rem)] leading-[0.76] tracking-[-0.045em] text-[#CBCAC8]">
            THIS IS
            <span className="block text-[#DA0D12]">THE BACKSTORE.</span>
          </h2>

          <p className="mx-auto mt-9 max-w-xl text-sm leading-8 text-[#666362] sm:text-base">
            Made from passion. Worn with identity.
          </p>

          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#DA0D12] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#80060B]"
          >
            Explore The Store
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
