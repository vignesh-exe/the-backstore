"use client";

import CountUp from "../CountUp";

const stats = [
  { value: 100, suffix: "+", label: "Happy Customers" },
  { value: 150, suffix: "+", label: "Orders Delivered" },
  { value: 250, suffix: "+", label: "Custom Designs" },
  { value: 4.9, suffix: "", label: "Customer Rating", isRating: true },
];

export default function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-[#F3EBDD] px-4 pt-12 pb-0 sm:px-7 sm:pt-16 sm:pb-1 lg:px-10 lg:pt-20 lg:pb-2">
      {/* Background Accent */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-[320px] w-[320px] rounded-full bg-[#DA0D12]/[0.035] blur-[100px] sm:h-[500px] sm:w-[500px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[260px] w-[260px] rounded-full bg-[#171717]/[0.025] blur-[100px]" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3 sm:mb-12">
          <span className="h-px w-8 bg-[#DA0D12]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
            Independent Style / Since 2025
          </span>
        </div>

        {/* Main Heading */}
        <div className="max-w-[1100px]">
          <h2
            className="text-[clamp(3.8rem,10vw,9rem)] uppercase leading-[0.8] tracking-[-0.025em] text-[#171717]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            NOT MADE
            <br />
            <span className="text-[#DA0D12]">TO FIT IN.</span>
          </h2>
        </div>

        {/* Intro */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p className="max-w-md text-base leading-7 text-[#45413B] sm:text-lg sm:leading-8">
              Your style. Your interests. Your rules. The Backstore brings
              together the things you love and turns them into everyday
              streetwear with character.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#625D55]">
              Built around what moves you
            </p>
            <p className="mt-2 text-sm leading-6 text-[#625D55]">
              Anime. Cinema. Motorsport. Sports. Street culture.
            </p>
          </div>
        </div>

        {/* CountUp Statistics */}
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 border-y border-[#171717]/15 py-8 sm:mt-16 sm:gap-x-6 sm:py-10 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:py-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex min-w-0 flex-col ${
                index % 2 === 0 ? "items-start" : "items-start sm:items-center"
              } lg:items-start`}
            >
              <div className="flex min-h-[48px] items-center gap-1.5 sm:min-h-[64px]">
                <CountUp
                  from={0}
                  to={stat.value}
                  mode="count"
                  easing="easeOut"
                  format="standard"
                  separator=","
                  prefix=""
                  suffix={stat.suffix}
                  direction="up"
                  duration={1.8}
                  delay={0}
                  trigger="view"
                  replayOnHover
                  className="count-up-text text-[2.8rem] font-bold leading-none tracking-[-0.06em] text-[#171717] sm:text-5xl lg:text-6xl"
                />
                {stat.isRating && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-7 w-7 shrink-0 text-[#DA0D12] sm:h-9 sm:w-9"
                  >
                    <path d="M12 2.5 15.1 8.8l6.9 1-5 4.9 1.2 6.9L12 18.3l-6.2 3.3L7 14.7l-5-4.9 6.9-1L12 2.5Z" />
                  </svg>
                )}
              </div>
              <p className="mt-3 text-xs font-semibold text-[#45413B] sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Brand Story */}
        <div className="grid grid-cols-1 gap-8 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#DA0D12]">
              01 / The Philosophy
            </p>
            <h3
              className="mt-5 max-w-sm text-4xl uppercase leading-[0.9] text-[#171717] sm:text-5xl lg:text-6xl"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              WEAR YOUR
              <br />
              <span className="text-[#DA0D12]">WORLD.</span>
            </h3>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-8">
            <p className="text-base leading-7 text-[#45413B] sm:text-lg sm:leading-8">
              We believe clothing should be more than something you put on. It
              should reflect what you stand for, what inspires you, and what
              makes you different. Every collection starts with a connection to
              culture and a reason to wear it.
            </p>
            <p className="mt-5 text-sm leading-7 text-[#625D55]">
              No following the crowd. No dressing by the rules. Just original
              designs, relaxed fits, and a little attitude.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-[#DA0D12]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#171717]">
                Made for your kind of different
              </span>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div className="mt-6 flex items-end justify-between border-t border-[#171717]/15 pt-3 sm:mt-8">
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
