import Link from "next/link";

export default function FinalShopCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F3EBDD] px-4 pb-4 pt-14 text-[#171717] sm:px-7 sm:pb-6 sm:pt-20 lg:px-10 lg:pb-8 lg:pt-24">
      {/* Background Accents */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[400px] w-[400px] rounded-full bg-[#DA0D12]/[0.045] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-[#171717]/[0.035] blur-[100px]" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Section Label */}
        <div className="mb-10 flex items-center gap-3 sm:mb-14">
          <span className="h-px w-8 bg-[#DA0D12]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
            The Backstore / Find Your Thing
          </span>
        </div>

        {/* Main Heading */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2
              className="text-[clamp(4rem,11vw,9.5rem)] uppercase leading-[0.78] tracking-[-0.025em] text-[#171717]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              YOUR STYLE.
              <br />
              <span className="text-[#DA0D12]">YOUR UNIVERSE.</span>
            </h2>
          </div>
          <div className="max-w-sm lg:col-span-4 lg:justify-self-end lg:pb-2">
            <p className="text-sm leading-7 text-[#45413B] sm:text-base">
              From statement tees to collectibles worth showing off, find the
              things that connect with your world. Wear what you love. Collect
              what you believe in.
            </p>
          </div>
        </div>

        {/* Two Shopping Options */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20">
          {/* T-Shirts */}
          <div className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden border border-[#171717]/15 bg-[#EAE2D4] p-6 transition-colors duration-300 hover:border-[#DA0D12]/50 sm:min-h-[280px] sm:p-9">
            <span className="pointer-events-none absolute -right-5 -top-12 select-none text-[150px] leading-none text-[#171717]/[0.035] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 sm:text-[190px]">
              T
            </span>
            <div className="relative">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#DA0D12]">
                01 / Wear Your World
              </p>
              <h3
                className="mt-5 text-5xl uppercase leading-[0.85] text-[#171717] sm:text-6xl lg:text-7xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                STATEMENT
                <br />
                TEES.
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-6 text-[#625D55]">
                Oversized fits. Culture-inspired graphics. Everyday essentials
                with personality.
              </p>
            </div>

            <Link
              href="/shop/t-shirts"
              className="relative mt-8 inline-flex w-fit items-center gap-4 border-b border-[#DA0D12] pb-2 font-mono text-[10px] uppercase tracking-[0.2em] !text-black transition-colors hover:!text-[#DA0D12]"
            >
              Shop T-Shirts
              <span className="text-[#DA0D12] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Collectibles */}
          <div className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden border border-[#171717]/15 bg-[#171717] p-6 text-[#F3EBDD] transition-colors duration-300 hover:border-[#DA0D12]/60 sm:min-h-[280px] sm:p-9">
            <span className="pointer-events-none absolute -right-4 -top-12 select-none text-[150px] leading-none text-white/[0.04] transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110 sm:text-[190px]">
              C
            </span>
            <div className="relative">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#DA0D12]">
                02 / Keep What You Love
              </p>
              <h3
                className="mt-5 text-5xl uppercase leading-[0.85] text-[#F3EBDD] sm:text-6xl lg:text-7xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                COLLECT
                <br />
                YOUR CULTURE.
              </h3>
              <p className="mt-4 max-w-xs text-sm leading-6 text-[#CBCAC8]">
                Discover figures, fan favourites, and collectibles that deserve
                a place in your world.
              </p>
            </div>
            <Link
              href="/shop/collectibles"
              className="relative mt-8 inline-flex w-fit items-center gap-4 border-b border-[#DA0D12] pb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F3EBDD] transition-colors hover:text-[#DA0D12]"
            >
              Explore Collectibles
              <span className="text-[#DA0D12] transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="mt-12 flex items-center justify-between border-t border-[#171717]/15 pt-5 sm:mt-16">
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#625D55]">
            THE BACKSTORE
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#625D55]">
            MADE IN INDIA
          </span>
        </div>
      </div>
    </section>
  );
}
