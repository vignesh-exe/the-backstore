"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleX,
  Clipboard,
  Copy,
  CreditCard,
  Download,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "@/lib/supabase";

/* ============================================================
   TYPES
============================================================ */

type DeliveryAddress = {
  country?: string;
  landmark?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
};

type VariantDetails = Record<string, unknown>;

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_details: VariantDetails | null;
  product_image_url: string | null;
  sku: string | null;
  quantity: number;
  unit_price: number;
  mrp: number;
  total_price: number;
  created_at: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  delivery_address: DeliveryAddress;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

/* ============================================================
   ORDER STATUS
============================================================ */

const ORDER_STEPS = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

/* ============================================================
   HELPERS
============================================================ */

function formatPrice(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusIndex(status: string) {
  return ORDER_STEPS.indexOf(status);
}

function getStatusClass(status: string) {
  switch (status) {
    case "Placed":
      return "border-[#DA0D12]/30 bg-[#DA0D12]/10 text-[#FF3439]";

    case "Confirmed":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "Packed":
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";

    case "Shipped":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

    case "Out for Delivery":
      return "border-orange-500/20 bg-orange-500/10 text-orange-400";

    case "Delivered":
      return "border-green-500/20 bg-green-500/10 text-green-400";

    case "Cancelled":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-white/10 bg-white/[0.03] text-[#777]";
  }
}

function getAddressLines(address: DeliveryAddress | null | undefined) {
  if (!address) {
    return [];
  }

  return [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.district,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean);
}

function getVariantEntries(variantDetails: VariantDetails | null) {
  if (!variantDetails) {
    return [];
  }

  return Object.entries(variantDetails).filter(
    ([, value]) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );
}

function getVariantText(variantDetails: VariantDetails | null) {
  return getVariantEntries(variantDetails)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" • ");
}

/* ============================================================
   COMPACT STATUS TRACKER
============================================================ */

function OrderStatusTracker({ status }: { status: string }) {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === "Cancelled";

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[620px] items-start">
        {ORDER_STEPS.map((step, index) => {
          const completed = !isCancelled && currentIndex >= index;

          const active = !isCancelled && currentIndex === index;

          return (
            <div key={step} className="flex flex-1 items-start">
              <div className="flex min-w-[60px] flex-col items-center">
                <div
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full border text-[8px] font-bold",
                    completed
                      ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                      : "border-[#2A2A2A] bg-[#111] text-[#555]",
                    active ? "ring-2 ring-[#DA0D12]/15" : "",
                  ].join(" ")}
                >
                  {completed ? <Check size={12} /> : index + 1}
                </div>

                <span
                  className={[
                    "mt-2 whitespace-nowrap text-center font-mono text-[6px] uppercase tracking-[0.06em]",
                    completed ? "text-[#AAA]" : "text-[#4D4D4D]",
                  ].join(" ")}
                >
                  {step}
                </span>
              </div>

              {index < ORDER_STEPS.length - 1 && (
                <div
                  className={[
                    "mt-3.5 h-px flex-1",
                    !isCancelled && currentIndex > index
                      ? "bg-[#DA0D12]"
                      : "bg-[#242424]",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SMALL SECTION HEADER
============================================================ */

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-[#E7E7E5]">{title}</h3>

        {subtitle && (
          <p className="mt-0.5 text-[9px] text-[#555]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function MyOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedOrder, setCopiedOrder] = useState<string | null>(null);

  /* ==========================================================
     LOAD ORDERS
  ========================================================== */

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          sessionError.message || "Unable to verify your session.",
        );
      }

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      const email = session.user.email?.trim();

      if (!email) {
        throw new Error("Your account does not have an email address.");
      }

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            customer_name,
            customer_email,
            customer_phone,
            status,
            payment_method,
            payment_status,
            subtotal,
            shipping_amount,
            discount_amount,
            total_amount,
            delivery_address,
            notes,
            created_at,
            updated_at,
            order_items (
              id,
              order_id,
              product_id,
              variant_id,
              product_name,
              variant_details,
              product_image_url,
              sku,
              quantity,
              unit_price,
              mrp,
              total_price,
              created_at
            )
          `,
        )
        .eq("customer_email", email)
        .order("created_at", {
          ascending: false,
        });

      if (ordersError) {
        console.error("Fetch orders error:", ordersError);

        throw new Error(ordersError.message || "Unable to load your orders.");
      }

      setOrders((data ?? []) as Order[]);
    } catch (err) {
      console.error("My Orders error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /* ==========================================================
     COPY ORDER NUMBER
  ========================================================== */

  async function copyOrderNumber(orderNumber: string) {
    try {
      await navigator.clipboard.writeText(orderNumber);

      setCopiedOrder(orderNumber);

      toast.success("Order number copied!");

      window.setTimeout(() => {
        setCopiedOrder(null);
      }, 2000);
    } catch {
      toast.error("Unable to copy order number.");
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 pb-12 pt-28 sm:px-6">
        <div className="mx-auto max-w-[1000px] animate-pulse">
          <div className="h-2.5 w-32 rounded bg-[#191919]" />

          <div className="mt-4 h-14 w-64 max-w-full rounded bg-[#151515]" />

          <div className="mt-3 h-3 w-full max-w-lg rounded bg-[#121212]" />

          <div className="mt-8 h-[260px] rounded-2xl border border-white/5 bg-[#101010]" />
        </div>
      </main>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 pb-12 pt-28 sm:px-6">
        <div className="mx-auto max-w-[800px]">
          <div className="rounded-2xl border border-red-500/10 bg-[#101010] px-5 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/10">
              <Package size={19} className="text-[#DA0D12]" />
            </div>

            <p className="mt-4 font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
              Orders / Error
            </p>

            <h1 className="mt-2 font-[var(--font-bebas-neue)] text-4xl uppercase text-[#F2F2F0]">
              Unable To Load Orders
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-xs leading-5 text-[#666]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadOrders(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DA0D12] px-5 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white transition hover:bg-[#B90B10]"
            >
              <RefreshCw size={12} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     EMPTY
  ========================================================== */

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 pb-12 pt-28 sm:px-6">
        <div className="mx-auto max-w-[1000px]">
          <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#DA0D12]">
            The Backstore / Account
          </p>

          <h1 className="mt-3 font-[var(--font-bebas-neue)] text-5xl uppercase leading-none tracking-tight text-[#F2F2F0] sm:text-6xl">
            My Orders
          </h1>

          <p className="mt-3 text-xs text-[#666]">
            Track your Backstore orders, view order details and manage your
            purchases.
          </p>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#101010] px-5 py-16 text-center">
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#DA0D12]/[0.05]" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/10">
                <ShoppingBag size={19} className="text-[#DA0D12]" />
              </div>

              <p className="mt-4 font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
                Orders / 00
              </p>

              <h2 className="mt-2 font-[var(--font-bebas-neue)] text-4xl uppercase text-[#F2F2F0]">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-xs leading-5 text-[#555]">
                Your completed orders will appear here once you make your first
                purchase from The Backstore.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DA0D12] px-6 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white transition hover:bg-[#B90B10]"
              >
                Start Shopping
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ==========================================================
     MAIN PAGE
  ========================================================== */

  return (
    <main className="min-h-screen bg-[#080808] px-4 pb-12 pt-28 sm:px-6">
      <div className="mx-auto max-w-[1000px]">
        {/* ==================================================
            HEADER
        ================================================== */}

        <section>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#DA0D12]">
                The Backstore / Account
              </p>

              <h1 className="mt-3 font-[var(--font-bebas-neue)] text-5xl uppercase leading-[0.85] tracking-tight text-[#F2F2F0] sm:text-6xl">
                My Orders
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-5 text-[#666]">
                Track your Backstore orders, view order details and manage your
                purchases.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadOrders(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111] px-3.5 py-2.5 font-mono text-[7px] uppercase tracking-[0.16em] text-[#777] transition hover:border-[#DA0D12]/30 hover:text-[#CBCAC8] disabled:opacity-50"
              >
                <RefreshCw
                  size={11}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#DA0D12] px-3.5 py-2.5 font-mono text-[7px] uppercase tracking-[0.16em] text-white transition hover:bg-[#B90B10]"
              >
                <ShoppingBag size={11} />
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101010] px-3 py-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DA0D12] font-mono text-[8px] font-bold text-white">
              {orders.length}
            </span>

            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#777]">
              {orders.length === 1 ? "Order placed" : "Orders placed"}
            </span>
          </div>
        </section>

        {/* ==================================================
            ORDERS
        ================================================== */}

        <section className="mt-6 space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;

            const items = order.order_items ?? [];

            const itemCount = items.reduce(
              (total, item) => total + Number(item.quantity ?? 0),
              0,
            );

            const firstItem = items[0];

            const currentIndex = getStatusIndex(order.status);

            const addressLines = getAddressLines(order.delivery_address);

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101010] shadow-[0_15px_45px_rgba(0,0,0,0.22)]"
              >
                {/* ==================================================
                    ORDER HEADER
                ================================================== */}

                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    {/* META */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/10 px-2 py-1 font-mono text-[6px] font-bold uppercase tracking-[0.15em] text-[#DA0D12]">
                            Order
                          </span>

                          <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-[#666]">
                            {formatDate(order.created_at)}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <h2 className="break-all font-mono text-sm font-bold tracking-[0.03em] text-[#F2F2F0] sm:text-base">
                            {order.order_number}
                          </h2>

                          <button
                            type="button"
                            onClick={() => copyOrderNumber(order.order_number)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#151515] text-[#666] transition hover:border-[#DA0D12]/30 hover:text-[#DA0D12]"
                            aria-label="Copy order number"
                          >
                            {copiedOrder === order.order_number ? (
                              <Check size={11} className="text-green-500" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>

                        <p className="mt-1.5 text-[9px] text-[#555]">
                          Order placed on{" "}
                          <span className="text-[#777]">
                            {formatDateTime(order.created_at)}
                          </span>
                        </p>
                      </div>

                      {/* STATUS */}

                      <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                        <span
                          className={`rounded-full border px-2.5 py-1.5 font-mono text-[6px] font-bold uppercase tracking-[0.1em] ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          <span className="mr-1 inline-block h-1 w-1 rounded-full bg-current" />
                          {order.status}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1.5 font-mono text-[6px] font-bold uppercase tracking-[0.1em] ${
                            order.payment_status === "Paid"
                              ? "border-green-500/20 bg-green-500/10 text-green-500"
                              : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          <CreditCard size={9} className="mr-1 inline" />
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    {/* STATUS TRACKER */}

                    <OrderStatusTracker status={order.status} />

                    {/* CANCELLED */}

                    {order.status === "Cancelled" && (
                      <div className="rounded-xl border border-red-500/15 bg-red-500/[0.04] p-3">
                        <div className="flex gap-2.5">
                          <CircleX
                            size={15}
                            className="mt-0.5 shrink-0 text-[#DA0D12]"
                          />

                          <div>
                            <p className="text-[10px] font-semibold text-[#F2F2F0]">
                              Order Cancelled
                            </p>

                            <p className="mt-0.5 text-[9px] leading-4 text-[#666]">
                              This order has been cancelled.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TRACKING */}

                    <div className="flex items-center gap-3 rounded-xl border border-[#DA0D12]/10 bg-[#DA0D12]/[0.035] px-3 py-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DA0D12]">
                        <Truck size={14} className="text-white" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-[#DA0D12]">
                          Tracking ID
                        </p>

                        <p className="mt-0.5 text-[9px] leading-4 text-[#666]">
                          Tracking ID will be available after your order reaches{" "}
                          <span className="font-semibold text-[#AAA]">
                            Shipped
                          </span>{" "}
                          status.
                        </p>
                      </div>
                    </div>

                    {/* SUMMARY */}

                    <div className="grid grid-cols-3 gap-2">
                      {/* ITEMS */}

                      <div className="rounded-xl border border-white/[0.05] bg-[#141414] p-3">
                        <div className="flex items-center gap-2">
                          <Package size={13} className="text-[#DA0D12]" />

                          <div>
                            <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#555]">
                              Items
                            </p>

                            <p className="mt-0.5 text-xs font-semibold text-[#E5E5E3]">
                              {itemCount}
                            </p>
                          </div>
                        </div>

                        {firstItem && (
                          <p className="mt-2 truncate text-[8px] text-[#555]">
                            {firstItem.product_name}
                            {items.length > 1 && ` + ${items.length - 1} more`}
                          </p>
                        )}
                      </div>

                      {/* PAYMENT */}

                      <div className="rounded-xl border border-white/[0.05] bg-[#141414] p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard size={13} className="text-[#DA0D12]" />

                          <div className="min-w-0">
                            <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#555]">
                              Payment
                            </p>

                            <p className="mt-0.5 truncate text-[10px] font-semibold text-[#E5E5E3]">
                              {order.payment_method}
                            </p>
                          </div>
                        </div>

                        <p className="mt-2 text-[8px] text-[#555]">
                          Status:{" "}
                          <span className="text-green-500">
                            {order.payment_status}
                          </span>
                        </p>
                      </div>

                      {/* TOTAL */}

                      <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12] p-3">
                        <div className="flex items-center gap-2">
                          <ShoppingBag size={13} className="text-white" />

                          <div>
                            <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-white/60">
                              Total
                            </p>

                            <p className="mt-0.5 text-sm font-bold text-white">
                              {formatPrice(order.total_amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#151515] px-3 py-2.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#AAA] transition hover:border-[#DA0D12]/30 hover:text-white"
                      >
                        {isExpanded ? (
                          <ChevronUp size={11} />
                        ) : (
                          <ChevronDown size={11} />
                        )}

                        {isExpanded ? "Hide Details" : "View Details"}
                      </button>

                      <button
                        type="button"
                        disabled={order.status === "Cancelled"}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/[0.03] px-3 py-2.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#DA0D12] transition hover:bg-red-500/[0.07] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <CircleX size={11} />
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={currentIndex < 3}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#151515] px-3 py-2.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#666] transition hover:text-[#AAA] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Download size={11} />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    EXPANDED DETAILS
                ================================================== */}

                {isExpanded && (
                  <div className="border-t border-white/[0.06] bg-[#0D0D0D] p-4 sm:p-5">
                    <div className="grid gap-4 xl:grid-cols-[1.65fr_0.85fr]">
                      {/* ==================================================
                          LEFT
                      ================================================== */}

                      <div className="space-y-4">
                        {/* ORDER ITEMS */}

                        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
                          <SectionHeader
                            icon={
                              <Package size={14} className="text-[#DA0D12]" />
                            }
                            title="Order Items"
                            subtitle={`${items.length} ${
                              items.length === 1 ? "product" : "products"
                            }`}
                          />

                          <div className="space-y-2">
                            {items.map((item) => {
                              const variants = getVariantEntries(
                                item.variant_details,
                              );

                              return (
                                <div
                                  key={item.id}
                                  className="rounded-xl border border-white/[0.05] bg-[#151515] p-3"
                                >
                                  <div className="flex gap-3">
                                    {/* IMAGE */}

                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.05] bg-[#1B1B1B]">
                                      {item.product_image_url ? (
                                        <img
                                          src={item.product_image_url}
                                          alt={item.product_name}
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                          <Package
                                            size={17}
                                            className="text-[#444]"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* INFO */}

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                          <h4 className="truncate text-xs font-semibold text-[#E5E5E3]">
                                            {item.product_name}
                                          </h4>

                                          {item.sku && (
                                            <p className="mt-0.5 font-mono text-[6px] uppercase tracking-[0.12em] text-[#555]">
                                              SKU: {item.sku}
                                            </p>
                                          )}
                                        </div>

                                        <p className="shrink-0 text-xs font-bold text-[#F2F2F0]">
                                          {formatPrice(item.total_price)}
                                        </p>
                                      </div>

                                      {/* VARIANTS */}

                                      {variants.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {variants.map(([key, value]) => (
                                            <span
                                              key={`${item.id}-${key}`}
                                              className="rounded-full border border-white/10 bg-[#1A1A1A] px-2 py-1 text-[7px] text-[#777]"
                                            >
                                              <span className="text-[#555]">
                                                {key}:
                                              </span>{" "}
                                              {String(value)}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* PRICE META */}

                                      <div className="mt-2 flex flex-wrap gap-1">
                                        <span className="rounded-full bg-[#1A1A1A] px-2 py-1 text-[7px] text-[#777]">
                                          Qty:{" "}
                                          <span className="text-[#AAA]">
                                            {item.quantity}
                                          </span>
                                        </span>

                                        <span className="rounded-full bg-[#1A1A1A] px-2 py-1 text-[7px] text-[#777]">
                                          Unit:{" "}
                                          <span className="text-[#AAA]">
                                            {formatPrice(item.unit_price)}
                                          </span>
                                        </span>

                                        {Number(item.mrp) >
                                          Number(item.unit_price) && (
                                          <span className="rounded-full bg-[#1A1A1A] px-2 py-1 text-[7px] text-[#555]">
                                            MRP:{" "}
                                            <span className="line-through">
                                              {formatPrice(item.mrp)}
                                            </span>
                                          </span>
                                        )}
                                      </div>

                                      {/* PRODUCT DETAILS */}

                                      {variants.length > 0 && (
                                        <div className="mt-2 rounded-lg border border-white/[0.05] bg-[#111] px-2.5 py-2">
                                          <p className="font-mono text-[6px] uppercase tracking-[0.15em] text-[#555]">
                                            Product Details
                                          </p>

                                          <p className="mt-1 text-[8px] text-[#777]">
                                            {getVariantText(
                                              item.variant_details,
                                            )}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* DELIVERY ADDRESS */}

                        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
                          <SectionHeader
                            icon={
                              <MapPin size={14} className="text-blue-400" />
                            }
                            title="Delivery Address"
                            subtitle="Address used for this order"
                          />

                          <div className="rounded-lg bg-[#151515] p-3">
                            <p className="text-[10px] font-semibold text-[#CBCAC8]">
                              {order.customer_name}
                            </p>

                            {addressLines.length > 0 ? (
                              <div className="mt-2 space-y-0.5">
                                {addressLines.map((line, index) => (
                                  <p
                                    key={`${line}-${index}`}
                                    className="text-[9px] leading-4 text-[#777]"
                                  >
                                    {line}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-2 text-[9px] text-[#555]">
                                Delivery address unavailable.
                              </p>
                            )}

                            {order.customer_phone && (
                              <div className="mt-3 border-t border-white/[0.05] pt-2.5">
                                <p className="font-mono text-[6px] uppercase tracking-[0.15em] text-[#555]">
                                  Phone
                                </p>

                                <p className="mt-0.5 text-[9px] text-[#888]">
                                  {order.customer_phone}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CUSTOMER DETAILS */}

                        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
                          <SectionHeader
                            icon={
                              <Check size={14} className="text-green-500" />
                            }
                            title="Customer Details"
                            subtitle="Order contact information"
                          />

                          <div className="grid gap-2 md:grid-cols-3">
                            <div className="rounded-lg bg-[#151515] p-3">
                              <p className="font-mono text-[6px] uppercase tracking-[0.14em] text-[#555]">
                                Name
                              </p>

                              <p className="mt-1 text-[9px] font-semibold text-[#CBCAC8]">
                                {order.customer_name}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[#151515] p-3">
                              <p className="font-mono text-[6px] uppercase tracking-[0.14em] text-[#555]">
                                Email
                              </p>

                              <p className="mt-1 break-all text-[9px] font-semibold text-[#CBCAC8]">
                                {order.customer_email}
                              </p>
                            </div>

                            <div className="rounded-lg bg-[#151515] p-3">
                              <p className="font-mono text-[6px] uppercase tracking-[0.14em] text-[#555]">
                                Phone
                              </p>

                              <p className="mt-1 text-[9px] font-semibold text-[#CBCAC8]">
                                {order.customer_phone ?? "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ==================================================
                          RIGHT
                      ================================================== */}

                      <div className="space-y-4">
                        {/* PAYMENT */}

                        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
                          <SectionHeader
                            icon={
                              <CreditCard
                                size={14}
                                className="text-purple-400"
                              />
                            }
                            title="Payment"
                            subtitle="Payment information"
                          />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg bg-[#151515] p-3">
                              <span className="text-[9px] text-[#666]">
                                Method
                              </span>

                              <span className="text-[9px] font-semibold text-[#CBCAC8]">
                                {order.payment_method}
                              </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-[#151515] p-3">
                              <span className="text-[9px] text-[#666]">
                                Status
                              </span>

                              <span className="rounded-full bg-green-500/10 px-2 py-1 text-[8px] font-semibold text-green-500">
                                {order.payment_status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ORDER SUMMARY */}

                        <div className="rounded-xl border border-white/[0.06] bg-[#111] p-4">
                          <SectionHeader
                            icon={
                              <Clipboard size={14} className="text-[#DA0D12]" />
                            }
                            title="Order Summary"
                            subtitle="Payment breakdown"
                          />

                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-[#666]">
                                Subtotal
                              </span>

                              <span className="text-[9px] font-semibold text-[#CBCAC8]">
                                {formatPrice(order.subtotal)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-[#666]">
                                Delivery
                              </span>

                              <span className="text-[9px] font-semibold text-[#CBCAC8]">
                                {formatPrice(order.shipping_amount)}
                              </span>
                            </div>

                            {Number(order.discount_amount ?? 0) > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-[#666]">
                                  Discount
                                </span>

                                <span className="text-[9px] font-semibold text-green-500">
                                  -{formatPrice(order.discount_amount)}
                                </span>
                              </div>
                            )}

                            <div className="border-t border-white/[0.06] pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-[#CBCAC8]">
                                  Total Paid
                                </span>

                                <span className="text-base font-bold text-[#DA0D12]">
                                  {formatPrice(order.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CURRENT STATUS */}

                        <div className="rounded-xl bg-[#DA0D12] p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                              <Truck size={14} className="text-white" />
                            </div>

                            <div>
                              <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-white/60">
                                Current Status
                              </p>

                              <p className="mt-0.5 text-sm font-bold text-white">
                                {order.status}
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 text-[9px] leading-4 text-white/70">
                            We'll keep your order updated as it moves through
                            the delivery process.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="mt-8 flex items-center justify-between border-t border-white/[0.05] pt-4">
          <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#3F3F3F]">
            The Backstore / Made in India / Wear it different.
          </p>

          <Link
            href="/privacy-policy"
            className="font-mono text-[6px] uppercase tracking-[0.16em] text-[#444] transition hover:text-[#DA0D12]"
          >
            Privacy
          </Link>
        </div>
      </div>
    </main>
  );
}
