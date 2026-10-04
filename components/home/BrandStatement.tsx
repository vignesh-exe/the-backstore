export default function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-4 pb-10 pt-10 sm:px-7 sm:pb-12 sm:pt-12 lg:px-10 lg:pb-16 lg:pt-16">
      {/* Background details */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DA0D12]/[0.035] blur-[140px]" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* Top label */}
        <div className="mb-10 flex items-center gap-3">
          <span className="h-px w-8 bg-[#DA0D12]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
            The Backstore / Identity
          </span>
        </div>

        {/* Main statement */}
        <div className="max-w-[1100px]">
          <h2
            className="text-[clamp(4rem,10vw,9rem)] uppercase leading-[0.78] tracking-[-0.02em] text-[#CBCAC8]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            WEAR WHAT
            <br />
            <span className="text-[#DA0D12]">YOU BELIEVE.</span>
          </h2>
        </div>

        {/* Bottom content */}
        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-[#CBCAC8]/10 pt-8 sm:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#555]">
              01 / Our Approach
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[16px] leading-7 text-[#777] sm:text-[18px] sm:leading-8">
              The Backstore is built for people who want their clothes to say
              something. Cinema, music, motorsport, sport, anime, street culture
              — every design starts with something worth wearing.
            </p>

            <p className="mt-6 text-[12px] leading-6 text-[#444]">
              Designed for the culture. Made for everyday wear.
            </p>
          </div>
        </div>

        {/* Bottom coordinates */}
        <div className="mt-16 flex items-end justify-between border-t border-[#CBCAC8]/10 pt-5">
          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#444]">
            EST. 2025
          </span>

          <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#444]">
            MADE IN INDIA
          </span>
        </div>
      </div>
    </section>
  );
}
