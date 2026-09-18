"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  setCartItems,
  updateCartItemQuantity,
} from "@/lib/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

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
  sku?: string | null;
  brand?: string | null;
  collection?: string | null;
  category?: string | null;
  gender?: string | null;
  fit?: string | null;
  tags?: string[] | null;
  mrp?: number | null;
  price?: number | null;
  description?: string | null;
  stock?: number | null;
  sizes?: Record<string, number> | null;
  slug?: string | null;
  metadata?: Record<string, unknown> | null;
  fabric?: string | null;
  gsm?: number | string | null;
  image_url?: string | null;
  product_images?: ProductImage[] | null;
  is_featured?: boolean | null;
  featured?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
};

type WishlistItem = {
  id?: string;
  product_id?: string;
  product?: Product;
};

type CartState = {
  cart?: {
    cartItems?: Record<
      string,
      {
        productId: string;
        size: string;
        quantity: number;
      }
    >;
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(value: number | null | undefined) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function PawIcon({ className = "h-5 w-5" }: { className?: string }) {
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

function ArrowIcon({ direction = "right" }: { direction?: "right" | "left" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {direction === "right" ? (
        <>
          <path d="M4 12h15" />
          <path d="m13 6 6 6-6 6" />
        </>
      ) : (
        <>
          <path d="M20 12H5" />
          <path d="m11 6-6 6 6 6" />
        </>
      )}
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
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function normalizeProduct(value: Product): Product {
  return {
    ...value,
    id: String(value.id),
    tags: Array.isArray(value.tags) ? value.tags : [],
    product_images: Array.isArray(value.product_images)
      ? value.product_images
      : [],
    sizes: value.sizes && typeof value.sizes === "object" ? value.sizes : {},
  };
}

export default function ProductSlugPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch = useDispatch();

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || "";

  const wishlist = useSelector(
    (state: { wishlist?: { wishlistItems?: WishlistItem[] } }) =>
      state.wishlist?.wishlistItems ?? [],
  );

  const cartItems = useSelector(
    (state: CartState) => state.cart?.cartItems ?? {},
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"cart" | "buy" | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState<"story" | "fit" | "delivery">(
    "story",
  );
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      if (!slug) return;

      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const payload = await response.json();

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        const normalized = list.map(normalizeProduct);
        const matched = normalized.find(
          (item: Product) => slugify(item.name) === slug,
        );

        if (!matched) {
          throw new Error("Product not found.");
        }

        if (cancelled) return;

        setProduct(matched);

        const sameGroup = normalized.filter(
          (item: Product) =>
            item.id !== matched.id &&
            item.is_active !== false &&
            (item.collection === matched.collection ||
              item.category === matched.category),
        );

        const fallback = normalized.filter(
          (item: Product) => item.id !== matched.id && item.is_active !== false,
        );

        setRelatedProducts(
          [...sameGroup, ...fallback]
            .filter(
              (item, index, array) =>
                array.findIndex((entry) => entry.id === item.id) === index,
            )
            .slice(0, 4),
        );

        const storedSizes =
          matched.sizes && typeof matched.sizes === "object"
            ? Object.entries(matched.sizes)
                .filter(([, stock]) => Number(stock) > 0)
                .map(([size]) => size)
            : [];

        const fallbackSizes = (matched.category || "")
          .toLowerCase()
          .includes("footwear")
          ? ["7", "8", "9", "10", "11"]
          : ["XS", "S", "M", "L", "XL", "XXL"];

        setSelectedSize(storedSizes[0] || fallbackSizes[0] || "");
        setActiveImage(0);
        setQuantity(0);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /*
   * Keep the current product's wishlist state in sync with Supabase.
   * Redux is still used for the UI, but Supabase is the source of
   * persistence so the wishlist survives refresh/login sessions.
   */
  useEffect(() => {
    if (!product) return;

    let cancelled = false;

    const loadWishlistState = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (!cancelled) {
            const localMatch = wishlist.some(
              (item) => String(item.id ?? item.product_id) === product.id,
            );

            setWishlisted(localMatch);
          }
          return;
        }

        const { data, error: wishlistError } = await supabase
          .from("wishlist_items")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("product_id", product.id)
          .maybeSingle();

        if (wishlistError) {
          throw wishlistError;
        }

        if (!cancelled) {
          setWishlisted(Boolean(data));
        }
      } catch (wishlistError) {
        console.error("Failed to load wishlist state:", wishlistError);

        if (!cancelled) {
          const localMatch = wishlist.some(
            (item) => String(item.id ?? item.product_id) === product.id,
          );

          setWishlisted(localMatch);
        }
      }
    };

    loadWishlistState();

    return () => {
      cancelled = true;
    };
  }, [product, wishlist]);

  useEffect(() => {
    if (!addedNotice) return;

    const timeout = window.setTimeout(() => setAddedNotice(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [addedNotice]);

  const images = useMemo(() => {
    if (!product) return [];

    const remoteImages = [...(product.product_images ?? [])]
      .filter((image) => Boolean(image.image_url))
      .sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      })
      .map((image) => ({
        url: image.image_url as string,
        alt: image.alt_text || product.name,
      }));

    if (remoteImages.length) return remoteImages;

    return product.image_url
      ? [{ url: product.image_url, alt: product.name }]
      : [];
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product) return [];

    const order = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

    const sizes =
      product.sizes && typeof product.sizes === "object"
        ? Object.entries(product.sizes)
            .map(([size, stock]) => ({
              size,
              stock: Math.max(0, Math.floor(Number(stock) || 0)),
            }))
            .sort((a, b) => {
              const aIndex = order.indexOf(a.size.toUpperCase());
              const bIndex = order.indexOf(b.size.toUpperCase());

              if (aIndex === -1 && bIndex === -1) {
                return a.size.localeCompare(b.size);
              }

              if (aIndex === -1) return 1;
              if (bIndex === -1) return -1;

              return aIndex - bIndex;
            })
        : [];

    return sizes;
  }, [product]);

  const selectedStock =
    availableSizes.find((item) => item.size === selectedSize)?.stock ?? 0;

  const hasSizeInventory = availableSizes.length > 0;
  const allSizesOutOfStock =
    hasSizeInventory && availableSizes.every((item) => item.stock <= 0);

  const isOutOfStock = hasSizeInventory
    ? allSizesOutOfStock
    : Number(product?.stock ?? 0) <= 0;

  const canPurchase =
    !isOutOfStock && Boolean(selectedSize) && selectedStock > 0 && quantity > 0;

  const displayCategory = "T-Shirt";

  const discount = useMemo(() => {
    if (!product?.mrp || !product.price || product.mrp <= product.price)
      return 0;
    return Math.round(((product.mrp - product.price) / product.mrp) * 100);
  }, [product]);

  const fabricGsm = useMemo(() => {
    const metadata = product?.metadata;
    const metadataGsm =
      metadata && typeof metadata === "object" ? metadata.gsm : undefined;

    const value = product?.gsm ?? metadataGsm ?? 240;
    const numericValue = Number(value);

    return Number.isFinite(numericValue) && numericValue > 0
      ? Math.floor(numericValue)
      : 240;
  }, [product]);

  const fabricMaterial = useMemo(() => {
    const metadata = product?.metadata;
    const metadataFabric =
      metadata && typeof metadata === "object" ? metadata.fabric : undefined;

    const raw = product?.fabric ?? metadataFabric;

    if (typeof raw === "string" && raw.trim()) {
      return (
        raw.replace(/^\\d+(?:\\.\\d+)?\\s*GSM\\s*/i, "").trim() || "Cotton"
      );
    }

    return "GSM Cotton";
  }, [product]);

  const openCartDrawer = () => {
    window.dispatchEvent(new Event("backstore:open-cart"));
  };

  const cartCount = Object.values(cartItems).reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  const cartKey =
    product && selectedSize ? `${product.id}_${selectedSize}` : "";

  const quantityInCart = cartKey ? (cartItems[cartKey]?.quantity ?? 0) : 0;

  const showViewCart = quantity > 0 && quantityInCart > 0;

  /*
   * Restore the signed-in user's cart from Supabase into Redux.
   * This runs when the page loads and again when authentication
   * changes, so cart items survive logout/login cycles.
   */
  useEffect(() => {
    let cancelled = false;

    const loadUserCart = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (!cancelled) {
            dispatch(setCartItems({}));
          }
          return;
        }

        const { data, error: cartError } = await supabase
          .from("cart_items")
          .select("product_id, size, quantity")
          .eq("user_id", session.user.id);

        if (cartError) {
          throw cartError;
        }

        if (cancelled) return;

        const restoredCart: Record<string, any> = {};

        for (const item of data ?? []) {
          const productId = String(item.product_id);
          const size = String(item.size);
          const restoredQuantity = Math.max(0, Number(item.quantity) || 0);

          if (restoredQuantity <= 0) continue;

          restoredCart[`${productId}_${size}`] = {
            productId,
            size,
            quantity: restoredQuantity,
            productType: "normal",
          };
        }

        dispatch(setCartItems(restoredCart));
      } catch (cartError) {
        console.error("Failed to restore cart:", cartError);
      }
    };

    const handleAuthChange = (_event: string, session: any) => {
      if (session?.user) {
        window.setTimeout(loadUserCart, 0);
      } else {
        dispatch(setCartItems({}));
      }
    };

    loadUserCart();

    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  /*
   * Whenever the selected size changes, show the exact quantity
   * already stored for that product/size in Redux.
   */
  useEffect(() => {
    if (!product || !selectedSize) {
      setQuantity(0);
      return;
    }

    const key = `${product.id}_${selectedSize}`;
    setQuantity(cartItems[key]?.quantity ?? 0);
  }, [product, selectedSize, cartItems]);

  const handleWishlist = async () => {
    if (!product || wishlistLoading) return;

    setWishlistLoading(true);

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

      if (wishlisted) {
        const { error: deleteError } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", product.id);

        if (deleteError) {
          throw deleteError;
        }

        dispatch(removeFromWishlist({ productId: product.id }));
        setWishlisted(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("wishlist_items")
        .insert({
          user_id: userId,
          product_id: product.id,
        });

      if (insertError) {
        /*
         * If the row already exists because the UI and DB got out of sync,
         * keep the UI in the correct saved state instead of adding a duplicate.
         */
        if (insertError.code === "23505") {
          dispatch(addToWishlist({ product: product as any }));
          setWishlisted(true);
          return;
        }

        throw insertError;
      }

      dispatch(addToWishlist({ product: product as any }));
      setWishlisted(true);
    } catch (wishlistError) {
      console.error("Wishlist update failed:", wishlistError);

      toast.error(
        wishlistError instanceof Error
          ? wishlistError.message
          : "Unable to update wishlist.",
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  const persistCartQuantity = async (nextQuantity: number) => {
    if (!product || !selectedSize || nextQuantity <= 0) {
      return false;
    }

    const maxStock = hasSizeInventory
      ? selectedStock
      : Math.max(0, Number(product.stock) || 0);

    if (maxStock <= 0 || nextQuantity > maxStock) {
      return false;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
      return false;
    }

    const userId = session.user.id;

    const { data: existingItem, error: lookupError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .eq("size", selectedSize)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: nextQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: product.id,
        size: selectedSize,
        quantity: nextQuantity,
      });

      if (insertError) {
        throw insertError;
      }
    }

    const currentReduxQuantity =
      cartItems[`${product.id}_${selectedSize}`]?.quantity ?? 0;

    if (currentReduxQuantity > 0) {
      dispatch(
        updateCartItemQuantity({
          productId: product.id,
          size: selectedSize,
          quantity: nextQuantity,
        }),
      );
    } else {
      dispatch(
        addToCart({
          productId: product.id,
          size: selectedSize,
          quantity: nextQuantity,
          productType: "normal",
          productImage: images[0]?.url,
          customization: null,
        }),
      );
    }

    setQuantity(nextQuantity);
    return true;
  };

  const addProductToCart = async (goToCheckout = false) => {
    if (!product || !canPurchase || actionLoading || showViewCart) {
      return;
    }

    setActionLoading(goToCheckout ? "buy" : "cart");

    try {
      const saved = await persistCartQuantity(quantity);

      if (!saved) return;

      setAddedNotice(true);

      if (goToCheckout) {
        router.push("/checkout");
      }
    } catch (requestError) {
      console.error("Add to cart failed:", requestError);
      setAddedNotice(false);

      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to add item to cart.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const increaseQuantity = async () => {
    if (!product || actionLoading) return;

    const maxStock = hasSizeInventory
      ? selectedStock
      : Math.max(0, Number(product?.stock) || 0);

    if (!selectedSize || maxStock <= 0 || quantity >= maxStock) return;

    const nextQuantity = Math.min(quantity + 1, maxStock);

    setActionLoading("cart");

    try {
      await persistCartQuantity(nextQuantity);
    } catch (requestError) {
      console.error("Failed to increase cart quantity:", requestError);
    } finally {
      setActionLoading(null);
    }
  };

  const decreaseQuantity = async () => {
    if (!product || !selectedSize || quantity <= 0 || actionLoading) return;

    const nextQuantity = Math.max(quantity - 1, 0);

    setActionLoading("cart");

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

      if (nextQuantity <= 0) {
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", session.user.id)
          .eq("product_id", product.id)
          .eq("size", selectedSize);

        if (deleteError) {
          throw deleteError;
        }

        dispatch(
          updateCartItemQuantity({
            productId: product.id,
            size: selectedSize,
            quantity: 0,
          }),
        );

        setQuantity(0);
      } else {
        const { error: updateError } = await supabase
          .from("cart_items")
          .update({
            quantity: nextQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", session.user.id)
          .eq("product_id", product.id)
          .eq("size", selectedSize);

        if (updateError) {
          throw updateError;
        }

        dispatch(
          updateCartItemQuantity({
            productId: product.id,
            size: selectedSize,
            quantity: nextQuantity,
          }),
        );

        setQuantity(nextQuantity);
      }
    } catch (requestError) {
      console.error("Failed to decrease cart quantity:", requestError);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 pb-20 pt-24 text-[#CBCAC8] sm:px-8">
        <div className="mx-auto max-w-[1500px] animate-pulse">
          <div className="mb-6 h-3 w-28 rounded-full bg-white/10" />
          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="aspect-[4/5] rounded-[30px] bg-white/[0.05]" />
            <div className="space-y-5 rounded-[30px] border border-white/10 p-6">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-28 w-4/5 rounded bg-white/10" />
              <div className="h-12 w-36 rounded bg-white/10" />
              <div className="h-28 rounded bg-white/10" />
              <div className="h-16 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-[#CBCAC8]">
        <div className="text-center">
          <PawIcon className="mx-auto h-10 w-10 text-[#DA0D12]" />
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.28em] text-[#666362]">
            Backstore / 404
          </p>
          <h1
            className="mt-3 text-6xl leading-none"
            style={{ fontFamily: "var(--font-bebas-neue), Impact, sans-serif" }}
          >
            PRODUCT LOST
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#666362]">
            {error || "This piece could not be found in the pack."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/shop/t-shirts")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#DA0D12] px-6 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white"
          >
            <ArrowIcon direction="left" />
            Back to shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-[#CBCAC8]">
      {/* Background system */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #CBCAC8 1px, transparent 1px),
              linear-gradient(to bottom, #CBCAC8 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
        <div className="absolute left-[-180px] top-[20%] h-[460px] w-[460px] rounded-full bg-[#DA0D12]/[0.045] blur-[150px]" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#DA0D12]/[0.035] blur-[150px]" />
      </div>

      {/* Added toast */}
      <div
        className={`pointer-events-none fixed left-1/2 top-24 z-[80] -translate-x-1/2 transition-all duration-300 ${
          addedNotice ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-[#DA0D12]/40 bg-[#111]/95 px-5 py-3 shadow-2xl backdrop-blur-xl">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DA0D12] text-white">
            <CheckIcon />
          </span>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white">
            Added to the pack
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-32 pt-24 sm:px-7 lg:px-10 lg:pt-28">
        {/* Top command bar */}
        <div className="mb-5 flex items-center justify-between border-y border-white/10 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#666362] transition hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              <ArrowIcon direction="left" />
            </span>
            Back
          </button>

          <div className="hidden items-center gap-3 font-mono text-[7px] uppercase tracking-[0.2em] text-[#424141] sm:flex">
            <span>THE BACKSTORE</span>
            <span>/</span>
            <span>{product.collection || "THE PACK"}</span>
            <span>/</span>
            <span>{product.sku || product.id.slice(0, 8)}</span>
          </div>

          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="group flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#CBCAC8]/70 transition hover:text-white"
          >
            Cart
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DA0D12] px-1.5 text-[8px] font-bold text-white">
              {cartCount}
            </span>
          </button>
        </div>

        {/* Main new layout */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(440px,1.12fr)]">
          {/* Visual / poster */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#121212]">
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#080808]/70 px-3 py-2 backdrop-blur-xl">
                <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/70">
                  Pack approved
                </span>
              </div>

              <div className="absolute right-5 top-5 z-20 flex flex-col items-end">
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
                  {String(activeImage + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 h-px w-8 bg-[#DA0D12]" />
              </div>

              <div className="aspect-[1.12/1] overflow-hidden sm:aspect-[1.12/1] lg:aspect-[1.12/1]">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]?.url}
                    alt={images[activeImage]?.alt || product.name}
                    className="h-full w-full object-cover transition-all duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#1b1b1b]">
                    <PawIcon className="h-16 w-16 text-[#DA0D12]/40" />
                  </div>
                )}
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
                {discount > 0 && (
                  <div className="mb-1 rounded-full bg-[#DA0D12] px-3 py-2 font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-white">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>
            {/* Gallery rail */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition-all sm:h-24 sm:w-20 ${
                      activeImage === index
                        ? "border-[#DA0D12]"
                        : "border-white/10 opacity-50 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 font-mono text-[6px] text-white drop-shadow">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Three-point manifesto directly below the product card */}
            <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
              {[
                ["01", "Original", "Not mass market"],
                ["02", "Relaxed", "Built to move"],
                ["03", "The Pack", "Made in Chennai"],
              ].map(([number, title, text], index) => (
                <div
                  key={number}
                  className={`px-3 py-4 sm:px-5 ${
                    index > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  <span className="font-mono text-[7px] text-[#DA0D12]">
                    {number}
                  </span>
                  <p className="mt-3 text-[9px] uppercase tracking-[0.08em] text-white/80">
                    {title}
                  </p>
                  <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#666362]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase console */}
          <aside className="relative">
            <div className="rounded-[26px] border border-white/10 bg-[#101010] p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  DROP / {product.collection || "THE PACK"}
                </span>

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    wishlisted
                      ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:border-[#DA0D12]/60 hover:text-white"
                  }`}
                >
                  <HeartIcon filled={wishlisted} />
                </button>
              </div>

              <p className="mt-5 font-mono text-[7px] uppercase tracking-[0.18em] text-white/35 sm:mt-6">
                {product.brand || "THE BACKSTORE"} /{" "}
                {product.gender || "UNISEX"}
              </p>

              <h1
                className="mt-2 max-w-full break-words text-[clamp(3.15rem,6vw,5.8rem)] leading-[0.82] tracking-[-0.018em] text-[#CBCAC8]"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3 border-y border-white/10 py-4">
                <span
                  className="text-4xl text-white sm:text-5xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  {formatPrice(product.price)}
                </span>

                {product.mrp && product.mrp > (product.price ?? 0) && (
                  <span className="mb-1 font-mono text-xs text-white/30 line-through">
                    {formatPrice(product.mrp)}
                  </span>
                )}

                {discount > 0 && (
                  <span className="mb-1 rounded-full bg-[#DA0D12]/10 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#DA0D12]">
                    Save {discount}%
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-4 text-xs leading-6 text-white/45 sm:text-sm">
                  {product.description}
                </p>
              )}

              {/* Fabric / GSM */}
              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="border-r border-white/10 px-4 py-3.5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/30">
                    Fabric
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-white/75">
                    {fabricMaterial}
                  </p>
                </div>

                <div className="px-4 py-3.5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/30">
                    GSM
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-white/75">
                    {fabricGsm} GSM
                  </p>
                </div>
              </div>

              {/* Size matrix */}
              <div className="mt-6">
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">
                      Choose your size
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      Select before adding to cart.
                    </p>
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#DA0D12]">
                    {selectedSize || "SELECT"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
                  {availableSizes.map(({ size, stock }) => {
                    const selected = selectedSize === size;
                    const available = stock > 0;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={!available}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(0);
                        }}
                        className={`relative h-12 rounded-xl border font-mono text-[9px] uppercase tracking-[0.15em] transition ${
                          selected
                            ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                            : available
                              ? "border-white/10 bg-white/[0.025] text-white/65 hover:border-white/30 hover:bg-white/[0.05]"
                              : "cursor-not-allowed border-white/5 text-white/15 line-through"
                        }`}
                      >
                        <span className="block">{size}</span>
                        <span
                          className={`mt-1 block text-[6px] uppercase tracking-[0.08em] ${
                            available
                              ? selected
                                ? "text-white/75"
                                : "text-white/30"
                              : "text-[#DA0D12]/70"
                          }`}
                        >
                          {available ? `${stock} available` : "Out of stock"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">
                    Quantity
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
                    {selectedSize
                      ? selectedStock > 0
                        ? `${selectedStock} available in ${selectedSize}`
                        : `Out of stock in ${selectedSize}`
                      : "Select a size"}
                  </span>
                </div>

                <div className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-2">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 0}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white disabled:opacity-20"
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon />
                  </button>

                  <div className="text-center">
                    <span
                      className="text-3xl leading-none text-white"
                      style={{
                        fontFamily:
                          "var(--font-bebas-neue), Impact, sans-serif",
                      }}
                    >
                      {String(quantity).padStart(2, "0")}
                    </span>
                    {quantityInCart > 0 && (
                      <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.1em] text-[#DA0D12]">
                        {quantityInCart} already in cart
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={selectedStock <= 0 || quantity >= selectedStock}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white disabled:opacity-20"
                    aria-label="Increase quantity"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {/* CTA system */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  disabled={
                    Boolean(actionLoading) || (!showViewCart && !canPurchase)
                  }
                  onClick={() => {
                    if (showViewCart) {
                      openCartDrawer();
                      return;
                    }

                    addProductToCart(false);
                  }}
                  className="group flex h-16 w-full items-center justify-between rounded-2xl bg-[#DA0D12] px-5 text-white transition hover:bg-[#b90b10] disabled:cursor-not-allowed disabled:bg-[#242323] disabled:text-white/25 sm:px-6"
                >
                  <span>
                    <span className="block font-mono text-[8px] uppercase tracking-[0.2em] opacity-70">
                      {isOutOfStock
                        ? "Currently unavailable"
                        : "Your next piece"}
                    </span>
                    <span className="mt-1 block text-sm font-bold uppercase tracking-[0.08em]">
                      {actionLoading === "cart"
                        ? "Adding..."
                        : showViewCart
                          ? "View Cart"
                          : !selectedSize
                            ? "Select size"
                            : "Add to cart"}
                    </span>
                  </span>

                  <span className="transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!canPurchase || Boolean(actionLoading)}
                  onClick={() => addProductToCart(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] font-mono text-[8px] uppercase tracking-[0.2em] text-white/60 transition hover:border-[#DA0D12]/50 hover:bg-[#DA0D12]/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  {actionLoading === "buy" ? "Preparing..." : "Buy now"}
                  <ArrowIcon />
                </button>
              </div>

              {/* Mini assurances */}
              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10">
                {[
                  ["01", "FAST", "Dispatch"],
                  ["02", "SAFE", "Checkout"],
                  ["03", "PACK", "Checked"],
                ].map(([number, title, text], index) => (
                  <div
                    key={number}
                    className={`px-2 py-3 text-center ${
                      index > 0 ? "border-l border-white/10" : ""
                    }`}
                  >
                    <span className="font-mono text-[6px] text-[#DA0D12]">
                      {number}
                    </span>
                    <p className="mt-2 text-[7px] font-bold uppercase tracking-[0.12em] text-white/65">
                      {title}
                    </p>
                    <p className="mt-1 font-mono text-[5px] uppercase tracking-[0.1em] text-white/20">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Product identity strip */}
        <section className="mt-5 rounded-[30px] border border-white/10 bg-[#101010] p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                PRODUCT IDENTITY
              </p>
              <h2
                className="mt-2 text-5xl leading-[0.8] text-white sm:text-6xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                BUILT FOR
                <br />
                THE PACK.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">
              {[
                ["Brand", product.brand || "The Backstore"],
                ["Collection", product.collection || "The Pack"],
                ["Category", displayCategory],
                ["Fit", product.fit || "Relaxed"],
                ["Gender", product.gender || "Unisex"],
                ["SKU", product.sku || "—"],
                ["Fabric", fabricMaterial],
                ["GSM", `${fabricGsm} GSM`],
              ].map(([label, value]) => (
                <div key={label} className="border-t border-white/10 pt-3">
                  <p className="font-mono text-[6px] uppercase tracking-[0.18em] text-white/20">
                    {label}
                  </p>
                  <p className="mt-2 truncate text-xs uppercase tracking-[0.05em] text-white/60">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive information area */}
        <section className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#101010] p-5 sm:p-6">
            <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
              FIELD NOTES
            </p>

            <div className="mt-6 space-y-2">
              {[
                ["story", "The story"],
                ["fit", "Fit + care"],
                ["delivery", "Delivery"],
              ].map(([key, label], index) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setShowDetails(key as "story" | "fit" | "delivery")
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left font-mono text-[8px] uppercase tracking-[0.14em] transition ${
                    showDetails === key
                      ? "bg-[#DA0D12] text-white"
                      : "text-white/35 hover:bg-white/[0.04] hover:text-white/75"
                  }`}
                >
                  <span>
                    <span className="mr-3 opacity-40">0{index + 1}</span>
                    {label}
                  </span>
                  <ArrowIcon />
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[330px] rounded-[30px] border border-white/10 bg-[#101010] p-6 sm:p-8 lg:p-10">
            {showDetails === "story" && (
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  The Backstore / Story
                </p>
                <h3
                  className="mt-4 text-5xl leading-[0.8] text-white sm:text-7xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  WEAR YOUR
                  <br />
                  OWN STORY.
                </h3>
                <p className="mt-7 max-w-3xl text-sm leading-7 text-white/40">
                  {product.description ||
                    "A Backstore piece built around bold graphics, relaxed streetwear proportions and the attitude of doing things your own way."}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {(product.tags ?? []).slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-2 font-mono text-[6px] uppercase tracking-[0.12em] text-white/35"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {showDetails === "fit" && (
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  Fit / Care
                </p>
                <h3
                  className="mt-4 text-5xl leading-[0.8] text-white sm:text-7xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  RELAXED
                  <br />
                  BY DESIGN.
                </h3>

                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  {[
                    "Follow the garment care instructions supplied with the piece.",
                    "Wash with similar colours and avoid unnecessary high heat.",
                    "Turn graphic tees inside out when washing to help protect the print.",
                    "Store folded or hung in a dry place.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <span className="mt-0.5 shrink-0 text-[#DA0D12]">
                        <CheckIcon />
                      </span>
                      <p className="text-sm leading-6 text-white/40">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showDetails === "delivery" && (
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  Order / Delivery
                </p>
                <h3
                  className="mt-4 text-5xl leading-[0.8] text-white sm:text-7xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  FROM OUR
                  <br />
                  PACK TO YOU.
                </h3>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["01", "Packed", "Your order is prepared for dispatch."],
                    ["02", "Shipped", "Your package moves through delivery."],
                    ["03", "Delivered", "Your Backstore piece reaches you."],
                  ].map(([number, title, text]) => (
                    <div
                      key={number}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                    >
                      <span className="font-mono text-[7px] text-[#DA0D12]">
                        {number}
                      </span>
                      <p className="mt-7 text-sm uppercase text-white/70">
                        {title}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-white/30">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                  Keep exploring
                </p>
                <h2
                  className="mt-2 text-6xl leading-[0.78] text-white sm:text-8xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  MORE FROM
                  <br />
                  THE PACK.
                </h2>
              </div>

              <button
                type="button"
                onClick={() => router.push("/shop/t-shirts")}
                className="hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 transition hover:text-white sm:flex"
              >
                View all
                <ArrowIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {relatedProducts.map((item, index) => {
                const relatedImage =
                  item.product_images?.find((image) => image.is_primary)
                    ?.image_url ||
                  item.product_images?.find((image) => image.image_url)
                    ?.image_url ||
                  item.image_url ||
                  "";

                const relatedDiscount =
                  item.mrp && item.price && item.mrp > item.price
                    ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
                    : 0;

                return (
                  <article
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${item.name}`}
                    onClick={() =>
                      router.push(
                        `/shop/t-shirts/product/${slugify(item.name)}`,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(
                          `/shop/t-shirts/product/${slugify(item.name)}`,
                        );
                      }
                    }}
                    className="group flex h-full min-w-0 cursor-pointer flex-col outline-none"
                  >
                    <div className="relative aspect-[0.84] w-full overflow-hidden rounded-[28px] border border-[#CBCAC8]/15 bg-[#171717] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#CBCAC8]/30 group-hover:shadow-[0_28px_70px_rgba(0,0,0,0.42)]">
                      {relatedImage ? (
                        <img
                          src={relatedImage}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#171717]">
                          <PawIcon className="h-10 w-10 text-[#DA0D12]/30" />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
                      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/[0.04]" />

                      {relatedDiscount > 0 && (
                        <div className="absolute bottom-3 left-3 z-10 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/[0.10] bg-[#DA0D12]/95 px-1.5 shadow-[0_8px_20px_rgba(218,13,18,0.18)] backdrop-blur-md">
                          <span className="font-[var(--font-outfit)] text-[7px] font-bold leading-none tracking-[-0.02em] text-white">
                            -{relatedDiscount}%
                          </span>
                        </div>
                      )}

                      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.10] bg-[#111111]/75 text-[#CBCAC8] backdrop-blur-xl transition-all duration-300 group-hover:border-white/20 group-hover:bg-[#222222]">
                        <ArrowIcon />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-2 pt-5 sm:px-3 sm:pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3
                            className="line-clamp-2 text-[24px] leading-[0.82] text-[#CBCAC8] sm:text-[29px]"
                            style={{
                              fontFamily:
                                "var(--font-bebas-neue), Impact, sans-serif",
                            }}
                          >
                            {item.name}
                          </h3>

                          <p className="mt-3 line-clamp-1 text-[8px] uppercase tracking-[0.22em] text-[#666362] sm:text-[9px]">
                            {item.category || "T-Shirt"}
                            {item.collection ? ` / ${item.collection}` : ""}
                          </p>
                        </div>

                        <div className="shrink-0 pt-1 text-right">
                          <span className="font-mono text-[12px] font-medium tracking-[-0.02em] text-[#CBCAC8]/80 sm:text-[14px]">
                            {formatPrice(item.price)}
                          </span>

                          {item.mrp && item.price && item.mrp > item.price && (
                            <span className="mt-1 block font-mono text-[8px] text-[#666362] line-through sm:text-[9px]">
                              {formatPrice(item.mrp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#080808]/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div className="min-w-0 flex-1 pl-1">
            <p className="truncate text-xs font-bold uppercase text-white">
              {product.name}
            </p>

            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
              {selectedSize || "Select size"} · {formatPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
              wishlisted
                ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                : "border-white/10 bg-white/[0.03] text-white/50"
            }`}
            aria-label="Wishlist"
          >
            <HeartIcon filled={wishlisted} />
          </button>

          <button
            type="button"
            disabled={Boolean(actionLoading) || (!showViewCart && !canPurchase)}
            onClick={() => {
              if (showViewCart) {
                openCartDrawer();
                return;
              }

              addProductToCart(false);
            }}
            className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#DA0D12] px-4 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b90b10] disabled:cursor-not-allowed disabled:bg-[#242323] disabled:text-white/25"
          >
            {actionLoading === "cart"
              ? "Adding"
              : showViewCart
                ? "View"
                : "Add"}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </main>
  );
}
