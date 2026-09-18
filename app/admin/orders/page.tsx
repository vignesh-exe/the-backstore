"use client";

import { useMemo, useState } from "react";
import OrderActionDrawer, {
  Order,
  OrderStatus,
} from "@/components/admin/OrderActionDrawer";

const initialOrders: Order[] = [
  {
    id: "JA202609130005",
    customer: "Shoby",
    email: "shobykutty27@gmail.com",
    phone: "8220081259",
    date: "13 Sep 2026",
    items: 1,
    amount: 293.31,
    payment: "Online Payment",
    status: "Placed",
    address:
      "12, new test address, Landmark: near school, Bodhi, THENI, TAMIL NADU, PIN: 602213, India",
    paymentDetails: "Online Payment",
    orderItems: [
      {
        name: "Millet Idly Mix",
        code: "JM-001",
        image: "/products/millet-idly-mix.jpg",
        weight: "200g",
        quantity: 1,
        unitPrice: 249,
        mrp: 299,
        details: "Millet idly mix was super dry and tasty.",
      },
    ],
  },
];

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

function getStatusCount(orders: Order[], status: "All" | OrderStatus) {
  if (status === "All") {
    return orders.length;
  }

  return orders.filter((order) => order.status === status).length;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");

  const [paymentFilter, setPaymentFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order,
      ),
    );

    setSelectedOrder((currentOrder) =>
      currentOrder && currentOrder.id === orderId
        ? {
            ...currentOrder,
            status,
          }
        : currentOrder,
    );
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
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-[#dfe5ec] bg-[#f3f6f9]">
                    <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                      Order
                    </th>

                    <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                      Customer
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
                        {order.payment === "Online Payment" ? "Online" : "COD"}
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
