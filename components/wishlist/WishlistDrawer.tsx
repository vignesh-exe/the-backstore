"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { removeFromWishlist } from "@/lib/features/wishlist/wishlistSlice";

type ProductImage = {
  image_url?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type Product = {
  id: string | number;
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  mrp?: number | string | null;
  image_url?: string | null;
  product_images?: ProductImage[] | null;
  sizes?: Record<string, number> | null;
  slug?: string | null;
  is_active?: boolean | null;
  status?: string | null;
};

type WishlistEntry = {
  id?: string | number;
  product_id?: string | number;
  product?: Product | null;
  name?: string | null;
  category?: string | null;
  price?: number | string | null;
  image_url?: string | null;
  product_images?: ProductImage[] | null;
  sizes?: Record<string, number> | null;
  slug?: string | null;
};

type WishlistState = {
  wishlist?: {
    wishlistItems?: WishlistEntry[];
  };
};

type WishlistDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

function formatPrice(value: number | string | null | undefined) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function getProduct(entry: WishlistEntry): Product {
  return (
    entry.product ?? {
      id: String(entry.product_id ?? entry.id ?? ""),
      name: entry.name ?? "Backstore Product",
      category: entry.category ?? "T-Shirt",
      price: entry.price ?? 0,
      image_url: entry.image_url ?? null,
      product_images: entry.product_images ?? [],
      sizes: entry.sizes ?? {},
      slug: entry.slug ?? null,
    }
  );
}

function getProductImage(product: Product) {
  const images = [...(product.product_images ?? [])]
    .filter((image) => Boolean(image.image_url))
    .sort((a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    });

  return images[0]?.image_url || product.image_url || "";
}

function getAvailableSize(product: Product) {
  const sizes = product.sizes ?? {};

  for (const size of SIZE_ORDER) {
    if (Number(sizes[size] ?? 0) > 0) {
      return size;
    }
  }

  const fallback = Object.entries(sizes).find(([, stock]) => Number(stock) > 0);

  return fallback?.[0] ?? "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function WishlistDrawer({
  isOpen,
  onClose,
}: WishlistDrawerProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlist = useSelector(
    (state: WishlistState) => state.wishlist?.wishlistItems ?? [],
  );

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist({ productId }));
  };

  const handleAddToCart = (product: Product) => {
    const size = getAvailableSize(product);

    if (!size) {
      router.push(`/shop/t-shirts/product/${slugify(product.name ?? "")}`);
      onClose();
      return;
    }

    dispatch(
      addToCart({
        productId: String(product.id),
        size,
        quantity: 1,
        productType: "normal",
        productImage: getProductImage(product) || undefined,
        customization: null,
      }),
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close wishlist"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-md"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l border-white/10 bg-[#161616] text-[#CBCAC8] shadow-[-20px_0_80px_rgba(0,0,0,0.45)]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#161616] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#DA0D12]/10">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61C19.89 3.66 18.61 3.12 17.27 3.12C15.93 3.12 14.65 3.66 13.7 4.61L12 6.31L10.3 4.61C8.32 2.63 5.12 2.63 3.14 4.61C1.16 6.59 1.16 9.79 3.14 11.77L12 20.63L20.86 11.77C22.84 9.79 22.84 6.59 20.84 4.61Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
                The Backstore
              </p>
              <h2 className="mt-0.5 text-xl font-semibold leading-none text-white">
                Wishlist
              </h2>
            </div>

            {wishlist.length > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DA0D12] px-2 text-[9px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#424141]/40 text-xl text-[#CBCAC8] transition hover:border-[#DA0D12]/40 hover:bg-[#DA0D12]/10 hover:text-white"
          >
            ×
          </button>
        </header>

        {wishlist.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#DA0D12]/20 bg-[#424141]/30">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#DA0D12]"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61C19.89 3.66 18.61 3.12 17.27 3.12C15.93 3.12 14.65 3.66 13.7 4.61L12 6.31L10.3 4.61C8.32 2.63 5.12 2.63 3.14 4.61C1.16 6.59 1.16 9.79 3.14 11.77L12 20.63L20.86 11.77C22.84 9.79 22.84 6.59 20.84 4.61Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
              Nothing Saved
            </p>

            <h3 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-4xl uppercase tracking-wide text-white">
              Your Wishlist Is Empty
            </h3>

            <p className="mt-3 max-w-[290px] text-xs leading-6 text-[#666362]">
              See something you like? Tap the heart and keep it close. Your
              favourite pieces will appear here.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#DA0D12] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#80060B]"
            >
              Explore The Drop
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                    Saved Pieces
                  </p>
                  <p className="mt-1 text-xs text-[#CBCAC8]">
                    Your saved products from The Backstore.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    wishlist.forEach((entry) => {
                      const product = getProduct(entry);
                      handleRemove(String(product.id));
                    });
                  }}
                  className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#666362] transition hover:text-[#DA0D12]"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {wishlist.map((entry, index) => {
                  const product = getProduct(entry);
                  const image = getProductImage(product);
                  const productId = String(product.id);
                  const price = Number(product.price ?? 0);
                  const availableSize = getAvailableSize(product);
                  const outOfStock =
                    Boolean(product.sizes) &&
                    Object.keys(product.sizes ?? {}).length > 0 &&
                    !availableSize;

                  return (
                    <article
                      key={`${productId}-${index}`}
                      className="rounded-2xl border border-white/10 bg-[#424141]/30 p-3.5"
                    >
                      <div className="flex gap-3.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (product.name) {
                              router.push(
                                `/shop/t-shirts/product/${slugify(product.name)}`,
                              );
                              onClose();
                            }
                          }}
                          className="h-[120px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-[#424141]"
                          aria-label={`View ${product.name ?? "product"}`}
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={product.name ?? "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-3xl opacity-60">
                              🐕
                            </div>
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.22em] text-[#DA0D12]">
                                {product.category || "T-Shirt"}
                              </p>
                              <h3 className="text-sm font-semibold leading-5 text-white">
                                {product.name || "Backstore Product"}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(productId)}
                              aria-label={`Remove ${product.name ?? "product"} from wishlist`}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-[#666362] transition hover:bg-[#DA0D12]/10 hover:text-[#DA0D12]"
                            >
                              ×
                            </button>
                          </div>

                          <div className="mt-2">
                            {availableSize ? (
                              <span className="rounded-full bg-[#161616] px-2.5 py-1 text-[7px] font-medium uppercase tracking-[0.1em] text-[#CBCAC8]">
                                Available: {availableSize}
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#161616] px-2.5 py-1 text-[7px] font-medium uppercase tracking-[0.1em] text-[#DA0D12]">
                                Select size
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-end justify-between gap-2">
                            <p className="text-sm font-semibold text-white">
                              {formatPrice(price)}
                            </p>

                            <button
                              type="button"
                              disabled={outOfStock}
                              onClick={() => handleAddToCart(product)}
                              className="rounded-full bg-[#DA0D12] px-3.5 py-2 text-[8px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              {outOfStock ? "Out of Stock" : "Add to Cart"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[#161616] px-5 pb-6 pt-5 sm:px-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                    Saved Items
                  </p>
                  <p className="mt-1 text-xs text-[#CBCAC8]">
                    {wishlist.length}{" "}
                    {wishlist.length === 1 ? "piece" : "pieces"} waiting for you
                  </p>
                </div>
                <span className="text-2xl">🐾</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-[#424141]/40 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CBCAC8] transition hover:border-[#DA0D12]/40 hover:bg-[#DA0D12] hover:text-white"
              >
                Continue Shopping
                <span aria-hidden="true">→</span>
              </button>

              <p className="mt-4 text-center text-[8px] uppercase tracking-[0.16em] text-[#666362]">
                Save it now · Wear it later
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
