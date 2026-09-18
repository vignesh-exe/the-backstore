"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRODUCTS = [
  {
    type: "oversized",
    title: "Custom Oversized T-Shirt",
    subtitle: "Oversized fit",
    image: "/images/custom/oversized/black.jpg",
    whiteImage: "/images/custom/oversized/white.jpg",
    price: 599,
    description:
      "Premium oversized cotton t-shirt made for your custom designs.",
  },
  {
    type: "regular",
    title: "Custom Regular T-Shirt",
    subtitle: "Regular fit",
    image: "/images/custom/regular/black.png",
    whiteImage: "/images/custom/regular/white.png",
    price: 499,
    description:
      "Clean regular-fit cotton t-shirt made for your custom designs.",
  },
] as const;

function ArrowRight() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </svg>
  );
}

export default function CustomizePage() {
  const [activeType, setActiveType] = useState<"oversized" | "regular" | null>(
    null,
  );

  return (
    <main className="min-h-screen bg-[#080808] text-[#CBCAC8]">
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-7 sm:pb-20 sm:pt-32 lg:px-10">
        <div className="pointer-events-none absolute left-[8%] top-20 h-72 w-72 rounded-full bg-[#DA0D12]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[5%] top-56 h-80 w-80 rounded-full bg-[#DA0D12]/6 blur-[130px]" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-3xl sm:mb-14">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#DA0D12]" />
              <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#DA0D12]">
                The Backstore / Customize
              </span>
            </div>

            <h1
              className="text-6xl uppercase leading-[0.84] tracking-tight text-[#CBCAC8] sm:text-7xl lg:text-9xl"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              MAKE IT
              <br />
              YOURS.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#666362] sm:text-base">
              Choose your blank. Pick black or white. Upload your artwork.
              We&apos;ll take it from there.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {PRODUCTS.map((product, index) => {
              const isActive = activeType === product.type;

              return (
                <Link
                  key={product.type}
                  href={`/customize/${product.type}`}
                  onMouseEnter={() => setActiveType(product.type)}
                  onMouseLeave={() => setActiveType(null)}
                  className="group relative overflow-hidden rounded-[30px] border border-[#CBCAC8]/10 bg-[#111111] transition-all duration-500 hover:-translate-y-1 hover:border-[#DA0D12]/35"
                >
                  <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-[#CBCAC8]/10 bg-[#080808]/75 px-3 py-2 backdrop-blur-md">
                    <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#666362]">
                      0{index + 1}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#DA0D12]" />
                    <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#CBCAC8]">
                      {product.subtitle}
                    </span>
                  </div>

                  <div className="relative aspect-[1.15] overflow-hidden bg-[#0D0D0D]">
                    <Image
                      src={isActive ? product.whiteImage : product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-10 transition-all duration-700 ease-out group-hover:scale-[1.04] sm:p-14"
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#111111] to-transparent" />
                  </div>

                  <div className="relative px-6 pb-7 pt-2 sm:px-8 sm:pb-8">
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-[#DA0D12]">
                          Custom apparel
                        </p>

                        <h2
                          className="mt-2 text-4xl uppercase leading-none text-[#CBCAC8] sm:text-5xl"
                          style={{
                            fontFamily:
                              "var(--font-bebas-neue), Impact, sans-serif",
                          }}
                        >
                          {product.title}
                        </h2>

                        <p className="mt-3 max-w-md text-xs leading-5 text-[#666362]">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#161616] text-[#CBCAC8] transition-all duration-300 group-hover:border-[#DA0D12]/40 group-hover:bg-[#DA0D12] group-hover:text-white">
                        <ArrowRight />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#CBCAC8]/8 pt-5">
                      <div>
                        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#555]">
                          Starting from
                        </span>
                        <p className="mt-1 text-lg font-semibold text-[#CBCAC8]">
                          ₹{product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.18em] text-[#666362]">
                        <span className="h-3 w-3 rounded-full bg-black ring-1 ring-[#CBCAC8]/30" />
                        <span className="h-3 w-3 rounded-full bg-white ring-1 ring-[#CBCAC8]/30" />
                        2 colours
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Choose your fit"],
              ["02", "Pick black or white"],
              ["03", "Upload your artwork"],
            ].map(([number, text]) => (
              <div
                key={number}
                className="flex items-center gap-3 rounded-2xl border border-[#CBCAC8]/8 bg-[#0D0D0D] px-4 py-4"
              >
                <span className="font-mono text-[7px] tracking-[0.15em] text-[#DA0D12]">
                  {number}
                </span>
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#666362]">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[#CBCAC8]/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[#555]">
              <SparkIcon />
              <span className="font-mono text-[7px] uppercase tracking-[0.2em]">
                Built for your ideas
              </span>
            </div>

            <Link
              href="/shop/t-shirts"
              className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#666362] transition-colors hover:text-[#CBCAC8]"
            >
              Browse ready-made drops
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
