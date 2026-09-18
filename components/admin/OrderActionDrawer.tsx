"use client";

import { useEffect, useState } from "react";

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "Online Payment" | "COD";

export type OrderItem = {
  name: string;
  code: string;
  image: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  details: string;
};

export type Order = {
  id: string;
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
  orderItems: OrderItem[];
};

type OrderActionDrawerProps = {
  order: Order | null;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
};

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

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef7f2] text-[#23643f]">
        {icon}
      </div>

      <h3 className="text-[12px] font-bold text-[#17233b]">{title}</h3>
    </div>
  );
}

const statusOptions: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function OrderActionDrawer({
  order,
  onClose,
  onStatusUpdate,
}: OrderActionDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("Placed");

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setIsUpdating(false);
    }
  }, [order]);

  useEffect(() => {
    if (!order) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [order, onClose]);

  if (!order) {
    return null;
  }

  const hasStatusChanged = selectedStatus !== order.status;

  const handleUpdateStatus = () => {
    if (!hasStatusChanged || isUpdating) {
      return;
    }

    setIsUpdating(true);

    setTimeout(() => {
      onStatusUpdate(order.id, selectedStatus);
      setIsUpdating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close order details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-[1px]"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-white shadow-[-12px_0_35px_rgba(15,23,42,0.16)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#e7ebf0] px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[14px] font-bold text-[#17233b]">
                Order ##{order.id}
              </h2>

              <span
                className={[
                  "rounded-full px-2 py-1 text-[8px] font-bold",
                  getStatusClass(order.status),
                ].join(" ")}
              >
                {order.status}
              </span>
            </div>

            <p className="mt-1 text-[9px] text-[#8795a9]">
              Placed on {order.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#71809a] transition-colors hover:bg-[#f2f4f7] hover:text-[#17233b]"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Customer Details */}
          <section className="border-b border-[#edf0f3] p-4">
            <SectionHeader icon={<UserIcon />} title="Customer Details" />

            <div className="mt-3 rounded-[10px] border border-[#e4e9ef] bg-[#f8fafc] p-3">
              <p className="text-[11px] font-bold text-[#17233b]">
                {order.customer}
              </p>

              <p className="mt-1 text-[9px] text-[#71809a]">{order.email}</p>

              <p className="mt-1 text-[9px] text-[#71809a]">{order.phone}</p>
            </div>
          </section>

          {/* Order Items */}
          <section className="border-b border-[#edf0f3] p-4">
            <SectionHeader icon={<OrderIcon />} title="Order Items" />

            <p className="mt-1 text-[9px] text-[#8795a9]">
              {order.items} {order.items === 1 ? "Item" : "Items"}
            </p>

            <div className="mt-3 overflow-hidden rounded-[10px] border border-[#e4e9ef]">
              {order.orderItems.map((item, index) => (
                <div key={`${item.code}-${index}`}>
                  {/* Product */}
                  <div className="flex gap-3 p-3">
                    <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e4e9ef] bg-[#f5f6f8]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-bold text-[#17233b]">
                            {item.name}
                          </h4>

                          <p className="mt-1 text-[8px] uppercase text-[#98a4b4]">
                            PRODUCT CODE: {item.code}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-[11px] font-bold text-[#23643f]">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>

                          <p className="mt-1 text-[8px] text-[#98a4b4]">
                            {formatCurrency(item.unitPrice)} / item
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <div className="grid grid-cols-4 border-t border-[#edf0f3] bg-[#fafbfc]">
                    <div className="border-r border-[#edf0f3] px-3 py-2.5">
                      <p className="text-[7px] uppercase text-[#98a4b4]">
                        Weight
                      </p>

                      <p className="mt-1 text-[9px] font-bold text-[#23643f]">
                        {item.weight}
                      </p>
                    </div>

                    <div className="border-r border-[#edf0f3] px-3 py-2.5">
                      <p className="text-[7px] uppercase text-[#98a4b4]">
                        Quantity
                      </p>

                      <p className="mt-1 text-[9px] font-bold text-[#52627a]">
                        {item.quantity}
                      </p>
                    </div>

                    <div className="border-r border-[#edf0f3] px-3 py-2.5">
                      <p className="text-[7px] uppercase text-[#98a4b4]">
                        Unit Price
                      </p>

                      <p className="mt-1 text-[9px] font-bold text-[#52627a]">
                        {formatCurrency(item.unitPrice)}
                      </p>
                    </div>

                    <div className="px-3 py-2.5">
                      <p className="text-[7px] uppercase text-[#98a4b4]">MRP</p>

                      <p className="mt-1 text-[9px] font-bold text-[#52627a]">
                        {formatCurrency(item.mrp)}
                      </p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="border-t border-[#edf0f3] px-3 py-2.5">
                    <p className="text-[7px] uppercase text-[#98a4b4]">
                      Product Details
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-[#71809a]">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Address */}
          <section className="border-b border-[#edf0f3] p-4">
            <SectionHeader icon={<LocationIcon />} title="Delivery Address" />

            <div className="mt-3 rounded-[10px] border border-[#e4e9ef] bg-[#f8fafc] p-3">
              <p className="text-[9px] leading-4 text-[#52627a]">
                {order.address}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section className="border-b border-[#edf0f3] p-4">
            <SectionHeader icon={<PaymentIcon />} title="Payment" />

            <div className="mt-3 flex items-center justify-between rounded-[10px] border border-[#e4e9ef] bg-[#f8fafc] px-3 py-3">
              <span className="text-[9px] text-[#8795a9]">Payment Method</span>

              <span className="text-[9px] font-bold text-[#52627a]">
                {order.paymentDetails}
              </span>
            </div>
          </section>

          {/* Order Summary */}
          <section className="border-b border-[#edf0f3] p-4">
            <h3 className="text-[12px] font-bold text-[#17233b]">
              Order Summary
            </h3>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#71809a]">Items</span>

                <span className="text-[10px] font-semibold text-[#52627a]">
                  {order.items}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#71809a]">Total</span>

                <span className="text-[13px] font-bold text-[#23643f]">
                  {formatCurrency(order.amount)}
                </span>
              </div>
            </div>
          </section>

          {/* Update Status */}
          <section className="bg-[#fffdf7] p-4">
            <h3 className="text-[12px] font-bold text-[#17233b]">
              Update Order Status
            </h3>

            <p className="mt-1 text-[9px] text-[#71809a]">
              Change the current status of this order.
            </p>

            <div className="mt-3">
              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as OrderStatus)
                }
                className="h-[42px] w-full rounded-[9px] border border-[#dce3eb] bg-white px-3 text-[11px] font-medium text-[#52627a] outline-none transition-colors focus:border-[#23643f]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!hasStatusChanged || isUpdating}
              onClick={handleUpdateStatus}
              className={[
                "mt-3 h-[42px] w-full rounded-[9px]",
                "text-[10px] font-semibold transition-all duration-200",
                !hasStatusChanged || isUpdating
                  ? "cursor-not-allowed bg-[#cbd5e1] text-white"
                  : "bg-[#23643f] text-white hover:bg-[#194d30]",
              ].join(" ")}
            >
              {isUpdating
                ? "Updating..."
                : hasStatusChanged
                  ? "Update Status"
                  : "Status Already Updated"}
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#e5e9ef] bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] w-full rounded-[9px] border border-[#dce3eb] bg-white text-[11px] font-semibold text-[#52627a] transition-colors hover:border-[#23643f] hover:text-[#23643f]"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
}
