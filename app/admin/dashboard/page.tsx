"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Package,
  ShoppingBag,
  Tag,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  total_amount: number | null;
  status: string | null;
  created_at: string;
};

type DashboardStats = {
  totalProducts: number;
  revenue: number;
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  yesterdayOrders: number;
  weekOrders: number;
  monthOrders: number;
};

const emptyStats: DashboardStats = {
  totalProducts: 0,
  revenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  todayOrders: 0,
  yesterdayOrders: 0,
  weekOrders: 0,
  monthOrders: 0,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getStartOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getStartOfWeek(date: Date) {
  const result = getStartOfDay(date);
  const day = result.getDay();
  const difference = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - difference);
  return result;
}

function getStartOfMonth(date: Date) {
  const result = getStartOfDay(date);
  result.setDate(1);
  return result;
}

function getStatusClasses(status: string | null) {
  switch (status) {
    case "Delivered":
      return "bg-[#dcfce7] text-[#15803d]";
    case "Cancelled":
      return "bg-[#fee2e2] text-[#dc2626]";
    case "Shipped":
    case "Out for Delivery":
      return "bg-[#dbeafe] text-[#2563eb]";
    case "Confirmed":
    case "Packed":
      return "bg-[#ede9fe] text-[#7c3aed]";
    case "Placed":
    default:
      return "bg-[#fff3cd] text-[#b27a00]";
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          { count: productCount, error: productsError },
          { data: ordersData, error: ordersError },
        ] = await Promise.all([
          supabase
            .from("products")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("orders")
            .select(
              `
                id,
                order_number,
                customer_name,
                customer_email,
                total_amount,
                status,
                created_at
              `,
            )
            .order("created_at", { ascending: false }),
        ]);

        if (productsError) {
          throw new Error(productsError.message || "Unable to load products.");
        }

        if (ordersError) {
          throw new Error(ordersError.message || "Unable to load orders.");
        }

        if (!mounted) {
          return;
        }

        const orders = (ordersData ?? []) as Order[];
        const now = new Date();
        const todayStart = getStartOfDay(now);
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const weekStart = getStartOfWeek(now);
        const monthStart = getStartOfMonth(now);

        const todayOrders = orders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= todayStart;
        }).length;

        const yesterdayOrders = orders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= yesterdayStart && createdAt < todayStart;
        }).length;

        const weekOrders = orders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= weekStart;
        }).length;

        const monthOrders = orders.filter((order) => {
          const createdAt = new Date(order.created_at);
          return createdAt >= monthStart;
        }).length;

        const pendingOrders = orders.filter(
          (order) => order.status === "Placed",
        ).length;

        const revenue = orders.reduce((total, order) => {
          if (order.status === "Cancelled") {
            return total;
          }

          return total + Number(order.total_amount ?? 0);
        }, 0);

        setStats({
          totalProducts: productCount ?? 0,
          revenue,
          totalOrders: orders.length,
          pendingOrders,
          todayOrders,
          yesterdayOrders,
          weekOrders,
          monthOrders,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (dashboardError) {
        console.error("Load dashboard error:", dashboardError);

        if (!mounted) {
          return;
        }

        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Unable to load dashboard data.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const chartData = useMemo(
    () => [
      {
        label: "Today",
        value: stats.todayOrders,
      },
      {
        label: "Yesterday",
        value: stats.yesterdayOrders,
      },
      {
        label: "This week",
        value: stats.weekOrders,
      },
      {
        label: "This month",
        value: stats.monthOrders,
      },
    ],
    [stats],
  );

  const chartMax = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] text-[#17233a]">
      <div className="w-full">
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

        {error && (
          <div className="mb-5 rounded-[12px] border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-[12px] font-medium text-[#dc2626]">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Total Products
              </p>
              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                {loading ? "—" : stats.totalProducts}
              </p>
              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Products in store
              </p>
            </div>
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#fff3b8] text-[#d69e00]">
              <Package size={24} strokeWidth={2} />
            </div>
          </div>

          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Revenue
              </p>
              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                {loading ? "—" : formatCurrency(stats.revenue)}
              </p>
              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Total revenue
              </p>
            </div>
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#d9f8e6] text-[#16a34a]">
              <TrendingUp size={24} strokeWidth={2} />
            </div>
          </div>

          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">Orders</p>
              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                {loading ? "—" : stats.totalOrders}
              </p>
              <p className="mt-1 text-[10px] font-medium text-[#9aa5b4]">
                Total orders
              </p>
            </div>
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#dceaff] text-[#2563eb]">
              <Tag size={24} strokeWidth={2} />
            </div>
          </div>

          <div className="flex min-h-[112px] items-center justify-between rounded-[15px] border border-[#dce3eb] bg-white px-5 py-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-[12px] font-semibold text-[#71809a]">
                Pending
              </p>
              <p className="mt-1 text-[25px] font-bold tracking-[-0.04em] text-[#17233a]">
                {loading ? "—" : stats.pendingOrders}
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

        <section className="mt-6 overflow-hidden rounded-[15px] border border-[#dce3eb] bg-white shadow-[0_2px_6px_rgba(15,23,42,0.05)]">
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

          <div className="p-5">
            <div className="relative h-[300px] overflow-hidden rounded-[10px] border border-[#e5e9ee] bg-[#fcfdff]">
              <div className="absolute bottom-10 left-14 right-5 top-5 flex flex-col justify-between">
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
                <div className="border-t border-dashed border-[#d7dee7]" />
              </div>

              <div className="absolute bottom-10 left-14 right-5 top-5 flex justify-between">
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
                <div className="border-l border-dashed border-[#e0e5eb]" />
              </div>

              <div className="absolute bottom-10 left-2 top-5 flex flex-col justify-between bg-[#fcfdff] pr-3 text-[10px] font-medium text-[#7f8a99]">
                <span>{chartMax}</span>
                <span>{Math.ceil(chartMax * 0.75)}</span>
                <span>{Math.ceil(chartMax * 0.5)}</span>
                <span>{Math.ceil(chartMax * 0.25)}</span>
                <span>0</span>
              </div>

              <div className="absolute bottom-10 left-14 right-5 border-b border-[#8e98a5]" />
              <div className="absolute bottom-10 left-14 top-5 border-l border-[#8e98a5]" />

              <div className="absolute bottom-10 left-14 right-5 top-5 flex items-end justify-around gap-6 px-5 pb-1">
                {chartData.map((item) => (
                  <div
                    key={item.label}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <div
                      className="w-full max-w-[80px] rounded-t-[8px] bg-[#d81920] transition-all duration-500"
                      style={{
                        height:
                          item.value === 0
                            ? "4px"
                            : `${Math.max((item.value / chartMax) * 100, 8)}%`,
                      }}
                      title={`${item.label}: ${item.value} orders`}
                    />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-[11px] left-14 right-5 flex justify-between text-[9px] font-medium text-[#8a94a2]">
                {chartData.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-[12px] font-medium text-[#9aa5b4]"
                      >
                        Loading orders...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-10 text-center text-[12px] font-medium text-[#9aa5b4]"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#f0f2f5] last:border-b-0"
                      >
                        <td className="px-5 py-4 text-[11px] font-bold text-[#d81920]">
                          {order.order_number || order.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[11px] font-bold text-[#17233a]">
                            {order.customer_name || "Unknown customer"}
                          </p>
                          {order.customer_email && (
                            <p className="mt-1 text-[9px] font-medium text-[#9aa5b4]">
                              {order.customer_email}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-[11px] font-bold text-[#17233a]">
                          {formatCurrency(Number(order.total_amount ?? 0))}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${getStatusClasses(
                              order.status,
                            )}`}
                          >
                            {order.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
