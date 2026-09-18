"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";
import {
  addToCart,
  deleteItemFromCart,
  updateCartItemQuantity,
} from "@/lib/features/cart/cartSlice";

/* ============================================================
   TYPES
============================================================ */

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

type ProductImage = {
  image_url?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  price?: number | null;
  mrp?: number | null;
  stock?: number | null;
  gsm?: number | null;
  fabric?: string | null;
  status?: string | null;
  product_images?: ProductImage[] | null;
  metadata?: {
    sizes?: Record<string, number>;
    [key: string]: unknown;
  } | null;
};

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
};

type AddressForm = {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
};

type StateItem = {
  name: string;
  slug: string;
};

type DistrictItem = {
  name: string;
  slug: string;
};

type StateResponse = {
  districts?: DistrictItem[];
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/* ============================================================
   CONSTANTS
============================================================ */

const INDIA_LOCATION_API = "https://aniket-thapa.github.io/india-pincode-api";

const SHIPPING_FEE = 0;

const CHECKOUT_STEPS = [
  { number: "01", label: "Contact" },
  { number: "02", label: "Delivery" },
  { number: "03", label: "Payment" },
];

/* ============================================================
   ICONS
============================================================ */

function Icon({
  name,
  size = 18,
  className = "",
}: {
  name:
    | "arrow-left"
    | "arrow-right"
    | "check"
    | "chevron-down"
    | "lock"
    | "map-pin"
    | "minus"
    | "plus"
    | "shield"
    | "shopping-bag"
    | "trash"
    | "truck"
    | "user"
    | "x"
    | "credit-card"
    | "refresh";
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "arrow-left":
      return (
        <svg {...common}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "minus":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "shopping-bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l1 12H5L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M10 11v6M14 11v6" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M9 7V4h6v3" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6h11v10H3z" />
          <path d="M14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "credit-card":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.5-4L4 9" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14.5 4L20 15" />
          <path d="M20 20v-5h-5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getCartKey(productId: string, size: string) {
  return `${productId}_${size}`;
}

function getSortedImages(product?: Product) {
  return [...(product?.product_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;

    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
}

function getProductImage(item: ReduxCartItem, product?: Product) {
  return (
    item.productImage ||
    getSortedImages(product).find((image) => image.image_url)?.image_url ||
    ""
  );
}

function getProductPrice(item: ReduxCartItem, product?: Product) {
  if (typeof item.productPrice === "number") {
    return item.productPrice;
  }

  return Number(product?.price ?? 0);
}

function getProductMrp(product?: Product) {
  const mrp = Number(product?.mrp ?? 0);
  const price = Number(product?.price ?? 0);

  return mrp > 0 ? mrp : price;
}

function getProductName(item: ReduxCartItem, product?: Product) {
  return item.productName || product?.name || "Backstore Product";
}

function getSizeStock(product: Product | undefined, size: string) {
  const sizes = product?.metadata?.sizes;

  if (sizes && typeof sizes === "object") {
    const value = Number(sizes[size] ?? 0);

    if (Number.isFinite(value)) {
      return Math.max(0, value);
    }
  }

  const fallbackStock = Number(product?.stock ?? 0);

  return Number.isFinite(fallbackStock) ? Math.max(0, fallbackStock) : 0;
}

/* ============================================================
   PAGE
============================================================ */

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state: {
      cart?: {
        cartItems?: Record<string, ReduxCartItem>;
      };
    }) => state.cart?.cartItems ?? {},
  );

  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCartHydrating, setIsCartHydrating] = useState(true);

  const [customer, setCustomer] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
  });

  const [address, setAddress] = useState<AddressForm>({
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
  });

  const [states, setStates] = useState<StateItem[]>([]);
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [isStatesLoading, setIsStatesLoading] = useState(true);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);

  const [contactOpen, setContactOpen] = useState(true);
  const [deliveryOpen, setDeliveryOpen] = useState(true);

  const [contactComplete, setContactComplete] = useState(false);
  const [deliveryComplete, setDeliveryComplete] = useState(false);

  const [contactError, setContactError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  /* ==========================================================
     LOAD PRODUCT DATA
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setIsProductsLoading(true);

        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load product details.");
        }

        const payload = await response.json();

        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.products)
            ? payload.products
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        if (cancelled) return;

        const nextProducts: Record<string, Product> = {};

        for (const product of list) {
          if (product?.id) {
            nextProducts[String(product.id)] = product;
          }
        }

        setProducts(nextProducts);
      } catch (error) {
        console.error("Checkout product lookup failed:", error);
        toast.error("Unable to load some product details.");
      } finally {
        if (!cancelled) {
          setIsProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     RESTORE CART FROM SUPABASE

     Redux state is in-memory, so it is empty after a full page
     reload. Restore the authenticated user's cart from the
     cart_items table before deciding that the cart is empty.
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function hydrateCart() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          return;
        }

        const { data, error } = await supabase
          .from("cart_items")
          .select("product_id,size,quantity")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        if (cancelled) return;

        // Do not duplicate an already-populated Redux cart.
        if (Object.keys(cartItems).length > 0) {
          return;
        }

        for (const item of data ?? []) {
          const productId = String(item.product_id ?? "");
          const size = String(item.size ?? "");
          const quantity = Number(item.quantity ?? 0);

          if (!productId || !size || quantity <= 0) {
            continue;
          }

          dispatch(
            addToCart({
              productId,
              size,
              quantity,
              productType: "normal",
            }),
          );
        }
      } catch (error) {
        console.error("Failed to restore checkout cart:", error);
      } finally {
        if (!cancelled) {
          setIsCartHydrating(false);
        }
      }
    }

    hydrateCart();

    return () => {
      cancelled = true;
    };
  }, [dispatch, cartItems]);

  /* ==========================================================
     LOAD STATES
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadStates() {
      try {
        setIsStatesLoading(true);

        const response = await fetch(`${INDIA_LOCATION_API}/states.json`);

        if (!response.ok) {
          throw new Error("Failed to load states.");
        }

        const data = (await response.json()) as StateItem[];

        if (!cancelled) {
          setStates(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load states:", error);
      } finally {
        if (!cancelled) {
          setIsStatesLoading(false);
        }
      }
    }

    loadStates();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     LOAD DISTRICTS
  ========================================================== */

  useEffect(() => {
    if (!address.state) {
      setDistricts([]);
      return;
    }

    const selectedState = states.find((state) => state.name === address.state);

    if (!selectedState) {
      setDistricts([]);
      return;
    }

    let cancelled = false;

    async function loadDistricts() {
      try {
        setIsDistrictsLoading(true);

        const response = await fetch(
          `${INDIA_LOCATION_API}/states/${selectedState?.slug}.json`,
        );

        if (!response.ok) {
          throw new Error("Failed to load districts.");
        }

        const data = (await response.json()) as StateResponse;

        if (!cancelled) {
          setDistricts(data.districts ?? []);
        }
      } catch (error) {
        console.error("Failed to load districts:", error);

        if (!cancelled) {
          setDistricts([]);
        }
      } finally {
        if (!cancelled) {
          setIsDistrictsLoading(false);
        }
      }
    }

    loadDistricts();

    return () => {
      cancelled = true;
    };
  }, [address.state, states]);

  /* ==========================================================
     RESOLVED CART
  ========================================================== */

  const resolvedItems = useMemo(() => {
    return Object.entries(cartItems)
      .filter(([, item]) => Number(item.quantity) > 0)
      .map(([cartKey, item]) => {
        const product = products[String(item.productId)];

        return {
          cartKey,
          item,
          product,
          name: getProductName(item, product),
          price: getProductPrice(item, product),
          mrp: getProductMrp(product),
          image: getProductImage(item, product),
          stock: getSizeStock(product, item.size),
        };
      });
  }, [cartItems, products]);

  /* ==========================================================
     TOTALS
  ========================================================== */

  const subtotal = useMemo(() => {
    return resolvedItems.reduce(
      (total, entry) => total + entry.price * Number(entry.item.quantity || 0),
      0,
    );
  }, [resolvedItems]);

  const mrpTotal = useMemo(() => {
    return resolvedItems.reduce(
      (total, entry) => total + entry.mrp * Number(entry.item.quantity || 0),
      0,
    );
  }, [resolvedItems]);

  const productSavings = Math.max(0, mrpTotal - subtotal);
  const grandTotal = Math.max(0, subtotal + SHIPPING_FEE);

  /* ==========================================================
     ADDRESS UPDATE
  ========================================================== */

  const updateAddress = (field: keyof AddressForm, value: string) => {
    setAddress((current) => ({
      ...current,
      [field]: value,
      ...(field === "state" ? { district: "" } : {}),
    }));

    setDeliveryComplete(false);
    setDeliveryError("");
    setPaymentError("");
  };

  /* ==========================================================
     CUSTOMER UPDATE
  ========================================================== */

  const updateCustomer = (field: keyof CustomerForm, value: string) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    setContactComplete(false);
    setContactError("");
    setPaymentError("");
  };

  /* ==========================================================
     VALIDATE CONTACT
  ========================================================== */

  const validateContact = () => {
    const name = customer.name.trim();
    const email = customer.email.trim();
    const phone = customer.phone.trim();

    if (!name || !email || !phone) {
      setContactError("Please complete all contact details.");
      setContactComplete(false);
      setContactOpen(true);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError("Please enter a valid email address.");
      setContactComplete(false);
      setContactOpen(true);
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setContactError("Please enter a valid 10-digit phone number.");
      setContactComplete(false);
      setContactOpen(true);
      return false;
    }

    setContactError("");
    setContactComplete(true);
    setContactOpen(false);
    setDeliveryOpen(true);

    return true;
  };

  /* ==========================================================
     VALIDATE DELIVERY
  ========================================================== */

  const validateDelivery = () => {
    const required = [
      address.addressLine1,
      address.addressLine2,
      address.state,
      address.district,
      address.city,
      address.pincode,
    ];

    if (required.some((value) => !value.trim())) {
      setDeliveryError("Please complete all required delivery fields.");
      setDeliveryComplete(false);
      setDeliveryOpen(true);
      return false;
    }

    if (!/^[0-9]{6}$/.test(address.pincode)) {
      setDeliveryError("Please enter a valid 6-digit pincode.");
      setDeliveryComplete(false);
      setDeliveryOpen(true);
      return false;
    }

    setDeliveryError("");
    setDeliveryComplete(true);

    return true;
  };

  /* ==========================================================
     PAYMENT READINESS
  ========================================================== */

  const isContactReady =
    customer.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) &&
    /^[0-9]{10}$/.test(customer.phone.trim());

  const isDeliveryReady =
    address.addressLine1.trim().length > 0 &&
    address.addressLine2.trim().length > 0 &&
    address.state.trim().length > 0 &&
    address.district.trim().length > 0 &&
    address.city.trim().length > 0 &&
    /^[0-9]{6}$/.test(address.pincode.trim());

  const isCheckoutReady =
    resolvedItems.length > 0 && isContactReady && isDeliveryReady;

  /* ==========================================================
     UPDATE CART QUANTITY
  ========================================================== */

  const updateQuantity = async (
    cartKey: string,
    item: ReduxCartItem,
    nextQuantity: number,
  ) => {
    const productId = String(item.productId);
    const size = String(item.size || "");

    if (!productId || !size) return;

    if (updatingKey) return;

    const product = products[productId];
    const stock = getSizeStock(product, size);

    if (nextQuantity > 0 && stock > 0 && nextQuantity > stock) {
      toast.error(`Only ${stock} available in size ${size}.`);
      return;
    }

    setUpdatingKey(cartKey);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
        return;
      }

      if (nextQuantity <= 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", session.user.id)
          .eq("product_id", productId)
          .eq("size", size);

        if (error) throw error;

        dispatch(
          deleteItemFromCart({
            productId,
            size,
          }),
        );

        return;
      }

      const { data: existingItem, error: lookupError } = await supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("product_id", productId)
        .eq("size", size)
        .maybeSingle();

      if (lookupError) throw lookupError;

      if (existingItem?.id) {
        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: nextQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id)
          .eq("user_id", session.user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: session.user.id,
          product_id: productId,
          size,
          quantity: nextQuantity,
        });

        if (error) throw error;
      }

      dispatch(
        updateCartItemQuantity({
          productId,
          size,
          quantity: nextQuantity,
        }),
      );
    } catch (error) {
      console.error("Checkout cart update failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Unable to update cart.",
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  /* ==========================================================
     REMOVE ITEM
  ========================================================== */

  const removeItem = async (entry: (typeof resolvedItems)[number]) => {
    await updateQuantity(entry.cartKey, entry.item, 0);
  };

  /* ==========================================================
     PAYMENT
  ========================================================== */

  const handlePayment = async () => {
    setPaymentError("");

    if (resolvedItems.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    if (!isCheckoutReady) {
      setPaymentError(
        "Please complete all required contact and delivery details before payment.",
      );
      return;
    }

    const contactValid = validateContact();

    if (!contactValid) {
      return;
    }

    const deliveryValid = validateDelivery();

    if (!deliveryValid) {
      return;
    }

    for (const entry of resolvedItems) {
      if (entry.stock > 0 && Number(entry.item.quantity) > entry.stock) {
        setPaymentError(
          `${entry.name} has only ${entry.stock} item(s) available in size ${entry.item.size}.`,
        );
        return;
      }
    }

    if (!window.Razorpay) {
      setPaymentError("Payment service is still loading. Please try again.");
      return;
    }

    try {
      setIsPaymentLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
        return;
      }

      const checkoutCart = resolvedItems.map((entry) => ({
        product_id: entry.item.productId,
        product_name: entry.name,
        size: entry.item.size,
        quantity: Number(entry.item.quantity),
        price: entry.price,
        mrp: entry.mrp,
        image: entry.image || null,
      }));

      const createOrderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: grandTotal,
        }),
      });

      const createOrderData = await createOrderResponse.json();

      if (!createOrderResponse.ok || !createOrderData?.success) {
        throw new Error(
          createOrderData?.error || "Unable to create payment order.",
        );
      }

      const razorpayOrder = createOrderData.order;

      if (!razorpayOrder?.id) {
        throw new Error("Razorpay order ID was not returned.");
      }

      if (!createOrderData?.keyId) {
        throw new Error("Razorpay key ID was not returned.");
      }

      const options: RazorpayOptions = {
        key: createOrderData.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "The Backstore",
        description: "The Backstore Order",
        order_id: razorpayOrder.id,

        notes: {
          source: "the-backstore-checkout",
        },

        theme: {
          color: "#DA0D12",
        },

        modal: {
          ondismiss: () => {
            setIsPaymentLoading(false);
          },
        },

        handler: async (paymentResponse) => {
          try {
            setPaymentError("");

            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,

                customer_name: customer.name.trim(),
                customer_email: customer.email.trim(),
                customer_phone: customer.phone.trim(),

                address: {
                  country: "India",
                  ...address,
                },

                subtotal,
                delivery_charge: SHIPPING_FEE,
                discount: 0,
                coupon_code: null,
                total_amount: grandTotal,

                cart: checkoutCart,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData?.success) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification or order creation failed.",
              );
            }

            const order = verifyData.order;

            if (!order?.id) {
              throw new Error(
                "Payment was successful, but your order could not be created.",
              );
            }

            setOrderNumber(order.order_number || order.orderNumber || "");

            for (const entry of resolvedItems) {
              dispatch(
                deleteItemFromCart({
                  productId: entry.item.productId,
                  size: entry.item.size,
                }),
              );
            }

            window.dispatchEvent(new Event("cart-updated"));

            setShowSuccess(true);
          } catch (error) {
            console.error("Order finalization failed:", error);

            setPaymentError(
              error instanceof Error
                ? error.message
                : "We could not finish your order.",
            );
          } finally {
            setIsPaymentLoading(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);

      setPaymentError(
        error instanceof Error ? error.message : "Unable to start payment.",
      );

      setIsPaymentLoading(false);
    }
  };

  /* ==========================================================
     EMPTY CART
  ========================================================== */

  if (!isProductsLoading && !isCartHydrating && resolvedItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 pb-20 pt-28 text-[#CBCAC8] sm:px-8">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[32px] border border-[#CBCAC8]/10 bg-[#111111] px-6 py-14 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:px-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#DA0D12]/10 blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#DA0D12]/5 blur-[80px]" />

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#DA0D12]/25 bg-[#DA0D12]/[0.08] text-[#DA0D12]">
              <Icon name="shopping-bag" size={30} />
            </div>

            <p className="relative mt-7 font-mono text-[8px] uppercase tracking-[0.35em] text-[#DA0D12]">
              The Backstore / Checkout
            </p>

            <h1
              className="relative mt-3 text-4xl uppercase leading-none text-[#CBCAC8] sm:text-5xl"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              Your cart is empty.
            </h1>

            <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-[#666362]">
              Add something from the latest Backstore drops and come back here
              to finish your order.
            </p>

            <Link
              href="/shop/t-shirts"
              className="group relative mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#DA0D12] px-7 font-mono text-[8px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#b90b10]"
            >
              Continue Shopping
              <Icon
                name="arrow-right"
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-[#080808] text-[#CBCAC8]">
        {/* ====================================================
            TOP STRIP
        ==================================================== */}

        <section className="relative overflow-hidden border-b border-[#CBCAC8]/8 bg-[#0D0D0D]">
          <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[#DA0D12]/10 blur-[80px]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#DA0D12]/5 blur-[90px]" />

          <div className="relative mx-auto max-w-[1440px] px-4 pb-7 pt-28 sm:px-7 sm:pt-28 lg:px-10 lg:pb-9 lg:pt-32">
            <Link
              href="/shop/t-shirts"
              className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#666362] transition-colors hover:text-[#CBCAC8]"
            >
              <Icon
                name="arrow-left"
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back to shop
            </Link>

            <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#DA0D12]">
                    The Backstore
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#444]" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#666362]">
                    Secure checkout
                  </span>
                </div>

                <h1
                  className="mt-2 text-5xl uppercase leading-[0.86] tracking-tight text-[#CBCAC8] sm:text-6xl lg:text-7xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  Finish the order.
                </h1>

                <p className="mt-3 max-w-xl text-xs leading-6 text-[#666362] sm:text-sm">
                  Your selected pieces are reserved in your checkout. Add your
                  details, choose where they should go, then pay securely.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-[#CBCAC8]/8 bg-[#141414] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DA0D12]/10 text-[#DA0D12]">
                    <Icon name="shield" size={17} />
                  </div>

                  <div>
                    <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#666362]">
                      Protected
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#CBCAC8]">
                      Secure payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step indicator */}
            <div className="mt-8 flex max-w-2xl items-center">
              {CHECKOUT_STEPS.map((step, index) => (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-1 items-center"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[8px] tracking-[0.08em] ${
                        index === 0
                          ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                          : "border-[#CBCAC8]/12 bg-[#111111] text-[#666362]"
                      }`}
                    >
                      {step.number}
                    </div>

                    <span
                      className={`hidden font-mono text-[8px] uppercase tracking-[0.16em] sm:block ${
                        index === 0 ? "text-[#CBCAC8]" : "text-[#666362]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < CHECKOUT_STEPS.length - 1 && (
                    <div className="mx-3 h-px flex-1 bg-[#CBCAC8]/8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-8">
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-5">
              {/* CONTACT */}
              <section className="overflow-hidden rounded-[28px] border border-[#CBCAC8]/8 bg-[#111111]">
                <button
                  type="button"
                  onClick={() => setContactOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 border-b border-[#CBCAC8]/7 px-5 py-5 text-left sm:px-7"
                  aria-expanded={contactOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        contactComplete
                          ? "bg-[#DA0D12] text-white"
                          : "bg-[#DA0D12]/10 text-[#DA0D12]"
                      }`}
                    >
                      {contactComplete ? (
                        <Icon name="check" size={19} />
                      ) : (
                        <Icon name="user" size={19} />
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
                        Step 01
                      </p>

                      <h2
                        className="mt-1 text-2xl uppercase leading-none text-[#CBCAC8]"
                        style={{
                          fontFamily:
                            "var(--font-bebas-neue), Impact, sans-serif",
                        }}
                      >
                        Contact details
                      </h2>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {contactComplete && (
                      <span className="hidden rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/8 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.15em] text-[#DA0D12] sm:block">
                        Ready
                      </span>
                    )}

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#161616] text-[#666362]">
                      <Icon
                        name="chevron-down"
                        size={16}
                        className={`transition-transform duration-300 ${
                          contactOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </span>
                  </div>
                </button>

                {contactOpen && (
                  <div className="p-5 sm:p-7">
                    <p className="mb-5 max-w-2xl text-xs leading-6 text-[#666362]">
                      We&apos;ll use these details for order confirmation and
                      delivery updates.
                    </p>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Full name"
                        required
                        value={customer.name}
                        placeholder="Your full name"
                        autoComplete="name"
                        onChange={(value) => updateCustomer("name", value)}
                      />

                      <Field
                        label="Email address"
                        required
                        type="email"
                        value={customer.email}
                        placeholder="you@example.com"
                        autoComplete="email"
                        onChange={(value) => updateCustomer("email", value)}
                      />

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="phone"
                          className="mb-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]"
                        >
                          Phone number
                          <span className="ml-1 text-[#DA0D12]">*</span>
                        </label>

                        <div className="flex overflow-hidden rounded-2xl border border-[#CBCAC8]/10 bg-[#161616] focus-within:border-[#DA0D12]/45">
                          <div className="flex shrink-0 items-center border-r border-[#CBCAC8]/8 px-4 font-mono text-[9px] text-[#666362]">
                            +91
                          </div>

                          <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            maxLength={10}
                            value={customer.phone}
                            onChange={(event) =>
                              updateCustomer(
                                "phone",
                                event.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="10-digit mobile number"
                            className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-[#CBCAC8] outline-none placeholder:text-[#444]"
                          />
                        </div>
                      </div>
                    </div>

                    {contactError && <ErrorBox message={contactError} />}

                    <button
                      type="button"
                      onClick={validateContact}
                      className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#DA0D12] px-5 py-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#b90b10] sm:w-auto sm:min-w-[260px]"
                    >
                      {contactComplete
                        ? "Contact confirmed"
                        : "Continue to delivery"}
                      <Icon
                        name={contactComplete ? "check" : "arrow-right"}
                        size={16}
                        className={
                          contactComplete
                            ? ""
                            : "transition-transform duration-300 group-hover:translate-x-1"
                        }
                      />
                    </button>
                  </div>
                )}
              </section>

              {/* DELIVERY */}
              <section className="overflow-hidden rounded-[28px] border border-[#CBCAC8]/8 bg-[#111111]">
                <button
                  type="button"
                  onClick={() => setDeliveryOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 border-b border-[#CBCAC8]/7 px-5 py-5 text-left sm:px-7"
                  aria-expanded={deliveryOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        deliveryComplete
                          ? "bg-[#DA0D12] text-white"
                          : "bg-[#DA0D12]/10 text-[#DA0D12]"
                      }`}
                    >
                      {deliveryComplete ? (
                        <Icon name="check" size={19} />
                      ) : (
                        <Icon name="map-pin" size={19} />
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
                        Step 02
                      </p>

                      <h2
                        className="mt-1 text-2xl uppercase leading-none text-[#CBCAC8]"
                        style={{
                          fontFamily:
                            "var(--font-bebas-neue), Impact, sans-serif",
                        }}
                      >
                        Delivery address
                      </h2>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {deliveryComplete && (
                      <span className="hidden rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/8 px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.15em] text-[#DA0D12] sm:block">
                        Ready
                      </span>
                    )}

                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBCAC8]/10 bg-[#161616] text-[#666362]">
                      <Icon
                        name="chevron-down"
                        size={16}
                        className={`transition-transform duration-300 ${
                          deliveryOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </span>
                  </div>
                </button>

                {deliveryOpen && (
                  <div className="p-5 sm:p-7">
                    <p className="mb-5 max-w-2xl text-xs leading-6 text-[#666362]">
                      Where should we send your Backstore order?
                    </p>

                    <div className="space-y-5">
                      <ReadOnlyField label="Country" value="India" />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Field
                            label="Address line 1"
                            required
                            value={address.addressLine1}
                            placeholder="House / Flat No., Street"
                            autoComplete="address-line1"
                            onChange={(value) =>
                              updateAddress("addressLine1", value)
                            }
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <Field
                            label="Address line 2"
                            required
                            value={address.addressLine2}
                            placeholder="Area, locality, apartment"
                            autoComplete="address-line2"
                            onChange={(value) =>
                              updateAddress("addressLine2", value)
                            }
                          />
                        </div>

                        <Field
                          label="Landmark"
                          optional
                          value={address.landmark}
                          placeholder="Nearby landmark"
                          onChange={(value) => updateAddress("landmark", value)}
                        />

                        <Field
                          label="City"
                          required
                          value={address.city}
                          placeholder="City"
                          autoComplete="address-level2"
                          onChange={(value) => updateAddress("city", value)}
                        />

                        <SelectField
                          label="State"
                          required
                          value={address.state}
                          disabled={isStatesLoading}
                          placeholder={
                            isStatesLoading
                              ? "Loading states..."
                              : "Select state"
                          }
                          options={states.map((state) => ({
                            value: state.name,
                            label: state.name,
                          }))}
                          onChange={(value) => updateAddress("state", value)}
                        />

                        <SelectField
                          label="District"
                          required
                          value={address.district}
                          disabled={!address.state || isDistrictsLoading}
                          placeholder={
                            isDistrictsLoading
                              ? "Loading districts..."
                              : address.state
                                ? "Select district"
                                : "Select state first"
                          }
                          options={districts.map((district) => ({
                            value: district.name,
                            label: district.name,
                          }))}
                          onChange={(value) => updateAddress("district", value)}
                        />

                        <Field
                          label="Pincode"
                          required
                          value={address.pincode}
                          placeholder="6-digit pincode"
                          inputMode="numeric"
                          maxLength={6}
                          onChange={(value) =>
                            updateAddress("pincode", value.replace(/\D/g, ""))
                          }
                        />
                      </div>
                    </div>

                    {deliveryError && <ErrorBox message={deliveryError} />}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={validateDelivery}
                        className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#DA0D12] px-5 py-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#b90b10] sm:w-auto sm:min-w-[260px]"
                      >
                        {deliveryComplete
                          ? "Address confirmed"
                          : "Continue to payment"}
                        <Icon
                          name={deliveryComplete ? "check" : "arrow-right"}
                          size={16}
                          className={
                            deliveryComplete
                              ? ""
                              : "transition-transform duration-300 group-hover:translate-x-1"
                          }
                        />
                      </button>

                      <span className="inline-flex items-center justify-center gap-2 font-mono text-[7px] uppercase tracking-[0.15em] text-[#444]">
                        <Icon name="truck" size={13} />
                        Standard delivery
                      </span>
                    </div>
                  </div>
                )}
              </section>

              {/* TRUST PANEL */}
              <section className="grid gap-3 sm:grid-cols-3">
                <TrustCard
                  icon="lock"
                  title="Secure payment"
                  text="Protected by Razorpay"
                />
                <TrustCard
                  icon="shield"
                  title="Safe checkout"
                  text="Your details stay protected"
                />
                <TrustCard
                  icon="truck"
                  title="Delivery"
                  text="India-wide shipping"
                />
              </section>
            </div>

            {/* =================================================
                RIGHT SUMMARY
            ================================================= */}

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-[30px] border border-[#CBCAC8]/9 bg-[#111111] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
                <div className="border-b border-[#CBCAC8]/7 px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.28em] text-[#DA0D12]">
                        Your selection
                      </p>

                      <h2
                        className="mt-1 text-3xl uppercase leading-none text-[#CBCAC8]"
                        style={{
                          fontFamily:
                            "var(--font-bebas-neue), Impact, sans-serif",
                        }}
                      >
                        Order summary
                      </h2>
                    </div>

                    <span className="rounded-full border border-[#CBCAC8]/9 bg-[#161616] px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.15em] text-[#666362]">
                      {resolvedItems.reduce(
                        (total, entry) =>
                          total + Number(entry.item.quantity || 0),
                        0,
                      )}{" "}
                      items
                    </span>
                  </div>
                </div>

                <div className="max-h-[430px] overflow-y-auto px-4 py-4 sm:px-5">
                  <div className="space-y-3">
                    {resolvedItems.map((entry) => (
                      <div
                        key={entry.cartKey}
                        className="group rounded-2xl border border-[#CBCAC8]/7 bg-[#161616] p-3"
                      >
                        <div className="flex gap-3">
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#CBCAC8]/7 bg-[#0C0C0C]">
                            {entry.image ? (
                              <Image
                                src={entry.image}
                                alt={entry.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[#333]">
                                <Icon name="shopping-bag" size={22} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#CBCAC8]">
                                  {entry.name}
                                </p>

                                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.18em] text-[#555]">
                                  Size / {entry.item.size}
                                </p>
                              </div>

                              <button
                                type="button"
                                aria-label={`Remove ${entry.name}`}
                                disabled={updatingKey === entry.cartKey}
                                onClick={() => void removeItem(entry)}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#CBCAC8]/7 text-[#555] transition-colors hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/8 hover:text-[#DA0D12] disabled:opacity-40"
                              >
                                <Icon name="trash" size={14} />
                              </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="flex items-center overflow-hidden rounded-full border border-[#CBCAC8]/8 bg-[#0F0F0F]">
                                <button
                                  type="button"
                                  disabled={
                                    updatingKey === entry.cartKey ||
                                    Number(entry.item.quantity) <= 1
                                  }
                                  onClick={() =>
                                    void updateQuantity(
                                      entry.cartKey,
                                      entry.item,
                                      Number(entry.item.quantity) - 1,
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-[#666362] transition hover:bg-white/5 hover:text-[#CBCAC8] disabled:opacity-30"
                                  aria-label="Decrease quantity"
                                >
                                  <Icon name="minus" size={13} />
                                </button>

                                <span className="flex h-8 min-w-8 items-center justify-center border-x border-[#CBCAC8]/8 font-mono text-[8px] text-[#CBCAC8]">
                                  {updatingKey === entry.cartKey ? (
                                    <span className="h-3 w-3 animate-spin rounded-full border border-[#CBCAC8]/20 border-t-[#DA0D12]" />
                                  ) : (
                                    entry.item.quantity
                                  )}
                                </span>

                                <button
                                  type="button"
                                  disabled={
                                    updatingKey === entry.cartKey ||
                                    (entry.stock > 0 &&
                                      Number(entry.item.quantity) >=
                                        entry.stock)
                                  }
                                  onClick={() =>
                                    void updateQuantity(
                                      entry.cartKey,
                                      entry.item,
                                      Number(entry.item.quantity) + 1,
                                    )
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-[#666362] transition hover:bg-white/5 hover:text-[#CBCAC8] disabled:opacity-30"
                                  aria-label="Increase quantity"
                                >
                                  <Icon name="plus" size={13} />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#CBCAC8]">
                                  {formatPrice(
                                    entry.price * Number(entry.item.quantity),
                                  )}
                                </p>

                                {entry.mrp > entry.price && (
                                  <p className="mt-0.5 font-mono text-[7px] text-[#555] line-through">
                                    {formatPrice(
                                      entry.mrp * Number(entry.item.quantity),
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUMMARY TOTALS */}
                <div className="border-t border-[#CBCAC8]/7 px-5 py-5 sm:px-6">
                  <div className="space-y-3">
                    <SummaryRow
                      label="Subtotal"
                      value={formatPrice(subtotal)}
                    />

                    <SummaryRow
                      label="Shipping"
                      value={
                        SHIPPING_FEE === 0 ? "FREE" : formatPrice(SHIPPING_FEE)
                      }
                      accent
                    />

                    {productSavings > 0 && (
                      <SummaryRow
                        label="You save"
                        value={`-${formatPrice(productSavings)}`}
                        accent
                      />
                    )}
                  </div>

                  <div className="mt-5 border-t border-[#CBCAC8]/7 pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#555]">
                          Total payable
                        </p>

                        <p className="mt-1 text-xs text-[#666362]">
                          Taxes included where applicable
                        </p>
                      </div>

                      <p className="text-3xl font-semibold tracking-tight text-[#CBCAC8]">
                        {formatPrice(grandTotal)}
                      </p>
                    </div>
                  </div>

                  {paymentError && <ErrorBox message={paymentError} />}

                  <button
                    type="button"
                    disabled={isPaymentLoading || !isCheckoutReady}
                    onClick={handlePayment}
                    className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#DA0D12] px-5 py-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white shadow-[0_14px_40px_rgba(218,13,18,0.16)] transition-all duration-300 hover:bg-[#b90b10] hover:shadow-[0_18px_45px_rgba(218,13,18,0.22)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    {isPaymentLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                        Processing
                      </>
                    ) : !isCheckoutReady ? (
                      <>
                        Complete details to pay
                        <Icon name="lock" size={15} />
                      </>
                    ) : (
                      <>
                        Pay {formatPrice(grandTotal)}
                        <Icon
                          name="arrow-right"
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-center font-mono text-[7px] uppercase tracking-[0.12em] text-[#444]">
                    <Icon name="lock" size={12} />
                    Secure encrypted payment
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ====================================================
            BOTTOM NOTE
        ==================================================== */}

        <section className="border-t border-[#CBCAC8]/7 bg-[#0C0C0C]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DA0D12]/8 text-[#DA0D12]">
                <Icon name="shopping-bag" size={16} />
              </div>

              <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#444]">
                The Backstore / Made in India / Wear it different.
              </p>
            </div>

            <Link
              href="/privacy-policy"
              className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#555] underline underline-offset-4 transition-colors hover:text-[#DA0D12]"
            >
              Privacy policy
            </Link>
          </div>
        </section>
      </main>

      {/* ======================================================
          SUCCESS
      ====================================================== */}

      {showSuccess && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[500px] overflow-hidden rounded-[30px] border border-[#CBCAC8]/10 bg-[#111111] p-7 text-center shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#DA0D12]/10 blur-[65px]" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DA0D12] text-white shadow-[0_15px_45px_rgba(218,13,18,0.25)]">
              <Icon name="check" size={29} />
            </div>

            <p className="relative mt-6 font-mono text-[8px] uppercase tracking-[0.3em] text-[#DA0D12]">
              Order confirmed
            </p>

            <h2
              className="relative mt-2 text-5xl uppercase leading-none text-[#CBCAC8]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              You&apos;re in.
            </h2>

            <p className="relative mx-auto mt-4 max-w-sm text-sm leading-6 text-[#666362]">
              Your Backstore order has been placed successfully. We&apos;ll use
              your contact details for the next updates.
            </p>

            {orderNumber && (
              <div className="relative mx-auto mt-6 w-fit rounded-2xl border border-[#DA0D12]/15 bg-[#DA0D12]/6 px-5 py-3">
                <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#555]">
                  Order number
                </p>
                <p className="mt-1 font-mono text-sm font-semibold tracking-[0.12em] text-[#DA0D12]">
                  {orderNumber}
                </p>
              </div>
            )}

            <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/orders")}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#CBCAC8]/10 bg-[#161616] font-mono text-[8px] uppercase tracking-[0.16em] text-[#CBCAC8] transition hover:border-[#CBCAC8]/20"
              >
                My orders
                <Icon name="arrow-right" size={14} />
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#DA0D12] font-mono text-[8px] uppercase tracking-[0.16em] text-white transition hover:bg-[#b90b10]"
              >
                Continue shopping
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   FIELD COMPONENTS
============================================================ */

function Field({
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]">
        {label}

        {required && <span className="ml-1 text-[#DA0D12]">*</span>}

        {optional && (
          <span className="ml-2 text-[7px] tracking-[0.12em] text-[#444]">
            Optional
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-[#CBCAC8]/10 bg-[#161616] px-4 py-3.5 text-sm text-[#CBCAC8] outline-none transition placeholder:text-[#444] focus:border-[#DA0D12]/45 focus:ring-4 focus:ring-[#DA0D12]/[0.06]"
      />
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]">
        {label}
        <span className="ml-1 text-[#DA0D12]">*</span>
      </label>

      <div className="flex items-center justify-between rounded-2xl border border-[#CBCAC8]/7 bg-[#141414] px-4 py-3.5">
        <span className="text-sm font-medium text-[#666362]">{value}</span>

        <Icon name="lock" size={14} className="text-[#444]" />
      </div>
    </div>
  );
}

function SelectField({
  label,
  required,
  value,
  disabled,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  disabled?: boolean;
  placeholder: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]">
        {label}
        {required && <span className="ml-1 text-[#DA0D12]">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-2xl border border-[#CBCAC8]/10 bg-[#161616] px-4 py-3.5 pr-11 text-sm text-[#CBCAC8] outline-none transition focus:border-[#DA0D12]/45 focus:ring-4 focus:ring-[#DA0D12]/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#161616] text-[#CBCAC8]"
            >
              {option.label}
            </option>
          ))}
        </select>

        <Icon
          name="chevron-down"
          size={15}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#555]"
        />
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#DA0D12]/20 bg-[#DA0D12]/[0.06] px-4 py-3">
      <p className="text-xs leading-5 text-[#DA0D12]">{message}</p>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: "lock" | "shield" | "truck";
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#CBCAC8]/7 bg-[#111111] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DA0D12]/8 text-[#DA0D12]">
          <Icon name={icon} size={15} />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-[#CBCAC8]">
            {title}
          </p>
          <p className="mt-1 truncate text-[9px] text-[#444]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#666362]">{label}</span>
      <span
        className={
          accent ? "font-semibold text-[#DA0D12]" : "font-medium text-[#CBCAC8]"
        }
      >
        {value}
      </span>
    </div>
  );
}
