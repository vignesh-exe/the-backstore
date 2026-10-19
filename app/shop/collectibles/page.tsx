"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

type CollectibleImage = {
  id?: string;
  image_url?: string | null;
  cloudinary_public_id?: string | null;
  alt_text?: string | null;
  sort_order?: number | null;
  is_primary?: boolean | null;
};

type Collectible = {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  category: string;
  collection: string;
  sku: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  status: string;
  featured: boolean;
  tags: string[];
  collectible_images: CollectibleImage[];
};

const collections = [
  "All Collections",
  "Anime",
  "Comic",
  "Kollywood",
  "Sports",
  "Cinephile",
  "F1",
  "Football",
  "Cricket",
  "Memes",
  "Motivational Quotes",
  "Garage Culture",
  "Music",
];

const categories = [
  "All Categories",
  "Anime Toys",
  "Posters",
  "3D Toys",
  "Frames",
  "Die Cast Models",
  "Katanas",
];

const priceRanges = [
  { label: "Under ₹500", min: 0, max: 499 },
  { label: "₹500 – ₹999", min: 500, max: 999 },
  { label: "₹1,000 – ₹1,499", min: 1000, max: 1499 },
  { label: "₹1,500+", min: 1500, max: Infinity },
];

function getDiscount(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function getCollectibleImage(collectible: Collectible) {
  const images = [...(collectible.collectible_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });
  return images[0]?.image_url || "";
}

function normalizeCollectible(raw: any): Collectible {
  const price = Number(raw?.price ?? 0);
  const mrp = Number(raw?.mrp ?? 0);
  const tags = Array.isArray(raw?.tags) ? raw.tags.filter(Boolean) : [];
  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? "Untitled Collectible"),
    description: raw?.description ?? "",
    brand: raw?.brand ?? "",
    category: String(raw?.category ?? "Collectible").trim(),
    collection: String(raw?.collection ?? tags[0] ?? "The Backstore").trim(),
    sku: String(raw?.sku ?? ""),
    price,
    mrp,
    discount: getDiscount(price, mrp),
    stock: Number(raw?.stock ?? 0),
    status: String(raw?.status ?? "Active"),
    featured: Boolean(raw?.featured),
    tags,
    collectible_images: Array.isArray(raw?.collectible_images)
      ? raw.collectible_images
      : [],
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function PawIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="7.2" cy="7.2" rx="2.1" ry="2.8" />
      <ellipse cx="12" cy="5.2" rx="2.1" ry="2.8" />
      <ellipse cx="16.8" cy="7.2" rx="2.1" ry="2.8" />
      <path d="M12 10.1c-3.3 0-5.9 2.4-5.9 5.1 0 2.1 1.6 3.2 3.5 2.6 1-.3 1.6-1 2.4-1s1.4.7 2.4 1c1.9.6 3.5-.5 3.5-2.6 0-2.7-2.6-5.1-5.9-5.1Z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function PackageIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function CollectibleArtwork() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111318]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(218,13,18,0.28),transparent_50%)]" />
      <div className="absolute left-[12%] top-[10%] h-[220px] w-[2px] rotate-[24deg] bg-[#DA0D12]/30" />
      <div className="absolute right-[15%] top-[5%] h-[260px] w-[2px] rotate-[-22deg] bg-[#DA0D12]/20" />
      <div className="relative flex h-[72%] w-[62%] items-center justify-center">
        <div
          className="absolute inset-0 bg-[#080808]"
          style={{
            clipPath:
              "polygon(22% 7%,39% 0,50% 8%,61% 0,78% 7%,91% 27%,77% 39%,70% 30%,70% 100%,30% 100%,30% 30%,23% 39%,9% 27%)",
          }}
        />
        <div className="relative z-10 text-center">
          <PawIcon className="mx-auto h-10 w-10 text-[#DA0D12]" />
          <div
            className="mt-4 text-[48px] leading-[0.72] text-white"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            COLLECT
          </div>
          <div
            className="text-[48px] leading-[0.72] text-[#DA0D12]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            DIFFERENT
          </div>
          <div className="mt-3 text-[8px] font-bold uppercase tracking-[0.3em] text-white/35">
            The Backstore
          </div>
        </div>
      </div>
      <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
        COLLECT / 002
      </span>
    </div>
  );
}

function CollectibleCard({ collectible }: { collectible: Collectible }) {
  const router = useRouter();
  const image = getCollectibleImage(collectible);
  const discount =
    collectible.discount > 0
      ? collectible.discount
      : getDiscount(collectible.price, collectible.mrp);

  const openCollectible = () => {
    router.push(`/shop/collectibles/product/${slugify(collectible.name)}`);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View ${collectible.name}`}
      onClick={openCollectible}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCollectible();
        }
      }}
      className="group flex h-full min-w-0 cursor-pointer flex-col outline-none"
    >
      <div className="relative aspect-[0.84] w-full overflow-hidden rounded-[28px] border border-[#CBCAC8]/15 bg-[#171717] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#CBCAC8]/30 group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.42)]">
        {image ? (
          <img
            src={image}
            alt={collectible.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <CollectibleArtwork />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/[0.04]" />
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/[0.10] bg-[#DA0D12]/95 px-1.5 shadow-[0_8px_20px_rgba(218,13,18,0.18)] backdrop-blur-md">
            <span className="font-[var(--font-outfit)] text-[9px] font-bold leading-none tracking-[-0.02em] text-white">
              -{discount}%
            </span>
          </div>
        )}
        {collectible.featured && (
          <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 backdrop-blur-md">
            <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-white">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-5 sm:px-3 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2
              title={collectible.name}
              className="min-w-0 max-w-full truncate text-[26px] leading-[0.82] text-[#CBCAC8] sm:text-[31px]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              {collectible.name}
            </h2>
            <p className="mt-3 line-clamp-1 text-[10px] uppercase tracking-[0.22em] text-[#666362] sm:text-[11px]">
              {collectible.category}
              {collectible.collection ? ` / ${collectible.collection}` : ""}
            </p>
          </div>
          <div className="shrink-0 pt-1 text-right">
            <span className="font-mono text-[14px] font-medium tracking-[-0.02em] text-[#CBCAC8]/80 sm:text-[16px]">
              {formatPrice(collectible.price)}
            </span>
            {collectible.mrp > collectible.price && (
              <span className="mt-1 block font-mono text-[10px] text-[#666362] line-through sm:text-[11px]">
                {formatPrice(collectible.mrp)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function FilterSection({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-[24px] leading-none text-[#CBCAC8]"
          style={{
            fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
          }}
        >
          {title}
        </h3>
        <span className="font-mono text-[9px] text-[#666362]">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const active = selected === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={`flex w-full items-center gap-2.5 rounded-[10px] px-2 py-2 text-left transition-all ${
                active
                  ? "bg-[#DA0D12]/10 text-[#CBCAC8]"
                  : "text-[#666362] hover:bg-[#CBCAC8]/[0.035] hover:text-[#CBCAC8]"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border ${
                  active
                    ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                    : "border-[#666362]/50"
                }`}
              >
                {active && <CheckIcon />}
              </span>
              <span className="text-[10px]">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CollectiblesPageContent() {
  const searchParams = useSearchParams();
  const collectionFromUrl = searchParams.get("collection");

  const [selectedCollection, setSelectedCollection] =
    useState("All Collections");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const requestedCollection = collectionFromUrl?.trim();
    if (!requestedCollection) {
      setSelectedCollection("All Collections");
      return;
    }
    const matchedCollection = collections.find(
      (collection) =>
        collection.toLowerCase() === requestedCollection.toLowerCase(),
    );
    setSelectedCollection(matchedCollection ?? "All Collections");
  }, [collectionFromUrl]);

  useEffect(() => {
    let cancelled = false;

    const loadCollectibles = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/admin/collectibles", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || data?.error || "Failed to load collectibles.",
          );
        }

        const normalized = Array.isArray(data.collectibles)
          ? data.collectibles.map(normalizeCollectible)
          : [];

        if (!cancelled) {
          setCollectibles(normalized);
        }
      } catch (error) {
        console.error("Collectibles load error:", error);
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load collectibles.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCollectibles();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCollectibles = useMemo(() => {
    const activePriceRange = priceRanges.find(
      (range) => range.label === selectedPrice,
    );

    return collectibles
      .filter((collectible) => {
        if (selectedCollection === "All Collections") {
          return true;
        }

        return (
          collectible.collection.trim().toLowerCase() ===
          selectedCollection.trim().toLowerCase()
        );
      })
      .filter((collectible) => {
        if (selectedCategory === "All Categories") {
          return true;
        }

        return collectible.category === selectedCategory;
      })
      .filter((collectible) => {
        if (selectedPrice === "All Prices" || !activePriceRange) {
          return true;
        }

        return (
          collectible.price >= activePriceRange.min &&
          collectible.price <= activePriceRange.max
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") {
          return a.price - b.price;
        }

        if (sort === "price-high") {
          return b.price - a.price;
        }

        if (sort === "name-az") {
          return a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
            numeric: true,
          });
        }

        if (sort === "name-za") {
          return b.name.localeCompare(a.name, undefined, {
            sensitivity: "base",
            numeric: true,
          });
        }

        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
  }, [collectibles, selectedCollection, selectedCategory, selectedPrice, sort]);

  const activeFilterCount =
    (selectedCollection !== "All Collections" ? 1 : 0) +
    (selectedCategory !== "All Categories" ? 1 : 0) +
    (selectedPrice !== "All Prices" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCollection("All Collections");
    setSelectedCategory("All Categories");
    setSelectedPrice("All Prices");
  };

  return (
    <main className="min-h-screen bg-[#080808] px-4 pb-24 pt-32 text-[#CBCAC8]">
      <Navbar />
      <section className="mx-auto max-w-[1180px]">
        <header className="mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <PawIcon className="h-3 w-3 text-[#DA0D12]" />
                <p className="font-[var(--font-outfit)] text-[10px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
                  The Backstore / Collection 02
                </p>
              </div>
              <h1
                className="text-[calc(clamp(4.5rem,10vw,8.5rem)+2px)] leading-[0.78] tracking-[0.01em] text-[#CBCAC8]"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                COLLECTIBLES
              </h1>
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#DA0D12]" />
                <span className="font-[var(--font-outfit)] text-[10px] uppercase tracking-[0.2em] text-[#666362]">
                  {collectibles.length} pieces / collector&apos;s collection
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#666362]">
                Sort Collection
              </label>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 min-w-[180px] rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[11px] text-[#CBCAC8] outline-none transition-colors focus:border-[#DA0D12]/50"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>
            </div>
          </div>
          <div className="mt-8 h-px w-full bg-[#CBCAC8]/10" />
        </header>

        <div className="mb-5 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#CBCAC8]"
          >
            <FilterIcon />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DA0D12] px-1 text-[9px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[10px] text-[#CBCAC8] outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
          </select>
        </div>

        {mobileFiltersOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-[100] md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Collectible filters"
            >
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-[2px]"
              />
              <div className="fixed inset-x-0 bottom-0 z-[101] flex h-[min(90dvh,760px)] max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[28px] border-t border-[#CBCAC8]/10 bg-[#111111] shadow-[0_-24px_80px_rgba(0,0,0,0.55)]">
                <div className="flex shrink-0 justify-center pt-3">
                  <span className="h-1 w-10 rounded-full bg-[#CBCAC8]/20" />
                </div>
                <div className="flex shrink-0 items-center justify-between border-b border-[#CBCAC8]/10 px-5 pb-4 pt-3">
                  <div>
                    <h2
                      className="text-[26px] leading-none text-[#CBCAC8]"
                      style={{
                        fontFamily:
                          "var(--font-bebas-neue), Impact, sans-serif",
                      }}
                    >
                      FILTERS
                    </h2>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#666362]">
                      {activeFilterCount > 0
                        ? `${activeFilterCount} active`
                        : "Refine the collection"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#666362] transition-colors hover:text-[#CBCAC8]"
                  >
                    Clear all
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                  <FilterSection
                    title="Collections"
                    items={collections}
                    selected={selectedCollection}
                    onSelect={setSelectedCollection}
                  />
                  <div className="my-6 h-px bg-[#CBCAC8]/8" />
                  <FilterSection
                    title="Categories"
                    items={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                  <div className="my-6 h-px bg-[#CBCAC8]/8" />
                  <FilterSection
                    title="Price"
                    items={[
                      "All Prices",
                      ...priceRanges.map((range) => range.label),
                    ]}
                    selected={selectedPrice}
                    onSelect={setSelectedPrice}
                  />
                </div>
                <div className="shrink-0 border-t border-[#CBCAC8]/10 bg-[#111111] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#DA0D12] text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90"
                  >
                    Show {filteredCollectibles.length} Collectibles
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[210px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-28 rounded-[20px] border border-[#CBCAC8]/10 bg-[#111111] p-5">
              <FilterSection
                title="Collections"
                items={collections}
                selected={selectedCollection}
                onSelect={setSelectedCollection}
              />
              <div className="my-6 h-px bg-[#CBCAC8]/8" />
              <FilterSection
                title="Categories"
                items={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
              <div className="my-6 h-px bg-[#CBCAC8]/8" />
              <FilterSection
                title="Price"
                items={[
                  "All Prices",
                  ...priceRanges.map((range) => range.label),
                ]}
                selected={selectedPrice}
                onSelect={setSelectedPrice}
              />
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 w-full text-left text-[9px] font-semibold uppercase tracking-[0.16em] text-[#666362] transition-colors hover:text-[#CBCAC8]"
              >
                Clear all filters
              </button>
              <div className="mt-7 rounded-[14px] bg-[#DA0D12]/8 p-3">
                <div className="flex items-center gap-2">
                  <PawIcon className="h-3 w-3 text-[#DA0D12]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#DA0D12]">
                    Backstore
                  </span>
                </div>
                <p className="mt-2 text-[9px] leading-relaxed text-[#666362]">
                  Collectibles made for people who collect what they love.
                </p>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#666362]">
                Showing{" "}
                <span className="text-[#CBCAC8]">
                  {filteredCollectibles.length}
                </span>{" "}
                collectibles
              </p>
              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1 w-1 rounded-full bg-[#DA0D12]" />
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#666362]">
                  Collector&apos;s Drop
                </span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[22px] border border-[#CBCAC8]/10 bg-[#111111]"
                  >
                    <div className="aspect-[0.86] animate-pulse bg-[#171717]" />
                    <div className="space-y-3 p-4">
                      <div className="h-2 w-16 animate-pulse rounded bg-[#252525]" />
                      <div className="h-6 w-3/4 animate-pulse rounded bg-[#252525]" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-[#252525]" />
                      <div className="h-5 w-1/3 animate-pulse rounded bg-[#252525]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-[22px] border border-[#DA0D12]/20 bg-[#111111] px-6">
                <div className="text-center">
                  <PawIcon className="mx-auto h-7 w-7 text-[#DA0D12]" />
                  <h2
                    className="mt-4 text-[38px] text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    COLLECTIBLES OFFLINE
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-[11px] leading-relaxed text-[#666362]">
                    {loadError}
                  </p>
                </div>
              </div>
            ) : filteredCollectibles.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {filteredCollectibles.map((collectible) => (
                  <CollectibleCard
                    key={collectible.id}
                    collectible={collectible}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-[22px] border border-[#CBCAC8]/10 bg-[#111111]">
                <div className="text-center">
                  <PackageIcon className="mx-auto h-7 w-7 text-[#DA0D12]" />
                  <h2
                    className="mt-4 text-[38px] text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    NO COLLECTIBLES FOUND
                  </h2>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#666362]">
                    Try another collection
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CollectiblesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080808] px-4 pb-24 pt-32 text-[#CBCAC8]" />
      }
    >
      <CollectiblesPageContent />
    </Suspense>
  );
}
