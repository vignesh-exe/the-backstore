"use client";

import { useEffect, useState } from "react";

/*
 * ============================================================
 * THE BACKSTORE — HERO COLLECTION MEDIA
 * ============================================================
 *
 * Put your collection media inside:
 *
 * public/images/hero/
 *
 * Files:
 *
 * doomsday-poster.png
 * midnight-poster.png
 * street-poster.png
 * collection-video.mp4
 *
 * ============================================================
 */

const collectionMedia = [
  {
    id: 1,
    type: "image",
    src: "/images/hero/doomsday-poster.png",
    alt: "Doomsday Collection",
  },
  {
    id: 2,
    type: "image",
    src: "/images/hero/midnight-poster.png",
    alt: "Midnight Collection",
  },
  {
    id: 3,
    type: "image",
    src: "/images/hero/street-poster.png",
    alt: "Street Collection",
  },
  {
    id: 4,
    type: "video",
    src: "/images/hero/collection-video.mp4",
    alt: "The Backstore Collection Video",
  },
];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /*
   * ============================================================
   * PAGE LOAD
   * ============================================================
   */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  /*
   * ============================================================
   * AUTO SLIDER
   * ============================================================
   */

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveMedia((current) =>
        current === collectionMedia.length - 1
          ? 0
          : current + 1,
      );
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused]);

  /*
   * ============================================================
   * PREVIOUS
   * ============================================================
   */

  const previousMedia = () => {
    setActiveMedia((current) =>
      current === 0
        ? collectionMedia.length - 1
        : current - 1,
    );
  };

  /*
   * ============================================================
   * NEXT
   * ============================================================
   */

  const nextMedia = () => {
    setActiveMedia((current) =>
      current === collectionMedia.length - 1
        ? 0
        : current + 1,
    );
  };

  return (
    <section
      className={`relative min-h-screen overflow-hidden bg-[#080808] text-white transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* =========================================================
          COMIC BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Red comic panel */}

        <div
          className="absolute inset-x-0 top-[8%] h-[70%] bg-[#ff2d32]"
          style={{
            clipPath:
              "polygon(0 7%, 8% 3%, 17% 8%, 28% 2%, 39% 7%, 52% 1%, 64% 6%, 76% 2%, 88% 7%, 100% 1%, 100% 91%, 91% 96%, 79% 91%, 68% 98%, 56% 92%, 44% 98%, 31% 92%, 19% 97%, 8% 91%, 0 96%)",
          }}
        />

        {/* Black comic shadow */}

        <div
          className="absolute -left-[8%] top-[18%] h-[55%] w-[65%] bg-black/90"
          style={{
            clipPath:
              "polygon(0 8%, 14% 0, 27% 5%, 42% 1%, 56% 8%, 72% 2%, 100% 12%, 94% 90%, 77% 100%, 60% 92%, 45% 100%, 28% 92%, 12% 98%, 0 88%)",
          }}
        />

        {/* Halftone */}

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.2px, transparent 1.2px)",
            backgroundSize: "12px 12px",
          }}
        />

        {/* Speed lines */}

        <div className="absolute left-0 top-[42%] h-px w-[45%] rotate-[-8deg] bg-white/30" />

        <div className="absolute left-[-5%] top-[46%] h-px w-[50%] rotate-[-8deg] bg-white/20" />

        <div className="absolute left-[5%] top-[78%] h-px w-[45%] rotate-[4deg] bg-[#ff2d32]" />

        <div className="absolute right-0 top-[32%] h-px w-[30%] rotate-[8deg] bg-[#ff2d32]" />

        {/* Comic burst */}

        <div
          className="absolute right-[5%] top-[12%] h-[260px] w-[260px] opacity-40"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, #ff2d32 0deg 7deg, transparent 7deg 16deg)",
          }}
        />
      </div>

      {/* =========================================================
          HERO CONTENT WRAPPER
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pt-32 pb-28 sm:px-10 sm:pb-28 lg:px-16 lg:pt-20 lg:pb-24">
        {/* =======================================================
            TOP BRAND LABEL
        ======================================================= */}

        <div className="mb-5 flex items-center gap-4 lg:mb-3">
          <span className="h-[2px] w-12 bg-white" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-white/80 sm:text-xs">
            Made in India
          </span>

          <span className="h-[2px] w-16 bg-white/40" />
        </div>

        {/* =======================================================
            MAIN HERO GRID
        ======================================================= */}

        <div className="grid items-center gap-8 lg:min-h-[calc(100vh-170px)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-5 xl:gap-8">
          {/* =====================================================
              LEFT SIDE
          ===================================================== */}

          <div className="relative z-20 pb-4 lg:pb-8">
            {/* Comic label */}

            <div className="mb-5 inline-flex -rotate-2 items-center border-2 border-white bg-black px-4 py-2 shadow-[5px_5px_0_#ff2d32]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                THE ORIGINAL STREETWEAR
              </span>
            </div>

            {/* ===================================================
                MAIN HEADING
            =================================================== */}

            <div className="relative max-w-[850px]">
              <h1
                className="select-none text-[clamp(4.5rem,11vw,10rem)] font-black uppercase leading-[0.76] tracking-[-0.07em]"
                style={{
                  fontFamily:
                    "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  WebkitTextStroke: "2px #000",
                  textShadow:
                    "8px 8px 0 #000, 14px 14px 0 rgba(0,0,0,0.35)",
                }}
              >
                <span className="block text-white">
                  WEAR IT.
                </span>

                <span
                  className="relative block text-[#ff2d32]"
                  style={{
                    WebkitTextStroke: "3px #000",
                  }}
                >
                  YOUR WAY.
                </span>
              </h1>

              {/* Comic underline */}

              <div className="absolute -bottom-5 left-0 h-4 w-[70%] -rotate-2 bg-white sm:h-5">
                <div className="absolute right-[-18px] top-[-3px] h-7 w-10 -skew-x-12 bg-white" />
              </div>
            </div>

            {/* ===================================================
                DESCRIPTION
            =================================================== */}

            <p className="mt-14 max-w-xl text-sm font-bold uppercase leading-relaxed tracking-[0.12em] text-white/85 sm:text-base">
              Bold designs. Oversized fits. Original attitude.
              <br />
              Built for people who don&apos;t follow the crowd.
            </p>

            {/* ===================================================
                CTA BUTTONS
            =================================================== */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {/* SHOP */}

              <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden border-2 border-black bg-[#ff2d32] px-8 font-black uppercase tracking-wide text-black shadow-[6px_6px_0_#000] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_#000]">
                <span>
                  Shop the Drop
                </span>

                <span className="ml-5 text-xl transition-transform duration-200 group-hover:translate-x-2">
                  →
                </span>
              </button>

              {/* CUSTOMIZE */}

              <button className="group inline-flex h-14 items-center justify-center border-2 border-white bg-black px-8 font-black uppercase tracking-wide text-white shadow-[6px_6px_0_#ff2d32] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1">
                <span>
                  Customize Your Tee
                </span>

                <span className="ml-5 text-xl transition-transform duration-200 group-hover:translate-x-2">
                  →
                </span>
              </button>
            </div>

            {/* ===================================================
                BRAND DETAILS
            =================================================== */}

            <div className="mt-7 flex w-full flex-nowrap items-center gap-2 overflow-hidden whitespace-nowrap font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-white/60 sm:mt-9 sm:gap-4 sm:text-[9px] sm:tracking-[0.2em] lg:text-[10px] lg:tracking-[0.25em]">
              <span className="shrink-0">
                BOLD DESIGNS
              </span>

              <span className="shrink-0">
                •
              </span>

              <span className="shrink-0">
                OVERSIZED FITS
              </span>

              <span className="shrink-0">
                •
              </span>

              <span className="shrink-0">
                MADE IN INDIA
              </span>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE — COMIC SWIPER
          ===================================================== */}

          <div
            className="relative flex min-h-[420px] items-center justify-center pb-16 sm:min-h-[470px] lg:min-h-0 lg:translate-y-[-5px] lg:pb-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* =================================================
                COMIC BURST
            ================================================= */}

            <div
              className="absolute h-[360px] w-[360px] rotate-6 bg-white/10 sm:h-[470px] sm:w-[470px] lg:h-[510px] lg:w-[510px]"
              style={{
                clipPath:
                  "polygon(50% 0%, 58% 19%, 72% 5%, 76% 25%, 94% 18%, 86% 37%, 100% 50%, 84% 58%, 95% 76%, 75% 74%, 80% 95%, 61% 83%, 50% 100%, 41% 82%, 22% 95%, 25% 75%, 5% 80%, 16% 60%, 0% 50%, 17% 40%, 5% 21%, 25% 27%, 23% 6%, 42% 19%)",
              }}
            />

            {/* =================================================
                CARD WRAPPER
            ================================================= */}

            <div className="relative z-10 w-[91%] max-w-[600px] rotate-[-3deg] sm:w-[87%] lg:w-[84%]">
              {/* =================================================
                  RED OFFSET
              ================================================= */}

              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-[#ff2d32]"
                style={{
                  clipPath:
                    "polygon(1% 2%, 15% 0, 29% 3%, 43% 1%, 57% 4%, 72% 1%, 88% 4%, 99% 1%, 97% 94%, 84% 98%, 69% 94%, 55% 99%, 40% 95%, 25% 98%, 10% 94%, 1% 97%)",
                }}
              />

              {/* =================================================
                  BLACK OFFSET
              ================================================= */}

              <div
                className="absolute inset-0 translate-x-5 translate-y-5 bg-black"
                style={{
                  clipPath:
                    "polygon(1% 2%, 15% 0, 29% 3%, 43% 1%, 57% 4%, 72% 1%, 88% 4%, 99% 1%, 97% 94%, 84% 98%, 69% 94%, 55% 99%, 40% 95%, 25% 98%, 10% 94%, 1% 97%)",
                }}
              />

              {/* =================================================
                  MAIN CARD
              ================================================= */}

              <div
                className="relative overflow-hidden border-[5px] border-black bg-[#ff2d32] p-[7px]"
                style={{
                  clipPath:
                    "polygon(1% 2%, 15% 0, 29% 3%, 43% 1%, 57% 4%, 72% 1%, 88% 4%, 99% 1%, 97% 94%, 84% 98%, 69% 94%, 55% 99%, 40% 95%, 25% 98%, 10% 94%, 1% 97%)",
                }}
              >
                {/* =================================================
                    MEDIA
                ================================================= */}

                <div className="relative aspect-square overflow-hidden bg-[#ff2d32]">
                  {collectionMedia.map((media, index) => {
                    const isActive =
                      index === activeMedia;

                    if (media.type === "video") {
                      return (
                        <video
                          key={media.id}
                          src={media.src}
                          autoPlay={isActive}
                          muted
                          loop
                          playsInline
                          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                            isActive
                              ? "z-10 scale-100 opacity-100"
                              : "z-0 scale-105 opacity-0"
                          }`}
                        />
                      );
                    }

                    return (
                      <img
                        key={media.id}
                        src={media.src}
                        alt={media.alt}
                        className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                          isActive
                            ? "z-10 scale-100 opacity-100"
                            : "z-0 scale-105 opacity-0"
                        }`}
                      />
                    );
                  })}

                  {/* Halftone */}

                  <div
                    className="pointer-events-none absolute inset-0 z-20 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                      backgroundSize: "11px 11px",
                    }}
                  />

                  {/* Inner frame */}

                  <div className="pointer-events-none absolute inset-5 z-30 border-[3px] border-white/60 sm:inset-7" />

                  {/* Corners */}

                  <div className="pointer-events-none absolute left-5 top-5 z-40 h-8 w-8 border-l-[4px] border-t-[4px] border-white sm:left-7 sm:top-7" />

                  <div className="pointer-events-none absolute right-5 top-5 z-40 h-8 w-8 border-r-[4px] border-t-[4px] border-white sm:right-7 sm:top-7" />

                  <div className="pointer-events-none absolute bottom-5 left-5 z-40 h-8 w-8 border-b-[4px] border-l-[4px] border-white sm:bottom-7 sm:left-7" />

                  <div className="pointer-events-none absolute bottom-5 right-5 z-40 h-8 w-8 border-b-[4px] border-r-[4px] border-white sm:right-7 sm:bottom-7" />
                </div>
              </div>

              {/* =================================================
                  LEFT ARROW
              ================================================= */}

              <button
                type="button"
                aria-label="Previous collection"
                onClick={previousMedia}
                className="absolute -left-5 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-[4px] border-black bg-white text-black shadow-[5px_5px_0_#ff2d32] transition-all duration-200 hover:-translate-x-1 hover:bg-[#ff2d32] sm:-left-9 sm:h-12 sm:w-12"
              >
                <span className="text-2xl font-black">
                  ←
                </span>
              </button>

              {/* =================================================
                  RIGHT ARROW
              ================================================= */}

              <button
                type="button"
                aria-label="Next collection"
                onClick={nextMedia}
                className="absolute -right-5 top-1/2 z-50 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-[4px] border-black bg-[#ff2d32] text-black shadow-[5px_5px_0_#000] transition-all duration-200 hover:translate-x-1 hover:bg-white sm:-right-9 sm:h-12 sm:w-12"
              >
                <span className="text-2xl font-black">
                  →
                </span>
              </button>

              {/* =================================================
                  SPEECH BUBBLE
              ================================================= */}

              <div className="absolute -right-2 -top-9 z-50 rotate-6 border-[4px] border-black bg-white px-4 py-3 text-center shadow-[6px_6px_0_#000] sm:-right-8 sm:-top-9 sm:px-5 sm:py-4">
                <p
                  className="text-base font-black uppercase leading-none text-black sm:text-2xl"
                  style={{
                    fontFamily:
                      "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                  }}
                >
                  GOOD TEES.
                  <br />
                  BAD RULES.
                </p>

                <div className="absolute -bottom-5 left-7 h-7 w-7 rotate-45 border-b-[4px] border-r-[4px] border-black bg-white" />
              </div>

              {/* =================================================
                  NOT JUST A BRAND
              ================================================= */}

              <div className="absolute -bottom-5 -left-5 z-50 flex h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full border-[5px] border-black bg-[#ff2d32] p-3 text-center shadow-[6px_6px_0_#000] sm:-bottom-10 sm:-left-10 sm:h-28 sm:w-28">
                <span className="text-[9px] font-black uppercase leading-tight text-black sm:text-base">
                  Not
                  <br />
                  Just
                  <br />
                  A Brand
                </span>
              </div>

              {/* =================================================
                  DOTS
              ================================================= */}

              <div className="absolute -bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 sm:-bottom-12">
                {collectionMedia.map((media, index) => (
                  <button
                    key={media.id}
                    type="button"
                    aria-label={`Go to collection ${index + 1}`}
                    onClick={() =>
                      setActiveMedia(index)
                    }
                    className={`transition-all duration-300 ${
                      index === activeMedia
                        ? "h-[5px] w-10 bg-[#ff2d32]"
                        : "h-[4px] w-5 bg-white/40 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM COMIC STRIP
          
          IMPORTANT:
          This stays above the page background but DOES NOT
          overlap the hero card because the hero wrapper reserves
          bottom space using pb-28 / lg:pb-24.
      ========================================================= */}

      <div className="absolute bottom-0 left-0 right-0 z-30 border-t-2 border-white/20 bg-black/95">
        <div className="mx-auto flex h-[70px] max-w-[1500px] items-center justify-between px-6 sm:px-10 lg:px-16">
          {/* Slider counter */}

          <div className="flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 sm:text-[10px]">
            <span className="text-white">
              {String(activeMedia + 1).padStart(2, "0")}
            </span>

            <span>
              /
            </span>

            <span>
              04
            </span>

            <span className="ml-3 h-[2px] w-16 bg-white/20">
              <span
                className="block h-full bg-[#ff2d32] transition-all duration-500"
                style={{
                  width: `${
                    ((activeMedia + 1) /
                      collectionMedia.length) *
                    100
                  }%`,
                }}
              />
            </span>
          </div>

          {/* Scroll indicator */}

          <div className="hidden items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 sm:flex">
            <span>
              Scroll Down
            </span>

            <span className="text-lg text-white">
              ↓
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          TOP / BOTTOM COMIC DETAILS
      ========================================================= */}

      <div className="pointer-events-none absolute bottom-[70px] left-5 z-20 h-5 w-5 border-b-2 border-l-2 border-white/30" />

      <div className="pointer-events-none absolute right-5 top-32 z-20 h-5 w-5 border-r-2 border-t-2 border-white/30" />
    </section>
  );
}