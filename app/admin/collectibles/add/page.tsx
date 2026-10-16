"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
type ImageSlot = {
  id: number;
  file: File | null;
  preview: string;
};
const collections = [
  "Anime",
  "Comic",
  "Kollywood",
  "Sports",
  "Cinephile",
  "F1",
  "Football",
  "Cricket",
  "Memes",
  "Motivational Quotes",
  "Garage Culture",
  "Music",
];
const categories = [
  "Anime Toys",
  "Posters",
  "3D Toys",
  "Frames",
  "Die Cast Models",
];
const initialImageSlots: ImageSlot[] = [
  { id: 1, file: null, preview: "" },
  { id: 2, file: null, preview: "" },
  { id: 3, file: null, preview: "" },
  { id: 4, file: null, preview: "" },
];
function ArrowLeftIcon() {
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
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}
function ChevronDownIcon() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      width="17"
      height="17"
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
function InputLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-[12px] font-semibold text-[#33415c]">
      {children}
      {required && <span className="ml-1 text-[#ff2d32]">*</span>}
    </label>
  );
}
const inputClass =
  "h-[44px] w-full rounded-[9px] border border-[#d7dfe9] bg-white px-3.5 text-[13px] text-[#17233b] outline-none transition-colors placeholder:text-[#9ba8ba] focus:border-[#17233b] focus:ring-1 focus:ring-[#17233b]/10";
const selectClass =
  "h-[44px] w-full appearance-none rounded-[9px] border border-[#d7dfe9] bg-white px-3.5 pr-10 text-[13px] text-[#17233b] outline-none transition-colors focus:border-[#17233b] focus:ring-1 focus:ring-[#17233b]/10";
export default function AddCollectiblePage() {
  const [images, setImages] = useState<ImageSlot[]>(initialImageSlots);
  const [collectibleName, setCollectibleName] = useState("");
  const [sku, setSku] = useState("");
  const [collection, setCollection] = useState("");
  const [category, setCategory] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const discount = useMemo(() => {
    const mrpValue = Number(mrp);
    const priceValue = Number(sellingPrice);
    if (!mrpValue || !priceValue || priceValue >= mrpValue) {
      return 0;
    }
    return Math.round(((mrpValue - priceValue) / mrpValue) * 100);
  }, [mrp, sellingPrice]);
  const handleImageChange = (
    slotId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setMessage("Each image must be smaller than 15MB.");
      event.target.value = "";
      return;
    }
    const preview = URL.createObjectURL(file);
    setMessage("");
    setImages((current) =>
      current.map((slot) => {
        if (slot.id !== slotId) {
          return slot;
        }
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
        return {
          ...slot,
          file,
          preview,
        };
      }),
    );
    event.target.value = "";
  };
  const removeImage = (slotId: number) => {
    setImages((current) =>
      current.map((slot) => {
        if (slot.id !== slotId) {
          return slot;
        }
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
        return {
          ...slot,
          file: null,
          preview: "",
        };
      }),
    );
  };
  const handleSave = async () => {
    setMessage("");
    if (!collectibleName.trim()) {
      setMessage("Collectible name is required.");
      return;
    }
    if (!sku.trim()) {
      setMessage("SKU is required.");
      return;
    }
    if (!collection) {
      setMessage("Please select a collection.");
      return;
    }
    if (!category) {
      setMessage("Please select a category.");
      return;
    }
    if (!mrp || Number(mrp) < 0) {
      setMessage("Please enter a valid MRP.");
      return;
    }
    if (!sellingPrice || Number(sellingPrice) < 0) {
      setMessage("Please enter a valid selling price.");
      return;
    }
    if (Number(sellingPrice) > Number(mrp)) {
      setMessage("Selling price cannot be greater than MRP.");
      return;
    }
    if (!stock || Number(stock) < 0) {
      setMessage("Please enter a valid stock quantity.");
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", collectibleName.trim());
      formData.append("sku", sku.trim());
      formData.append("collection", collection);
      formData.append("category", category);
      formData.append("mrp", mrp);
      formData.append("price", sellingPrice);
      formData.append("stock", stock);
      formData.append("description", description.trim());
      formData.append("status", status);
      formData.append("featured", String(featured));
      images.forEach((slot) => {
        if (slot.file) formData.append("images", slot.file);
      });
      const response = await fetch("/api/admin/collectibles", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Failed to create collectible.");
      }
      router.push("/admin/collectibles");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to create collectible. Please try again.",
      );
      setIsSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17233b]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-7 lg:px-9">
        <div className="mb-7">
          <Link
            href="/admin/collectibles"
            className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#687790] transition-colors hover:text-black"
          >
            <ArrowLeftIcon />
            Back to Collectibles
          </Link>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-[3px] w-8 bg-[#ff2d32]" />
              <span className="font-bebas-neue text-[12px] tracking-[0.18em] text-[#8a96aa]">
                COLLECTIBLE MANAGEMENT
              </span>
            </div>
            <h1 className="font-bebas-neue text-[42px] leading-none tracking-[0.02em] text-[#17233b] sm:text-[48px]">
              ADD COLLECTIBLE
            </h1>
            <p className="mt-2 text-[14px] text-[#71809a]">
              Create a new collectible for The Backstore.
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-[#17233b]">
                Collectible Images
              </h2>
              <p className="mt-1 text-[12px] text-[#7b8799]">
                Upload up to 4 images. The first image will be used as the
                primary image.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {images.map((slot, index) => (
                <div key={slot.id} className="relative aspect-square">
                  {slot.preview ? (
                    <div className="relative h-full w-full overflow-hidden rounded-[10px] border border-[#d7dfe9] bg-[#f5f6f8]">
                      <img
                        src={slot.preview}
                        alt={`Collectible image ${slot.id}`}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(slot.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow-md transition-colors hover:bg-[#ff2d32] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Remove image ${slot.id}`}
                      >
                        <XIcon />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-black px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white">
                          Primary
                        </span>
                      )}
                    </div>
                  ) : (
                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-[#cbd5e1] bg-[#fafbfc] text-[#8a96aa] transition-colors hover:border-[#17233b] hover:bg-[#f5f7f9]">
                      <UploadIcon />
                      <span className="mt-2 text-[11px] font-semibold">
                        {index === 0 ? "Primary Image" : "Upload Image"}
                      </span>
                      <span className="mt-1 text-[9px] text-[#a0a9b6]">
                        JPG, PNG, WEBP
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => handleImageChange(slot.id, event)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                BASIC INFORMATION
              </h2>
              <p className="mt-1 text-[12px] text-[#7b8799]">
                Add the main information about this collectible.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <InputLabel required>Collectible Name</InputLabel>
                <input
                  type="text"
                  value={collectibleName}
                  onChange={(event) => setCollectibleName(event.target.value)}
                  placeholder="e.g. Naruto 3D Figure"
                  className={inputClass}
                />
              </div>
              <div>
                <InputLabel required>SKU</InputLabel>
                <input
                  type="text"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="e.g. COL-001"
                  className={inputClass}
                />
              </div>
              <div>
                <InputLabel required>Collection</InputLabel>
                <div className="relative">
                  <select
                    value={collection}
                    onChange={(event) => setCollection(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Collection</option>
                    {collections.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
              <div>
                <InputLabel required>Category</InputLabel>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                PRICING & INVENTORY
              </h2>
              <p className="mt-1 text-[12px] text-[#7b8799]">
                Set pricing and available inventory for this collectible.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <InputLabel required>MRP</InputLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#71809a]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={mrp}
                    onChange={(event) => setMrp(event.target.value)}
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
              <div>
                <InputLabel required>Selling Price</InputLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#71809a]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={sellingPrice}
                    onChange={(event) => setSellingPrice(event.target.value)}
                    placeholder="0"
                    className={`${inputClass} pl-8`}
                  />
                </div>
                {discount > 0 && (
                  <p className="mt-1.5 text-[10px] font-medium text-[#16a34a]">
                    {discount}% discount
                  </p>
                )}
              </div>
              <div>
                <InputLabel required>Stock</InputLabel>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>
          </section>
          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                DESCRIPTION
              </h2>
              <p className="mt-1 text-[12px] text-[#7b8799]">
                Add a description for the collectible.
              </p>
            </div>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter collectible description..."
              rows={6}
              className="w-full resize-none rounded-[9px] border border-[#d7dfe9] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#17233b] outline-none transition-colors placeholder:text-[#9ba8ba] focus:border-[#17233b] focus:ring-1 focus:ring-[#17233b]/10"
            />
          </section>
          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                PRODUCT SETTINGS
              </h2>
              <p className="mt-1 text-[12px] text-[#7b8799]">
                Control how this collectible appears in the store.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <InputLabel>Status</InputLabel>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className={selectClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
              <div>
                <InputLabel>Featured Collectible</InputLabel>
                <button
                  type="button"
                  onClick={() => setFeatured((current) => !current)}
                  className="flex h-[44px] w-full items-center justify-between rounded-[9px] border border-[#d7dfe9] bg-white px-3.5"
                >
                  <span className="text-[13px] text-[#17233b]">
                    Show as featured
                  </span>
                  <span
                    className={[
                      "relative h-5 w-9 rounded-full transition-colors",
                      featured ? "bg-[#ff2d32]" : "bg-[#cbd5e1]",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                        featured ? "translate-x-4" : "translate-x-0.5",
                      ].join(" ")}
                    />
                  </span>
                </button>
              </div>
            </div>
          </section>
          {message && (
            <div className="rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <p className="text-[12px] font-medium text-[#dc2626]">
                {message}
              </p>
            </div>
          )}
          <section className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/collectibles"
              className="inline-flex h-[46px] items-center justify-center rounded-[9px] border border-[#d7dfe9] bg-white px-6 text-[12px] font-semibold text-[#52627a] transition-colors hover:border-[#17233b] hover:text-[#17233b]"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[9px] bg-black px-7 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#ff2d32] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusIcon />
              {isSaving ? "Creating..." : "Create Collectible"}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
