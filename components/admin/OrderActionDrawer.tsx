"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "Online Payment" | "COD";

export type CustomizationData = {
  color?: string;
  size?: string;
  frontImages?: string[];
  backImages?: string[];
  leftSleeveImages?: string[];
  rightSleeveImages?: string[];
  [key: string]: unknown;
};

export type OrderItem = {
  name: string;
  code: string;
  image: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  details: string;
  orderItemId?: string;
  isCustom?: boolean;
  customization?: CustomizationData | null;
};

export type Order = {
  id: string;
  databaseId?: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  items: number;
  amount: number;
  payment: PaymentMethod;
  status: OrderStatus;
  address: string;
  paymentDetails: string;
  trackingId?: string | null;
  orderItems: OrderItem[];
};

type OrderActionDrawerProps = {
  order: Order | null;
  onClose: () => void;
  onStatusUpdate: (
    orderId: string,
    status: OrderStatus,
    trackingId?: string,
  ) => void | Promise<void>;
};

const statusOptions: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const trackingStatuses: OrderStatus[] = [
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: OrderStatus) {
  switch (status) {
    case "Placed":
      return "bg-[#fff4cf] text-[#9a6500] border-[#f5df9a]";
    case "Confirmed":
      return "bg-[#e8f0ff] text-[#2459c5] border-[#cfe0ff]";
    case "Packed":
      return "bg-[#f0e8ff] text-[#7140b7] border-[#dfcffb]";
    case "Shipped":
      return "bg-[#e4f5ff] text-[#0075a8] border-[#c6eafa]";
    case "Out for Delivery":
      return "bg-[#fff0df] text-[#c2410c] border-[#ffd7b0]";
    case "Delivered":
      return "bg-[#dcfce7] text-[#15803d] border-[#b9efca]";
    case "Cancelled":
      return "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]";
    default:
      return "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]";
  }
}

function isCustomItem(item: OrderItem) {
  return (
    item.isCustom === true ||
    Boolean(
      item.customization?.frontImages?.length ||
      item.customization?.backImages?.length ||
      item.customization?.leftSleeveImages?.length ||
      item.customization?.rightSleeveImages?.length,
    )
  );
}

type CustomImage = {
  key: string;
  label: string;
  url: string;
  storagePath: string | null;
};

function getStoragePath(url: string) {
  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/custom-designs/";
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

function getCustomImages(item: OrderItem): CustomImage[] {
  if (!item.customization) return [];

  const groups: Array<[string, string, string[] | undefined]> = [
    ["front", "Front", item.customization.frontImages],
    ["back", "Back", item.customization.backImages],
    ["left-sleeve", "Left Sleeve", item.customization.leftSleeveImages],
    ["right-sleeve", "Right Sleeve", item.customization.rightSleeveImages],
  ];

  return groups.flatMap(([key, label, urls]) =>
    (urls ?? [])
      .filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0,
      )
      .map((url, index, filteredUrls) => ({
        key: `${key}-${index}-${url}`,
        label: filteredUrls.length > 1 ? `${label} ${index + 1}` : label,
        url,
        storagePath: getStoragePath(url),
      })),
  );
}

function CloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="m9 7 .7-3h4.6l.7 3" />
      <path d="M6 7l1 14h10l1-14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c.8-4.1 3.4-6 8-6s7.2 1.9 8 6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function TruckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h11v11H3z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17.5" cy="18" r="2" />
    </svg>
  );
}

function SectionHeader({
  icon,
  title,
  eyebrow,
}: {
  icon: React.ReactNode;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#111827] text-white shadow-sm">
        {icon}
      </div>
      <div>
        {eyebrow && (
          <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#9aa5b5]">
            {eyebrow}
          </p>
        )}
        <h3 className="text-[12px] font-bold text-[#17233b]">{title}</h3>
      </div>
    </div>
  );
}

export default function OrderActionDrawer({
  order,
  onClose,
  onStatusUpdate,
}: OrderActionDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("Placed");
  const [trackingId, setTrackingId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deletingImageKey, setDeletingImageKey] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!order) return;

    setSelectedStatus(order.status);
    setTrackingId(order.trackingId ?? "");
    setIsUpdating(false);
    setActionError("");
    setVisibleItems(order.orderItems);
  }, [order]);

  useEffect(() => {
    if (!order) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [order, onClose]);

  const customImages = useMemo(
    () =>
      visibleItems.flatMap((item, itemIndex) =>
        getCustomImages(item).map((image) => ({
          ...image,
          itemIndex,
        })),
      ),
    [visibleItems],
  );

  if (!order) return null;

  const hasStatusChanged = selectedStatus !== order.status;
  const requiresTracking = trackingStatuses.includes(selectedStatus);
  const normalizedTrackingId = trackingId.trim();

  const handleUpdateStatus = async () => {
    if (isUpdating) return;

    if (!hasStatusChanged) {
      if (requiresTracking && !normalizedTrackingId) {
        setActionError("Tracking ID is mandatory for shipped orders.");
      }
      return;
    }

    if (requiresTracking && !normalizedTrackingId) {
      setActionError(
        "Enter a tracking ID before moving this order to shipped.",
      );
      return;
    }

    setActionError("");
    setIsUpdating(true);

    try {
      await onStatusUpdate(order.id, selectedStatus, normalizedTrackingId);
    } catch (error) {
      console.error("Order status update failed:", error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update the order status.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = async (image: CustomImage) => {
    try {
      const response = await fetch(image.url);
      if (!response.ok) throw new Error("Unable to download image.");

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = image.url.split("/").pop() || "custom-design.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Custom image download failed:", error);
      window.open(image.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDeleteImage = async (image: CustomImage, itemIndex: number) => {
    const item = visibleItems[itemIndex];

    if (!item?.orderItemId || !image.url) {
      setActionError(
        "This custom image cannot be deleted because its order item is missing.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete the ${image.label.toLowerCase()} custom image from this order? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingImageKey(image.key);
    setActionError("");

    try {
      if (image.storagePath) {
        const { error: storageError } = await supabase.storage
          .from("custom-designs")
          .remove([image.storagePath]);

        if (storageError) throw storageError;
      }

      const currentCustomization = item.customization ?? {};

      const imageGroups = [
        "frontImages",
        "backImages",
        "leftSleeveImages",
        "rightSleeveImages",
      ] as const;

      const updatedCustomization: CustomizationData = {
        ...currentCustomization,
      };

      for (const group of imageGroups) {
        const values = updatedCustomization[group];
        if (Array.isArray(values)) {
          updatedCustomization[group] = values.filter(
            (value) => value !== image.url,
          );
        }
      }

      const { error: databaseError } = await supabase
        .from("order_items")
        .update({
          variant_details: {
            ...((item.customization && typeof item.customization === "object"
              ? {
                  ...item.customization,
                }
              : {}) as Record<string, unknown>),
            customization: updatedCustomization,
          },
        })
        .eq("id", item.orderItemId);

      if (databaseError) throw databaseError;

      setVisibleItems((current) =>
        current.map((currentItem, currentIndex) =>
          currentIndex !== itemIndex
            ? currentItem
            : {
                ...currentItem,
                customization: updatedCustomization,
              },
        ),
      );
    } catch (error) {
      console.error("Delete custom image failed:", error);
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete the custom image.",
      );
    } finally {
      setDeletingImageKey(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close order details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#07111c]/55 backdrop-blur-[3px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col overflow-hidden border-l border-white/20 bg-[#f7f8fa] shadow-[-24px_0_60px_rgba(15,23,42,0.22)]">
        <div className="relative shrink-0 overflow-hidden bg-[#111827] px-5 pb-5 pt-5 text-white">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#d81920]/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-36 w-36 rounded-full bg-[#ffffff]/10 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.16em] text-white/70">
                  Order
                </span>
                <span
                  className={`rounded-full border px-2 py-1 text-[7px] font-bold ${getStatusClass(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <h2 className="text-[18px] font-black tracking-[-0.02em]">
                #{order.id}
              </h2>
              <p className="mt-1 text-[9px] text-white/55">
                Placed on {order.date}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <section className="border-b border-[#e7ebf0] bg-white p-4">
            <SectionHeader
              icon={<UserIcon />}
              eyebrow="Profile"
              title="Customer Details"
            />

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[#e5e9ef] bg-[#fafbfc] p-3">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#9aa5b5]">
                  Customer
                </p>
                <p className="mt-1 text-[11px] font-bold text-[#17233b]">
                  {order.customer}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#e5e9ef] bg-[#fafbfc] p-3">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#9aa5b5]">
                  Phone
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#52627a]">
                  {order.phone || "—"}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#e5e9ef] bg-[#fafbfc] p-3 sm:col-span-2">
                <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#9aa5b5]">
                  Email
                </p>
                <p className="mt-1 truncate text-[10px] font-semibold text-[#52627a]">
                  {order.email}
                </p>
              </div>
            </div>
          </section>

          <section className="border-b border-[#e7ebf0] bg-white p-4">
            <div className="flex items-center justify-between">
              <SectionHeader
                icon={<OrderIcon />}
                eyebrow="Line items"
                title="Order Items"
              />
              <span className="rounded-full bg-[#111827] px-2.5 py-1 text-[8px] font-bold text-white">
                {visibleItems.length}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {visibleItems.map((item, index) => {
                const custom = isCustomItem(item);

                return (
                  <article
                    key={`${item.orderItemId ?? item.code}-${index}`}
                    className="overflow-hidden rounded-[14px] border border-[#e2e7ed] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f0f2f4]">
                        {item.image?.trim() ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#a1a9b5]">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h4 className="truncate text-[11px] font-bold text-[#17233b]">
                                {item.name}
                              </h4>
                              <span
                                className={`rounded-full border px-1.5 py-0.5 text-[6px] font-black uppercase tracking-[0.08em] ${
                                  custom
                                    ? "border-[#ffd2d4] bg-[#fff0f0] text-[#d81920]"
                                    : "border-[#cce5d6] bg-[#eef6f1] text-[#23643f]"
                                }`}
                              >
                                {custom ? "Custom" : "Normal"}
                              </span>
                            </div>

                            <p className="mt-1 text-[7px] uppercase tracking-[0.1em] text-[#9aa5b5]">
                              {item.code || "NO SKU"}
                            </p>
                          </div>

                          <p className="shrink-0 text-[11px] font-black text-[#111827]">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-[#f5f6f8] px-2 py-1 text-[7px] font-semibold text-[#68768a]">
                            Qty {item.quantity}
                          </span>
                          <span className="rounded-md bg-[#f5f6f8] px-2 py-1 text-[7px] font-semibold text-[#68768a]">
                            {formatCurrency(item.unitPrice)} each
                          </span>
                          {item.customization?.size && (
                            <span className="rounded-md bg-[#f5f6f8] px-2 py-1 text-[7px] font-semibold text-[#68768a]">
                              Size {item.customization.size}
                            </span>
                          )}
                          {item.customization?.color && (
                            <span className="rounded-md bg-[#f5f6f8] px-2 py-1 text-[7px] font-semibold text-[#68768a]">
                              {item.customization.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-t border-[#edf0f3] bg-[#fafbfc]">
                      <div className="border-r border-[#edf0f3] px-3 py-2.5">
                        <p className="text-[6px] uppercase tracking-[0.12em] text-[#9aa5b5]">
                          Weight
                        </p>
                        <p className="mt-1 text-[8px] font-bold text-[#52627a]">
                          {item.weight || "—"}
                        </p>
                      </div>
                      <div className="border-r border-[#edf0f3] px-3 py-2.5">
                        <p className="text-[6px] uppercase tracking-[0.12em] text-[#9aa5b5]">
                          Unit Price
                        </p>
                        <p className="mt-1 text-[8px] font-bold text-[#52627a]">
                          {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="px-3 py-2.5">
                        <p className="text-[6px] uppercase tracking-[0.12em] text-[#9aa5b5]">
                          MRP
                        </p>
                        <p className="mt-1 text-[8px] font-bold text-[#52627a]">
                          {formatCurrency(item.mrp)}
                        </p>
                      </div>
                    </div>

                    {item.details && (
                      <div className="border-t border-[#edf0f3] px-3 py-2.5">
                        <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[#9aa5b5]">
                          Product Details
                        </p>
                        <p className="mt-1 text-[8px] leading-4 text-[#71809a]">
                          {item.details}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {customImages.length > 0 && (
            <section className="border-b border-[#e7ebf0] bg-[#fffafa] p-4">
              <div className="flex items-center justify-between">
                <SectionHeader
                  icon={<OrderIcon />}
                  eyebrow="Production assets"
                  title="Custom Uploaded Images"
                />
                <span className="rounded-full bg-[#d81920] px-2.5 py-1 text-[8px] font-bold text-white">
                  {customImages.length}
                </span>
              </div>

              <p className="mt-2 text-[8px] leading-4 text-[#8b5c61]">
                These are the artwork files uploaded by the customer for this
                custom order.
              </p>

              <div className="mt-3 space-y-3">
                {customImages.map((image) => {
                  const itemIndex = image.itemIndex;
                  const isDeleting = deletingImageKey === image.key;

                  return (
                    <div
                      key={image.key}
                      className="overflow-hidden rounded-[14px] border border-[#f1d8da] bg-white shadow-[0_5px_20px_rgba(216,25,32,0.06)]"
                    >
                      <div className="flex gap-3 p-3">
                        <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#f3f3f3]">
                          {image.url?.trim() ? (
                            <img
                              src={image.url}
                              alt={image.label}
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#a1a9b5]">
                              No image
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-bold text-[#17233b]">
                                {image.label}
                              </p>
                              <p className="mt-1 text-[7px] uppercase tracking-[0.1em] text-[#a2767a]">
                                Customer artwork
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDownload(image)}
                              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#111827] px-2 text-[8px] font-bold text-white transition hover:bg-[#253044]"
                            >
                              <DownloadIcon />
                              Download
                            </button>

                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() =>
                                handleDeleteImage(image, itemIndex)
                              }
                              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-[#f0c5c8] bg-white px-2 text-[8px] font-bold text-[#d81920] transition hover:bg-[#fff1f2] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <TrashIcon />
                              {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="border-b border-[#e7ebf0] bg-white p-4">
            <SectionHeader
              icon={<LocationIcon />}
              eyebrow="Shipping"
              title="Delivery Address"
            />
            <div className="mt-3 rounded-[12px] border border-[#e5e9ef] bg-[#fafbfc] p-3">
              <p className="text-[9px] leading-5 text-[#52627a]">
                {order.address || "No delivery address available."}
              </p>
            </div>
          </section>

          <section className="border-b border-[#e7ebf0] bg-white p-4">
            <SectionHeader
              icon={<PaymentIcon />}
              eyebrow="Checkout"
              title="Payment"
            />
            <div className="mt-3 flex items-center justify-between rounded-[12px] border border-[#e5e9ef] bg-[#fafbfc] px-3 py-3">
              <span className="text-[9px] text-[#8795a9]">Payment Method</span>
              <span className="text-[9px] font-black text-[#17233b]">
                {order.paymentDetails}
              </span>
            </div>
          </section>

          <section className="border-b border-[#e7ebf0] bg-white p-4">
            <div className="rounded-[14px] bg-[#111827] p-4 text-white">
              <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/45">
                Order total
              </p>
              <div className="mt-1 flex items-end justify-between gap-4">
                <span className="text-[9px] text-white/60">
                  {order.items} {order.items === 1 ? "item" : "items"}
                </span>
                <span className="text-[22px] font-black tracking-[-0.03em]">
                  {formatCurrency(order.amount)}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-[#f7f9fb] p-4">
            <div className="rounded-[16px] border border-[#dfe5eb] bg-white p-4 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#d81920] text-white">
                  <TruckIcon />
                </div>
                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#9aa5b5]">
                    Fulfilment
                  </p>
                  <h3 className="text-[12px] font-bold text-[#17233b]">
                    Update Order Status
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[7px] font-bold uppercase tracking-[0.14em] text-[#8d99aa]">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(event) => {
                    setSelectedStatus(event.target.value as OrderStatus);
                    setActionError("");
                  }}
                  className="h-[44px] w-full rounded-[10px] border border-[#dce3eb] bg-[#fbfcfd] px-3 text-[10px] font-bold text-[#52627a] outline-none transition focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/5"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {requiresTracking && (
                <div className="mt-3 rounded-[12px] border border-[#cfe5f3] bg-[#f3fbff] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[7px] font-black uppercase tracking-[0.14em] text-[#0075a8]">
                      Tracking ID <span className="text-[#d81920]">*</span>
                    </label>
                    <span className="text-[7px] font-semibold text-[#6f8ea0]">
                      Mandatory
                    </span>
                  </div>

                  <input
                    value={trackingId}
                    onChange={(event) => {
                      setTrackingId(event.target.value);
                      setActionError("");
                    }}
                    placeholder="Enter courier tracking number"
                    className="h-[42px] w-full rounded-[9px] border border-[#cfe0e8] bg-white px-3 text-[10px] font-semibold text-[#17233b] outline-none placeholder:text-[#a6b4c1] focus:border-[#0075a8] focus:ring-2 focus:ring-[#0075a8]/10"
                  />

                  <p className="mt-1.5 text-[7px] leading-4 text-[#6f8ea0]">
                    Required for Shipped, Out for Delivery and Delivered.
                  </p>
                </div>
              )}

              {actionError && (
                <div className="mt-3 rounded-[10px] border border-[#fecaca] bg-[#fff1f2] px-3 py-2.5 text-[8px] font-semibold leading-4 text-[#b4232b]">
                  {actionError}
                </div>
              )}

              <button
                type="button"
                disabled={
                  isUpdating ||
                  (!hasStatusChanged &&
                    !(requiresTracking && !trackingId.trim()))
                }
                onClick={handleUpdateStatus}
                className={[
                  "mt-3 h-[44px] w-full rounded-[10px] text-[9px] font-black uppercase tracking-[0.08em] transition-all",
                  isUpdating ||
                  (!hasStatusChanged &&
                    !(requiresTracking && !trackingId.trim()))
                    ? "cursor-not-allowed bg-[#d7dde5] text-white"
                    : "bg-[#d81920] text-white shadow-[0_8px_18px_rgba(216,25,32,0.18)] hover:bg-[#b9161c]",
                ].join(" ")}
              >
                {isUpdating
                  ? "Saving Changes..."
                  : hasStatusChanged
                    ? requiresTracking
                      ? "Save Status & Tracking"
                      : "Update Status"
                    : requiresTracking && !trackingId.trim()
                      ? "Tracking ID Required"
                      : "Status Already Updated"}
              </button>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#e1e5ea] bg-white p-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] w-full rounded-[10px] border border-[#dce3eb] bg-white text-[9px] font-bold uppercase tracking-[0.08em] text-[#52627a] transition hover:border-[#111827] hover:text-[#111827]"
          >
            Close Order
          </button>
        </div>
      </aside>
    </div>
  );
}
