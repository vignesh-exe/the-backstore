"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SizeKey = "XS" | "S" | "M" | "L" | "XL" | "XXL";

type FormState = {
  productName: string;
  sku: string;
  brand: string;
  collection: string;
  category: string;
  gender: string;
  fit: string;
  fabricGsm: string;
  fabricMaterial: string;
  mrp: string;
  sellingPrice: string;
  description: string;

  sizes: Record<SizeKey, number>;

  featured: boolean;
  status: "Active" | "Inactive";

  images: string[];
};

type ApiProductImage = {
  id?: string;
  image_url?: string;
  cloudinary_public_id?: string | null;
  alt_text?: string | null;
  sort_order?: number | null;
  is_primary?: boolean;
};

type ApiProduct = {
  id: string;
  name?: string | null;
  sku?: string | null;
  product_code?: string | null;

  brand?: string | null;

  category?: string | null;
  category_name?: string | null;

  gender?: string | null;
  fit?: string | null;

  fabric?: string | null;
  fabric_gsm?: number | string | null;
  fabric_material?: string | null;

  mrp?: number | string | null;
  price?: number | string | null;

  description?: string | null;

  stock?: number | null;

  sizes?: Partial<Record<SizeKey, number>> | null;

  stock_xs?: number | null;
  stock_s?: number | null;
  stock_m?: number | null;
  stock_l?: number | null;
  stock_xl?: number | null;
  stock_xxl?: number | null;

  tags?: string[] | null;

  featured?: boolean | null;
  is_featured?: boolean | null;

  status?: string | null;
  is_active?: boolean | null;

  image_url?: string | null;
  image_urls?: string[] | null;

  product_images?: ApiProductImage[] | null;
};

const SIZE_KEYS: SizeKey[] = ["XS", "S", "M", "L", "XL", "XXL"];

const COLLECTIONS = [
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

const CATEGORIES = ["Oversized T-Shirt", "Regular T-Shirt"];

const GENDERS = ["Men", "Women", "Unisex"];

const FITS = ["Oversized", "Regular", "Relaxed"];

const EMPTY_FORM: FormState = {
  productName: "",
  sku: "",
  brand: "The Backstore",
  collection: "",
  category: "",
  gender: "Unisex",
  fit: "Oversized",
  fabricGsm: "240",
  fabricMaterial: "GSM Cotton",
  mrp: "",
  sellingPrice: "",
  description: "",

  sizes: {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  },

  featured: false,
  status: "Active",

  images: ["", "", "", ""],
};

function ChevronDownIcon() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowLeftIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function UploadIcon() {
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
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function SaveIcon() {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function formatPrice(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return "₹0";
  }

  return `₹${number.toLocaleString("en-IN")}`;
}

function getProductImages(product: ApiProduct): string[] {
  if (
    Array.isArray(product.product_images) &&
    product.product_images.length > 0
  ) {
    const sortedImages = [...product.product_images].sort((a, b) => {
      if (a.is_primary && !b.is_primary) {
        return -1;
      }

      if (!a.is_primary && b.is_primary) {
        return 1;
      }

      return Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);
    });

    return sortedImages.map((image) => image.image_url || "").filter(Boolean);
  }

  if (Array.isArray(product.image_urls)) {
    return product.image_urls.filter(Boolean);
  }

  if (product.image_url) {
    return [product.image_url];
  }

  return [];
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  /*
   * Total stock is always calculated
   * from the individual sizes.
   */
  const totalStock = useMemo(() => {
    return SIZE_KEYS.reduce(
      (total, size) => total + Number(form.sizes[size] || 0),
      0,
    );
  }, [form.sizes]);

  /*
   * Load existing product from Supabase
   * through the admin API.
   */
  useEffect(() => {
    if (!productId) {
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message || data?.error || "Failed to load product.",
          );
        }

        const product: ApiProduct | null = data?.product ?? data;

        if (!product) {
          throw new Error("Product not found.");
        }

        /*
         * Product images now come primarily
         * from the product_images table.
         */
        const existingImages = getProductImages(product);

        const normalizedImages = [
          existingImages[0] ?? "",
          existingImages[1] ?? "",
          existingImages[2] ?? "",
          existingImages[3] ?? "",
        ];

        /*
         * Collection is stored as the first
         * tag for the current product schema.
         *
         * Example:
         *
         * tags = [
         *   "Anime",
         *   "Unisex",
         *   "Oversized"
         * ]
         */
        const tags = Array.isArray(product.tags) ? product.tags : [];

        const collection = tags[0] ?? "";

        /*
         * Sizes are stored as a JSON object.
         *
         * We also support the individual
         * stock_xs, stock_s etc. fields so
         * older products continue to work.
         */
        const existingSizes =
          product.sizes && typeof product.sizes === "object"
            ? product.sizes
            : {};

        const isInactive =
          product.is_active === false ||
          String(product.status ?? "").toLowerCase() === "inactive";

        const fabricValue = product.fabric?.trim() || "";

        const parsedFabricGsm =
          product.fabric_gsm !== undefined && product.fabric_gsm !== null
            ? String(product.fabric_gsm)
            : (fabricValue.match(/\\d+(?:\\.\\d+)?/)?.[0] ?? "240");

        const parsedFabricMaterial =
          product.fabric_material?.trim() ||
          (fabricValue
            ? fabricValue.replace(/^\\d+(?:\\.\\d+)?\\s*/i, "").trim()
            : "GSM Cotton") ||
          "GSM Cotton";

        setForm({
          productName: product.name ?? "",

          sku: product.sku ?? product.product_code ?? "",

          brand: "The Backstore",

          collection,

          category: product.category ?? product.category_name ?? "",

          gender: product.gender ?? tags[1] ?? "Unisex",

          fit: product.fit ?? tags[2] ?? "Oversized",

          fabricGsm: parsedFabricGsm,

          fabricMaterial: parsedFabricMaterial,

          mrp:
            product.mrp !== undefined && product.mrp !== null
              ? String(product.mrp)
              : "",

          sellingPrice:
            product.price !== undefined && product.price !== null
              ? String(product.price)
              : "",

          description: product.description ?? "",

          sizes: {
            XS: Number(existingSizes.XS ?? product.stock_xs ?? 0),

            S: Number(existingSizes.S ?? product.stock_s ?? 0),

            M: Number(existingSizes.M ?? product.stock_m ?? 0),

            L: Number(existingSizes.L ?? product.stock_l ?? 0),

            XL: Number(existingSizes.XL ?? product.stock_xl ?? 0),

            XXL: Number(existingSizes.XXL ?? product.stock_xxl ?? 0),
          },

          featured: Boolean(product.is_featured ?? product.featured ?? false),

          status: isInactive ? "Inactive" : "Active",

          images: normalizedImages,
        });

        setImageFiles([null, null, null, null]);
      } catch (err) {
        console.error("Load product error:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load this product.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSize = (size: SizeKey, value: string) => {
    const parsed = Number(value);

    setForm((current) => ({
      ...current,

      sizes: {
        ...current.sizes,

        [size]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
      },
    }));
  };

  /*
   * Featured product toggle.
   */
  const toggleFeatured = () => {
    setForm((current) => ({
      ...current,
      featured: !current.featured,
    }));
  };

  /*
   * Image selection.
   *
   * New files are kept locally for now.
   * The actual Cloudinary upload will be
   * handled by the backend upload flow.
   */
  const handleImageChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");

        return;
      }

      setError("");

      const previewUrl = URL.createObjectURL(file);

      setImageFiles((current) => {
        const next = [...current];

        next[index] = file;

        return next;
      });

      setForm((current) => {
        const images = [...current.images];

        images[index] = previewUrl;

        return {
          ...current,
          images,
        };
      });
    };

  const removeImage = (index: number) => {
    setForm((current) => {
      const images = [...current.images];

      images[index] = "";

      return {
        ...current,
        images,
      };
    });

    setImageFiles((current) => {
      const next = [...current];

      next[index] = null;

      return next;
    });
  };

  /*
   * Build the tags array expected by
   * the current Supabase product structure.
   *
   * Collection is the first tag.
   * Gender is the second tag.
   * Fit is the third tag.
   */
  const buildTags = () => {
    return [form.collection.trim(), form.gender.trim(), form.fit.trim()].filter(
      Boolean,
    );
  };

  /*
   * Save edited product.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!productId) {
      setError("Product ID is missing.");

      return;
    }

    if (!form.productName.trim()) {
      setError("Product name is required.");

      return;
    }

    if (!form.sku.trim()) {
      setError("SKU is required.");

      return;
    }

    if (!form.collection) {
      setError("Please select a collection.");

      return;
    }

    if (!form.category) {
      setError("Please select a category.");

      return;
    }

    if (!form.sellingPrice) {
      setError("Selling price is required.");

      return;
    }

    const sellingPrice = Number(form.sellingPrice);

    const mrp = Number(form.mrp || 0);

    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      setError("Please enter a valid selling price.");

      return;
    }

    if (form.mrp && (!Number.isFinite(mrp) || mrp < 0)) {
      setError("Please enter a valid MRP.");

      return;
    }

    if (mrp > 0 && sellingPrice > mrp) {
      setError("Selling price cannot be greater than MRP.");

      return;
    }

    try {
      setSaving(true);

      /*
       * Only keep actual remote URLs.
       *
       * blob: URLs are browser-only previews
       * and must never be stored in Supabase.
       */
      const existingRemoteImages = form.images.filter(
        (image) => image && !image.startsWith("blob:"),
      );

      /*
       * IMPORTANT:
       *
       * New local image files are intentionally
       * not sent as blob URLs.
       *
       * Cloudinary upload will be connected
       * through the backend upload endpoint.
       */
      const payload = {
        name: form.productName.trim(),

        sku: form.sku.trim(),

        product_code: form.sku.trim(),

        brand: "The Backstore",

        /*
         * Keep collection in the payload
         * for API compatibility.
         */
        collection: form.collection.trim(),

        category: form.category.trim(),

        gender: form.gender.trim(),

        fit: form.fit.trim(),

        fabric: `${form.fabricGsm.trim()} ${form.fabricMaterial.trim()}`.trim(),

        fabric_gsm: Number(form.fabricGsm) || 0,

        fabric_material: form.fabricMaterial.trim(),

        /*
         * Current Supabase structure uses
         * tags for collection / gender / fit.
         */
        tags: buildTags(),

        mrp,

        price: sellingPrice,

        description: form.description.trim(),

        stock: totalStock,

        sizes: form.sizes,

        /*
         * Existing Cloudinary URLs only.
         */
        image_urls: existingRemoteImages,

        image_url: existingRemoteImages[0] ?? "",

        is_featured: form.featured,

        featured: form.featured,

        is_active: form.status === "Active",

        status: form.status,
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to update product.",
        );
      }

      setSuccess("Product updated successfully.");

      /*
       * Give the success message a moment
       * to appear before returning to products.
       */
      setTimeout(() => {
        router.push("/admin/products");

        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Update product error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the product.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] px-5 py-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="h-[30px] w-[180px] animate-pulse rounded bg-[#e6ebf1]" />

          <div className="mt-2 h-[18px] w-[260px] animate-pulse rounded bg-[#e6ebf1]" />

          <div className="mt-7 h-[400px] animate-pulse rounded-[18px] border border-[#e1e7ee] bg-white" />

          <div className="mt-5 h-[260px] animate-pulse rounded-[18px] border border-[#e1e7ee] bg-white" />
        </div>
      </main>
    );
  }

  if (error && !form.productName && !loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] px-5 py-8">
        <div className="mx-auto max-w-[1180px]">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="mb-6 inline-flex items-center gap-1 text-[13px] font-medium text-[#52627a] transition-colors hover:text-black"
          >
            <ArrowLeftIcon />
            Back to Products
          </button>

          <div className="rounded-[18px] border border-[#f0caca] bg-white p-8">
            <h1 className="font-bebas-neue text-[28px] text-[#17233b]">
              PRODUCT NOT FOUND
            </h1>

            <p className="mt-2 text-[14px] text-[#7b8799]">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-5 py-8">
      <div className="mx-auto max-w-[1180px]">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="mb-3 inline-flex items-center gap-1 text-[13px] font-medium text-[#52627a] transition-colors hover:text-black"
            >
              <ArrowLeftIcon />
              Back to Products
            </button>

            <h1 className="font-bebas-neue text-[32px] leading-none tracking-[0.01em] text-[#17233b] sm:text-[36px]">
              EDIT PRODUCT
            </h1>

            <p className="mt-2 text-[13px] text-[#7b8799]">
              Update the product information and save your changes.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="h-[42px] rounded-[9px] border border-[#d7dee7] bg-white px-5 text-[13px] font-semibold text-[#52627a] transition-colors hover:bg-[#f8fafc]"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-product-form"
              disabled={saving}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-black px-5 text-[13px] font-semibold text-white transition-all hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SaveIcon />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* =====================================================
            MESSAGES
        ====================================================== */}
        {error && (
          <div className="mt-5 rounded-[10px] border border-[#ffd0d0] bg-[#fff5f5] px-4 py-3 text-[13px] font-medium text-[#d11a2a]">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-[10px] border border-[#bdebcf] bg-[#f0fff5] px-4 py-3 text-[13px] font-medium text-[#16803a]">
            <CheckIcon />
            {success}
          </div>
        )}

        <form
          id="edit-product-form"
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >
          {/* =====================================================
              PRODUCT IMAGES
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              PRODUCT IMAGES
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Update the images displayed for this product.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {form.images.map((image, index) => (
                <div key={index}>
                  <p className="mb-2 text-[11px] font-semibold text-[#52627a]">
                    Image {index + 1}
                  </p>

                  <div className="relative">
                    <label
                      htmlFor={`product-image-${index}`}
                      className={[
                        "group flex h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed",
                        image
                          ? "border-[#cfd8e3] bg-white"
                          : "border-[#d7dfe9] bg-[#fafbfd] hover:bg-[#f6f8fa]",
                      ].join(" ")}
                    >
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="h-full w-full object-contain"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                            <span className="rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-black">
                              Change Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-[#8b98aa]">
                            <ImageIcon />
                          </div>

                          <p className="mt-3 text-[12px] font-medium text-[#52627a]">
                            Upload Image
                          </p>

                          <p className="mt-1 text-[10px] text-[#9aa5b5]">
                            PNG, JPG or WEBP
                          </p>
                        </>
                      )}
                    </label>

                    <input
                      id={`product-image-${index}`}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleImageChange(index)}
                    />

                    {image && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#667085] shadow-sm transition-colors hover:bg-[#fff1f1] hover:text-[#d11a2a]"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>

                  {imageFiles[index] && (
                    <p className="mt-2 truncate text-[10px] text-[#7b8799]">
                      New image selected
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* =====================================================
              BASIC INFORMATION
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              BASIC INFORMATION
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Update the main information about this product.
            </p>

            <div className="mt-6 space-y-5">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="product-name"
                  className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                >
                  Product Name <span className="text-[#ff2d32]">*</span>
                </label>

                <input
                  id="product-name"
                  type="text"
                  value={form.productName}
                  onChange={(event) =>
                    updateField("productName", event.target.value)
                  }
                  placeholder="e.g. Doomsday Oversized Tee"
                  className="h-[50px] w-full rounded-[10px] border border-[#d5dee9] bg-white px-4 text-[14px] text-[#17233b] outline-none transition-all placeholder:text-[#a0aec0] focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                />
              </div>

              {/* SKU + Brand */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-sku"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    SKU <span className="text-[#ff2d32]">*</span>
                  </label>

                  <input
                    id="product-sku"
                    type="text"
                    value={form.sku}
                    onChange={(event) => updateField("sku", event.target.value)}
                    placeholder="e.g. TB-050"
                    className="h-[50px] w-full rounded-[10px] border border-[#d5dee9] bg-white px-4 text-[14px] text-[#17233b] outline-none transition-all placeholder:text-[#a0aec0] focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    Brand
                  </label>

                  <input
                    id="product-brand"
                    type="text"
                    value="The Backstore"
                    readOnly
                    className="h-[50px] w-full cursor-not-allowed rounded-[10px] border border-[#d5dee9] bg-[#f5f7fa] px-4 text-[14px] font-medium text-[#6d7b90] outline-none"
                  />

                  <p className="mt-1.5 text-[10px] text-[#9aa5b5]">
                    Brand is fixed for The Backstore products.
                  </p>
                </div>
              </div>

              {/* Collection + Category */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="collection"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    Collection <span className="text-[#ff2d32]">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="collection"
                      value={form.collection}
                      onChange={(event) =>
                        updateField("collection", event.target.value)
                      }
                      className="h-[50px] w-full appearance-none rounded-[10px] border border-[#d5dee9] bg-white px-4 pr-11 text-[14px] text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                    >
                      <option value="">Select Collection</option>

                      {COLLECTIONS.map((collection) => (
                        <option key={collection} value={collection}>
                          {collection}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#73839a]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    Category <span className="text-[#ff2d32]">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="category"
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      className="h-[50px] w-full appearance-none rounded-[10px] border border-[#d5dee9] bg-white px-4 pr-11 text-[14px] text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                    >
                      <option value="">Select Category</option>

                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#73839a]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>

              {/* Gender + Fit */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    Gender
                  </label>

                  <div className="relative">
                    <select
                      id="gender"
                      value={form.gender}
                      onChange={(event) =>
                        updateField("gender", event.target.value)
                      }
                      className="h-[50px] w-full appearance-none rounded-[10px] border border-[#d5dee9] bg-white px-4 pr-11 text-[14px] text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                    >
                      {GENDERS.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#73839a]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fit"
                    className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                  >
                    Fit
                  </label>

                  <div className="relative">
                    <select
                      id="fit"
                      value={form.fit}
                      onChange={(event) =>
                        updateField("fit", event.target.value)
                      }
                      className="h-[50px] w-full appearance-none rounded-[10px] border border-[#d5dee9] bg-white px-4 pr-11 text-[14px] text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                    >
                      {FITS.map((fit) => (
                        <option key={fit} value={fit}>
                          {fit}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#73839a]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>

              {/* Fabric */}
              <div className="mt-5">
                <label
                  htmlFor="fabric-gsm"
                  className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                >
                  Fabric
                </label>

                <div className="flex h-[50px] w-full overflow-hidden rounded-[10px] border border-[#d5dee9] bg-white transition-all focus-within:border-[#8da0b7] focus-within:ring-2 focus-within:ring-[#17233b]/5">
                  <input
                    id="fabric-gsm"
                    type="number"
                    min="0"
                    value={form.fabricGsm}
                    onChange={(event) =>
                      updateField("fabricGsm", event.target.value)
                    }
                    aria-label="Fabric GSM"
                    className="h-full min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[#17233b] outline-none placeholder:text-[#a0aec0]"
                  />

                  <div className="flex h-full w-[185px] shrink-0 items-center border-l border-[#33415c] bg-[#f1f4f7] px-4 text-[14px] text-[#53627a]">
                    {form.fabricMaterial}
                  </div>
                </div>

                <p className="mt-1.5 text-[10px] text-[#9aa5b5]">
                  Prefilled as 240 GSM Cotton.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              PRICING
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              PRICING
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Set the product's MRP and selling price.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {/* MRP */}
              <div>
                <label
                  htmlFor="mrp"
                  className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                >
                  MRP
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#718096]">
                    ₹
                  </span>

                  <input
                    id="mrp"
                    type="number"
                    min="0"
                    value={form.mrp}
                    onChange={(event) => updateField("mrp", event.target.value)}
                    placeholder="699"
                    className="h-[50px] w-full rounded-[10px] border border-[#d5dee9] bg-white pl-9 pr-4 text-[14px] text-[#17233b] outline-none transition-all placeholder:text-[#a0aec0] focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                  />
                </div>
              </div>

              {/* Selling Price */}
              <div>
                <label
                  htmlFor="selling-price"
                  className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                >
                  Selling Price <span className="text-[#ff2d32]">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#718096]">
                    ₹
                  </span>

                  <input
                    id="selling-price"
                    type="number"
                    min="0"
                    value={form.sellingPrice}
                    onChange={(event) =>
                      updateField("sellingPrice", event.target.value)
                    }
                    placeholder="599"
                    className="h-[50px] w-full rounded-[10px] border border-[#d5dee9] bg-white pl-9 pr-4 text-[14px] text-[#17233b] outline-none transition-all placeholder:text-[#a0aec0] focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              DESCRIPTION
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              DESCRIPTION
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Update the product description.
            </p>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={6}
              placeholder="Write product description..."
              className="mt-6 w-full resize-none rounded-[10px] border border-[#d5dee9] bg-white px-4 py-3 text-[14px] leading-6 text-[#17233b] outline-none transition-all placeholder:text-[#a0aec0] focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
            />
          </section>

          {/* =====================================================
              SIZE INVENTORY
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              SIZE INVENTORY
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Update available stock for each size.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {SIZE_KEYS.map((size) => (
                <div key={size}>
                  <label
                    htmlFor={`size-${size}`}
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#52627a]"
                  >
                    {size}
                  </label>

                  <input
                    id={`size-${size}`}
                    type="number"
                    min="0"
                    value={form.sizes[size]}
                    onChange={(event) => updateSize(size, event.target.value)}
                    className="h-[48px] w-full rounded-[10px] border border-[#d5dee9] bg-white px-3 text-center text-[14px] font-medium text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-[10px] bg-[#f5f7fa] px-4 py-4">
              <div>
                <p className="text-[12px] font-semibold text-[#40516d]">
                  Total Available Stock
                </p>

                <p className="mt-1 text-[10px] text-[#8b98aa]">
                  Automatically calculated from all sizes.
                </p>
              </div>

              <span className="text-[22px] font-bold text-[#17233b]">
                {totalStock}
              </span>
            </div>
          </section>

          {/* =====================================================
              PRODUCT SETTINGS
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
              PRODUCT SETTINGS
            </h2>

            <p className="mt-1 text-[13px] text-[#7b8799]">
              Control the visibility and status of the product.
            </p>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              {/* Featured */}
              <div className="flex min-h-[110px] items-center justify-between rounded-[12px] border border-[#dfe5ec] bg-[#fafbfc] px-5 py-5">
                <div>
                  <p className="text-[15px] font-semibold text-[#17233b]">
                    Featured Product
                  </p>

                  <p className="mt-1 text-[12px] text-[#7b8799]">
                    Show this product in featured sections.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.featured}
                  aria-label="Featured Product"
                  onClick={toggleFeatured}
                  className={[
                    "relative h-[30px] w-[54px] shrink-0 rounded-full",
                    "transition-colors duration-200 ease-in-out",
                    "focus:outline-none focus:ring-2 focus:ring-[#ff2d32]/20",
                    form.featured ? "bg-[#ff2d32]" : "bg-[#cbd5e1]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute left-[4px] top-[4px]",
                      "h-[22px] w-[22px] rounded-full bg-white",
                      "shadow-[0_1px_5px_rgba(0,0,0,0.22)]",
                      "transition-transform duration-200 ease-in-out",
                      form.featured ? "translate-x-[24px]" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-[13px] font-semibold text-[#40516d]"
                >
                  Status
                </label>

                <div className="relative">
                  <select
                    id="status"
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as "Active" | "Inactive",
                      )
                    }
                    className="h-[50px] w-full appearance-none rounded-[10px] border border-[#d5dee9] bg-white px-4 pr-11 text-[14px] text-[#17233b] outline-none transition-all focus:border-[#8da0b7] focus:ring-2 focus:ring-[#17233b]/5"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#73839a]">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              PRODUCT SUMMARY
          ====================================================== */}
          <section className="rounded-[18px] border border-[#dfe5ec] bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.035)] sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-bebas-neue text-[22px] text-[#17233b]">
                  PRODUCT SUMMARY
                </h2>

                <p className="mt-1 text-[13px] text-[#7b8799]">
                  Review the updated information before saving.
                </p>
              </div>

              <span
                className={[
                  "inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold",
                  form.status === "Active"
                    ? "bg-[#dcfce7] text-[#16803a]"
                    : "bg-[#f1f5f9] text-[#64748b]",
                ].join(" ")}
              >
                {form.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Product */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Product
                </p>

                <p className="mt-1 truncate text-[13px] font-semibold text-[#17233b]">
                  {form.productName || "—"}
                </p>
              </div>

              {/* SKU */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  SKU
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {form.sku || "—"}
                </p>
              </div>

              {/* Selling Price */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Selling Price
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {formatPrice(form.sellingPrice)}
                </p>
              </div>

              {/* Total Stock */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Total Stock
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {totalStock}
                </p>
              </div>

              {/* Collection */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Collection
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {form.collection || "—"}
                </p>
              </div>

              {/* Category */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Category
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {form.category || "—"}
                </p>
              </div>

              {/* Fabric */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Fabric
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  {form.fabricGsm || "—"} {form.fabricMaterial || ""}
                </p>
              </div>

              {/* Brand */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Brand
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#17233b]">
                  The Backstore
                </p>
              </div>

              {/* Featured */}
              <div className="rounded-[10px] bg-[#f7f9fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#8b98aa]">
                  Featured
                </p>

                <p
                  className={[
                    "mt-1 text-[13px] font-semibold",
                    form.featured ? "text-[#ff2d32]" : "text-[#64748b]",
                  ].join(" ")}
                >
                  {form.featured ? "Yes" : "No"}
                </p>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e8edf2] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="h-[44px] rounded-[9px] border border-[#d7dee7] bg-white px-6 text-[13px] font-semibold text-[#52627a] transition-colors hover:bg-[#f8fafc]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-[44px] items-center justify-center gap-2 rounded-[9px] bg-black px-7 text-[13px] font-semibold text-white transition-all hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SaveIcon />
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
