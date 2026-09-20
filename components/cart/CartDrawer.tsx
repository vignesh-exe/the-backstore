"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
  decrementQuantity,
  deleteItemFromCart,
  incrementQuantity,
} from "@/lib/features/cart/cartSlice";
import { supabase } from "@/lib/supabase";

type ReduxCartItem = {
  productId: string;
  size: string;
  quantity: number;
  productType?: string;
  productImage?: string;
  productName?: string;
  productPrice?: number;
  customization?: {
    color?: string;
    colour?: string;
    [key: string]: unknown;
  } | null;
};

type Product = {
  id: string;
  name: string;
  price?: number | null;
  image_url?: string | null;
  product_images?: Array<{
    image_url?: string | null;
    is_primary?: boolean | null;
    sort_order?: number | null;
  }> | null;
};

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state: {
      cart?: {
        cartItems?: Record<string, ReduxCartItem>;
      };
    }) => state.cart?.cartItems ?? {},
  );

  const [products, setProducts] = useState<Record<string, Product>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        const payload = response.ok ? await response.json() : null;

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        const nextProducts: Record<string, Product> = {};

        for (const product of list) {
          if (product?.id) {
            nextProducts[String(product.id)] = product;
          }
        }

        const customProductIds = Object.values(cartItems)
          .filter((item) => item.productType === "custom")
          .map((item) => item.productId)
          .filter(Boolean);

        if (customProductIds.length > 0) {
          const uniqueCustomProductIds = [...new Set(customProductIds)];

          const { data: customProducts, error: customProductsError } =
            await supabase
              .from("custom_products")
              .select("id, name, price, black_image, white_image")
              .in("id", uniqueCustomProductIds);

          if (customProductsError) {
            console.error(
              "Custom cart product lookup error:",
              customProductsError,
            );
          }

          for (const customProduct of customProducts ?? []) {
            nextProducts[String(customProduct.id)] = {
              id: String(customProduct.id),
              name: customProduct.name,
              price: Number(customProduct.price ?? 0),
              image_url:
                customProduct.black_image || customProduct.white_image || null,
            };
          }
        }

        if (cancelled) return;

        setProducts(nextProducts);
      } catch (error) {
        console.error("Cart product lookup error:", error);
      }
    }

    if (isOpen && Object.keys(cartItems).length > 0) {
      loadProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [isOpen, cartItems]);

  const resolvedItems = useMemo(() => {
    return Object.entries(cartItems).map(([cartKey, item]) => {
      const product = products[String(item.productId)];

      const sortedImages = [...(product?.product_images ?? [])].sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;

        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });

      const image =
        item.productImage ||
        sortedImages.find((entry) => entry.image_url)?.image_url ||
        product?.image_url ||
        "";

      const name = item.productName || product?.name || "Backstore Product";

      const price =
        typeof item.productPrice === "number"
          ? item.productPrice
          : Number(product?.price ?? 0);

      const color =
        item.customization?.color || item.customization?.colour || "";

      return {
        cartKey,
        ...item,
        name,
        price,
        image,
        color,
      };
    });
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return resolvedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [resolvedItems]);

  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const itemCount = resolvedItems.reduce(
    (total, item) => total + item.quantity,
    0,
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-md"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l border-white/10 bg-[#161616] text-[#CBCAC8] shadow-[-20px_0_80px_rgba(0,0,0,0.45)]"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#161616] px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#DA0D12]/10">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6.5 8.5H17.5L19 21H5L6.5 8.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9V6.5C9 4.567 10.343 3 12 3C13.657 3 15 4.567 15 6.5V9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
                The Backstore
              </p>

              <h2 className="mt-0.5 text-xl font-semibold leading-none text-white">
                Your Cart
              </h2>
            </div>

            {itemCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DA0D12] px-2 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#424141]/40 text-xl text-[#CBCAC8] transition hover:border-[#DA0D12]/40 hover:bg-[#DA0D12]/10 hover:text-white"
          >
            ×
          </button>
        </header>

        {/* Content */}
        {resolvedItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-[#DA0D12]/20 bg-[#424141]/30">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#DA0D12]"
                aria-hidden="true"
              >
                <path
                  d="M6.5 8.5H17.5L19 21H5L6.5 8.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9V6.5C9 4.567 10.343 3 12 3C13.657 3 15 4.567 15 6.5V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#DA0D12]">
              Join The Pack
            </p>

            <h3 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-4xl uppercase tracking-wide text-white">
              Your Cart Is Empty
            </h3>

            <p className="mt-3 max-w-[290px] text-xs leading-6 text-[#666362]">
              Nothing in here yet. Find something you love and bring it home.
            </p>

            <Link
              href="/"
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#DA0D12] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#80060B]"
            >
              Explore Products
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#666362]">
                  Your Picks
                </p>

                <p className="text-[9px] uppercase tracking-[0.15em] text-[#666362]">
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </p>
              </div>

              <div className="space-y-4">
                {resolvedItems.map((item) => (
                  <article
                    key={item.cartKey}
                    className="rounded-2xl border border-white/10 bg-[#424141]/30 p-3.5"
                  >
                    <div className="flex gap-3.5">
                      {/* Product visual */}
                      <div className="flex h-[105px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#424141]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <span className="block text-2xl opacity-60">
                              🐕
                            </span>

                            <span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.18em] text-[#CBCAC8]/50">
                              Backstore
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.22em] text-[#DA0D12]">
                              The Backstore
                            </p>

                            <h3 className="truncate text-sm font-semibold text-white">
                              {item.name}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                deleteItemFromCart({ cartKey: item.cartKey }),
                              )
                            }
                            aria-label={`Remove ${item.name}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-[#666362] transition hover:bg-[#DA0D12]/10 hover:text-[#DA0D12]"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-[#161616] px-2.5 py-1 text-[7px] font-medium uppercase tracking-[0.1em] text-[#CBCAC8]">
                            {item.size}
                          </span>

                          {item.color && (
                            <span className="rounded-full bg-[#161616] px-2.5 py-1 text-[7px] font-medium uppercase tracking-[0.1em] text-[#CBCAC8]">
                              {item.color}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center rounded-full border border-white/10 bg-[#161616]">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  decrementQuantity({
                                    productId: item.productId,
                                    size: item.size,
                                  }),
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="flex h-7 w-7 items-center justify-center text-sm text-[#CBCAC8] transition hover:text-[#DA0D12] disabled:cursor-not-allowed disabled:opacity-25"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span className="min-w-6 text-center text-[10px] font-semibold text-white">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                dispatch(
                                  incrementQuantity({
                                    productId: item.productId,
                                    size: item.size,
                                  }),
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center text-sm text-[#CBCAC8] transition hover:text-[#DA0D12]"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Free shipping message */}
              {shipping > 0 && (
                <div className="mt-5 rounded-xl border border-[#DA0D12]/15 bg-[#DA0D12]/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🐾</span>

                    <p className="text-[9px] leading-4 text-[#CBCAC8]">
                      Add{" "}
                      <span className="font-semibold text-white">
                        {formatPrice(1999 - subtotal)}
                      </span>{" "}
                      more for free shipping.
                    </p>
                  </div>
                </div>
              )}

              {shipping === 0 && subtotal > 0 && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#424141]/20 px-4 py-3">
                  <span className="text-sm">🐾</span>

                  <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-[#CBCAC8]">
                    You unlocked free shipping
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            <div className="shrink-0 border-t border-white/10 bg-[#161616] px-5 pb-6 pt-5 sm:px-7">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666362]">Subtotal</span>

                  <span className="text-sm font-medium text-[#CBCAC8]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#666362]">Shipping</span>

                  <span className="text-sm font-medium text-[#CBCAC8]">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="my-4 h-px bg-white/10" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.25em] text-[#666362]">
                      Total
                    </p>

                    <p className="mt-1 text-[8px] text-[#666362]">
                      Taxes included
                    </p>
                  </div>

                  <p className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-white">
                    {formatPrice(total)}
                  </p>
                </div>
              </div>

              <a
                href="/checkout"
                onClick={onClose}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-[#DA0D12] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#80060B]"
              >
                Proceed To Checkout
                <span aria-hidden="true">→</span>
              </a>

              <p className="mt-4 text-center text-[8px] uppercase tracking-[0.16em] text-[#666362]">
                Secure checkout · Built for the pack
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
