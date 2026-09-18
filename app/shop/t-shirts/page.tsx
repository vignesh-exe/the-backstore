"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { supabase } from "@/lib/supabase";

type ProductImage = {
  id?: string;
  image_url?: string | null;
  cloudinary_public_id?: string | null;
  alt_text?: string | null;
  sort_order?: number | null;
  is_primary?: boolean | null;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  collection: string;
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  status: string;
  featured: boolean;
  tags: string[];
  product_images: ProductImage[];
};

const collections = [
  "All Collections",
  "Anime",
  "Sports",
  "Football",
  "Doomsday",
  "Streetwear",
  "Fandom",
  "New Arrivals",
];

const categories = [
  "All Products",
  "Oversized T-Shirt",
  "T-Shirt",
  "Hoodie",
  "Sweatshirt",
  "Footwear",
];

function getDiscount(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function getProductImage(product: Product) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return images[0]?.image_url || "";
}

function normalizeProduct(raw: any): Product {
  const tags = Array.isArray(raw?.tags) ? raw.tags.filter(Boolean) : [];
  const price = Number(raw?.price ?? 0);
  const mrp = Number(raw?.mrp ?? 0);

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? "Untitled Product"),
    description: raw?.description ?? "",
    category: String(raw?.category ?? raw?.category_name ?? "T-Shirt"),
    collection: String(tags[0] ?? "The Backstore"),
    price,
    mrp,
    discount: getDiscount(price, mrp),
    stock: Number(raw?.stock ?? 0),
    status: String(raw?.status ?? "Active"),
    featured: Boolean(raw?.featured ?? raw?.is_featured),
    tags,
    product_images: Array.isArray(raw?.product_images)
      ? raw.product_images
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

function HeartIcon({
  active,
  className = "h-[19px] w-[19px]",
}: {
  active: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.2 8.9c0 5.1-8.2 10.2-8.2 10.2S3.8 14 3.8 8.9a4.45 4.45 0 0 1 8.2-2.45A4.45 4.45 0 0 1 20.2 8.9Z" />
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

/* ================================================================
   MOCK PRODUCT ART
================================================================ */

function ProductArtwork({
  design,
}: {
  design: "dog" | "comic" | "anime" | "minimal";
}) {
  if (design === "dog") {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#171717]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(218,13,18,0.22),transparent_45%)]" />

        <div className="relative flex h-[78%] w-[58%] items-center justify-center">
          <div
            className="absolute inset-0 bg-[#0b0b0b]"
            style={{
              clipPath:
                "polygon(22% 7%, 39% 0, 50% 8%, 61% 0, 78% 7%, 91% 27%, 77% 39%, 70% 30%, 70% 100%, 30% 100%, 30% 30%, 23% 39%, 9% 27%)",
            }}
          />

          <div className="relative z-10 mt-6 text-center">
            <PawIcon className="mx-auto h-12 w-12 text-[#DA0D12]" />

            <div
              className="mt-2 text-[27px] leading-none text-white"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              BACKSTORE
            </div>

            <div className="mt-1 text-[6px] font-bold uppercase tracking-[0.3em] text-white/40">
              Made For The Pack
            </div>
          </div>
        </div>

        <span className="absolute bottom-5 left-5 font-mono text-[7px] uppercase tracking-[0.2em] text-white/20">
          BS / 001
        </span>
      </div>
    );
  }

  if (design === "comic") {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#e9e5df]">
        <div className="absolute -left-[15%] top-[22%] h-[85px] w-[130%] rotate-[-8deg] bg-[#DA0D12]" />

        <div className="relative flex h-[78%] w-[58%] items-center justify-center">
          <div
            className="absolute inset-0 bg-[#171717]"
            style={{
              clipPath:
                "polygon(22% 7%, 39% 0, 50% 8%, 61% 0, 78% 7%, 91% 27%, 77% 39%, 70% 30%, 70% 100%, 30% 100%, 30% 30%, 23% 39%, 9% 27%)",
            }}
          />

          <div className="relative z-10 rotate-[-5deg] px-4 text-center">
            <div
              className="text-[42px] leading-[0.75] text-white"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              NO
            </div>

            <div
              className="text-[42px] leading-[0.75] text-[#DA0D12]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              RULES
            </div>

            <div className="mt-3 inline-block bg-white px-2 py-1 text-[6px] font-black uppercase tracking-[0.2em] text-black">
              EST. 2026
            </div>
          </div>
        </div>

        <span className="absolute bottom-5 right-5 font-mono text-[7px] text-black/30">
          DROP / 002
        </span>
      </div>
    );
  }

  if (design === "anime") {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111318]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(218,13,18,0.3),transparent_48%)]" />

        <div className="absolute left-[10%] top-[14%] h-[180px] w-[2px] rotate-[25deg] bg-[#DA0D12]/50" />

        <div className="absolute right-[15%] top-[5%] h-[230px] w-[2px] rotate-[-20deg] bg-[#DA0D12]/30" />

        <div className="relative flex h-[78%] w-[58%] items-center justify-center">
          <div
            className="absolute inset-0 bg-[#080808]"
            style={{
              clipPath:
                "polygon(22% 7%, 39% 0, 50% 8%, 61% 0, 78% 7%, 91% 27%, 77% 39%, 70% 30%, 70% 100%, 30% 100%, 30% 30%, 23% 39%, 9% 27%)",
            }}
          />

          <div className="relative z-10 text-center">
            <div className="mb-2 text-[7px] font-bold uppercase tracking-[0.35em] text-[#DA0D12]">
              Anime Division
            </div>

            <div
              className="text-[48px] leading-[0.75] text-white"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              OTaku
            </div>

            <div
              className="text-[28px] leading-none text-[#DA0D12]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              MODE
            </div>
          </div>
        </div>

        <span className="absolute bottom-5 left-5 font-mono text-[7px] text-white/20">
          ANIME / 003
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#d7d1c8]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(135deg,transparent_45%,#111_46%,#111_48%,transparent_49%)] [background-size:18px_18px]" />

      <div className="relative flex h-[78%] w-[58%] items-center justify-center">
        <div
          className="absolute inset-0 bg-[#151515]"
          style={{
            clipPath:
              "polygon(22% 7%, 39% 0, 50% 8%, 61% 0, 78% 7%, 91% 27%, 77% 39%, 70% 30%, 70% 100%, 30% 100%, 30% 30%, 23% 39%, 9% 27%)",
          }}
        />

        <div className="relative z-10 text-center">
          <div className="text-[7px] font-bold uppercase tracking-[0.3em] text-white/40">
            The Backstore
          </div>

          <div
            className="mt-3 text-[45px] leading-[0.72] text-white"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            MADE
          </div>

          <div
            className="text-[45px] leading-[0.72] text-[#DA0D12]"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            DIFFERENT
          </div>
        </div>
      </div>

      <span className="absolute bottom-5 right-5 font-mono text-[7px] text-black/30">
        STREET / 004
      </span>
    </div>
  );
}

/* ================================================================
   PRODUCT CARD
================================================================ */

function ProductCard({
  product,
  isWishlisted,
  onWishlist,
  wishlistLoading,
}: {
  product: Product;
  isWishlisted: boolean;
  onWishlist: () => void;
  wishlistLoading?: boolean;
}) {
  const router = useRouter();
  const productSlug = slugify(product.name);
  const discount =
    product.discount > 0
      ? product.discount
      : getDiscount(product.price, product.mrp);

  const openProduct = () => {
    router.push(`/shop/t-shirts/product/${productSlug}`);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProduct();
        }
      }}
      className="group flex h-full min-w-0 cursor-pointer flex-col outline-none"
    >
      {/* ============================================================
          IMAGE / ARTWORK PANEL
      ============================================================ */}
      <div className="relative aspect-[0.84] w-full overflow-hidden rounded-[28px] border border-[#CBCAC8]/15 bg-[#171717] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#CBCAC8]/30 group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.42)]">
        {getProductImage(product) ? (
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <ProductArtwork design="dog" />
        )}

        {/* Soft editorial overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/[0.04]" />
        {/* Tiny discount marker */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/[0.10] bg-[#DA0D12]/95 px-1.5 backdrop-blur-md shadow-[0_8px_20px_rgba(218,13,18,0.18)]">
            <span className="font-[var(--font-outfit)] text-[7px] font-bold leading-none tracking-[-0.02em] text-white">
              -{discount}%
            </span>
          </div>
        )}

        {/* Minimal wishlist control */}
        <button
          type="button"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={(event) => {
            event.stopPropagation();
            onWishlist();
          }}
          disabled={wishlistLoading}
          aria-busy={wishlistLoading}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-wait disabled:opacity-70 ${
            isWishlisted
              ? "border-[#DA0D12]/50 bg-[#DA0D12] text-white shadow-[0_10px_30px_rgba(218,13,18,0.22)]"
              : "border-white/[0.10] bg-[#111111]/75 text-[#CBCAC8] hover:border-white/20 hover:bg-[#222222]"
          }`}
        >
          <HeartIcon active={isWishlisted} className="h-4 w-4" />
        </button>
      </div>

      {/* ============================================================
          EDITORIAL PRODUCT META
      ============================================================ */}
      <div className="flex flex-1 flex-col px-2 pt-5 sm:px-3 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className="line-clamp-2 text-[24px] leading-[0.82] text-[#CBCAC8] sm:text-[29px]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              {product.name}
            </h2>

            <p className="mt-3 line-clamp-1 text-[8px] uppercase tracking-[0.22em] text-[#666362] sm:text-[9px]">
              {product.category}
              {product.collection ? ` / ${product.collection}` : ""}
            </p>
          </div>

          {/* Price stays visually aligned with the product title block */}
          <div className="shrink-0 pt-1 text-right">
            <span className="font-mono text-[12px] font-medium tracking-[-0.02em] text-[#CBCAC8]/80 sm:text-[14px]">
              {formatPrice(product.price)}
            </span>

            {product.mrp > product.price && (
              <span className="mt-1 block font-mono text-[8px] text-[#666362] line-through sm:text-[9px]">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function TshirtsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCollection, setSelectedCollection] =
    useState("All Collections");

  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const [sort, setSort] = useState("featured");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/admin/products", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || data?.error || "Failed to load products.",
          );
        }

        const normalized = Array.isArray(data.products)
          ? data.products.map(normalizeProduct)
          : [];

        if (!cancelled) {
          setProducts(normalized);
        }
      } catch (error) {
        console.error("T-shirts products load error:", error);

        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : "Failed to load products.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Load the logged-in user's wishlist from Supabase.
   * Supabase is the persistent source of truth; local state is used
   * only to render the current page immediately.
   */
  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session?.user) {
          if (!cancelled) {
            setWishlist([]);
          }
          return;
        }

        const { data, error: wishlistError } = await supabase
          .from("wishlist_items")
          .select("product_id")
          .eq("user_id", session.user.id);

        if (wishlistError) {
          throw wishlistError;
        }

        if (!cancelled) {
          const wishlistIds = (data ?? [])
            .map((item) => String(item.product_id))
            .filter(Boolean);

          setWishlist(wishlistIds);
        }
      } catch (wishlistError) {
        console.error("Failed to load wishlist:", wishlistError);

        if (!cancelled) {
          setWishlist([]);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * The Navbar and WishlistDrawer read wishlist state from Redux.
   * Hydrate Redux from the persisted Supabase wishlist once both
   * the wishlist IDs and the product list are available.
   */
  useEffect(() => {
    if (!products.length || !wishlist.length) {
      return;
    }

    wishlist.forEach((productId) => {
      const product = products.find((item) => item.id === productId);

      if (product) {
        dispatch(addToWishlist({ product: product as any }));
      }
    });
  }, [dispatch, products, wishlist]);

  const toggleWishlist = async (id: string) => {
    if (wishlistLoadingIds.includes(id)) return;

    setWishlistLoadingIds((current) =>
      current.includes(id) ? current : [...current, id],
    );

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push(
          `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      const userId = session.user.id;
      const isCurrentlyWishlisted = wishlist.includes(id);

      if (isCurrentlyWishlisted) {
        const { error: deleteError } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);

        if (deleteError) {
          throw deleteError;
        }

        setWishlist((current) => current.filter((item) => item !== id));
        dispatch(removeFromWishlist({ productId: id }));
        return;
      }

      const { error: insertError } = await supabase
        .from("wishlist_items")
        .insert({
          user_id: userId,
          product_id: id,
        });

      if (insertError) {
        /*
         * The unique constraint prevents duplicates if the row already
         * exists because of a stale UI state or another tab.
         */
        if (insertError.code === "23505") {
          setWishlist((current) =>
            current.includes(id) ? current : [...current, id],
          );

          const product = products.find((item) => item.id === id);

          if (product) {
            dispatch(addToWishlist({ product: product as any }));
          }

          return;
        }

        throw insertError;
      }

      setWishlist((current) =>
        current.includes(id) ? current : [...current, id],
      );

      const product = products.find((item) => item.id === id);

      if (product) {
        dispatch(addToWishlist({ product: product as any }));
      }
    } catch (wishlistError) {
      console.error("Wishlist update failed:", wishlistError);

      toast.error(
        wishlistError instanceof Error
          ? wishlistError.message
          : "Unable to update wishlist.",
      );
    } finally {
      setWishlistLoadingIds((current) => current.filter((item) => item !== id));
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCollection === "All Collections") {
          return true;
        }

        return product.collection === selectedCollection;
      })
      .filter((product) => {
        if (selectedCategory === "All Products") {
          return true;
        }

        return product.category === selectedCategory;
      })
      .sort((a, b) => {
        if (sort === "price-low") {
          return a.price - b.price;
        }

        if (sort === "price-high") {
          return b.price - a.price;
        }

        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });
  }, [products, selectedCollection, selectedCategory, sort]);

  return (
    <main className="min-h-screen bg-[#080808] px-4 pb-24 pt-32 text-[#CBCAC8]">
      <section className="mx-auto max-w-[1180px]">
        {/* ========================================================
            HEADER
        ======================================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <PawIcon className="h-3 w-3 text-[#DA0D12]" />

                <p className="font-[var(--font-outfit)] text-[8px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
                  The Backstore / Collection 01
                </p>
              </div>

              <h1
                className="text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.78] tracking-[0.01em] text-[#CBCAC8]"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                T-SHIRTS
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[#DA0D12]" />

                <span className="font-[var(--font-outfit)] text-[8px] uppercase tracking-[0.2em] text-[#666362]">
                  {products.length} pieces / limited collection
                </span>
              </div>
            </div>

            {/* Desktop sort */}
            <div className="hidden md:block">
              <label className="mb-2 block text-[7px] font-semibold uppercase tracking-[0.2em] text-[#666362]">
                Sort Collection
              </label>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 min-w-[180px] rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[9px] text-[#CBCAC8] outline-none transition-colors focus:border-[#DA0D12]/50"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-[#CBCAC8]/10" />
        </header>

        {/* ========================================================
            MOBILE FILTER BUTTON
        ======================================================== */}

        <div className="mb-5 flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((current) => !current)}
            className="flex h-10 items-center gap-2 rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#CBCAC8]"
          >
            <FilterIcon />
            Filters
          </button>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 rounded-full border border-[#CBCAC8]/10 bg-[#161616] px-4 text-[8px] text-[#CBCAC8] outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
          </select>
        </div>

        {/* ========================================================
            MOBILE FILTERS
        ======================================================== */}

        {mobileFiltersOpen && (
          <div className="mb-5 rounded-[20px] border border-[#CBCAC8]/10 bg-[#111111] p-5 md:hidden">
            <FilterSection
              title="Collections"
              items={collections}
              selected={selectedCollection}
              onSelect={(value) => {
                setSelectedCollection(value);
                setMobileFiltersOpen(false);
              }}
            />

            <div className="mt-6">
              <FilterSection
                title="Categories"
                items={categories}
                selected={selectedCategory}
                onSelect={(value) => {
                  setSelectedCategory(value);
                  setMobileFiltersOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================
            CONTENT
        ======================================================== */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[210px_1fr]">
          {/* ======================================================
              DESKTOP SIDEBAR
          ====================================================== */}

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

              {/* Sidebar footer */}
              <div className="mt-7 rounded-[14px] bg-[#DA0D12]/8 p-3">
                <div className="flex items-center gap-2">
                  <PawIcon className="h-3 w-3 text-[#DA0D12]" />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[#DA0D12]">
                    Backstore
                  </span>
                </div>

                <p className="mt-2 text-[7px] leading-relaxed text-[#666362]">
                  Designs made from obsession, creativity and everyday culture.
                </p>
              </div>
            </div>
          </aside>

          {/* ======================================================
              PRODUCT GRID
          ====================================================== */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#666362]">
                Showing{" "}
                <span className="text-[#CBCAC8]">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="h-1 w-1 rounded-full bg-[#DA0D12]" />
                <span className="text-[7px] uppercase tracking-[0.18em] text-[#666362]">
                  Fresh Drop
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
                    className="mt-4 text-4xl text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    PRODUCTS OFFLINE
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-[9px] leading-relaxed text-[#666362]">
                    {loadError}
                  </p>
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    wishlistLoading={wishlistLoadingIds.includes(product.id)}
                    onWishlist={() => {
                      void toggleWishlist(product.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-[22px] border border-[#CBCAC8]/10 bg-[#111111]">
                <div className="text-center">
                  <PawIcon className="mx-auto h-7 w-7 text-[#DA0D12]" />

                  <h2
                    className="mt-4 text-4xl text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    NO DROPS FOUND
                  </h2>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-[#666362]">
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

/* ================================================================
   FILTER SECTION
================================================================ */

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
          className="text-[22px] leading-none text-[#CBCAC8]"
          style={{
            fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
          }}
        >
          {title}
        </h3>

        <span className="font-mono text-[7px] text-[#666362]">
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

              <span className="text-[8px]">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
