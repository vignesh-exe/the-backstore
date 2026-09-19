"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
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

type BackendProduct = {
  id: string;
  name: string;
  sku?: string | null;
  collection?: string | null;
  category?: string | null;
  gender?: string | null;
  fit?: string | null;
  mrp?: number | string | null;
  price?: number | string | null;
  stock?: number | null;
  description?: string | null;
  tags?: string[] | null;
  is_featured?: boolean | null;
  featured?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  product_images?: ProductImage[] | null;
};

type Product = BackendProduct & {
  image: string;
  categoryLabel: string;
  tag: string;
  priceLabel: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value: number | string | null | undefined) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "₹—";
  }

  return `₹${numericValue.toLocaleString("en-IN")}`;
}

function getPrimaryImage(product: BackendProduct) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (Boolean(a.is_primary) !== Boolean(b.is_primary)) {
      return a.is_primary ? -1 : 1;
    }

    return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
  });

  return images[0]?.image_url ?? "";
}

function normalizeProduct(product: BackendProduct): Product | null {
  if (!product?.id || !product?.name) {
    return null;
  }

  const image = getPrimaryImage(product);

  if (!image) {
    return null;
  }

  const collection = product.collection?.trim();
  const category = product.category?.trim();
  const gender = product.gender?.trim();

  const categoryLabel =
    [category, gender].filter(Boolean).join(" / ") ||
    collection ||
    "The Backstore";

  const tag =
    product.is_featured || product.featured
      ? "FEATURED"
      : collection || "NEW DROP";

  return {
    ...product,
    image,
    categoryLabel,
    tag,
    priceLabel: formatPrice(product.price),
  };
}

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

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

/* ============================================================
   PRODUCT CARD
============================================================ */

function ProductCard({
  product,
  index,
  isWishlisted,
  onWishlist,
  wishlistLoading,
}: {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onWishlist: () => void;
  wishlistLoading?: boolean;
}) {
  const router = useRouter();

  const openProduct = () => {
    router.push(`/shop/t-shirts/product/${slugify(product.name)}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProduct();
    }
  };

  return (
    <article
      className="group relative min-w-0 cursor-pointer"
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onClick={openProduct}
    >
      <div
        className="
          relative
          aspect-[0.82/1]
          overflow-hidden
          rounded-[22px]
          border
          border-[#CBCAC8]/10
          bg-[#424141]
          shadow-[0_20px_70px_rgba(0,0,0,0.22)]
          transition-all
          duration-500
          group-hover:-translate-y-1
          group-hover:border-[#CBCAC8]/20
          group-hover:shadow-[0_28px_80px_rgba(0,0,0,0.34)]
        "
      >
        <img
          src={product.image}
          alt={product.name}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.045]
          "
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#161616]/75 via-transparent to-[#161616]/5" />

        <div className="pointer-events-none absolute -bottom-20 -right-16 h-40 w-40 rounded-full bg-[#DA0D12]/15 blur-[65px]" />

        <div className="absolute left-4 right-4 top-4 z-20 flex items-start justify-between">
          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-[#CBCAC8]/10
              bg-[#161616]/65
              px-2.5
              py-1.5
              backdrop-blur-xl
            "
          >
            <PawIcon className="h-2.5 w-2.5 text-[#DA0D12]" />

            <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#CBCAC8]/75">
              {product.tag}
            </span>
          </div>

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
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-[#CBCAC8]/10
              bg-[#161616]/65
              text-[#CBCAC8]/70
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-[#DA0D12]/40
              hover:bg-[#DA0D12]
              hover:text-[#CBCAC8]
              disabled:cursor-wait
              disabled:opacity-70
            ${
              isWishlisted
                ? "border-[#DA0D12]/50 bg-[#DA0D12] text-[#CBCAC8]"
                : ""
            }`}
          >
            <HeartIcon filled={isWishlisted} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-20">
          <span className="font-mono text-[6px] tracking-[0.2em] text-[#CBCAC8]/45">
            PACK / {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#161616]/25 to-transparent" />
      </div>

      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="
                truncate
                text-[18px]
                leading-none
                tracking-[0.01em]
                text-[#CBCAC8]
              "
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              {product.name}
            </h3>

            <p className="mt-1.5 truncate font-mono text-[6px] uppercase tracking-[0.18em] text-[#666362]">
              {product.categoryLabel}
            </p>
          </div>

          <span className="shrink-0 font-mono text-[8px] tracking-[0.08em] text-[#CBCAC8]/80">
            {product.priceLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   MAIN SECTION
============================================================ */

type WishlistEntry = {
  id?: string | number;
  product_id?: string | number;
  product?: Product | null;
};

type WishlistState = {
  wishlist?: {
    wishlistItems?: WishlistEntry[];
  };
};

export default function NewDrop() {
  const router = useRouter();
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state: WishlistState) => state.wishlist?.wishlistItems ?? [],
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState<string[]>([]);
  const [persistedWishlistIds, setPersistedWishlistIds] = useState<string[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragDeltaXRef = useRef(0);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/admin/products", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load products (${response.status})`);
        }

        const payload = await response.json();

        const rawProducts: BackendProduct[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        const normalizedProducts = rawProducts
          .filter(
            (product) =>
              product?.is_active !== false &&
              (product?.is_featured === true || product?.featured === true),
          )
          .map(normalizeProduct)
          .filter((product): product is Product => Boolean(product));

        if (!cancelled) {
          setProducts(normalizedProducts);
          setCurrentIndex(0);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load products.",
          );
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
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
   * Supabase is the persistent source of truth; Redux is the shared UI
   * state used by the Navbar and WishlistDrawer.
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
            setPersistedWishlistIds([]);
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
          setPersistedWishlistIds(
            (data ?? []).map((item) => String(item.product_id)).filter(Boolean),
          );
        }
      } catch (wishlistError) {
        console.error("Failed to load wishlist:", wishlistError);

        if (!cancelled) {
          setPersistedWishlistIds([]);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Hydrate Redux after both the products and persisted wishlist are
   * available. This is what makes the Navbar count and WishlistDrawer
   * reflect wishlist items saved in Supabase.
   */
  useEffect(() => {
    if (!products.length || !persistedWishlistIds.length) {
      return;
    }

    persistedWishlistIds.forEach((productId) => {
      const product = products.find((item) => item.id === productId);

      if (product) {
        dispatch(addToWishlist({ product: product as any }));
      }
    });
  }, [dispatch, persistedWishlistIds, products]);

  const getWishlistProductId = (item: WishlistEntry) =>
    String(item.product_id ?? item.product?.id ?? item.id ?? "");

  const toggleWishlist = async (id: string) => {
    if (wishlistLoadingIds.includes(id)) {
      return;
    }

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
      const isCurrentlyWishlisted = wishlistItems.some(
        (item) => getWishlistProductId(item) === id,
      );

      if (isCurrentlyWishlisted) {
        const { error: deleteError } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);

        if (deleteError) {
          throw deleteError;
        }

        dispatch(removeFromWishlist({ productId: id }));
        setPersistedWishlistIds((current) =>
          current.filter((productId) => productId !== id),
        );
        return;
      }

      const { error: insertError } = await supabase
        .from("wishlist_items")
        .insert({
          user_id: userId,
          product_id: id,
        });

      if (insertError && insertError.code !== "23505") {
        throw insertError;
      }

      const product = products.find((item) => item.id === id);

      if (product) {
        dispatch(addToWishlist({ product: product as any }));
      }

      setPersistedWishlistIds((current) =>
        current.includes(id) ? current : [...current, id],
      );
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

  const carouselProducts =
    products.length > 0 ? [...products, ...products] : [];

  const moveCarousel = (direction: "next" | "previous") => {
    if (products.length <= 1) return;

    setCurrentIndex((current) =>
      direction === "next" ? current + 1 : Math.max(0, current - 1),
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStartXRef.current = event.clientX;
    dragDeltaXRef.current = 0;
    isDraggingRef.current = true;
    setIsDragging(true);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is not available in every browser context.
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const delta = event.clientX - dragStartXRef.current;
    dragDeltaXRef.current = delta;
    setDragOffset(delta);

    if (Math.abs(delta) > 8) {
      suppressClickRef.current = true;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const delta = dragDeltaXRef.current;

    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset(0);

    if (Math.abs(delta) >= 50) {
      moveCarousel(delta < 0 ? "next" : "previous");
    }

    dragDeltaXRef.current = 0;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already have been released.
    }

    if (suppressClickRef.current) {
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffset(0);
    dragDeltaXRef.current = 0;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already have been released.
    }

    suppressClickRef.current = false;
  };

  const handleCarouselClickCapture = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      if (isDraggingRef.current) return;
      setCurrentIndex((current) => current + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [products.length]);

  useEffect(() => {
    if (products.length === 0) return;

    if (currentIndex >= products.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 750);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, products.length]);

  return (
    <section
      id="new-drop"
      className="
        relative
        overflow-hidden
        bg-[#161616]
        py-16
        text-[#CBCAC8]
        sm:py-20
        lg:py-24
      "
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
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
            backgroundSize: "90px 90px",
          }}
        />

        {/* Dots */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle,
                #CBCAC8 1px,
                transparent 1.2px
              )
            `,
            backgroundSize: "34px 34px",
          }}
        />

        {/* Red atmosphere */}

        <div className="absolute left-[-180px] top-[25%] h-[420px] w-[420px] rounded-full bg-[#DA0D12]/[0.035] blur-[130px]" />

        <div className="absolute right-[-180px] top-[55%] h-[450px] w-[450px] rounded-full bg-[#80060B]/[0.05] blur-[140px]" />

        <div className="absolute left-1/2 top-[-200px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[#424141]/10 blur-[150px]" />
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-10 flex flex-col gap-7 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          {/* Left */}

          <div className="max-w-[700px]">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#CBCAC8]/[0.035]">
                <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />
              </span>

              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#DA0D12]">
                  The pack collection
                </p>

                <p className="mt-0.5 font-mono text-[6px] uppercase tracking-[0.22em] text-[#666362]">
                  Fresh members / 2026
                </p>
              </div>
            </div>

            <h2
              className="
                text-[clamp(4.5rem,10vw,8rem)]
                leading-[0.72]
                tracking-[-0.035em]
                text-[#CBCAC8]
              "
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              NEW <span className="text-[#DA0D12]">PACK.</span>
            </h2>
          </div>

          {/* Right */}

          <div className="max-w-[390px] lg:pb-1">
            <p className="text-[11px] leading-[1.8] text-[#666362] sm:text-xs">
              Meet the latest members of The Backstore. Original graphics,
              relaxed fits and pieces made for people who move with their own
              pack.
            </p>

            <div className="mt-5 flex items-center gap-4">
              <a
                href="/shop"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-[#CBCAC8]/10
                  bg-[#CBCAC8]/[0.035]
                  px-5
                  py-2.5
                  font-mono
                  text-[7px]
                  uppercase
                  tracking-[0.2em]
                  text-[#CBCAC8]/75
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-[#DA0D12]/40
                  hover:bg-[#DA0D12]
                  hover:text-[#CBCAC8]
                "
              >
                View all
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRightIcon />
                </span>
              </a>

              <span className="hidden font-mono text-[6px] uppercase tracking-[0.2em] text-[#424141] sm:block">
                Scroll the pack
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            PRODUCT CAROUSEL
            ----------------------------------------------------
            Desktop: 5 products visible
            Tablet: 3 products visible
            Mobile: 1.25 products visible
        ==================================================== */}

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[0.82/1] animate-pulse rounded-[22px] border border-[#CBCAC8]/8 bg-[#CBCAC8]/[0.035]"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[18px] border border-[#DA0D12]/20 bg-[#DA0D12]/[0.04] px-5 py-4 font-mono text-[7px] uppercase tracking-[0.16em] text-[#CBCAC8]/60">
            {error}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="rounded-[18px] border border-[#CBCAC8]/8 bg-[#CBCAC8]/[0.025] px-5 py-8 text-center font-mono text-[7px] uppercase tracking-[0.16em] text-[#666362]">
            No products available right now.
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="relative">
            {/* Manual carousel controls */}
            {products.length > 1 && (
              <div className="mb-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  aria-label="Previous products"
                  onClick={() => moveCarousel("previous")}
                  disabled={currentIndex === 0}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#CBCAC8]/10
                    bg-[#CBCAC8]/[0.035]
                    text-[#CBCAC8]/70
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-[#DA0D12]/40
                    hover:bg-[#DA0D12]
                    hover:text-[#CBCAC8]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <ChevronLeftIcon />
                </button>

                <button
                  type="button"
                  aria-label="Next products"
                  onClick={() => moveCarousel("next")}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#CBCAC8]/10
                    bg-[#CBCAC8]/[0.035]
                    text-[#CBCAC8]/70
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-[#DA0D12]/40
                    hover:bg-[#DA0D12]
                    hover:text-[#CBCAC8]
                  "
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}

            <div
              className="overflow-hidden touch-pan-y select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onClickCapture={handleCarouselClickCapture}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              <div
                className={`
                  flex
                  gap-4
                  ${
                    isDragging
                      ? "transition-none"
                      : "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  }
                  [--slide-width:calc((100%_-_16px)_/_1.25)]
                  [--slide-gap:16px]
                  sm:gap-5
                  sm:[--slide-width:calc((100%_-_40px)_/_3)]
                  sm:[--slide-gap:20px]
                  lg:gap-6
                  lg:[--slide-width:calc((100%_-_96px)_/_5)]
                  lg:[--slide-gap:24px]
                `}
                style={{
                  transform:
                    "translateX(calc(-1 * " +
                    currentIndex +
                    " * (var(--slide-width) + var(--slide-gap)) + " +
                    dragOffset +
                    "px))",
                }}
              >
                {carouselProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    className="
                      w-[var(--slide-width)]
                      shrink-0
                    "
                  >
                    <ProductCard
                      product={product}
                      index={index % Math.max(products.length, 1)}
                      isWishlisted={wishlistItems.some(
                        (item) => getWishlistProductId(item) === product.id,
                      )}
                      wishlistLoading={wishlistLoadingIds.includes(product.id)}
                      onWishlist={() => {
                        void toggleWishlist(product.id);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {products.length > 1 && (
              <p className="mt-3 text-center font-mono text-[6px] uppercase tracking-[0.2em] text-[#666362] sm:hidden">
                Swipe to explore
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
