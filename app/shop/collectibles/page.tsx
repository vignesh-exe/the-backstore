import Link from "next/link";

import Navbar from "@/components/navbar/Navbar";

export default function CollectiblesComingSoonPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-[#F2F2F0]">
      {/* ==========================================================
          RESPONSIVE BACKGROUND

          Desktop image:
          /images/collectibles/collectibles-desktop.png

          Mobile image:
          /images/collectibles/collectibles-mobile.png
      ========================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage:
            "url('/images/collectibles/collectibles-mobile.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage:
            "url('/images/collectibles/collectibles-desktop.png')",
        }}
      />

      {/* ==========================================================
          IMAGE OVERLAY
      ========================================================== */}

      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.72)_100%)]"
      />

      {/* ==========================================================
          NAVBAR
      ========================================================== */}

      <Navbar />

      {/* ==========================================================
          COMING SOON CONTENT
      ========================================================== */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
        <div className="mx-auto w-full max-w-[900px] text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 backdrop-blur-md sm:mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DA0D12] shadow-[0_0_12px_rgba(218,13,18,0.9)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#CBCAC8] sm:text-[11px]">
              The Backstore / 02
            </span>
          </div>

          <p
            className="text-[clamp(0.8rem,1.5vw,1rem)] uppercase tracking-[0.35em] text-[#DA0D12]"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            Collectibles
          </p>

          <h1 className="mt-3 font-[var(--font-bebas-neue)] text-[clamp(4.5rem,13vw,10rem)] uppercase leading-[0.82] tracking-[-0.035em] text-[#F2F2F0] sm:mt-4">
            Coming Soon
          </h1>

          <p
            className="mx-auto mt-5 max-w-[620px] text-[clamp(0.95rem,1.8vw,1.2rem)] leading-7 text-white/70 sm:mt-7 sm:leading-8"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            Anime collectibles, wall posters and more.
            <br className="hidden sm:block" />A new collection is being built
            for collectors.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
            <Link
              href="/shop/t-shirts"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#DA0D12] px-7 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white shadow-[0_12px_35px_rgba(218,13,18,0.22)] transition-all duration-200 hover:bg-[#B90B10] hover:shadow-[0_16px_42px_rgba(218,13,18,0.3)]"
            >
              Shop T-Shirts
              <span className="ml-3 text-sm">→</span>
            </Link>

            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-black/25 px-7 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBCAC8] backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-white/10 hover:text-white"
            >
              Back Home
            </Link>
          </div>

          <div className="mx-auto mt-10 h-px w-20 bg-[#DA0D12]/70 sm:mt-12" />

          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
            Something worth collecting is on the way.
          </p>
        </div>
      </section>
    </main>
  );
}
