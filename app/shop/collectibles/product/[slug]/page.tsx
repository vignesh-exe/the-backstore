"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateCartItemQuantity,
} from "@/lib/features/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/features/wishlist/wishlistSlice";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
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
  sku?: string | null;
  brand?: string | null;
  collection?: string | null;
  category?: string | null;
  tags?: string[] | null;
  mrp?: number | null;
  price?: number | null;
  description?: string | null;
  stock?: number | null;
  slug?: string | null;
  metadata?: Record<string, unknown> | null;
  image_url?: string | null;
  collectible_images?: CollectibleImage[] | null;
  featured?: boolean | null;
  status?: string | null;
};
type ProductReview = {
  id: string;
  rating: number;
  review: string;
  user_name?: string | null;
  created_at?: string | null;
  user_id?: string | null;
};
type ReviewUser = { id: string; name: string };
type WishlistItem = {
  id?: string;
  product_id?: string;
  product?: Collectible;
};
type CartState = {
  cart?: {
    cartItems?: Record<
      string,
      {
        productId: string;
        size: string;
        quantity: number;
        productType?: string;
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
function getDiscount(
  price: number | null | undefined,
  mrp: number | null | undefined,
) {
  const currentPrice = Number(price ?? 0);
  const maximumRetailPrice = Number(mrp ?? 0);
  if (!maximumRetailPrice || maximumRetailPrice <= currentPrice) return 0;
  return Math.round(
    ((maximumRetailPrice - currentPrice) / maximumRetailPrice) * 100,
  );
}
function normalizeCollectible(value: Collectible): Collectible {
  return {
    ...value,
    id: String(value.id),
    tags: Array.isArray(value.tags) ? value.tags : [],
    collectible_images: Array.isArray(value.collectible_images)
      ? value.collectible_images
      : [],
    stock: Math.max(0, Number(value.stock ?? 0)),
    price: Number(value.price ?? 0),
    mrp: Number(value.mrp ?? 0),
  };
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
function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
    </svg>
  );
}
export default function CollectibleSlugPage() {
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
  const [collectible, setCollectible] = useState<Collectible | null>(null);
  const [relatedCollectibles, setRelatedCollectibles] = useState<Collectible[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"cart" | "buy" | null>(
    null,
  );
  const [showDetails, setShowDetails] = useState<
    "story" | "details" | "delivery"
  >("story");
  const [addedNotice, setAddedNotice] = useState(false);
  const [reviewUser, setReviewUser] = useState<ReviewUser | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  useEffect(() => {
    let cancelled = false;
    async function loadCollectible() {
      if (!slug) return;
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/admin/collectibles", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to load collectibles.");
        }
        const payload = await response.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.collectibles)
            ? payload.collectibles
            : Array.isArray(payload?.data)
              ? payload.data
              : [];
        const normalized = list.map(normalizeCollectible);
        const matched = normalized.find(
          (item: Collectible) => slugify(item.name) === slug,
        );
        if (!matched) {
          throw new Error("Collectible not found.");
        }
        if (cancelled) return;
        setCollectible(matched);
        const sameGroup = normalized.filter(
          (item: Collectible) =>
            item.id !== matched.id &&
            item.status !== "Inactive" &&
            item.stock! > 0 &&
            (item.collection === matched.collection ||
              item.category === matched.category),
        );
        const fallback = normalized.filter(
          (item: Collectible) =>
            item.id !== matched.id &&
            item.status !== "Inactive" &&
            item.stock! > 0,
        );
        setRelatedCollectibles(
          [...sameGroup, ...fallback]
            .filter(
              (item, index, array) =>
                array.findIndex((entry) => entry.id === item.id) === index,
            )
            .slice(0, 4),
        );
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
    loadCollectible();
    return () => {
      cancelled = true;
    };
  }, [slug]);
  useEffect(() => {
    if (!collectible) return;
    const localMatch = wishlist.some(
      (item) =>
        String(item.id ?? item.product_id) === collectible.id ||
        String(item.product?.id) === collectible.id,
    );
    setWishlisted(localMatch);
  }, [collectible, wishlist]);
  useEffect(() => {
    let cancelled = false;
    const setUser = (session: any) => {
      const user = session?.user;
      setReviewUser(
        user
          ? {
              id: user.id,
              name: String(
                user.user_metadata?.full_name ||
                  user.user_metadata?.name ||
                  user.email?.split("@")[0] ||
                  "Customer",
              ),
            }
          : null,
      );
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setUser(session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session),
    );
    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!collectible) return;
    let cancelled = false;
    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await fetch(
          `/api/reviews?productId=${encodeURIComponent(collectible.id)}&productType=collectible`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Unable to load reviews.");
        const payload = await response.json();
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.reviews)
            ? payload.reviews
            : [];
        if (!cancelled) setReviews(list);
      } catch (requestError) {
        console.error("Failed to load collectible reviews:", requestError);
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [collectible]);
  const submitReview = async () => {
    if (!collectible) return;
    if (!reviewUser) {
      window.dispatchEvent(new Event("backstore:open-login"));
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Please select a rating.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your review.");
      return;
    }
    setReviewSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setReviewUser(null);
        window.dispatchEvent(new Event("backstore:open-login"));
        return;
      }
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          productId: collectible.id,
          productType: "collectible",
          rating: reviewRating,
          review: reviewText.trim(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(payload?.error || "Unable to submit your review.");
      const submittedReview = payload?.review || payload?.data;
      if (submittedReview)
        setReviews((current) => [submittedReview, ...current]);
      else {
        const refreshed = await fetch(
          `/api/reviews?productId=${encodeURIComponent(collectible.id)}&productType=collectible`,
          { cache: "no-store" },
        );
        const refreshedPayload = await refreshed.json();
        setReviews(
          Array.isArray(refreshedPayload)
            ? refreshedPayload
            : refreshedPayload?.reviews || [],
        );
      }
      setReviewRating(0);
      setReviewText("");
      toast.success("Thanks for sharing your review.");
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit your review.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    : 0;
  useEffect(() => {
    if (!addedNotice) return;
    const timeout = window.setTimeout(() => setAddedNotice(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [addedNotice]);
  const images = useMemo(() => {
    if (!collectible) return [];
    const remoteImages = [...(collectible.collectible_images ?? [])]
      .filter((image) => Boolean(image.image_url))
      .sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
      })
      .map((image) => ({
        url: image.image_url as string,
        alt: image.alt_text || collectible.name,
      }));
    if (remoteImages.length) return remoteImages;
    return collectible.image_url
      ? [{ url: collectible.image_url, alt: collectible.name }]
      : [];
  }, [collectible]);
  const stock = Math.max(0, Number(collectible?.stock ?? 0));
  const isOutOfStock =
    stock <= 0 ||
    collectible?.status === "Inactive" ||
    collectible?.status === "Out of Stock";
  const canPurchase = !isOutOfStock && quantity > 0 && quantity <= stock;
  const discount = useMemo(
    () => getDiscount(collectible?.price, collectible?.mrp),
    [collectible],
  );
  const cartKey = collectible ? `${collectible.id}_ONE SIZE` : "";
  const quantityInCart = cartKey ? (cartItems[cartKey]?.quantity ?? 0) : 0;
  useEffect(() => {
    if (collectible) setQuantity(quantityInCart);
  }, [collectible?.id, quantityInCart]);
  const openCartDrawer = () => {
    window.dispatchEvent(new Event("backstore:open-cart"));
  };

  const handleShare = async () => {
    if (!collectible || typeof window === "undefined") return;
    const shareData = {
      title: collectible.name,
      text: `Check out ${collectible.name} at The Backstore.`,
      url: window.location.href,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Product link copied.");
      } else {
        toast.error("Sharing is not supported on this device.");
      }
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name !== "AbortError") {
        toast.error("Unable to share this product.");
      }
    }
  };
  const handleWishlist = async () => {
    if (!collectible || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        dispatch(removeFromWishlist({ productId: collectible.id }));
        setWishlisted(false);
        toast.success("Removed from wishlist.");
      } else {
        dispatch(
          addToWishlist({
            product: {
              ...collectible,
              product_images: collectible.collectible_images,
            } as any,
          }),
        );
        setWishlisted(true);
        toast.success("Added to wishlist.");
      }
    } catch (wishlistError) {
      console.error("Wishlist update failed:", wishlistError);
      toast.error("Unable to update wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };
  const persistCartQuantity = async (nextQuantity: number) => {
    if (!collectible) return false;

    const maxStock = Math.max(0, Number(collectible.stock) || 0);
    if (nextQuantity < 0) return false;
    if (nextQuantity > maxStock) {
      toast.error("Requested quantity is not available in stock.");
      return false;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      window.dispatchEvent(new Event("backstore:open-login"));
      return false;
    }

    const userId = session.user.id;
    const { data: existingItem, error: lookupError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("collectible_id", collectible.id)
      .eq("size", "ONE SIZE")
      .maybeSingle();

    if (lookupError) throw lookupError;

    // A quantity of zero means the user removed the collectible from the cart.
    if (nextQuantity === 0) {
      if (existingItem) {
        const { error: deleteError } = await supabase
          .from("cart_items")
          .delete()
          .eq("id", existingItem.id)
          .eq("user_id", userId);
        if (deleteError) throw deleteError;
      }

      dispatch(
        updateCartItemQuantity({
          productId: collectible.id,
          size: "ONE SIZE",
          quantity: 0,
        }),
      );
      setQuantity(0);
      window.dispatchEvent(new Event("backstore:cart-updated"));
      return true;
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

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: userId,
        product_id: null,
        collectible_id: collectible.id,
        size: "ONE SIZE",
        quantity: nextQuantity,
      });

      if (insertError) throw insertError;
    }

    const currentReduxQuantity =
      cartItems[`${collectible.id}_ONE SIZE`]?.quantity ?? 0;

    if (currentReduxQuantity > 0) {
      dispatch(
        updateCartItemQuantity({
          productId: collectible.id,
          size: "ONE SIZE",
          quantity: nextQuantity,
        }),
      );
    } else {
      dispatch(
        addToCart({
          productId: collectible.id,
          size: "ONE SIZE",
          quantity: nextQuantity,
          productType: "collectible",
          productImage: images[0]?.url,
          customization: null,
        }),
      );
    }

    setQuantity(nextQuantity);
    window.dispatchEvent(new Event("backstore:cart-updated"));
    return true;
  };

  const addProductToCart = async (goToCheckout = false) => {
    if (!collectible || actionLoading) return;

    if (goToCheckout) {
      if (!canPurchase) return;
      setActionLoading("buy");
      try {
        const buyNowItem = {
          productId: collectible.id,
          size: "ONE SIZE",
          quantity,
          productType: "collectible",
          productImage: images[0]?.url,
          productName: collectible.name,
          productPrice: Number(collectible.price ?? 0),
        };
        sessionStorage.setItem(
          "backstore-buy-now-item",
          JSON.stringify(buyNowItem),
        );
        router.push("/checkout?buyNow=true");
      } catch (requestError) {
        console.error("Failed to prepare Buy Now checkout:", requestError);
        toast.error(
          requestError instanceof Error
            ? requestError.message
            : "Unable to start checkout.",
        );
      } finally {
        setActionLoading(null);
      }
      return;
    }

    // Quantity controls only change local state. Persist to Supabase only
    // when the user explicitly clicks the Add/Update Cart button.
    if (isOutOfStock && quantity > 0) return;
    if (quantity > stock) {
      toast.error("Requested quantity is not available in stock.");
      return;
    }
    if (quantity === 0 && quantityInCart === 0) return;

    setActionLoading("cart");
    try {
      const saved = await persistCartQuantity(quantity);
      if (saved) {
        setAddedNotice(quantity > 0);
        toast.success(
          quantity === 0
            ? "Collectible removed from cart."
            : quantityInCart > 0
              ? "Cart quantity updated."
              : "Added to cart.",
        );
      }
    } catch (requestError) {
      console.error("Save collectible cart quantity failed:", requestError);
      setAddedNotice(false);
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save collectible cart quantity.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const increaseQuantity = async () => {
    if (!collectible || isOutOfStock || actionLoading || quantity >= stock)
      return;

    const nextQuantity = Math.min(quantity + 1, stock);

    // Before the first Add to Cart, the counter is only a local selection.
    // Once the collectible is in the cart, every + click persists immediately.
    if (quantityInCart <= 0) {
      setQuantity(nextQuantity);
      return;
    }

    setActionLoading("cart");
    try {
      const saved = await persistCartQuantity(nextQuantity);
      if (saved) setQuantity(nextQuantity);
    } catch (requestError) {
      console.error(
        "Failed to increase collectible cart quantity:",
        requestError,
      );
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to increase cart quantity.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const decreaseQuantity = async () => {
    if (!collectible || quantity <= 0 || actionLoading) return;
    const nextQuantity = Math.max(quantity - 1, 0);

    // Before the first Add to Cart, the counter is only a local selection.
    if (quantityInCart <= 0) {
      setQuantity(nextQuantity);
      return;
    }

    // Once in cart, every - click persists immediately. At zero the database
    // row is deleted and Redux is cleared by persistCartQuantity.
    setActionLoading("cart");
    try {
      const saved = await persistCartQuantity(nextQuantity);
      if (saved) setQuantity(nextQuantity);
    } catch (requestError) {
      console.error(
        "Failed to decrease collectible cart quantity:",
        requestError,
      );
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : "Unable to decrease cart quantity.",
      );
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
  if (error || !collectible) {
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
            COLLECTIBLE LOST
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#666362]">
            {error || "This collectible could not be found in the collection."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/shop/collectibles")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#DA0D12] px-6 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white"
          >
            <ArrowIcon direction="left" />
            Back to collectibles
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] text-[#CBCAC8]">
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
            <span>{collectible.collection || "COLLECTIBLES"}</span>
            <span>/</span>
            <span>{collectible.sku || collectible.id.slice(0, 8)}</span>
          </div>
        </div>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(440px,1.12fr)]">
          <div className="relative">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#121212]">
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-[#080808]/70 px-3 py-2 backdrop-blur-xl">
                <PawIcon className="h-3.5 w-3.5 text-[#DA0D12]" />
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/70">
                  Collector approved
                </span>
              </div>
              <div className="absolute right-5 top-5 z-20 flex flex-col items-end">
                <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">
                  {String(activeImage + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 h-px w-8 bg-[#DA0D12]" />
              </div>
              <div className="aspect-[1.12/1] overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[activeImage]?.url}
                    alt={images[activeImage]?.alt || collectible.name}
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
            <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
              {[
                ["01", "Original", "Collector piece"],
                ["02", "Curated", "Selected for you"],
                ["03", "The Pack", "Backstore drop"],
              ].map(([number, title, text], index) => (
                <div
                  key={number}
                  className={`px-3 py-4 sm:px-5 ${index > 0 ? "border-l border-white/10" : ""}`}
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
          <aside className="relative">
            <div className="rounded-[26px] border border-white/10 bg-[#101010] p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  DROP / {collectible.collection || "COLLECTIBLES"}
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
                {collectible.brand || "THE BACKSTORE"} /{" "}
                {collectible.category || "COLLECTIBLE"}
              </p>
              <h1
                className="mt-2 max-w-full break-words text-[clamp(3.15rem,6vw,5.8rem)] leading-[0.82] tracking-[-0.018em] text-[#CBCAC8]"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                {collectible.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-end gap-3 border-y border-white/10 py-4">
                <span
                  className="text-4xl text-white sm:text-5xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  {formatPrice(collectible.price)}
                </span>

                {collectible.mrp &&
                  collectible.mrp > (collectible.price ?? 0) && (
                    <span className="mb-1 font-mono text-xs text-white/30 line-through">
                      {formatPrice(collectible.mrp)}
                    </span>
                  )}
                {discount > 0 && (
                  <span className="mb-1 rounded-full bg-[#DA0D12]/10 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#DA0D12]">
                    Save {discount}%
                  </span>
                )}

                <div className="ml-auto mb-1 flex shrink-0 items-center gap-1.5">
                  <span
                    className="text-sm text-[#DA0D12]"
                    aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
                  >
                    ★
                  </span>
                  <span className="font-mono text-xs text-white">
                    {reviews.length > 0 ? averageRating.toFixed(1) : "—"}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">
                    ({reviews.length})
                  </span>
                </div>
              </div>

              {collectible.description && (
                <p className="mt-4 text-xs leading-6 text-white/45 sm:text-sm">
                  {collectible.description}
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="border-r border-white/10 px-4 py-3.5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/30">
                    Category
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.04em] text-white/75">
                    {collectible.category || "Collectible"}
                  </p>
                </div>
                <div className="px-4 py-3.5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-white/30">
                    Collection
                  </p>
                  <p className="mt-1.5 truncate text-xs font-semibold uppercase tracking-[0.04em] text-white/75">
                    {collectible.collection || "The Backstore"}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/35">
                      Quantity
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      Select the number of pieces you want.
                    </p>
                  </div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#DA0D12]">
                    {stock > 0 ? `${stock} AVAILABLE` : "SOLD OUT"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 min-w-0 flex-1 items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-2">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={
                        quantity <= 0 || isOutOfStock || Boolean(actionLoading)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white disabled:opacity-20"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <div className="min-w-0 text-center">
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
                      disabled={
                        isOutOfStock ||
                        quantity >= stock ||
                        Boolean(actionLoading)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/5 hover:text-white disabled:opacity-20"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share this collectible"
                    title="Share this collectible"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-white/65 transition hover:border-[#DA0D12]/60 hover:bg-[#DA0D12]/10 hover:text-white"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={
                    Boolean(actionLoading) ||
                    (quantityInCart <= 0 &&
                      (quantity <= 0 || !canPurchase || quantity > stock))
                  }
                  onClick={() =>
                    quantityInCart > 0
                      ? openCartDrawer()
                      : addProductToCart(false)
                  }
                  className="group flex h-16 min-w-0 items-center justify-between gap-2 rounded-2xl bg-[#DA0D12] px-3 text-white transition hover:bg-[#b90b10] disabled:cursor-not-allowed disabled:bg-[#242323] disabled:text-white/25 sm:px-4"
                >
                  <span>
                    <span className="block font-mono text-[7px] uppercase tracking-[0.12em] opacity-70">
                      {isOutOfStock
                        ? "Currently unavailable"
                        : "Your next piece"}
                    </span>
                    <span className="mt-1 block text-xs font-bold uppercase tracking-[0.04em] sm:text-sm">
                      {actionLoading === "cart"
                        ? "Saving..."
                        : quantityInCart > 0
                          ? "Show Cart"
                          : isOutOfStock
                            ? "Out of stock"
                            : "Add to cart"}
                    </span>
                  </span>
                  <span className="shrink-0 transition-transform group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </button>
                <button
                  type="button"
                  disabled={!canPurchase || Boolean(actionLoading)}
                  onClick={() => addProductToCart(true)}
                  className="flex h-16 min-w-0 items-center justify-center gap-1 rounded-2xl border border-white/10 bg-white/[0.025] px-2 font-mono text-[7px] uppercase tracking-[0.12em] text-white/60 transition hover:border-[#DA0D12]/50 hover:bg-[#DA0D12]/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 sm:gap-2 sm:text-[8px]"
                >
                  {actionLoading === "buy" ? "Preparing..." : "Buy now"}
                  <ArrowIcon />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10">
                {[
                  ["01", "FAST", "Dispatch"],
                  ["02", "SAFE", "Checkout"],
                  ["03", "PACK", "Checked"],
                ].map(([number, title, text], index) => (
                  <div
                    key={number}
                    className={`px-2 py-3 text-center ${index > 0 ? "border-l border-white/10" : ""}`}
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
        <section className="mt-5 rounded-[30px] border border-white/10 bg-[#101010] p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                COLLECTIBLE IDENTITY
              </p>
              <h2
                className="mt-2 text-5xl leading-[0.8] text-white sm:text-6xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                BUILT FOR
                <br />
                THE COLLECTORS.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3">
              {[
                ["Brand", collectible.brand || "The Backstore"],
                ["Collection", collectible.collection || "The Pack"],
                ["Category", collectible.category || "Collectible"],
                ["SKU", collectible.sku || "—"],
                ["Stock", String(stock)],
                ["Status", collectible.status || "Active"],
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
        <section className="mt-5 grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#101010] p-5 sm:p-6">
            <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
              FIELD NOTES
            </p>
            <div className="mt-6 space-y-2">
              {[
                ["story", "The story"],
                ["details", "Details"],
                ["delivery", "Delivery"],
              ].map(([key, label], index) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setShowDetails(key as "story" | "details" | "delivery")
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
                  COLLECT WHAT
                  <br />
                  YOU LOVE.
                </h3>
                <p className="mt-7 max-w-3xl text-sm leading-7 text-white/40">
                  {collectible.description ||
                    "A Backstore collectible chosen for people who collect the characters, worlds, stories and ideas that mean something to them."}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {(collectible.tags ?? []).slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-2 font-mono text-[6px] uppercase tracking-[0.12em] text-white/35"
                    >
                      \#{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {showDetails === "details" && (
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  Collectible / Details
                </p>
                <h3
                  className="mt-4 text-5xl leading-[0.8] text-white sm:text-7xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  MADE TO
                  <br />
                  BE KEPT.
                </h3>
                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  {[
                    ["Category", collectible.category || "Collectible"],
                    ["Collection", collectible.collection || "The Backstore"],
                    ["SKU", collectible.sku || "—"],
                    [
                      "Availability",
                      isOutOfStock ? "Out of stock" : `${stock} available`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                    >
                      <p className="font-mono text-[6px] uppercase tracking-[0.18em] text-white/20">
                        {label}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-[0.05em] text-white/60">
                        {value}
                      </p>
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
                    [
                      "01",
                      "Packed",
                      "Your collectible is prepared for dispatch.",
                    ],
                    ["02", "Shipped", "Your package moves through delivery."],
                    ["03", "Delivered", "Your collectible reaches you."],
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
        {/* Customer reviews */}
        <section
          className="mt-12 sm:mt-16"
          aria-labelledby="customer-reviews-heading"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                THE PACK SPEAKS
              </p>
              <h2
                id="customer-reviews-heading"
                className="mt-2 text-5xl leading-[0.82] text-white sm:text-7xl"
                style={{
                  fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                }}
              >
                CUSTOMER REVIEWS
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#CBCAC8]/55">
                Real thoughts from collectors who have picked up this piece.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#101010] px-4 py-3">
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">
                PACK RATING
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold text-white">
                  {reviews.length ? averageRating.toFixed(1) : "—"}
                </span>
                <span className="text-sm tracking-wider text-[#DA0D12]">
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                </span>
                <span className="font-mono text-[8px] text-white/35">
                  ({reviews.length})
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#DA0D12]/25 bg-[#111111] p-5 sm:p-7">
              {!reviewUser ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#DA0D12]/30 bg-[#DA0D12]/10 text-2xl text-[#DA0D12]">
                    ★
                  </div>
                  <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                    YOUR TAKE MATTERS
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    Share your experience
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#CBCAC8]/55">
                    Picked up this collectible? Sign in to leave a rating and
                    help the rest of the pack.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(new Event("backstore:open-login"))
                    }
                    className="mt-6 rounded-full bg-[#DA0D12] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b90b10]"
                  >
                    Login to write a review <span aria-hidden="true">→</span>
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#DA0D12]">
                    WRITE A REVIEW
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white">
                    How was your experience?
                  </h3>
                  <p className="mt-2 text-xs text-[#CBCAC8]/45">
                    Posting as {reviewUser.name}
                  </p>
                  <fieldset className="mt-6">
                    <legend className="mb-3 text-sm font-semibold text-white/80">
                      Your rating
                    </legend>
                    <div
                      className="flex items-center gap-2"
                      role="radiogroup"
                      aria-label="Your rating"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          role="radio"
                          aria-checked={reviewRating === rating}
                          aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                          onClick={() => setReviewRating(rating)}
                          className={`text-3xl transition ${reviewRating >= rating ? "text-[#DA0D12]" : "text-white/20 hover:text-[#DA0D12]/70"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <label
                    htmlFor="collectible-review-text"
                    className="mt-6 block text-sm font-semibold text-white/80"
                  >
                    Your review
                  </label>
                  <textarea
                    id="collectible-review-text"
                    value={reviewText}
                    onChange={(event) =>
                      setReviewText(event.target.value.slice(0, 1000))
                    }
                    maxLength={1000}
                    rows={5}
                    placeholder="Tell the pack what you liked about this collectible..."
                    className="mt-3 w-full resize-y rounded-2xl border border-white/15 bg-[#080808] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#DA0D12]/70"
                  />
                  <div className="mt-2 flex justify-end font-mono text-[8px] text-white/35">
                    {reviewText.length}/1000
                  </div>
                  <button
                    type="button"
                    onClick={submitReview}
                    disabled={
                      reviewSubmitting || reviewRating < 1 || !reviewText.trim()
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#DA0D12] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#b90b10] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit review"}{" "}
                    <ArrowIcon />
                  </button>
                </div>
              )}
            </div>
            <div className="rounded-[28px] border border-white/10 bg-[#101010] p-5 sm:p-7">
              {reviewsLoading ? (
                <div className="flex min-h-[300px] flex-col gap-4">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-white/10" />
                  <div className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
                  <div className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-2xl text-[#DA0D12]">
                    ☆
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">
                    No reviews yet
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#CBCAC8]/55">
                    Be the first collector to share your experience with this
                    piece.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="text-lg font-bold text-white">
                      From the pack
                    </h3>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                      {reviews.length} review{reviews.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="max-h-[440px] space-y-4 overflow-y-auto pr-1">
                    {reviews.map((review) => {
                      const rating = Math.max(
                        0,
                        Math.min(5, Number(review.rating) || 0),
                      );
                      return (
                        <article
                          key={review.id}
                          className="rounded-2xl border border-white/10 bg-[#080808]/70 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {review.user_name || "Backstore customer"}
                              </p>
                              {review.created_at && (
                                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/35">
                                  {new Date(
                                    review.created_at,
                                  ).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                            </div>
                            <span
                              className="shrink-0 text-sm tracking-wider text-[#DA0D12]"
                              aria-label={`${rating} out of 5 stars`}
                            >
                              {"★".repeat(rating)}
                              <span className="text-white/15">
                                {"★".repeat(5 - rating)}
                              </span>
                            </span>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#CBCAC8]/70">
                            {review.review}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {relatedCollectibles.length > 0 && (
          <section className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                  Similar products
                </p>
                <h2
                  className="mt-2 text-6xl leading-[0.78] text-white sm:text-8xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  SIMILAR
                  <br />
                  PRODUCTS.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => router.push("/shop/collectibles")}
                className="hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 transition hover:text-white sm:flex"
              >
                View all
                <ArrowIcon />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {relatedCollectibles.map((item) => {
                const relatedImage =
                  item.collectible_images?.find((image) => image.is_primary)
                    ?.image_url ||
                  item.collectible_images?.find((image) => image.image_url)
                    ?.image_url ||
                  item.image_url ||
                  "";
                const relatedDiscount = getDiscount(item.price, item.mrp);
                return (
                  <article
                    key={item.id}
                    role="link"
                    tabIndex={0}
                    aria-label={`View ${item.name}`}
                    onClick={() =>
                      router.push(
                        `/shop/collectibles/product/${slugify(item.name)}`,
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(
                          `/shop/collectibles/product/${slugify(item.name)}`,
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
                            {item.category || "Collectible"}
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
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-[#080808]/95 p-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <div className="min-w-0 flex-1 pl-1">
            <p className="truncate text-xs font-bold uppercase text-white">
              {collectible.name}
            </p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/30">
              {quantity} piece{quantity === 1 ? "" : "s"} ·{" "}
              {formatPrice(collectible.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishlistLoading}
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
            disabled={
              Boolean(actionLoading) ||
              (quantityInCart <= 0 &&
                (quantity <= 0 || !canPurchase || quantity > stock))
            }
            onClick={() =>
              quantityInCart > 0 ? openCartDrawer() : addProductToCart(false)
            }
            className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#DA0D12] px-4 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#b90b10] disabled:cursor-not-allowed disabled:bg-[#242323] disabled:text-white/25"
          >
            {actionLoading === "cart"
              ? "Saving"
              : quantityInCart > 0
                ? "Show Cart"
                : "Add to Cart"}
            <ArrowIcon />
          </button>
        </div>
      </div>
    </main>
  );
}
