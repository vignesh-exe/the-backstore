"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProductStatus = "Active" | "Inactive" | "Out of Stock";

type Product = {
  id: string;
  name: string;
  sku: string;
  image: string;
  collection: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  featured: boolean;
};

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  sku: string | null;
  price: number | string;
  mrp: number | string | null;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  tags: string[] | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
  product_images?: {
    id: string;
    image_url: string;
    cloudinary_public_id?: string | null;
    alt_text?: string | null;
    sort_order?: number;
    is_primary?: boolean;
  }[];
  product_variants?: unknown[];
};

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function EditIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z" />
      <path d="m3.5 7.5 8.5 4.5 8.5-4.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-20"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("All Collections");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/products", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch products.");
      }

      const apiProducts: ApiProduct[] = result.products ?? [];

      const mappedProducts: Product[] = apiProducts.map((product) => {
        /*
         * The current API response uses the same shape shown by
         * /api/admin/products:
         *
         * sku
         * mrp
         * status
         * featured
         * tags
         * product_images
         *
         * Use the primary product image when available, then
         * fall back to the first uploaded image.
         */
        const sortedImages = [...(product.product_images ?? [])].sort(
          (a, b) => {
            if (a.is_primary && !b.is_primary) {
              return -1;
            }

            if (!a.is_primary && b.is_primary) {
              return 1;
            }

            return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
          },
        );

        const primaryImage = sortedImages[0]?.image_url || "";

        const tags = product.tags ?? [];

        return {
          id: product.id,
          name: product.name,
          sku: product.sku || "—",
          image: primaryImage,
          collection: tags[0] || "—",
          category: product.category || "—",
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          status: product.status,
          featured: Boolean(product.featured),
        };
      });

      setProducts(mappedProducts);
    } catch (fetchError) {
      console.error("Load products error:", fetchError);

      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        product.name.toLowerCase().includes(searchValue) ||
        product.sku.toLowerCase().includes(searchValue);

      const matchesCollection =
        collection === "All Collections" || product.collection === collection;

      const matchesCategory =
        category === "All Categories" || product.category === category;

      const matchesStatus =
        status === "All Status" || product.status === status;

      return (
        matchesSearch && matchesCollection && matchesCategory && matchesStatus
      );
    });
  }, [products, search, collection, category, status]);

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "Active",
  ).length;

  const featuredProducts = products.filter(
    (product) => product.featured,
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  const collections = useMemo(() => {
    const values = products
      .map((product) => product.collection)
      .filter((value) => value && value !== "—");

    return Array.from(new Set(values));
  }, [products]);

  const categories = useMemo(() => {
    const values = products.map((product) => product.category).filter(Boolean);

    return Array.from(new Set(values));
  }, [products]);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17233b]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-9">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-[3px] w-8 bg-[#ff2d32]" />

              <span className="font-bebas-neue text-[12px] tracking-[0.18em] text-[#8a96aa]">
                THE BACKSTORE
              </span>
            </div>

            <h1 className="font-bebas-neue text-[42px] leading-none tracking-[0.02em] text-[#17233b] sm:text-[48px]">
              PRODUCTS
            </h1>

            <p className="mt-2 text-[14px] text-[#71809a]">
              Manage your products, inventory and collections.
            </p>
          </div>

          <Link
            href="/admin/products/add"
            className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-[10px] border border-black bg-black px-6 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:border-[#ff2d32] hover:bg-[#ff2d32] hover:text-black"
          >
            <PlusIcon />
            <span>Add Product</span>
          </Link>
        </section>

        {/* =====================================================
            MOBILE ADD PRODUCT CTA
        ====================================================== */}
        <div className="mb-6 lg:hidden">
          <Link
            href="/admin/products/add"
            className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] border border-black bg-black px-5 text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:border-[#ff2d32] hover:bg-[#ff2d32] hover:text-black"
          >
            <PlusIcon />
            <span>Add Product</span>
          </Link>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Products */}
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#71809a]">
                  Total Products
                </p>

                <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
                  {loading ? "—" : totalProducts}
                </p>

                <p className="mt-2 text-[11px] text-[#9aa5b6]">Products</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f6] text-[#53647e]">
                <PackageIcon />
              </div>
            </div>
          </div>

          {/* Active Products */}
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div>
              <p className="text-[12px] font-medium text-[#71809a]">
                Active Products
              </p>

              <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
                {loading ? "—" : activeProducts}
              </p>

              <div className="mt-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />

                <span className="text-[11px] text-[#71809a]">
                  Currently active
                </span>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div>
              <p className="text-[12px] font-medium text-[#71809a]">Featured</p>

              <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
                {loading ? "—" : featuredProducts}
              </p>

              <p className="mt-2 text-[11px] text-[#71809a]">
                Featured products
              </p>
            </div>
          </div>

          {/* Low Stock */}
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div>
              <p className="text-[12px] font-medium text-[#71809a]">
                Low Stock
              </p>

              <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
                {loading ? "—" : lowStockProducts}
              </p>

              <p className="mt-2 text-[11px] text-[#71809a]">Needs attention</p>
            </div>
          </div>
        </section>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <section className="mb-5 rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] font-medium text-[#dc2626]">{error}</p>

              <button
                type="button"
                onClick={loadProducts}
                className="inline-flex h-[34px] items-center justify-center rounded-[8px] bg-black px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#ff2d32] hover:text-black"
              >
                Try Again
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            FILTER BAR
        ====================================================== */}
        <section className="mb-5 rounded-[14px] border border-[#e1e6ed] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {/* Search */}
            <div className="relative md:col-span-2 xl:col-span-1">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b98ab]">
                <SearchIcon />
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="h-[44px] w-full rounded-[9px] border border-[#dce2ea] bg-white pl-11 pr-4 text-[13px] text-[#17233b] outline-none transition-colors placeholder:text-[#9ba6b6] focus:border-[#17233b]"
              />
            </div>

            {/* Collection */}
            <select
              value={collection}
              onChange={(event) => setCollection(event.target.value)}
              className="h-[44px] rounded-[9px] border border-[#dce2ea] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
            >
              <option>All Collections</option>

              {collections.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-[44px] rounded-[9px] border border-[#dce2ea] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
            >
              <option>All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-[44px] rounded-[9px] border border-[#dce2ea] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
            >
              <option>All Status</option>

              <option>Active</option>

              <option>Inactive</option>

              <option>Out of Stock</option>
            </select>
          </div>
        </section>

        {/* =====================================================
            PRODUCTS TABLE
        ====================================================== */}
        <section className="overflow-hidden rounded-[14px] border border-[#e1e6ed] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="text-[#53627a]">
                <LoadingIcon />
              </div>

              <p className="mt-3 text-[13px] font-medium text-[#53627a]">
                Loading products...
              </p>

              <p className="mt-1 text-[11px] text-[#9aa5b6]">
                Fetching products from Supabase.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#dfe4eb] bg-[#f3f6f9]">
                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Image
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Product
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Collection
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Category
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Price
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Stock
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Featured
                      </th>

                      <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-[#e1e5ea] last:border-b-0 hover:bg-[#fafbfc]"
                      >
                        {/* Image */}
                        <td className="px-5 py-3">
                          <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-[9px] bg-[#eef1f4]">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <PackageIcon />
                            )}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-[13px] font-semibold text-[#17233b]">
                              {product.name}
                            </p>

                            <p className="mt-1 text-[11px] text-[#71809a]">
                              {product.sku}
                            </p>
                          </div>
                        </td>

                        {/* Collection */}
                        <td className="px-4 py-3 text-[12px] text-[#17233b]">
                          {product.collection}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-[12px] text-[#17233b]">
                          {product.category}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-[12px] font-semibold text-[#17233b]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3 text-[12px] text-[#17233b]">
                          {product.stock}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={[
                              "inline-flex rounded-full px-2.5 py-1",
                              "text-[10px] font-semibold",
                              product.status === "Active"
                                ? "bg-[#dcfce7] text-[#15803d]"
                                : product.status === "Out of Stock"
                                  ? "bg-[#fee2e2] text-[#dc2626]"
                                  : "bg-[#f1f5f9] text-[#64748b]",
                            ].join(" ")}
                          >
                            {product.status}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-4 py-3">
                          {product.featured ? (
                            <span className="inline-flex rounded-full bg-[#fef3c7] px-2.5 py-1 text-[10px] font-semibold text-[#a16207]">
                              Featured
                            </span>
                          ) : (
                            <span className="text-[12px] text-[#9aa5b6]">
                              —
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3">
                          <div className="flex justify-end">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#cddffb] bg-[#f8fbff] px-3 text-[11px] font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff]"
                            >
                              <EditIcon />
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards */}
              <div className="divide-y divide-[#e1e5ea] lg:hidden">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="p-4 sm:p-5">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#eef1f4]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <PackageIcon />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate text-[14px] font-semibold text-[#17233b]">
                              {product.name}
                            </h2>

                            <p className="mt-1 text-[11px] text-[#71809a]">
                              {product.sku}
                            </p>
                          </div>

                          {product.featured && (
                            <span className="shrink-0 rounded-full bg-[#fef3c7] px-2 py-1 text-[9px] font-semibold text-[#a16207]">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] text-[#53627a]">
                            {product.collection}
                          </span>

                          <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] text-[#53627a]">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom row */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#edf0f3] pt-4">
                      <div className="flex items-center gap-5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-[#8b98ab]">
                            Price
                          </p>

                          <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-[#8b98ab]">
                            Stock
                          </p>

                          <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                            {product.stock}
                          </p>
                        </div>

                        <span
                          className={[
                            "rounded-full px-2.5 py-1",
                            "text-[10px] font-semibold",
                            product.status === "Active"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : product.status === "Out of Stock"
                                ? "bg-[#fee2e2] text-[#dc2626]"
                                : "bg-[#f1f5f9] text-[#64748b]",
                          ].join(" ")}
                        >
                          {product.status}
                        </span>
                      </div>

                      {/* Edit */}
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#cddffb] bg-[#f8fbff] px-3 text-[11px] font-semibold text-[#2563eb]"
                      >
                        <EditIcon />
                        Edit
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Empty state */}
              {filteredProducts.length === 0 && (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f7] text-[#7b8799]">
                    <PackageIcon />
                  </div>

                  <h3 className="mt-4 text-[15px] font-semibold text-[#17233b]">
                    {products.length === 0
                      ? "No products yet"
                      : "No products found"}
                  </h3>

                  <p className="mt-1 max-w-[320px] text-[12px] text-[#7b8799]">
                    {products.length === 0
                      ? "Create your first product from the Add Product page."
                      : "Try changing your search or filter options."}
                  </p>

                  {products.length === 0 && (
                    <Link
                      href="/admin/products/add"
                      className="mt-4 inline-flex h-[38px] items-center gap-2 rounded-[8px] bg-black px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#ff2d32] hover:text-black"
                    >
                      <PlusIcon />
                      Add Product
                    </Link>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-col gap-2 border-t border-[#e1e5ea] bg-[#fafbfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[#7b8799]">
                  Showing{" "}
                  <span className="font-semibold text-[#53627a]">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#53627a]">
                    {products.length}
                  </span>{" "}
                  products
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
  );
}
