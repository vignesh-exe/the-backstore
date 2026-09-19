"use client";

import { useEffect, useRef, useState } from "react";
import TextType from "@/components/TextType";

/*
 * ============================================================
 * THE BACKSTORE — HERO SECTION
 * DOG / PACK INSPIRED STREETWEAR
 * ============================================================
 *
 * MOBILE ORDER
 * ------------
 * Navbar
 * Image / Collection Card
 * Hero Heading
 * Description
 * CTA
 * Identity Tag
 * Bottom Strip
 *
 * DESKTOP
 * --------
 * Content + Collection Card side by side
 * ============================================================
 */

const collectionMedia = [
  {
    id: 1,
    type: "image",
    src: "/images/hero/doomsday-poster.png",
    alt: "Doomsday Collection",
    collection: "Doomsday",
    code: "TB / 001",
  },
  {
    id: 2,
    type: "image",
    src: "/images/hero/midnight-poster.png",
    alt: "Midnight Collection",
    collection: "Midnight",
    code: "TB / 002",
  },
  {
    id: 3,
    type: "image",
    src: "/images/hero/street-poster.png",
    alt: "Street Collection",
    collection: "Street",
    code: "TB / 003",
  },
  {
    id: 4,
    type: "video",
    src: "/images/hero/collection-video.mp4",
    alt: "The Backstore Collection Video",
    collection: "The Pack",
    code: "TB / 004",
  },
];

/* ============================================================
   ICONS
   ============================================================ */

function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="7.1" cy="7.1" rx="2.05" ry="2.75" />
      <ellipse cx="12" cy="5.1" rx="2.05" ry="2.8" />
      <ellipse cx="16.9" cy="7.1" rx="2.05" ry="2.75" />

      <path d="M12 10.2c-3.25 0-5.85 2.3-5.85 5.05 0 2.15 1.7 3.25 3.6 2.65 1-.3 1.55-1.05 2.25-1.05s1.25.75 2.25 1.05c1.9.6 3.6-.5 3.6-2.65 0-2.75-2.6-5.05-5.85-5.05Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 7 5 5-5 5" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="m6.5 13.5 5.5 5.5 5.5-5.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 13.2 13.2 20a2 2 0 0 1-2.8 0L4 13.6V4h9.6L20 10.4a2 2 0 0 1 0 2.8Z" />
      <circle cx="8.5" cy="8.5" r="1.2" />
    </svg>
  );
}

/* ============================================================
   COLLECTION CARD
 * ============================================================ */

function CollectionCard({
  activeMedia,
  setActiveMedia,
  mobile = false,
}: {
  activeMedia: number;
  setActiveMedia: (index: number) => void;
  mobile?: boolean;
}) {
  const activeItem = collectionMedia[activeMedia];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = (event: React.TouchEvent<HTMLAnchorElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLAnchorElement>) => {
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwiping.current = true;
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLAnchorElement>) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
      isSwiping.current = true;

      if (deltaX < 0) {
        setActiveMedia(
          activeMedia === collectionMedia.length - 1 ? 0 : activeMedia + 1,
        );
      } else {
        setActiveMedia(
          activeMedia === 0 ? collectionMedia.length - 1 : activeMedia - 1,
        );
      }
    }
  };

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isSwiping.current) {
      event.preventDefault();
      event.stopPropagation();
      isSwiping.current = false;
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const videoIndex = collectionMedia.findIndex(
      (media) => media.type === "video",
    );

    if (activeMedia === videoIndex) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [activeMedia]);

  return (
    <div
      className={`
        relative
        mx-auto
        w-full
        ${mobile ? "max-w-[650px]" : "max-w-[730px]"}
      `}
    >
      {/* ======================================================
          SHADOW
      ====================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          inset-x-[12%]
          rounded-full
          bg-black/20
          ${mobile ? "bottom-[-8px] h-[18px]" : "bottom-[-12px] h-[24px]"}
        `}
      />

      {/* ======================================================
          COLLAR BUCKLE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-14px]
          z-40
          flex
          -translate-x-1/2
          items-center
          justify-center
        "
      >
        <div
          className={`
            rounded-[9px]
            border
            border-[#CBCAC8]/10
            bg-[#161616]/90
            shadow-[0_15px_40px_rgba(0,0,0,0.3)]
            backdrop-blur-xl
            ${mobile ? "h-[32px] w-[68px]" : "h-[44px] w-[88px]"}
          `}
        >
          <div
            className={`
              mx-auto
              rounded-[5px]
              border
              border-[#666362]/40
              ${mobile ? "mt-[6px] h-[19px] w-[34px]" : "mt-[9px] h-[24px] w-[44px]"}
            `}
          >
            <div
              className={`
                mx-auto
                rounded-[2px]
                bg-[#DA0D12]/60
                ${mobile ? "mt-[5px] h-[7px] w-[13px]" : "mt-[7px] h-[8px] w-[16px]"}
              `}
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          OUTER GLASS FRAME
      ====================================================== */}

      <a
        href="/shop/t-shirts"
        aria-label={`Shop ${activeItem.collection} collection`}
        onTouchStart={mobile ? handleTouchStart : undefined}
        onTouchMove={mobile ? handleTouchMove : undefined}
        onTouchEnd={mobile ? handleTouchEnd : undefined}
        onClick={mobile ? handleCardClick : undefined}
        style={mobile ? { touchAction: "pan-y" } : undefined}
        className={`
          group
          block
          cursor-pointer
          relative
          border
          border-[#CBCAC8]/10
          bg-[#CBCAC8]/[0.025]
          shadow-[0_30px_100px_rgba(0,0,0,0.35)]
          backdrop-blur-xl
          transition-transform
          duration-300
          hover:-translate-y-0.5
          ${mobile ? "rounded-[28px] p-1.5" : "rounded-[42px] p-2.5"}
        `}
      >
        <div
          className={`
            relative
            overflow-hidden
            bg-[#424141]
            ${mobile ? "aspect-[3/4] rounded-[22px]" : "aspect-[1.03/1] rounded-[34px]"}
          `}
        >
          {/* ==================================================
              MEDIA
          ================================================== */}

          <div className="absolute inset-0 flex">
            {collectionMedia.map((media) =>
              media.type === "video" ? (
                <video
                  key={media.id}
                  src={media.src}
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full shrink-0 object-cover"
                  style={{
                    transform: `translateX(-${activeMedia * 100}%)`,
                    transition: "transform 700ms ease",
                  }}
                />
              ) : (
                <img
                  key={media.id}
                  src={media.src}
                  alt={media.alt}
                  loading={
                    media.id === collectionMedia[0].id ? "eager" : "lazy"
                  }
                  decoding="async"
                  className="h-full w-full shrink-0 object-cover"
                  style={{
                    transform: `translateX(-${activeMedia * 100}%)`,
                    transition: "transform 700ms ease",
                  }}
                />
              ),
            )}
          </div>

          {/* ==================================================
              IMAGE OVERLAY
          ================================================== */}

          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#161616]/85 via-transparent to-[#161616]/10" />

          <div className="pointer-events-none absolute bottom-[-80px] right-[-60px] z-20 h-[190px] w-[190px] rounded-full bg-[#DA0D12]/10 blur-[75px]" />

          {/* ==================================================
              CORNER MARKERS
          ================================================== */}

          <div
            className={`
              pointer-events-none
              absolute
              left-4
              top-4
              z-30
              border-l
              border-t
              border-[#CBCAC8]/35
              ${mobile ? "h-5 w-5" : "left-8 top-8 h-6 w-6"}
            `}
          />

          <div
            className={`
              pointer-events-none
              absolute
              right-4
              top-4
              z-30
              border-r
              border-t
              border-[#CBCAC8]/35
              ${mobile ? "h-5 w-5" : "right-8 top-8 h-6 w-6"}
            `}
          />

          <div
            className={`
              pointer-events-none
              absolute
              bottom-4
              left-4
              z-30
              border-b
              border-l
              border-[#CBCAC8]/25
              ${mobile ? "h-5 w-5" : "bottom-8 left-8 h-6 w-6"}
            `}
          />

          <div
            className={`
              pointer-events-none
              absolute
              bottom-4
              right-4
              z-30
              border-b
              border-r
              border-[#CBCAC8]/25
              ${mobile ? "h-5 w-5" : "bottom-8 right-8 h-6 w-6"}
            `}
          />

          {/* ==================================================
              TOP LEFT LABEL
          ================================================== */}

          <div
            className={`
              absolute
              z-40
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-[#CBCAC8]/10
              bg-[#161616]/70
              backdrop-blur-xl
              ${
                mobile
                  ? "left-4 top-4 px-2.5 py-1.5"
                  : "left-7 top-7 px-3 py-1.5"
              }
            `}
          >
            <PawIcon
              className={
                mobile ? "h-2.5 w-2.5 text-[#DA0D12]" : "h-3 w-3 text-[#DA0D12]"
              }
            />

            <span
              className={`
                font-mono
                uppercase
                tracking-[0.2em]
                text-[#CBCAC8]/70
                ${mobile ? "text-[5.5px]" : "text-[6px]"}
              `}
            >
              Pack collection
            </span>
          </div>

          {/* ==================================================
              TOP RIGHT CODE
          ================================================== */}

          <div
            className={`
              absolute
              right-4
              top-4
              z-40
              rounded-full
              border
              border-[#CBCAC8]/10
              bg-[#161616]/70
              font-mono
              tracking-[0.15em]
              text-[#CBCAC8]/60
              backdrop-blur-xl
              ${
                mobile
                  ? "px-2.5 py-1.5 text-[5.5px]"
                  : "right-7 top-7 px-3 py-1.5 text-[6px]"
              }
            `}
          >
            {activeItem.code}
          </div>

          {/* ==================================================
              COLLECTION TITLE
          ================================================== */}

          <div
            className={`
              absolute
              bottom-4
              left-4
              z-40
              ${mobile ? "" : "bottom-8 left-8"}
            `}
          >
            <div
              className={`
                mb-1.5
                flex
                items-center
                gap-1.5
                ${mobile ? "" : "mb-2 gap-2"}
              `}
            >
              <span
                className={`
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-[#DA0D12]/20
                  ${mobile ? "h-4 w-4" : "h-5 w-5"}
                `}
              >
                <PawIcon
                  className={
                    mobile
                      ? "h-2 w-2 text-[#DA0D12]"
                      : "h-2.5 w-2.5 text-[#DA0D12]"
                  }
                />
              </span>

              <span
                className={`
                  font-mono
                  uppercase
                  tracking-[0.24em]
                  text-[#CBCAC8]/60
                  ${mobile ? "text-[5.5px]" : "text-[6px]"}
                `}
              >
                Current member
              </span>
            </div>

            <h2
              className={`
                leading-[0.78]
                text-[#CBCAC8]
                drop-shadow-[0_5px_20px_rgba(0,0,0,0.4)]
                ${mobile ? "text-[42px]" : "text-[70px]"}
              `}
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              {activeItem.collection}
            </h2>
          </div>
        </div>
      </a>

      {/* ======================================================
          SWIPER INDICATORS
      ====================================================== */}

      <div
        className={`
          flex
          items-center
          justify-center
          gap-4
          px-1
          ${mobile ? "mt-3" : "mt-4 px-3"}
        `}
      >
        <div className="flex items-center gap-1.5">
          {collectionMedia.map((media, index) => (
            <button
              key={media.id}
              type="button"
              aria-label={`Go to collection ${index + 1}`}
              onClick={() => setActiveMedia(index)}
              className={`
                h-1
                rounded-full
                transition-all
                duration-500
                ${
                  index === activeMedia
                    ? "w-7 bg-[#DA0D12]"
                    : "w-2 bg-[#CBCAC8]/15"
                }
              `}
            />
          ))}
        </div>

        <div className="font-mono text-[6px] tracking-[0.18em] text-[#666362]">
          <span className="text-[#CBCAC8]">
            {String(activeMedia + 1).padStart(2, "0")}
          </span>
          <span className="mx-1">/</span>
          <span>04</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */

export default function HeroSection() {
  const [activeMedia, setActiveMedia] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMedia((current) =>
        current === collectionMedia.length - 1 ? 0 : current + 1,
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className={`
        relative
        min-h-screen
        overflow-hidden
        bg-[#161616]
        text-[#CBCAC8]
              `}
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.34]"
        style={{
          backgroundImage: "url('/images/hero/hero-background.png')",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-1/2
            top-[40%]
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#DA0D12]/[0.045]
            blur-[140px]
          "
        />

        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                #CBCAC8 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                #CBCAC8 1px,
                transparent 1px
              )
            `,
            backgroundSize: "80px 80px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 25% 25%,
                #CBCAC8 1.2px,
                transparent 1.5px
              )
            `,
            backgroundSize: "44px 44px",
          }}
        />

        <div
          className="
            absolute
            left-1/2
            top-0
            h-[260px]
            w-[800px]
            -translate-x-1/2
            rounded-full
            bg-[#424141]/20
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[-180px]
            top-[30%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#DA0D12]/[0.025]
            blur-[120px]
          "
        />
      </div>

      {/* ======================================================
          DECORATIVE PAWS
      ====================================================== */}

      <div className="pointer-events-none absolute left-[4%] top-[30%] hidden opacity-[0.055] lg:block">
        <PawIcon className="h-24 w-24 text-[#CBCAC8]" />
      </div>

      <div className="pointer-events-none absolute right-[5%] bottom-[22%] hidden opacity-[0.04] lg:block">
        <PawIcon className="h-32 w-32 rotate-12 text-[#CBCAC8]" />
      </div>

      {/* ======================================================
          MAIN WRAPPER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[1500px]
          flex-col
          px-4
          pb-6
          pt-[82px]
          sm:px-7
          sm:pb-7
          sm:pt-[94px]
          lg:px-12
          lg:pb-8
          lg:pt-[106px]
        "
      >
        {/* ====================================================
            TOP META
        ==================================================== */}

        <div className="order-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#CBCAC8]/[0.035]">
              <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />
            </div>

            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#666362]">
                The Backstore
              </p>

              <p className="mt-0.5 text-[9px] text-[#CBCAC8]/70">
                Find your pack
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <span className="h-px w-10 bg-[#CBCAC8]/10" />

            <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#666362]">
              Chennai / India
            </span>

            <span className="h-px w-10 bg-[#CBCAC8]/10" />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden font-mono text-[7px] uppercase tracking-[0.2em] text-[#666362] sm:block">
              EST. 2026
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#DA0D12] shadow-[0_0_12px_rgba(218,13,18,0.5)]" />
          </div>
        </div>

        {/* ====================================================
            MOBILE COLLECTION CARD

            IMPORTANT:
            ORDER 2
            This now appears BEFORE the hero content.
        ==================================================== */}

        <div
          className="
            order-2
            mt-6
            w-full
            lg:hidden
          "
        >
          <CollectionCard
            activeMedia={activeMedia}
            setActiveMedia={setActiveMedia}
            mobile
          />
        </div>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div
          className="
            order-3
            flex
            flex-1
            items-center
            justify-center
            py-7
            lg:py-5
          "
        >
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:grid-cols-[0.88fr_1.12fr] xl:gap-16">
            {/* =================================================
                CONTENT
            ================================================= */}

            <div
              className="
                relative
                mx-auto
                w-full
                max-w-[650px]
                text-center
                lg:mx-0
                lg:text-left
              "
            >
              {/* Pack label */}

              <div className="mb-4 flex items-center justify-center gap-3 lg:mb-5 lg:justify-start">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DA0D12]/10">
                  <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />
                </div>

                <div className="text-left">
                  <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#DA0D12]">
                    Pack member / 001
                  </p>

                  <p className="mt-0.5 font-mono text-[6px] uppercase tracking-[0.22em] text-[#666362]">
                    New collection
                  </p>
                </div>
              </div>

              {/* =================================================
                  TWO-LINE MAIN HEADING
              ================================================= */}

              <h1
                className="
                  select-none
                  text-[clamp(5.3rem,17vw,10rem)]
                  leading-[0.7]
                  tracking-[-0.06em]
                  sm:text-[clamp(6rem,15vw,10.5rem)]
                  lg:text-[clamp(6.5rem,9vw,10.5rem)]
                  xl:text-[clamp(7rem,8.5vw,11rem)]
                "
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                {/* LINE 1 */}

                <span className="block whitespace-nowrap text-[#CBCAC8]">
                  <TextType
                    text={["WEAR IT."]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="_"
                    deletingSpeed={50}
                    cursorBlinkDuration={0.5}
                  />
                </span>

                {/* LINE 2 */}

                <span className="block whitespace-nowrap text-[#DA0D12]">
                  <TextType
                    text={["YOUR WAY."]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="_"
                    deletingSpeed={50}
                    cursorBlinkDuration={0.5}
                  />
                </span>
              </h1>

              {/* =================================================
                  COLLAR LINE
              ================================================= */}

              <div className="relative mx-auto mt-6 h-[2px] w-full max-w-[570px] bg-[#424141] lg:mx-0 lg:mt-8">
                <div className="absolute left-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full border border-[#DA0D12] bg-[#161616]" />

                <div className="absolute left-[18%] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-[#666362]" />

                <div className="absolute left-[35%] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-[#666362]" />

                <div className="absolute left-[52%] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-[#666362]" />

                <div className="absolute left-[69%] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-[#666362]" />

                <div className="absolute right-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full border border-[#DA0D12] bg-[#161616]" />
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <p className="mx-auto mt-5 max-w-[500px] text-[10px] leading-[1.85] text-[#666362] sm:text-[11px] lg:mx-0 lg:mt-7 lg:text-xs">
                Original designs. Relaxed fits. A little attitude. Built for the
                ones who move together, stand apart and wear their identity
                without asking permission.
              </p>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center lg:mt-8 lg:items-start lg:justify-start">
                <a
                  href="/shop"
                  className="
                    group
                    inline-flex
                    h-[48px]
                    items-center
                    justify-center
                    gap-5
                    rounded-full
                    bg-[#DA0D12]
                    px-7
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#CBCAC8]
                    shadow-[0_12px_35px_rgba(218,13,18,0.14)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_18px_45px_rgba(218,13,18,0.2)]
                  "
                >
                  <span>Explore the pack</span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon />
                  </span>
                </a>

                <a
                  href="/customize"
                  className="
                    inline-flex
                    h-[48px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#CBCAC8]/10
                    bg-[#CBCAC8]/[0.025]
                    px-7
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-[#666362]
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:border-[#CBCAC8]/20
                    hover:bg-[#CBCAC8]/[0.055]
                    hover:text-[#CBCAC8]
                  "
                >
                  Customize
                </a>
              </div>

              {/* =================================================
                  IDENTITY TAG
              ================================================= */}

              <div className="mt-7 flex items-center justify-center gap-3 lg:mt-9 lg:justify-start">
                <div className="flex h-10 w-10 rotate-[-5deg] items-center justify-center rounded-[10px] border border-[#CBCAC8]/10 bg-[#CBCAC8]/[0.025] text-[#666362]">
                  <TagIcon />
                </div>

                <div className="text-left">
                  <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-[#666362]">
                    Identity tag
                  </p>

                  <p
                    className="mt-1 text-[18px] leading-none text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    WEAR IT. YOUR WAY.
                  </p>
                </div>

                <div className="ml-2 hidden h-8 w-px bg-[#CBCAC8]/10 sm:block" />

                <div className="hidden sm:block">
                  <p className="font-mono text-[6px] uppercase tracking-[0.25em] text-[#666362]">
                    Origin
                  </p>

                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-[#CBCAC8]/65">
                    Made in India
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                DESKTOP COLLECTION CARD
            ================================================= */}

            <div className="relative hidden lg:block">
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CBCAC8]/[0.045]" />

              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#DA0D12]/[0.05]" />

              <CollectionCard
                activeMedia={activeMedia}
                setActiveMedia={setActiveMedia}
              />

              {/* =================================================
                  FLOATING DOG TAG
              ================================================= */}

              <div className="absolute -right-8 bottom-[70px] z-50 hidden rotate-[5deg] xl:block">
                <div className="relative flex h-[74px] w-[110px] items-center justify-center rounded-[16px] border border-[#CBCAC8]/10 bg-[#161616]/85 shadow-[0_15px_45px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                  <div className="absolute left-3 top-3 h-2 w-2 rounded-full border border-[#666362]" />

                  <div className="text-center">
                    <PawIcon className="mx-auto h-4 w-4 text-[#DA0D12]" />

                    <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.18em] text-[#666362]">
                      Member
                    </p>

                    <p
                      className="mt-0.5 text-[14px] leading-none text-[#CBCAC8]"
                      style={{
                        fontFamily:
                          "var(--font-bebas-neue), Impact, sans-serif",
                      }}
                    >
                      TB / 26
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            BOTTOM STRIP

            ORDER 4
        ==================================================== */}

        <div className="order-4 border-t border-[#CBCAC8]/8 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DA0D12]/10">
                <PawIcon className="h-3 w-3 text-[#DA0D12]" />
              </span>

              <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#666362]">
                Good clothes. Good energy. Same pack.
              </span>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <span className="h-px w-10 bg-[#CBCAC8]/10" />

              <span className="font-mono text-[6px] uppercase tracking-[0.25em] text-[#424141]">
                Designed for the pack
              </span>

              <span className="h-px w-10 bg-[#CBCAC8]/10" />
            </div>

            <a
              href="#new-drop"
              className="
                group
                flex
                items-center
                justify-center
                gap-2
                font-mono
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-[#666362]
                transition-colors
                hover:text-[#CBCAC8]
                sm:justify-start
              "
            >
              <span>Discover more</span>

              <span className="transition-transform duration-300 group-hover:translate-y-1">
                <ArrowDownIcon />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ======================================================
          DESKTOP SIDE LABELS
      ====================================================== */}

      <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 -rotate-90 items-center gap-3 xl:flex">
        <span className="h-px w-8 bg-[#CBCAC8]/10" />

        <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-[#424141]">
          One pack / One identity
        </span>
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 z-20 hidden translate-y-1/2 rotate-90 items-center gap-3 xl:flex">
        <span className="font-mono text-[6px] uppercase tracking-[0.3em] text-[#424141]">
          Wear your identity
        </span>

        <span className="h-px w-8 bg-[#CBCAC8]/10" />
      </div>

      {/* ======================================================
          CORNER MARKERS
      ====================================================== */}

      <div className="pointer-events-none absolute left-5 top-[18%] hidden h-4 w-4 border-l border-t border-[#CBCAC8]/10 lg:block" />

      <div className="pointer-events-none absolute right-5 top-[18%] hidden h-4 w-4 border-r border-t border-[#CBCAC8]/10 lg:block" />

      <div className="pointer-events-none absolute bottom-[9%] left-5 hidden h-4 w-4 border-b border-l border-[#CBCAC8]/10 lg:block" />

      <div className="pointer-events-none absolute bottom-[9%] right-5 hidden h-4 w-4 border-b border-r border-[#CBCAC8]/10 lg:block" />
    </section>
  );
}
