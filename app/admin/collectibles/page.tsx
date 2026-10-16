"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
type CollectibleStatus = "Active" | "Inactive" | "Out of Stock";
type CollectibleImage = {
  image_url: string;
  sort_order?: number;
  is_primary?: boolean;
};
type Collectible = {
  id: string;
  name: string;
  sku: string;
  image: string;
  collection: string;
  category: string;
  price: number;
  stock: number;
  status: CollectibleStatus;
  featured: boolean;
  collectible_images?: CollectibleImage[];
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
function TrashIcon() {
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
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}
function CollectibleIcon() {
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
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5" />
      <path d="M12 12v9" />
      <path d="M8 5.2 16 10" />
    </svg>
  );
}
export default function CollectiblesPage() {
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState("All Collections");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Collectible | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const loadCollectibles = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch("/api/admin/collectibles", {
          method: "GET",
          cache: "no-store",
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(result?.error || "Unable to load collectibles.");
        }
        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result?.collectibles)
            ? result.collectibles
            : [];
        const mappedCollectibles: Collectible[] = rows.map((item: any) => {
          const images = Array.isArray(item.collectible_images)
            ? [...item.collectible_images].sort((a, b) => {
                if (a?.is_primary !== b?.is_primary) {
                  return a?.is_primary ? -1 : 1;
                }
                return (a?.sort_order ?? 0) - (b?.sort_order ?? 0);
              })
            : [];
          return {
            id: String(item.id),
            name: String(item.name ?? ""),
            sku: String(item.sku ?? ""),
            image: images[0]?.image_url ?? item.image_url ?? "",
            collection: String(item.collection ?? ""),
            category: String(item.category ?? ""),
            price: Number(item.price ?? 0),
            stock: Number(item.stock ?? 0),
            status: item.status as CollectibleStatus,
            featured: Boolean(item.featured),
            collectible_images: images,
          };
        });
        setCollectibles(mappedCollectibles);
      } catch (loadError) {
        console.error("Failed to load collectibles:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load collectibles.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadCollectibles();
  }, []);
  const totalCollectibles = collectibles.length;
  const activeCollectibles = collectibles.filter(
    (item) => item.status === "Active",
  ).length;
  const featuredCollectibles = collectibles.filter(
    (item) => item.featured,
  ).length;
  const lowStockCollectibles = collectibles.filter(
    (item) => item.stock > 0 && item.stock <= 5,
  ).length;
  const collections = useMemo(
    () =>
      Array.from(new Set(collectibles.map((item) => item.collection))).filter(
        Boolean,
      ),
    [collectibles],
  );
  const categories = useMemo(
    () =>
      Array.from(new Set(collectibles.map((item) => item.category))).filter(
        Boolean,
      ),
    [collectibles],
  );
  const filteredCollectibles = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return collectibles.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.name.toLowerCase().includes(searchValue) ||
        item.sku.toLowerCase().includes(searchValue);
      const matchesCollection =
        collection === "All Collections" || item.collection === collection;
      const matchesCategory =
        category === "All Categories" || item.category === category;
      const matchesStatus = status === "All Status" || item.status === status;
      return (
        matchesSearch && matchesCollection && matchesCategory && matchesStatus
      );
    });
  }, [collectibles, search, collection, category, status]);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      setError("");
      const response = await fetch(
        `/api/admin/collectibles/${deleteTarget.id}`,
        {
          method: "DELETE",
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to delete collectible.");
      }
      setCollectibles((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (deleteError) {
      console.error("Failed to delete collectible:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete collectible.",
      );
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17233b]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7 lg:px-9">
        <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-[3px] w-8 bg-[#ff2d32]" />
              <span className="font-bebas-neue text-[12px] tracking-[0.18em] text-[#8a96aa]">
                THE BACKSTORE
              </span>
            </div>
            <h1 className="font-bebas-neue text-[42px] leading-none tracking-[0.02em] text-[#17233b] sm:text-[48px]">
              COLLECTIBLES
            </h1>
            <p className="mt-2 text-[14px] text-[#71809a]">
              Manage your collectibles, inventory and collections.
            </p>
          </div>
          <Link
            href="/admin/collectibles/add"
            className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2 rounded-[10px] border border-black bg-black px-6 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all duration-200 hover:border-[#ff2d32] hover:bg-[#ff2d32] hover:text-black"
          >
            <PlusIcon />
            <span>Add Collectible</span>
          </Link>
        </section>
        <div className="mb-6 lg:hidden">
          <Link
            href="/admin/collectibles/add"
            className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] border border-black bg-black px-5 text-[12px] font-semibold text-white shadow-sm transition-all duration-200 hover:border-[#ff2d32] hover:bg-[#ff2d32] hover:text-black"
          >
            <PlusIcon />
            <span>Add Collectible</span>
          </Link>
        </div>
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#71809a]">
                  Total Collectibles
                </p>
                <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
                  {totalCollectibles}
                </p>
                <p className="mt-2 text-[11px] text-[#9aa5b6]">Collectibles</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2f6] text-[#53647e]">
                <CollectibleIcon />
              </div>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <p className="text-[12px] font-medium text-[#71809a]">
              Active Collectibles
            </p>
            <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
              {activeCollectibles}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] text-[#71809a]">
                Currently active
              </span>
            </div>
          </div>
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <p className="text-[12px] font-medium text-[#71809a]">Featured</p>
            <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
              {featuredCollectibles}
            </p>
            <p className="mt-2 text-[11px] text-[#71809a]">
              Featured collectibles
            </p>
          </div>
          <div className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <p className="text-[12px] font-medium text-[#71809a]">Low Stock</p>
            <p className="mt-2 text-[28px] font-bold leading-none text-[#17233b]">
              {lowStockCollectibles}
            </p>
            <p className="mt-2 text-[11px] text-[#71809a]">Needs attention</p>
          </div>
        </section>
        <section className="mb-5 rounded-[14px] border border-[#e1e6ed] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative md:col-span-2 xl:col-span-1">
              <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b98ab]">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search collectibles..."
                className="h-[44px] w-full rounded-[9px] border border-[#dce2ea] bg-white pl-11 pr-4 text-[13px] text-[#17233b] outline-none transition-colors placeholder:text-[#9ba6b6] focus:border-[#17233b]"
              />
            </div>
            <select
              value={collection}
              onChange={(event) => setCollection(event.target.value)}
              className="h-[44px] rounded-[9px] border border-[#dce2ea] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
            >
              <option>All Collections</option>
              {collections.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-[44px] rounded-[9px] border border-[#dce2ea] bg-white px-3.5 text-[13px] text-[#52627a] outline-none focus:border-[#17233b]"
            >
              <option>All Categories</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
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
        {error && (
          <section className="mb-5 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
            <p className="text-[12px] font-medium text-[#dc2626]">{error}</p>
          </section>
        )}
        {isLoading && (
          <section className="mb-5 rounded-[14px] border border-[#e1e6ed] bg-white px-4 py-3">
            <p className="text-[12px] font-medium text-[#71809a]">
              Loading collectibles...
            </p>
          </section>
        )}
        <section className="overflow-hidden rounded-[14px] border border-[#e1e6ed] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead>
                <tr className="border-b border-[#dfe4eb] bg-[#f3f6f9]">
                  <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                    Image
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-[#53627a]">
                    Collectible
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
                {filteredCollectibles.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#e1e5ea] last:border-b-0 hover:bg-[#fafbfc]"
                  >
                    <td className="px-5 py-3">
                      <div className="flex h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-[9px] bg-[#eef1f4]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <CollectibleIcon />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[#17233b]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] text-[#71809a]">
                        {item.sku}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#17233b]">
                      {item.collection}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#17233b]">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-[#17233b]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#17233b]">
                      {item.stock}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold",
                          item.status === "Active"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : item.status === "Out of Stock"
                              ? "bg-[#fee2e2] text-[#dc2626]"
                              : "bg-[#f1f5f9] text-[#64748b]",
                        ].join(" ")}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.featured ? (
                        <span className="inline-flex rounded-full bg-[#fef3c7] px-2.5 py-1 text-[10px] font-semibold text-[#a16207]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#9aa5b6]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/collectibles/${item.id}/edit`}
                            className="inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#17233b] bg-white px-3 text-[11px] font-semibold text-[#17233b] transition-colors hover:bg-[#17233b] hover:text-white"
                          >
                            <EditIcon />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="inline-flex h-[34px] items-center justify-center rounded-[8px] border border-[#fecaca] bg-[#fffafa] px-3 text-[#dc2626] transition-colors hover:bg-[#fef2f2]"
                            aria-label={`Delete ${item.name}`}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-[#e1e5ea] lg:hidden">
            {filteredCollectibles.map((item) => (
              <article key={item.id} className="p-4 sm:p-5">
                <div className="flex gap-4">
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#eef1f4]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <CollectibleIcon />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-semibold text-[#17233b]">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-[11px] text-[#71809a]">
                          {item.sku}
                        </p>
                      </div>
                      {item.featured && (
                        <span className="shrink-0 rounded-full bg-[#fef3c7] px-2 py-1 text-[9px] font-semibold text-[#a16207]">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] text-[#53627a]">
                        {item.collection}
                      </span>
                      <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[10px] text-[#53627a]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#edf0f3] pt-4">
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-[#8b98ab]">
                        Price
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-[#8b98ab]">
                        Stock
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                        {item.stock}
                      </p>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        item.status === "Active"
                          ? "bg-[#dcfce7] text-[#15803d]"
                          : item.status === "Out of Stock"
                            ? "bg-[#fee2e2] text-[#dc2626]"
                            : "bg-[#f1f5f9] text-[#64748b]",
                      ].join(" ")}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/collectibles/${item.id}/edit`}
                      className="inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#cddffb] bg-[#f8fbff] px-3 text-[11px] font-semibold text-[#2563eb]"
                    >
                      <EditIcon />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="inline-flex h-[34px] items-center justify-center rounded-[8px] border border-[#fecaca] bg-[#fffafa] px-3 text-[#dc2626]"
                      aria-label={`Delete ${item.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filteredCollectibles.length === 0 && (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f4f7] text-[#7b8799]">
                <CollectibleIcon />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-[#17233b]">
                No collectibles found
              </h3>
              <p className="mt-1 max-w-[320px] text-[12px] text-[#7b8799]">
                Try changing your search or filter options.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2 border-t border-[#e1e5ea] bg-[#fafbfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-[#7b8799]">
              Showing{" "}
              <span className="font-semibold text-[#53627a]">
                {filteredCollectibles.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#53627a]">
                {collectibles.length}
              </span>{" "}
              collectibles
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#a0a9b6]">
              The Backstore Admin
            </p>
          </div>
        </section>
      </div>
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[420px] rounded-[14px] border border-[#e1e6ed] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]">
              <TrashIcon />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-[#17233b]">
              Delete collectible?
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-[#71809a]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#17233b]">
                {deleteTarget.name}
              </span>
              ? This will permanently remove the collectible and its images.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="h-[42px] rounded-[9px] border border-[#d7dfe9] bg-white px-5 text-[12px] font-semibold text-[#52627a] transition-colors hover:border-[#17233b] hover:text-[#17233b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-[42px] rounded-[9px] bg-[#dc2626] px-5 text-[12px] font-semibold text-white transition-colors hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Collectible"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
