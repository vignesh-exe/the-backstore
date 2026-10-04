import Link from "next/link";

export default function FinalShopCTA() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-4 pb-16 pt-8 text-[#CBCAC8] sm:px-7 sm:pb-20 sm:pt-10 lg:px-10 lg:pb-24 lg:pt-12">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DA0D12]/[0.045] blur-[130px]" />

      {/* Decorative lines */}
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-[18%] bg-gradient-to-r from-transparent to-[#DA0D12]/20" />

      <div className="pointer-events-none absolute right-0 top-1/2 h-px w-[18%] bg-gradient-to-l from-transparent to-[#DA0D12]/20" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Top label */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#DA0D12]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
            The Backstore / Shop
          </span>

          <span className="h-px w-8 bg-[#DA0D12]" />
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-[950px] text-center">
          <h2
            className="text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.78] tracking-[-0.01em] text-[#CBCAC8]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            FIND YOUR
            <br />
            <span className="text-[#DA0D12]">NEXT FAVORITE TEE.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-md text-[12px] leading-6 text-[#555] sm:text-[13px]">
            Built for the culture. Made for everyday wear.
            <br />
            Find something that feels like you.
          </p>

          {/* CTA */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/shop/t-shirts"
              className="group inline-flex items-center gap-4 rounded-full border border-[#DA0D12]/50 bg-[#DA0D12] px-7 py-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#b90b0f] hover:shadow-[0_0_35px_rgba(218,13,18,0.18)]"
            >
              Shop All T-Shirts
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[16px] w-[16px]"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12H18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M13 7L18 12L13 17"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom details */}
        <div className="mt-14 flex items-center justify-between border-t border-[#CBCAC8]/10 pt-5">
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#444]">
            THE BACKSTORE
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#444]">
            MADE IN INDIA
          </span>
        </div>
      </div>
    </section>
  );
}
