"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import OrderActionDrawer, {
  Order,
  OrderStatus,
} from "@/components/admin/OrderActionDrawer";

type OrderType = "Normal" | "Custom" | "Mixed";

type AdminOrder = Order & {
  orderType: OrderType;
};

type DatabaseOrder = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  delivery_address: unknown;
  subtotal: number | string | null;
  shipping_amount: number | string | null;
  total_amount: number | string | null;
  payment_method: string | null;
  payment_status: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  tracking_id: string | null;
};

type DatabaseOrderItem = {
  id: string;
  product_name: string | null;
  product_image_url: string | null;
  sku: string | null;
  quantity: number | null;
  unit_price: number | string | null;
  mrp: number | string | null;
  variant_details?: unknown | null;
};

function getCustomization(details: unknown) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }

  const value = details as Record<string, unknown>;
  const customization = value.customization;

  if (
    !customization ||
    typeof customization !== "object" ||
    Array.isArray(customization)
  ) {
    return null;
  }

  return customization as import("@/components/admin/OrderActionDrawer").CustomizationData;
}

function getItemDetails(details: unknown) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return "";
  }

  const value = details as Record<string, unknown>;
  const parts: string[] = [];

  if (typeof value.size === "string") parts.push(`Size: ${value.size}`);
  if (typeof value.color === "string") parts.push(`Color: ${value.color}`);

  return parts.join(" • ");
}

function isCustomOrderItem(item: DatabaseOrderItem) {
  const details = item.variant_details;

  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return false;
  }

  const value = details as Record<string, unknown>;

  return (
    value.is_custom === true ||
    value.isCustom === true ||
    Boolean(value.custom_product_id)
  );
}

function getOrderType(
  items: DatabaseOrderItem[] | null | undefined,
): OrderType {
  const hasCustom = (items ?? []).some(isCustomOrderItem);
  const hasNormal = (items ?? []).some((item) => !isCustomOrderItem(item));

  if (hasCustom && hasNormal) return "Mixed";
  if (hasCustom) return "Custom";
  return "Normal";
}

function getOrderTypeClass(orderType: OrderType) {
  switch (orderType) {
    case "Custom":
      return "bg-[#fff0f0] text-[#d81920] border-[#ffd2d4]";
    case "Mixed":
      return "bg-[#fff7e6] text-[#b56b00] border-[#ffe2ad]";
    default:
      return "bg-[#eef6f1] text-[#23643f] border-[#cce5d6]";
  }
}

function formatDeliveryAddress(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  const address = value as Record<string, unknown>;

  const orderedKeys = [
    "name",
    "full_name",
    "address",
    "address_line_1",
    "addressLine1",
    "address_line_2",
    "addressLine2",
    "street",
    "area",
    "landmark",
    "city",
    "district",
    "state",
    "pincode",
    "postal_code",
    "postalCode",
    "zip",
    "country",
  ];

  const parts: string[] = [];

  for (const key of orderedKeys) {
    const current = address[key];

    if (
      typeof current === "string" &&
      current.trim() &&
      !parts.includes(current.trim())
    ) {
      parts.push(current.trim());
    }
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return Object.entries(address)
    .filter(([, current]) => typeof current === "string" && current.trim())
    .map(([, current]) => String(current).trim())
    .filter(Boolean)
    .join(", ");
}

function mapDatabaseOrder(
  row: DatabaseOrder & {
    order_items?: DatabaseOrderItem[];
  },
): AdminOrder {
  return {
    id: row.order_number || row.id,
    customer: row.customer_name || "Unknown Customer",
    email: row.customer_email || "—",
    phone: row.customer_phone || "",
    date: new Date(row.created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    items: row.order_items?.length ?? 0,
    amount: Number(row.total_amount ?? 0),
    payment: row.payment_method === "COD" ? "COD" : "Online Payment",
    status: row.status,
    address: formatDeliveryAddress(row.delivery_address),
    paymentDetails: row.payment_method || "",
    trackingId: row.tracking_id,
    databaseId: row.id,
    orderItems: (row.order_items ?? []).map((item) => {
      const custom = isCustomOrderItem(item);
      const customization = getCustomization(item.variant_details);

      return {
        name: item.product_name || (custom ? "Custom T-Shirt" : "Product"),
        code: item.sku || "—",
        image: item.product_image_url || "",
        weight: "",
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unit_price ?? 0),
        mrp: Number(item.mrp ?? item.unit_price ?? 0),
        details: getItemDetails(item.variant_details),
        orderItemId: item.id,
        isCustom: custom,
        customization,
      };
    }),
    orderType: getOrderType(row.order_items),
  };
}

const statusTabs: Array<"All" | OrderStatus> = [
  "All",
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v4H6z" />
      <path d="M5 7h14l1 14H4L5 7Z" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: OrderStatus) {
  switch (status) {
    case "Placed":
      return "bg-[#fff4cf] text-[#a66b00]";

    case "Confirmed":
      return "bg-[#e5efff] text-[#2563eb]";

    case "Packed":
      return "bg-[#f0e7ff] text-[#7c3aed]";

    case "Shipped":
      return "bg-[#e4f5ff] text-[#0284c7]";

    case "Out for Delivery":
      return "bg-[#fff0df] text-[#c2410c]";

    case "Delivered":
      return "bg-[#dcfce7] text-[#15803d]";

    case "Cancelled":
      return "bg-[#fee2e2] text-[#dc2626]";

    default:
      return "bg-[#f1f5f9] text-[#64748b]";
  }
}

function getStatusCount(orders: AdminOrder[], status: "All" | OrderStatus) {
  if (status === "All") {
    return orders.length;
  }

  return orders.filter((order) => order.status === status).length;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [databaseOrders, setDatabaseOrders] = useState<DatabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");

  const [paymentFilter, setPaymentFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError("");

      const { data, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          customer_name,
          customer_email,
          customer_phone,
          delivery_address,
          subtotal,
          shipping_amount,
          total_amount,
          payment_method,
          payment_status,
          status,
          created_at,
          updated_at,
          tracking_id,
          order_items(
            id,
            product_name,
            product_image_url,
            sku,
            quantity,
            unit_price,
            mrp,
            variant_details
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (ordersError) {
        console.error("Load orders error:", ordersError);
        setError(ordersError.message || "Unable to load orders.");
        setOrders([]);
        setDatabaseOrders([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as Array<
        DatabaseOrder & {
          order_items?: DatabaseOrderItem[];
        }
      >;

      setDatabaseOrders(rows);
      setOrders(rows.map(mapDatabaseOrder));
      setLoading(false);
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchValue ||
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.email.toLowerCase().includes(searchValue);

      const matchesStatus = activeTab === "All" || order.status === activeTab;

      const matchesPayment =
        paymentFilter === "All" || order.payment === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, activeTab, paymentFilter]);

  const totalOrders = orders.length;

  const placedOrders = orders.filter(
    (order) => order.status === "Placed",
  ).length;

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderDrawer = () => {
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: OrderStatus,
    trackingId?: string,
  ) => {
    const databaseOrder = databaseOrders.find(
      (item) => (item.order_number || item.id) === orderId,
    );

    if (!databaseOrder) {
      throw new Error(`Unable to find database order for ${orderId}.`);
    }

    const trackingStatuses: OrderStatus[] = [
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    const shouldSaveTrackingId = trackingStatuses.includes(status);
    const trimmedTrackingId = trackingId?.trim() || "";

    if (shouldSaveTrackingId && !trimmedTrackingId) {
      throw new Error(
        "Tracking ID is mandatory for Shipped, Out for Delivery and Delivered.",
      );
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Your admin login session has expired. Please log in again.",
        );
      }

      const response = await fetch("/api/admin/orders/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          order_id: databaseOrder.id,
          status,
          tracking_id: shouldSaveTrackingId
            ? trimmedTrackingId
            : (databaseOrder.tracking_id ?? null),
        }),
      });

      const responseText = await response.text();

      let result: {
        success?: boolean;
        error?: string;
        data?: DatabaseOrder;
      } = {};

      try {
        result = responseText
          ? (JSON.parse(responseText) as typeof result)
          : {};
      } catch {
        result = {};
      }

      if (!response.ok || result?.success === false) {
        console.error("Update order status error:", {
          status: response.status,
          statusText: response.statusText,
          result,
          responseText: responseText.slice(0, 500),
        });

        throw new Error(
          result?.error ||
            `Unable to update order status (${response.status}).`,
        );
      }

      const updatedRow: Partial<DatabaseOrder> = result?.data ?? {};

      const updatedDatabaseOrder: DatabaseOrder = {
        ...databaseOrder,
        ...updatedRow,
        status,
        tracking_id:
          updatedRow?.tracking_id ??
          (shouldSaveTrackingId
            ? trimmedTrackingId
            : (databaseOrder.tracking_id ?? null)),
      };

      setDatabaseOrders((current) =>
        current.map((item) =>
          item.id === databaseOrder.id ? updatedDatabaseOrder : item,
        ),
      );

      setOrders((current) =>
        current.map((item) =>
          item.id === orderId
            ? {
                ...item,
                status,
                trackingId: updatedDatabaseOrder.tracking_id ?? null,
              }
            : item,
        ),
      );

      setSelectedOrder((current) =>
        current && current.id === orderId
          ? {
              ...current,
              status,
              trackingId: updatedDatabaseOrder.tracking_id ?? null,
            }
          : current,
      );

      setError("");
    } catch (error) {
      console.error("Update order status API error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to update order status.";

      setError(message);
      throw new Error(message);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#f7f9fb] text-[#17233b]">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-9">
          {/* PAGE HEADER */}
          <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-[3px] w-8 bg-[#ff2d32]" />

                <span className="font-bebas-neue text-[12px] tracking-[0.18em] text-[#8a96aa]">
                  THE BACKSTORE
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce9ea] text-[#ff2d32]">
                  <OrderIcon />
                </div>

                <h1 className="font-bebas-neue text-[42px] leading-none tracking-[0.02em] text-[#17233b] sm:text-[48px]">
                  ORDERS
                </h1>
              </div>

              <p className="mt-2 text-[14px] text-[#71809a]">
                Manage and track customer orders.
              </p>
            </div>

            {/* SUMMARY */}
            <div className="flex gap-3">
              <div className="min-w-[92px] rounded-[13px] border border-[#e1e6ed] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                <p className="text-[10px] text-[#71809a]">Total Orders</p>

                <p className="mt-1 text-[20px] font-bold leading-none text-[#17233b]">
                  {totalOrders}
                </p>
              </div>

              <div className="min-w-[76px] rounded-[13px] border border-[#e1e6ed] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                <p className="text-[10px] text-[#71809a]">Placed</p>

                <p className="mt-1 text-[20px] font-bold leading-none text-[#d99700]">
                  {placedOrders}
                </p>
              </div>

              <div className="hidden min-w-[76px] rounded-[13px] border border-[#e1e6ed] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)] sm:block">
                <p className="text-[10px] text-[#71809a]">Custom</p>

                <p className="mt-1 text-[20px] font-bold leading-none text-[#d81920]">
                  {
                    orders.filter((order) => order.orderType === "Custom")
                      .length
                  }
                </p>
              </div>
            </div>
          </section>

          {/* FILTER */}
          <section className="mb-5 overflow-hidden rounded-[14px] border border-[#e1e6ed] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
              <div className="relative flex-1 lg:max-w-[430px]">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#91a0b5]">
                  <SearchIcon />
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search order or customer..."
                  className="h-[44px] w-full rounded-[9px] border border-[#dce3eb] bg-white pl-10 pr-4 text-[13px] text-[#17233b] outline-none transition-colors placeholder:text-[#9aa8ba] focus:border-[#17233b]"
                />
              </div>

              <div className="flex items-center gap-3 lg:ml-auto">
                <div className="hidden text-[#7d8da3] sm:block">
                  <FilterIcon />
                </div>

                <select
                  value={paymentFilter}
                  onChange={(event) => setPaymentFilter(event.target.value)}
                  className="h-[44px] min-w-[150px] rounded-[9px] border border-[#dce3eb] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
                >
                  <option value="All">All Payments</option>

                  <option value="Online Payment">Online Payment</option>

                  <option value="COD">COD</option>
                </select>
              </div>
            </div>

            {/* STATUS TABS */}
            <div className="overflow-x-auto border-t border-[#edf0f3]">
              <div className="flex min-w-max items-center gap-1 px-4 py-3">
                {statusTabs.map((tab) => {
                  const count = getStatusCount(orders, tab);

                  const active = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={[
                        "inline-flex h-[34px] items-center gap-1.5 rounded-[8px] px-3",
                        "whitespace-nowrap text-[11px] font-semibold transition-all duration-200",
                        active
                          ? "bg-[#23643f] text-white shadow-sm"
                          : "text-[#64748b] hover:bg-[#f4f6f8] hover:text-[#17233b]",
                      ].join(" ")}
                    >
                      <span>{tab}</span>

                      <span
                        className={active ? "text-white/80" : "text-[#98a4b4]"}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* TABLE */}
          <section className="overflow-hidden rounded-[14px] border border-[#e1e6ed] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            {error && (
              <div className="border-b border-[#ffd5d7] bg-[#fff5f5] px-5 py-3 text-[12px] text-[#c62828]">
                {error}
              </div>
            )}

            {loading && (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dce3eb] border-t-[#23643f]" />
                <p className="mt-4 text-[12px] text-[#7b8799]">
                  Loading orders from database...
                </p>
              </div>
            )}

            {!loading && (
              <>
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full min-w-[1160px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#dfe5ec] bg-[#f3f6f9]">
                        <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Order
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Customer
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Order Type
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Date
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Items
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Amount
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Payment
                        </th>

                        <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Status
                        </th>

                        <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-[#e7ebf0] last:border-b-0 hover:bg-[#fafbfc]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-[12px] font-bold text-[#23643f]">
                              ##{order.id}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <p className="text-[12px] font-semibold text-[#17233b]">
                              {order.customer}
                            </p>

                            <p className="mt-1 text-[10px] text-[#8795a9]">
                              {order.email}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={[
                                "inline-flex items-center rounded-full border px-2.5 py-1",
                                "text-[9px] font-bold uppercase tracking-[0.06em]",
                                getOrderTypeClass(order.orderType),
                              ].join(" ")}
                            >
                              {order.orderType === "Custom"
                                ? "Custom Product"
                                : order.orderType === "Normal"
                                  ? "Normal Product"
                                  : "Mixed Order"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-[11px] text-[#52627a]">
                            {order.date}
                          </td>

                          <td className="px-4 py-4 text-[11px] text-[#52627a]">
                            {order.items} {order.items === 1 ? "Item" : "Items"}
                          </td>

                          <td className="px-4 py-4 text-[12px] font-bold text-[#17233b]">
                            {formatCurrency(order.amount)}
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-[#f1eaff] px-2.5 py-1 text-[9px] font-semibold text-[#7c3aed]">
                              {order.payment === "Online Payment"
                                ? "Online"
                                : "COD"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={[
                                "inline-flex rounded-full px-2.5 py-1",
                                "text-[9px] font-semibold",
                                getStatusClass(order.status),
                              ].join(" ")}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openOrderDrawer(order)}
                              className="inline-flex h-[34px] items-center gap-1.5 rounded-[9px] border border-[#dce3eb] bg-white px-3 text-[11px] font-semibold text-[#52627a] transition-all duration-200 hover:border-[#23643f] hover:text-[#23643f]"
                            >
                              View
                              <ArrowRightIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE */}
                <div className="divide-y divide-[#e7ebf0] lg:hidden">
                  {filteredOrders.map((order) => (
                    <article key={order.id} className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[12px] font-bold text-[#23643f]">
                            ##{order.id}
                          </p>

                          <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                            {order.customer}
                          </p>

                          <p className="mt-1 text-[10px] text-[#8795a9]">
                            {order.email}
                          </p>
                        </div>

                        <span
                          className={[
                            "shrink-0 rounded-full px-2.5 py-1",
                            "text-[9px] font-semibold",
                            getStatusClass(order.status),
                          ].join(" ")}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#edf0f3] pt-4 sm:grid-cols-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-[#8b98ab]">
                            Date
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-[#52627a]">
                            {order.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-[#8b98ab]">
                            Items
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-[#52627a]">
                            {order.items}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-[#8b98ab]">
                            Type
                          </p>

                          <span
                            className={[
                              "mt-1 inline-flex rounded-full border px-2 py-1",
                              "text-[8px] font-bold uppercase tracking-[0.05em]",
                              getOrderTypeClass(order.orderType),
                            ].join(" ")}
                          >
                            {order.orderType === "Custom"
                              ? "Custom Product"
                              : order.orderType === "Normal"
                                ? "Normal Product"
                                : "Mixed Order"}
                          </span>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-[#8b98ab]">
                            Amount
                          </p>

                          <p className="mt-1 text-[11px] font-bold text-[#17233b]">
                            {formatCurrency(order.amount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wide text-[#8b98ab]">
                            Payment
                          </p>

                          <p className="mt-1 text-[11px] font-medium text-[#52627a]">
                            {order.payment === "Online Payment"
                              ? "Online"
                              : "COD"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end border-t border-[#edf0f3] pt-4">
                        <button
                          type="button"
                          onClick={() => openOrderDrawer(order)}
                          className="inline-flex h-[34px] items-center gap-1.5 rounded-[9px] border border-[#dce3eb] bg-white px-3 text-[11px] font-semibold text-[#52627a] transition-all duration-200 hover:border-[#23643f] hover:text-[#23643f]"
                        >
                          View
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* EMPTY */}
                {filteredOrders.length === 0 && (
                  <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f7] text-[#7b8799]">
                      <OrderIcon />
                    </div>

                    <h3 className="mt-4 text-[15px] font-semibold text-[#17233b]">
                      No orders found
                    </h3>

                    <p className="mt-1 max-w-[320px] text-[12px] text-[#7b8799]">
                      Try changing your search or filter options.
                    </p>
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex flex-col gap-2 border-t border-[#e1e5ea] bg-[#fafbfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-[#7b8799]">
                    Showing{" "}
                    <span className="font-semibold text-[#53627a]">
                      {filteredOrders.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-[#53627a]">
                      {orders.length}
                    </span>{" "}
                    orders
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#a0a9b6]">
                    The Backstore Admin
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* SEPARATE ORDER ACTION DRAWER */}
      <OrderActionDrawer
        order={selectedOrder}
        onClose={closeOrderDrawer}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
