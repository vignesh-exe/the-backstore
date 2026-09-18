"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  Clock3,
  Package,
  ShoppingBag,
  Tag,
  TrendingUp,
} from "lucide-react";

const recentOrders = [
  {
    id: "—",
    customer: "No orders yet",
    amount: "₹0.00",
    status: "Pending",
  },
  {
    id: "—",
    customer: "No orders yet",
    amount: "₹0.00",
    status: "Pending",
  },
  {
    id: "—",
    customer: "No orders yet",
    amount: "₹0.00",
    status: "Pending",
  },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen w-full bg-[#f8fafc] text-[#17233a]">
      <div className="w-full">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#17233a]">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-[13px] font-medium text-[#71809a]">
              Welcome back! Here&apos;s what&apos;s happening today.
            </p>
          </div>
        </header>

        {/* =========================================================
            STAT CARDS
        ========================================================= */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Products */}
          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Total Products
              </p>

              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                0
              </p>

              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Products in store
              </p>
            </div>

            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#fff3b8] text-[#d69e00]">
              <Package size={24} strokeWidth={2} />
            </div>
          </div>

          {/* Revenue */}
          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Revenue
              </p>

              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                ₹0.00
              </p>

              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Total revenue
              </p>
            </div>

            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#d9f8e6] text-[#16a34a]">
              <TrendingUp size={24} strokeWidth={2} />
            </div>
          </div>

          {/* Orders */}
          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">Orders</p>

              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                0
              </p>

              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Total orders
              </p>
            </div>

            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#dceaff] text-[#2563eb]">
              <Tag size={24} strokeWidth={2} />
            </div>
          </div>

          {/* Pending */}
          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Pending
              </p>

              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                0
              </p>

              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Orders pending
              </p>
            </div>

            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#f0ddff] text-[#9333ea]">
              <Clock3 size={24} strokeWidth={2} />
            </div>
          </div>
        </section>

        {/* =========================================================
            ORDERS OVERVIEW
        ========================================================= */}
        <section className="mt-6 overflow-hidden rounded-[15px] border border-[#dce3eb] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-4">
            <div>
              <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[#17233a]">
                Orders Overview
              </h2>

              <p className="mt-1 text-[11px] font-medium text-[#8a97aa]">
                Track your order activity
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 rounded-lg border border-[#dce3eb] bg-white px-3 py-2 text-[11px] font-bold text-[#52627a] transition hover:bg-[#f8fafc]"
            >
              View Orders
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>
          </div>

          {/* Chart */}
          <div className="p-5">
            <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-[#e5e9ee] bg-[#fcfdff]">
              {/* Horizontal grid */}
              <div className="absolute bottom-10 left-14 right-5 top-5 flex flex-col justify-between">
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
              </div>

              {/* Vertical grid */}
              <div className="absolute bottom-10 left-14 right-5 top-5 flex justify-between">
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
              </div>

              {/* Y axis labels */}
              <div className="absolute bottom-10 left-2 top-5 flex flex-col justify-between bg-[#fcfdff] pr-3 text-[10px] font-medium text-[#7f8a99]">
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>

              {/* Axes */}
              <div className="absolute bottom-10 left-14 right-5 border-b border-[#8e98a5]" />

              <div className="absolute bottom-10 left-14 top-5 border-l border-[#8e98a5]" />

              {/* Empty state */}
              <div className="absolute inset-0 flex items-center justify-center pb-8">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2f6] text-[#71809a]">
                    <ShoppingBag size={21} strokeWidth={2} />
                  </div>

                  <p className="mt-3 text-[13px] font-bold text-[#52627a]">
                    No orders yet
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#9aa5b4]">
                    Your order statistics will appear here.
                  </p>
                </div>
              </div>

              {/* X axis labels */}
              <div className="absolute bottom-[11px] left-14 right-5 flex justify-between text-[9px] font-medium text-[#8a94a2]">
                <span>Today</span>
                <span>Yesterday</span>
                <span>This week</span>
                <span>This month</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            BOTTOM CONTENT
        ========================================================= */}
        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* Recent Orders */}
          <div className="overflow-hidden rounded-[15px] border border-[#dce3eb] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-4">
              <div>
                <h2 className="text-[15px] font-bold text-[#17233a]">
                  Recent Orders
                </h2>

                <p className="mt-1 text-[11px] font-medium text-[#8a97aa]">
                  Latest customer orders
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-[11px] font-bold text-[#52627a] transition hover:text-[#17233a]"
              >
                View all
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#e5e9ee] bg-[#f8fafc] text-left">
                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#71809a]">
                      Order
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#71809a]">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#71809a]">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#71809a]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#f0f2f5] last:border-b-0"
                    >
                      <td className="px-5 py-4 text-[11px] font-bold text-[#17233a]">
                        {order.id}
                      </td>

                      <td className="px-5 py-4 text-[11px] font-medium text-[#71809a]">
                        {order.customer}
                      </td>

                      <td className="px-5 py-4 text-[11px] font-bold text-[#17233a]">
                        {order.amount}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-[#fff3cd] px-2.5 py-1 text-[9px] font-bold text-[#b27a00]">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="overflow-hidden rounded-[15px] border border-[#dce3eb] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div className="border-b border-[#edf1f5] px-5 py-4">
              <h2 className="text-[15px] font-bold text-[#17233a]">
                Quick Actions
              </h2>

              <p className="mt-1 text-[11px] font-medium text-[#8a97aa]">
                Manage your store quickly
              </p>
            </div>

            <div className="grid gap-3 p-5">
              {/* Add Product */}
              <Link
                href="/admin/products/add"
                className="group flex items-center justify-between rounded-[10px] border border-[#dce3eb] bg-white px-4 py-3 transition hover:border-[#17233a] hover:bg-[#f8fafc]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17233a] text-white">
                    <Package size={17} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-[#17233a]">
                      Add Product
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#8a97aa]">
                      Add a new product
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="text-[#9aa5b4] transition group-hover:text-[#17233a]"
                />
              </Link>

              {/* Products */}
              <Link
                href="/admin/products"
                className="group flex items-center justify-between rounded-[10px] border border-[#dce3eb] bg-white px-4 py-3 transition hover:border-[#17233a] hover:bg-[#f8fafc]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0ff] text-[#2563eb]">
                    <ShoppingBag size={17} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-[#17233a]">
                      Manage Products
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#8a97aa]">
                      View and edit products
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="text-[#9aa5b4] transition group-hover:text-[#17233a]"
                />
              </Link>

              {/* Orders */}
              <Link
                href="/admin/orders"
                className="group flex items-center justify-between rounded-[10px] border border-[#dce3eb] bg-white px-4 py-3 transition hover:border-[#17233a] hover:bg-[#f8fafc]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8faef] text-[#16a34a]">
                    <Tag size={17} strokeWidth={2} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-[#17233a]">
                      Manage Orders
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#8a97aa]">
                      View customer orders
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="text-[#9aa5b4] transition group-hover:text-[#17233a]"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
