"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
type CollectibleImage = {
  image_url?: string | null;
  is_primary?: boolean;
  sort_order?: number;
  alt_text?: string | null;
};
type Collectible = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  collection?: string | null;
  category?: string | null;
  price: number;
  mrp?: number;
  stock: number;
  status?: string | null;
  featured?: boolean;
  created_at?: string;
  collectible_images?: CollectibleImage[];
  image_url?: string | null;
};
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function formatPrice(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}
function getImage(item: Collectible) {
  const images = [...(item.collectible_images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  return (
    images.find((image) => image.image_url)?.image_url || item.image_url || ""
  );
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M4.5 12h14M12.5 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function TrendingCollectibles() {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    async function loadCollectibles() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/admin/collectibles", {
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok)
          throw new Error(
            payload?.error || "Unable to load trending collectibles.",
          );
        const rows: Collectible[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.collectibles)
            ? payload.collectibles
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
        if (!cancelled) setCollectibles(rows);
      } catch (loadError) {
        if (!cancelled)
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load trending collectibles.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadCollectibles();
    return () => {
      cancelled = true;
    };
  }, []);
  const trending = useMemo(() => {
    const available = collectibles.filter(
      (item) => item.status !== "Inactive" && Number(item.stock ?? 0) > 0,
    );
    available.sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured))
        return a.featured ? -1 : 1;
      return (
        new Date(b.created_at ?? 0).getTime() -
        new Date(a.created_at ?? 0).getTime()
      );
    });
    return available;
  }, [collectibles]);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || trending.length < 2 || loading || error) return;
    const interval = window.setInterval(() => {
      const firstCard = track.querySelector<HTMLElement>(
        "[data-trending-card]",
      );
      if (!firstCard) return;
      const gap =
        Number.parseFloat(window.getComputedStyle(track).columnGap || "0") || 0;
      const step = firstCard.offsetWidth + gap;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft <= 8) {
        track.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        track.scrollBy({ left: -step, behavior: "smooth" });
      }
    }, 3000);
    return () => window.clearInterval(interval);
  }, [trending.length, loading, error]);
  return (
    <section className="hype-radar relative isolate overflow-hidden bg-[#F3EBDD] px-4 py-14 text-[#171717] sm:px-7 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col gap-7 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em] text-[#DA0D12]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#DA0D12] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#DA0D12]" />
              </span>
              The Hype / Shelf Finds
            </div>
            <h2
              className="max-w-[760px] text-[clamp(4rem,8vw,7rem)] uppercase leading-[0.78] tracking-[-0.035em] text-[#171717]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              SHELF <span className="text-[#DA0D12]">WORTHY.</span>
            </h2>
          </div>
          <div className="max-w-[350px] lg:pb-1">
            <p className="text-sm leading-6 text-[#5E574E]">
              Figures, art, and rare finds worth making room for. Discover the
              pieces that give your collection its character.
            </p>
            <div className="mt-4 flex items-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[#71695F]">
              <span className="h-px w-9 bg-[#DA0D12]" />
              Chosen for your shelf
            </div>
          </div>
        </div>
        <div className="mb-5 flex items-center justify-between border-y border-black/15 py-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[#71695F]">
          <span>Shelf finds / collectibles</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DA0D12]" /> The
            latest finds
          </span>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[0.82/1] w-[76vw] shrink-0 animate-pulse border border-black/10 bg-[#E7DCCB] sm:w-[calc((100%_-_2.5rem)_/_3)] lg:w-[calc((100%_-_6rem)_/_5)]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-[#DA0D12]/25 bg-[#E7DCCB] px-5 py-8 text-center">
            <p className="text-sm text-[#171717]">
              Trending collectibles are unavailable right now.
            </p>
            <p className="mt-2 text-xs text-[#71695F]">{error}</p>
          </div>
        ) : trending.length === 0 ? (
          <div className="rounded-2xl border border-black/15 bg-[#E7DCCB] px-5 py-10 text-center">
            <p className="text-lg text-[#171717]">The radar is warming up.</p>
            <p className="mt-2 text-sm text-[#71695F]">
              Available collectibles will appear here as they are added to the
              store.
            </p>
          </div>
        ) : (
          <div
            ref={trackRef}
            className={`trending-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 sm:gap-5 lg:gap-6 ${trending.length === 1 ? "justify-center" : ""}`}
          >
            {trending.map((item, index) => {
              const image = getImage(item);
              const href = `/shop/collectibles/product/${item.slug || slugify(item.name)}`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  data-trending-card
                  className="hype-card group relative block w-[76vw] shrink-0 snap-start sm:w-[calc((100%_-_2.5rem)_/_3)] lg:w-[calc((100%_-_6rem)_/_5)]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="overflow-hidden border border-[#D8CDBB] bg-[#FFFCF6] shadow-[0_4px_18px_rgba(45,35,20,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#DA0D12]/50 group-hover:shadow-[0_14px_32px_rgba(45,35,20,0.12)]">
                    <div className="relative aspect-[0.82/1] overflow-hidden bg-[#E8E0D4]">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(218,13,18,0.2),transparent_55%),linear-gradient(145deg,#292929,#151515)] px-4 text-center">
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40">
                            The Backstore / Collectible
                          </span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />
                      <div className="absolute left-3 top-3 flex items-center gap-2 bg-[#DA0D12] px-3 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.18em] text-white sm:left-3 sm:top-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#DA0D12]" />
                        {item.featured ? "Featured" : "Collectible"}
                      </div>
                      <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFCF6] text-[#171717] shadow-md transition-all duration-300 group-hover:bg-[#DA0D12] group-hover:text-white sm:right-3 sm:top-3 sm:h-10 sm:w-10">
                        <ArrowIcon />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                        <div className="mb-2 inline-flex border border-white/40 bg-black/45 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                          {item.collection || item.category || "Collectibles"}
                        </div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/90">
                          Pack / {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <div className="relative min-h-[126px] px-4 py-4 sm:min-h-[142px] sm:px-5 sm:py-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#DA0D12]">
                            {item.featured ? "Featured find" : "Fresh find"}
                          </p>
                          <h3
                            className="line-clamp-2 text-[17px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#171717] sm:text-[19px]"
                            style={{
                              fontFamily:
                                "var(--font-bebas-neue), Impact, sans-serif",
                            }}
                          >
                            {item.name}
                          </h3>
                        </div>
                        <span className="shrink-0 pt-1 text-xs font-medium text-[#171717] sm:text-sm">
                          {formatPrice(Number(item.price ?? 0))}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#E4D9C8] pt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-[#71695F]">
                        <span className="truncate">
                          {item.category || item.collection || "Collectible"}
                        </span>
                        <span className="shrink-0">Explore ↗</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <div className="mt-7 flex flex-col gap-4 border-t border-black/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#71695F]">
            Small details. Serious shelf appeal.
          </p>
          <Link
            href="/shop/collectibles"
            className="group inline-flex items-center justify-center gap-3 self-start rounded-full border border-black/20 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[#171717] transition-all duration-300 hover:border-[#DA0D12] hover:bg-[#DA0D12] hover:text-white sm:self-auto"
          >
            Explore the collection{" "}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .trending-track {
          scrollbar-width: none;
        }
        .trending-track::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .trending-track {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </section>
  );
}
