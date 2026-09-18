"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type ImageSlot = {
  id: number;
  file: File | null;
  preview: string;
};

type SaveState = "idle" | "saving" | "success" | "error";

const initialImageSlots: ImageSlot[] = [
  { id: 1, file: null, preview: "" },
  { id: 2, file: null, preview: "" },
  { id: 3, file: null, preview: "" },
  { id: 4, file: null, preview: "" },
];

/* ============================================================
   IMAGE COMPRESSION
============================================================ */

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read the selected image."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to compress the selected image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

async function compressImage(file: File): Promise<File> {
  /*
   * If the original image is already below 1MB,
   * keep the original file.
   */
  if (file.size <= MAX_IMAGE_SIZE) {
    return file;
  }

  const image = await loadImage(file);

  /*
   * Start with the original dimensions.
   * If the image is very large, reduce it gradually.
   */
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const MAX_DIMENSION = 2400;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);

    width = Math.max(1, Math.round(width * scale));

    height = Math.max(1, Math.round(height * scale));
  }

  /*
   * Try multiple quality levels.
   * We stop as soon as the image is <= 1MB.
   */
  const qualityLevels = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5];

  let currentWidth = width;
  let currentHeight = height;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const canvas = document.createElement("canvas");

    canvas.width = currentWidth;
    canvas.height = currentHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser does not support image compression.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(image, 0, 0, currentWidth, currentHeight);

    for (const quality of qualityLevels) {
      const blob = await canvasToBlob(canvas, quality);

      if (blob.size <= MAX_IMAGE_SIZE) {
        const extension = ".webp";

        const baseName = file.name.replace(/\.[^/.]+$/, "");

        return new File([blob], `${baseName}${extension}`, {
          type: "image/webp",
          lastModified: Date.now(),
        });
      }
    }

    /*
     * Still above 1MB.
     * Reduce dimensions and try again.
     */
    currentWidth = Math.round(currentWidth * 0.8);

    currentHeight = Math.round(currentHeight * 0.8);
  }

  /*
   * Final attempt with a lower quality.
   */
  const finalCanvas = document.createElement("canvas");

  finalCanvas.width = currentWidth;
  finalCanvas.height = currentHeight;

  const finalContext = finalCanvas.getContext("2d");

  if (!finalContext) {
    throw new Error("Your browser does not support image compression.");
  }

  finalContext.imageSmoothingEnabled = true;
  finalContext.imageSmoothingQuality = "high";

  finalContext.drawImage(image, 0, 0, currentWidth, currentHeight);

  const finalBlob = await canvasToBlob(finalCanvas, 0.45);

  if (finalBlob.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Unable to compress this image below 1MB. Please choose a smaller image.",
    );
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "");

  return new File([finalBlob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

/* ============================================================
   ICONS
============================================================ */

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
      <path d="m15 18-6 6" />
      <path d="m9 12 6-6" />
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
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function XIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

/* ============================================================
   PAGE
============================================================ */

export default function AddProductPage() {
  const [images, setImages] = useState<ImageSlot[]>(initialImageSlots);

  const [productName, setProductName] = useState("");

  const [sku, setSku] = useState("");

  // Brand is fixed for The Backstore.
  const brand = "The Backstore";

  const [collection, setCollection] = useState("");

  const [category, setCategory] = useState("");

  const [mrp, setMrp] = useState("");

  const [sellingPrice, setSellingPrice] = useState("");

  const [gender, setGender] = useState("");

  const [fit, setFit] = useState("");

  const [fabricGsm, setFabricGsm] = useState("240");

  const [fabricMaterial, setFabricMaterial] = useState("GSM Cotton");

  const [description, setDescription] = useState("");

  const [sizes, setSizes] = useState({
    xs: 0,
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
    xxl: 0,
  });

  const [featured, setFeatured] = useState(false);

  const [status, setStatus] = useState("Active");

  const [saveState, setSaveState] = useState<SaveState>("idle");

  const [saveMessage, setSaveMessage] = useState("");

  const totalStock = useMemo(() => {
    return Object.values(sizes).reduce((sum, value) => sum + value, 0);
  }, [sizes]);

  useEffect(() => {
    return () => {
      images.forEach((slot) => {
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
      });
    };
  }, [images]);

  /* ============================================================
     IMAGE CHANGE
  ============================================================ */

  const handleImageChange = (
    slotId: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveState("error");
      setSaveMessage("Please select a valid image file.");

      event.target.value = "";
      return;
    }

    /*
     * Allow larger source files because they
     * will be compressed to <= 1MB before upload.
     */
    const maxSourceFileSize = 15 * 1024 * 1024;

    if (file.size > maxSourceFileSize) {
      setSaveState("error");
      setSaveMessage("Each source image must be smaller than 15MB.");

      event.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    setSaveState("idle");
    setSaveMessage("");

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

  /* ============================================================
     REMOVE IMAGE
  ============================================================ */

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

  /* ============================================================
     SIZE UPDATE
  ============================================================ */

  const updateSize = (size: keyof typeof sizes, value: string) => {
    const numericValue = Math.max(0, Number(value) || 0);

    setSizes((current) => ({
      ...current,
      [size]: numericValue,
    }));
  };

  /* ============================================================
     FORM VALIDATION
  ============================================================ */

  const validateForm = () => {
    if (!productName.trim()) {
      return "Product name is required.";
    }

    if (!sku.trim()) {
      return "SKU is required.";
    }

    if (!collection) {
      return "Please select a collection.";
    }

    if (!category) {
      return "Please select a category.";
    }

    if (!mrp || Number(mrp) < 0) {
      return "Please enter a valid MRP.";
    }

    if (!sellingPrice || Number(sellingPrice) < 0) {
      return "Please enter a valid selling price.";
    }

    if (Number(sellingPrice) > Number(mrp)) {
      return "Selling price cannot be greater than MRP.";
    }

    return null;
  };

  /* ============================================================
     SAVE PRODUCT
  ============================================================ */

  const handleSave = async () => {
    if (saveState === "saving") {
      return;
    }

    setSaveState("idle");
    setSaveMessage("");

    const validationError = validateForm();

    if (validationError) {
      setSaveState("error");
      setSaveMessage(validationError);
      return;
    }

    try {
      setSaveState("saving");
      setSaveMessage("Preparing product...");

      /*
       * --------------------------------------------------------
       * GET SELECTED IMAGES
       * --------------------------------------------------------
       */

      const selectedImages = images.filter(
        (
          slot,
        ): slot is ImageSlot & {
          file: File;
        } => Boolean(slot.file),
      );

      /*
       * --------------------------------------------------------
       * COMPRESS IMAGES
       * --------------------------------------------------------
       */

      const compressedImages: File[] = [];

      for (let index = 0; index < selectedImages.length; index += 1) {
        const image = selectedImages[index];

        setSaveMessage(
          `Compressing image ${index + 1} of ${selectedImages.length}...`,
        );

        const compressedFile = await compressImage(image.file);

        /*
         * Safety check.
         */
        if (compressedFile.size > MAX_IMAGE_SIZE) {
          throw new Error(
            `Image ${index + 1} could not be compressed below 1MB.`,
          );
        }

        compressedImages.push(compressedFile);
      }

      /*
       * --------------------------------------------------------
       * CREATE FORMDATA
       * --------------------------------------------------------
       *
       * IMPORTANT:
       * Do not manually set Content-Type.
       * Browser automatically adds the multipart boundary.
       * --------------------------------------------------------
       */

      const formData = new FormData();

      formData.append("name", productName.trim());

      formData.append("description", description.trim());

      formData.append("brand", brand);

      formData.append("category", category);

      formData.append("sku", sku.trim());

      formData.append(
        "fabric",
        `${fabricGsm.trim()} ${fabricMaterial.trim()}`.trim(),
      );

      formData.append("price", String(Number(sellingPrice)));

      formData.append("mrp", String(Number(mrp)));

      formData.append("stock", String(totalStock));

      /*
       * --------------------------------------------------------
       * APPEND SIZE INVENTORY
       * --------------------------------------------------------
       *
       * The API stores these individual quantities in:
       *
       * products.metadata.sizes
       *
       * Example:
       * {
       *   XS: 2,
       *   S: 5,
       *   M: 8,
       *   L: 6,
       *   XL: 3,
       *   XXL: 1
       * }
       * --------------------------------------------------------
       */
      formData.append(
        "sizes",
        JSON.stringify({
          XS: Number(sizes.xs) || 0,
          S: Number(sizes.s) || 0,
          M: Number(sizes.m) || 0,
          L: Number(sizes.l) || 0,
          XL: Number(sizes.xl) || 0,
          XXL: Number(sizes.xxl) || 0,
        }),
      );

      formData.append(
        "status",
        status === "Inactive"
          ? "Inactive"
          : totalStock === 0
            ? "Out of Stock"
            : "Active",
      );

      formData.append("featured", String(featured));

      formData.append(
        "tags",
        [collection, gender, fit].filter(Boolean).join(","),
      );

      /*
       * --------------------------------------------------------
       * APPEND COMPRESSED IMAGES
       * --------------------------------------------------------
       */

      compressedImages.forEach((file) => {
        formData.append("images", file, file.name);
      });

      /*
       * --------------------------------------------------------
       * SEND TO API
       * --------------------------------------------------------
       */

      setSaveMessage(
        compressedImages.length > 0
          ? "Uploading product images..."
          : "Saving product...",
      );

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || "Failed to create product.",
        );
      }

      /*
       * --------------------------------------------------------
       * SUCCESS
       * --------------------------------------------------------
       */

      setSaveState("success");

      setSaveMessage("Product created successfully.");

      setProductName("");
      setSku("");
      setCollection("");
      setCategory("");
      setMrp("");
      setSellingPrice("");
      setGender("");
      setFit("");
      setFabricGsm("240");
      setFabricMaterial("GSM Cotton");
      setDescription("");

      setSizes({
        xs: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
      });

      setFeatured(false);
      setStatus("Active");

      images.forEach((slot) => {
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
      });

      setImages(
        initialImageSlots.map((slot) => ({
          ...slot,
        })),
      );
    } catch (error) {
      console.error("Create product error:", error);

      setSaveState("error");

      setSaveMessage(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#17233b]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-7 sm:px-7 lg:px-9">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7">
          <Link
            href="/admin/products"
            className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#687790] transition-colors hover:text-black"
          >
            <ArrowLeftIcon />
            Back to Products
          </Link>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-[3px] w-8 bg-[#ff2d32]" />

              <span className="font-bebas-neue text-[12px] tracking-[0.18em] text-[#8a96aa]">
                PRODUCT MANAGEMENT
              </span>
            </div>

            <h1 className="font-bebas-neue text-[42px] leading-none tracking-[0.02em] text-[#17233b] sm:text-[48px]">
              ADD PRODUCT
            </h1>

            <p className="mt-2 text-[14px] text-[#71809a]">
              Create a new product for The Backstore.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* ===================================================
              PRODUCT IMAGES
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="text-[16px] font-bold text-[#17233b]">
                Product Images
              </h2>

              <p className="mt-1 text-[12px] text-[#7b8799]">
                Upload up to 4 product images. The first image will be used as
                the primary product image.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {images.map((slot) => (
                <div key={slot.id} className="relative aspect-square">
                  {slot.preview ? (
                    <div className="relative h-full w-full overflow-hidden rounded-[10px] border border-[#d7dfe9] bg-[#f5f6f8]">
                      <img
                        src={slot.preview}
                        alt={`Product image ${slot.id}`}
                        className="h-full w-full object-contain"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(slot.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white shadow-md transition-colors hover:bg-[#ff2d32] hover:text-black"
                        aria-label={`Remove image ${slot.id}`}
                      >
                        <XIcon />
                      </button>

                      {slot.id === 1 && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-black px-2.5 py-1 text-[9px] font-semibold text-white">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ) : (
                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-[#cbd5e1] bg-[#fbfcfd] transition-all hover:border-[#17233b] hover:bg-[#f7f8fa]">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f3f6] text-[#71809a]">
                        <ImageIcon />
                      </div>

                      <span className="text-[11px] font-medium text-[#53627a]">
                        Image {slot.id}
                      </span>

                      <span className="mt-1 text-[9px] text-[#9aa5b6]">
                        Click to upload
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

            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#8b98ab]">
              <UploadIcon />

              <span>
                JPG, PNG or WebP · Automatically compressed to maximum 1MB per
                image
              </span>
            </div>
          </section>

          {/* ===================================================
              BASIC INFORMATION
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                BASIC INFORMATION
              </h2>

              <p className="mt-1 text-[12px] text-[#7b8799]">
                Add the main information about this product.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Product Name */}

              <div>
                <InputLabel required>Product Name</InputLabel>

                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="e.g. Doomsday Oversized Tee"
                  className={inputClass}
                />
              </div>

              {/* Brand */}

              <div>
                <InputLabel required>Brand</InputLabel>

                <input
                  type="text"
                  value={brand}
                  readOnly
                  aria-readonly="true"
                  className={`${inputClass} cursor-not-allowed bg-[#f1f4f7] text-[#687790]`}
                />

                <p className="mt-1.5 text-[9px] text-[#9aa5b6]">
                  Brand is fixed as The Backstore.
                </p>
              </div>

              {/* SKU */}

              <div>
                <InputLabel required>SKU</InputLabel>

                <input
                  type="text"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="e.g. TB-050"
                  className={inputClass}
                />
              </div>

              {/* Collection */}

              <div>
                <InputLabel required>Collection</InputLabel>

                <div className="relative">
                  <select
                    value={collection}
                    onChange={(event) => setCollection(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Collection</option>

                    <option value="Anime">Anime</option>

                    <option value="Comic">Comic</option>

                    <option value="Kollywood">Kollywood</option>

                    <option value="Sports">Sports</option>

                    <option value="Cinephile">Cinephile</option>

                    <option value="F1">F1</option>

                    <option value="Football">Football</option>

                    <option value="Cricket">Cricket</option>

                    <option value="Memes">Memes</option>

                    <option value="Motivational Quotes">
                      Motivational Quotes
                    </option>

                    <option value="Garage Culture">Garage Culture</option>

                    <option value="Music">Music</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Category */}

              <div>
                <InputLabel required>Category</InputLabel>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Category</option>

                    <option value="Oversized T-Shirt">Oversized T-Shirt</option>

                    <option value="Regular T-Shirt">Regular T-Shirt</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Fabric */}

              <div>
                <InputLabel>Fabric</InputLabel>

                <div className="flex h-[44px] w-full overflow-hidden rounded-[9px] border border-[#d7dfe9] bg-white transition-colors focus-within:border-[#17233b] focus-within:ring-1 focus-within:ring-[#17233b]/10">
                  <input
                    type="number"
                    min="0"
                    value={fabricGsm}
                    onChange={(event) => setFabricGsm(event.target.value)}
                    aria-label="Fabric GSM"
                    className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[13px] text-[#17233b] outline-none placeholder:text-[#9ba8ba]"
                  />

                  <div className="flex h-full w-[185px] shrink-0 items-center border-l border-[#33415c] bg-[#f1f4f7] px-3.5 text-[13px] text-[#53627a]">
                    {fabricMaterial}
                  </div>
                </div>

                <p className="mt-1.5 text-[9px] text-[#9aa5b6]">
                  Prefilled as 240 GSM Cotton.
                </p>
              </div>

              {/* Gender */}

              <div>
                <InputLabel>Gender</InputLabel>

                <div className="relative">
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Gender</option>

                    <option value="Unisex">Unisex</option>

                    <option value="Men">Men</option>

                    <option value="Women">Women</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Fit */}

              <div>
                <InputLabel>Fit</InputLabel>

                <div className="relative">
                  <select
                    value={fit}
                    onChange={(event) => setFit(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Fit</option>

                    <option value="Oversized">Oversized</option>

                    <option value="Regular">Regular</option>

                    <option value="Relaxed">Relaxed</option>
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              PRICING
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                PRICING
              </h2>

              <p className="mt-1 text-[12px] text-[#7b8799]">
                Set the MRP and selling price of the product.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    placeholder="699"
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
                    placeholder="599"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              DESCRIPTION
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                DESCRIPTION
              </h2>

              <p className="mt-1 text-[12px] text-[#7b8799]">
                Describe the product and its design.
              </p>
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write your product description..."
              rows={6}
              className="w-full resize-none rounded-[9px] border border-[#d7dfe9] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#17233b] outline-none transition-colors placeholder:text-[#9ba8ba] focus:border-[#17233b] focus:ring-1 focus:ring-[#17233b]/10"
            />
          </section>

          {/* ===================================================
              SIZE INVENTORY
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                  SIZE INVENTORY
                </h2>

                <p className="mt-1 text-[12px] text-[#7b8799]">
                  Enter the available quantity for each size.
                </p>
              </div>

              <div className="rounded-full bg-[#f1f4f7] px-3 py-1.5 text-[11px] font-semibold text-[#53627a]">
                Total Stock: {totalStock}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {(Object.keys(sizes) as Array<keyof typeof sizes>).map((size) => (
                <div key={size}>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7b8799]">
                    {size}
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={sizes[size]}
                    onChange={(event) => updateSize(size, event.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ===================================================
              PRODUCT SETTINGS
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5">
              <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                PRODUCT SETTINGS
              </h2>

              <p className="mt-1 text-[12px] text-[#7b8799]">
                Control the visibility and status of the product.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Featured Product */}

              <div className="flex min-h-[96px] items-center justify-between rounded-[10px] border border-[#dfe5ec] bg-[#fafbfc] px-4 py-4">
                <div>
                  <p className="text-[13px] font-semibold text-[#17233b]">
                    Featured Product
                  </p>

                  <p className="mt-1 text-[11px] text-[#7b8799]">
                    Show this product in featured sections.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  aria-label="Featured Product"
                  onClick={() => setFeatured((current) => !current)}
                  className={[
                    "relative h-[26px] w-[48px] shrink-0 rounded-full",
                    "transition-colors duration-200 ease-in-out",
                    "focus:outline-none focus:ring-2 focus:ring-[#ff2d32]/20",
                    featured ? "bg-[#ff2d32]" : "bg-[#cbd5e1]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "absolute left-[3px] top-[3px]",
                      "h-[20px] w-[20px] rounded-full bg-white",
                      "shadow-[0_1px_4px_rgba(0,0,0,0.2)]",
                      "transition-transform duration-200 ease-in-out",
                      featured ? "translate-x-[22px]" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>

              {/* Status */}

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
                  </select>

                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#71809a]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              PRODUCT SUMMARY
          ==================================================== */}

          <section className="rounded-[14px] border border-[#e1e6ed] bg-[#f1f4f7] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-bebas-neue text-[22px] tracking-[0.01em] text-[#17233b]">
                  PRODUCT SUMMARY
                </h2>

                <p className="mt-1 text-[11px] text-[#7b8799]">
                  Review the information before saving.
                </p>
              </div>

              <span
                className={[
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  status === "Active"
                    ? "bg-[#dcfce7] text-[#15803d]"
                    : "bg-[#e2e8f0] text-[#64748b]",
                ].join(" ")}
              >
                {status}
              </span>
            </div>

            <div className="rounded-[10px] border border-[#dfe5eb] bg-white p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8b98ab]">
                    Product
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#17233b]">
                    {productName || "Not entered"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8b98ab]">
                    Brand
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#17233b]">
                    {brand}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8b98ab]">
                    Collection
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#17233b]">
                    {collection || "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8b98ab]">
                    Price
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#17233b]">
                    {sellingPrice
                      ? `₹${Number(sellingPrice).toLocaleString("en-IN")}`
                      : "Not entered"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8b98ab]">
                    Total Stock
                  </p>

                  <p className="mt-1 text-[12px] font-semibold text-[#17233b]">
                    {totalStock}
                  </p>
                </div>
              </div>

              {/* Featured status */}

              <div className="mt-4 border-t border-[#edf0f3] pt-3">
                <span className="text-[10px] text-[#8b98ab]">Featured:</span>

                <span
                  className={[
                    "ml-2 text-[10px] font-semibold",
                    featured ? "text-[#ff2d32]" : "text-[#8b98ab]",
                  ].join(" ")}
                >
                  {featured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </section>

          {/* ===================================================
              SAVE MESSAGE
          ==================================================== */}

          {saveMessage && (
            <div
              className={[
                "rounded-[9px] border px-4 py-3 text-[12px] font-medium",
                saveState === "success"
                  ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
                  : saveState === "error"
                    ? "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                    : "border-[#dbeafe] bg-[#eff6ff] text-[#2563eb]",
              ].join(" ")}
            >
              {saveMessage}
            </div>
          )}

          {/* ===================================================
              ACTIONS
          ==================================================== */}

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[9px] border border-[#d5dce5] bg-white px-6 text-[13px] font-semibold text-[#52627a] transition-colors hover:bg-[#f5f6f8] hover:text-black"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving"}
              className={[
                "inline-flex h-[46px] items-center justify-center gap-2 rounded-[9px] px-7 text-[13px] font-semibold text-white shadow-sm transition-all duration-200",
                saveState === "saving"
                  ? "cursor-not-allowed bg-[#64748b]"
                  : "bg-black hover:bg-[#ff2d32] hover:text-black",
              ].join(" ")}
            >
              <PlusIcon />

              {saveState === "saving" ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
