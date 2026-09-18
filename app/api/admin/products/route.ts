import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

/* ============================================================
   SUPABASE SERVER CLIENT
============================================================ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

/* ============================================================
   CLOUDINARY
============================================================ */

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;

const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;

const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

/* ============================================================
   TYPES
============================================================ */

type ProductPayload = {
  name?: string;
  description?: string;
  brand?: string;
  category?: string;
  sku?: string;
  price?: number | string;
  mrp?: number | string;
  stock?: number | string;
  status?: string;
  featured?: boolean;
  tags?: string[];
  image_urls?: string[];
  sizes?: Record<string, number | string>;
};

/*
 * We intentionally don't rely on `instanceof File`
 * because uploaded multipart files can come from a
 * different runtime File implementation.
 */
type UploadedImageFile = File;

/* ============================================================
   HELPERS
============================================================ */

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SIZE_KEYS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type ProductSizes = Record<(typeof SIZE_KEYS)[number], number>;

function normalizeSizes(value: unknown): ProductSizes {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return SIZE_KEYS.reduce((sizes, key) => {
    const lowerKey = key.toLowerCase();
    const rawValue = source[key] ?? source[lowerKey] ?? 0;

    const quantity = Math.floor(toNumber(rawValue, 0));

    sizes[key] = Math.max(0, quantity);
    return sizes;
  }, {} as ProductSizes);
}

function getTotalSizeStock(sizes: ProductSizes) {
  return SIZE_KEYS.reduce((total, size) => total + sizes[size], 0);
}

/* ============================================================
   CLOUDINARY UPLOAD
============================================================ */

async function uploadToCloudinary(file: UploadedImageFile) {
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw new Error("Cloudinary server configuration is missing.");
  }

  const timestamp = Math.floor(Date.now() / 1000);

  const folder = "the-backstore/products";

  const signatureBase = `folder=${folder}&timestamp=${timestamp}`;

  const signature = crypto
    .createHash("sha1")
    .update(signatureBase + cloudinaryApiSecret)
    .digest("hex");

  const cloudinaryFormData = new FormData();

  cloudinaryFormData.append("file", file);

  cloudinaryFormData.append("api_key", cloudinaryApiKey);

  cloudinaryFormData.append("timestamp", String(timestamp));

  cloudinaryFormData.append("folder", folder);

  cloudinaryFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    console.error("Cloudinary upload failed:", result);

    throw new Error(
      result.error?.message || "Failed to upload product image to Cloudinary.",
    );
  }

  return {
    image_url: result.secure_url as string,

    cloudinary_public_id: (result.public_id as string) || null,
  };
}

/* ============================================================
   GET PRODUCTS
============================================================ */

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    /* --------------------------------------------------------
       PRODUCTS
    -------------------------------------------------------- */

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (productsError) {
      console.error("Failed to fetch products:", productsError);

      return jsonError(
        productsError.message || "Unable to load products.",
        500,
      );
    }

    const productRows = products ?? [];

    /* --------------------------------------------------------
       PRODUCT IMAGES
    -------------------------------------------------------- */

    const productIds = productRows
      .map((product) => product.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    let productImages: Array<{
      id: string;
      product_id: string;
      image_url: string;
      cloudinary_public_id: string | null;
      alt_text: string | null;
      sort_order: number;
      is_primary: boolean;
    }> = [];

    if (productIds.length > 0) {
      const { data: images, error: imagesError } = await supabaseAdmin
        .from("product_images")
        .select(
          `
            id,
            product_id,
            image_url,
            cloudinary_public_id,
            alt_text,
            sort_order,
            is_primary
          `,
        )
        .in("product_id", productIds)
        .order("sort_order", {
          ascending: true,
        });

      if (imagesError) {
        console.warn("Unable to load product images:", imagesError);
      } else {
        productImages = images ?? [];
      }
    }

    /* --------------------------------------------------------
       GROUP IMAGES
    -------------------------------------------------------- */

    const imagesMap = new Map<string, typeof productImages>();

    for (const image of productImages) {
      const existing = imagesMap.get(image.product_id) ?? [];

      existing.push(image);

      imagesMap.set(image.product_id, existing);
    }

    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    const mappedProducts = productRows.map((product) => ({
      ...product,

      /*
       * Size inventory is stored in the
       * products.metadata JSON column.
       *
       * Expose it as `sizes` at the API
       * level so the storefront can use:
       *
       * product.sizes.XS
       * product.sizes.S
       * etc.
       */
      sizes: normalizeSizes(product?.metadata?.sizes),

      product_images: imagesMap.get(product.id) ?? [],
    }));

    return NextResponse.json({
      success: true,
      products: mappedProducts,
    });
  } catch (error) {
    console.error("GET /api/admin/products failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to load products.",
      500,
    );
  }
}

/* ============================================================
   POST PRODUCT
============================================================ */

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    /* --------------------------------------------------------
       REQUEST DATA
    -------------------------------------------------------- */

    let payload: ProductPayload = {};

    let uploadedFiles: UploadedImageFile[] = [];

    const contentType = request.headers.get("content-type") || "";

    /* ========================================================
       MULTIPART FORM DATA
    ======================================================== */

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      payload = {
        name: String(formData.get("name") ?? ""),

        description: String(formData.get("description") ?? ""),

        brand: String(formData.get("brand") ?? ""),

        category: String(formData.get("category") ?? ""),

        sku: String(formData.get("sku") ?? ""),

        price: String(formData.get("price") ?? ""),

        mrp: String(formData.get("mrp") ?? ""),

        stock: String(formData.get("stock") ?? ""),

        status: String(formData.get("status") ?? ""),

        featured: String(formData.get("featured") ?? "false") === "true",

        tags: String(formData.get("tags") ?? "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        sizes: (() => {
          const rawSizes = formData.get("sizes");

          if (typeof rawSizes !== "string" || !rawSizes.trim()) {
            return undefined;
          }

          try {
            return JSON.parse(rawSizes) as Record<string, number | string>;
          } catch {
            return undefined;
          }
        })(),
      };

      /* ------------------------------------------------------
         READ IMAGE FILES

         IMPORTANT:
         Do NOT use `file instanceof File`.
         We identify uploaded files by their
         File/Blob properties instead.
      ------------------------------------------------------ */

      const formFiles = formData.getAll("images");

      uploadedFiles = formFiles.filter((value): value is File => {
        if (!value || typeof value !== "object") {
          return false;
        }

        const candidate = value as File;

        return (
          typeof candidate.arrayBuffer === "function" &&
          typeof candidate.name === "string" &&
          typeof candidate.type === "string" &&
          typeof candidate.size === "number" &&
          candidate.size > 0
        );
      });

      console.log("Product upload:", {
        contentType,
        formFileCount: formFiles.length,
        uploadedFileCount: uploadedFiles.length,
        files: uploadedFiles.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      });
    } else {
      /* ======================================================
         JSON
      ====================================================== */

      try {
        payload = (await request.json()) as ProductPayload;
      } catch {
        return jsonError("Invalid request body.");
      }
    }

    /* --------------------------------------------------------
       NORMALIZE PRODUCT DATA
    -------------------------------------------------------- */

    const productName =
      typeof payload.name === "string" ? payload.name.trim() : "";

    const description =
      typeof payload.description === "string" ? payload.description.trim() : "";

    const brand =
      typeof payload.brand === "string" && payload.brand.trim()
        ? payload.brand.trim()
        : "The Backstore";

    const category =
      typeof payload.category === "string" ? payload.category.trim() : "";

    const sku = typeof payload.sku === "string" ? payload.sku.trim() : "";

    const price = toNumber(payload.price, 0);

    const mrp = toNumber(payload.mrp, 0);

    const normalizedSizes = normalizeSizes(payload.sizes);

    const hasSizeInventory =
      payload.sizes !== undefined &&
      payload.sizes !== null &&
      typeof payload.sizes === "object";

    const stock = hasSizeInventory
      ? getTotalSizeStock(normalizedSizes)
      : Math.max(0, Math.floor(toNumber(payload.stock, 0)));

    const status =
      payload.status === "Inactive"
        ? "Inactive"
        : stock === 0
          ? "Out of Stock"
          : "Active";

    const featured = Boolean(payload.featured);

    const tags = Array.isArray(payload.tags)
      ? payload.tags.filter(
          (tag): tag is string =>
            typeof tag === "string" && tag.trim().length > 0,
        )
      : [];

    /* --------------------------------------------------------
       VALIDATION
    -------------------------------------------------------- */

    if (!productName) {
      return jsonError("Product name is required.");
    }

    if (!sku) {
      return jsonError("SKU is required.");
    }

    if (!category) {
      return jsonError("Product category is required.");
    }

    if (mrp < 0) {
      return jsonError("MRP cannot be negative.");
    }

    if (price < 0) {
      return jsonError("Selling price cannot be negative.");
    }

    if (price > mrp) {
      return jsonError("Selling price cannot be greater than MRP.");
    }

    /* --------------------------------------------------------
       CREATE UNIQUE SLUG
    -------------------------------------------------------- */

    const baseSlug = createSlug(productName);

    if (!baseSlug) {
      return jsonError("Unable to create product slug.");
    }

    let slug = baseSlug;
    let slugCounter = 1;

    while (true) {
      const { data: existingSlug, error: slugCheckError } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (slugCheckError) {
        console.error("Slug validation failed:", slugCheckError);

        return jsonError(
          slugCheckError.message || "Unable to validate product slug.",
          500,
        );
      }

      if (!existingSlug) {
        break;
      }

      slugCounter += 1;

      slug = `${baseSlug}-${slugCounter}`;
    }

    /* --------------------------------------------------------
       CHECK SKU
    -------------------------------------------------------- */

    const { data: existingSku, error: skuError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("sku", sku)
      .maybeSingle();

    if (skuError) {
      console.error("SKU validation failed:", skuError);

      return jsonError(skuError.message || "Unable to validate SKU.", 500);
    }

    if (existingSku) {
      return jsonError(`SKU "${sku}" already exists.`);
    }

    /* --------------------------------------------------------
       INSERT PRODUCT
    -------------------------------------------------------- */

    const { data: insertedProduct, error: insertProductError } =
      await supabaseAdmin
        .from("products")
        .insert({
          name: productName,
          slug,
          description: description || null,
          brand,
          category,
          sku,
          price,
          mrp,
          stock,
          status,
          featured,
          tags,

          /*
           * Store individual size inventory in
           * the existing JSONB metadata column.
           *
           * This keeps the current database schema
           * intact and avoids creating a new table
           * just for six size quantities.
           */
          metadata: {
            sizes: normalizedSizes,
          },
        })
        .select("*")
        .single();

    if (insertProductError) {
      console.error("Failed to insert product:", insertProductError);

      return jsonError(
        insertProductError.message || "Unable to create product.",
        500,
      );
    }

    /* --------------------------------------------------------
       IMAGE ROWS
    -------------------------------------------------------- */

    const imageRows: Array<{
      product_id: string;
      image_url: string;
      cloudinary_public_id: string | null;
      alt_text: string;
      sort_order: number;
      is_primary: boolean;
    }> = [];

    /* --------------------------------------------------------
       EXISTING IMAGE URL SUPPORT
    -------------------------------------------------------- */

    const existingImageUrls = Array.isArray(payload.image_urls)
      ? payload.image_urls.filter(
          (url): url is string =>
            typeof url === "string" && url.trim().length > 0,
        )
      : [];

    for (let index = 0; index < existingImageUrls.length; index += 1) {
      imageRows.push({
        product_id: insertedProduct.id,

        image_url: existingImageUrls[index],

        cloudinary_public_id: null,

        alt_text: productName,

        sort_order: index,

        is_primary: index === 0,
      });
    }

    /* ========================================================
       UPLOAD FILES TO CLOUDINARY
    ======================================================== */

    if (uploadedFiles.length > 0) {
      if (uploadedFiles.length > 4) {
        await supabaseAdmin
          .from("products")
          .delete()
          .eq("id", insertedProduct.id);

        return jsonError("You can upload a maximum of 4 product images.");
      }

      try {
        for (let index = 0; index < uploadedFiles.length; index += 1) {
          const file = uploadedFiles[index];

          /* --------------------------------------------------
             SERVER-SIDE VALIDATION
          -------------------------------------------------- */

          if (!file.type.startsWith("image/")) {
            throw new Error(`Image ${index + 1} is not a valid image file.`);
          }

          /*
           * Browser compression should already
           * make this <= 1MB.
           *
           * Keep a 1.1MB safety margin for
           * multipart/runtime handling.
           */
          const maxImageSize = 1.1 * 1024 * 1024;

          if (file.size > maxImageSize) {
            throw new Error(
              `Image ${index + 1} is larger than 1MB. Please select it again so it can be compressed.`,
            );
          }

          console.log(`Uploading image ${index + 1}:`, {
            name: file.name,
            type: file.type,
            size: file.size,
          });

          /* --------------------------------------------------
             CLOUDINARY
          -------------------------------------------------- */

          const uploaded = await uploadToCloudinary(file);

          const sortOrder = imageRows.length;

          imageRows.push({
            product_id: insertedProduct.id,

            image_url: uploaded.image_url,

            cloudinary_public_id: uploaded.cloudinary_public_id,

            alt_text: productName,

            sort_order: sortOrder,

            is_primary: sortOrder === 0,
          });

          console.log(
            `Image ${index + 1} uploaded successfully:`,
            uploaded.image_url,
          );
        }
      } catch (uploadError) {
        console.error("Product image upload failed:", uploadError);

        /*
         * Remove the product if
         * Cloudinary upload fails.
         */
        await supabaseAdmin
          .from("products")
          .delete()
          .eq("id", insertedProduct.id);

        return jsonError(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload product images.",
          500,
        );
      }
    }

    /* ========================================================
       IMPORTANT DEBUG
    ======================================================== */

    console.log("Final product image rows:", imageRows);

    /* ========================================================
       INSERT PRODUCT IMAGES
    ======================================================== */

    if (imageRows.length > 0) {
      const { data: insertedImages, error: imagesError } = await supabaseAdmin
        .from("product_images")
        .insert(imageRows)
        .select(
          `
              id,
              product_id,
              image_url,
              cloudinary_public_id,
              alt_text,
              sort_order,
              is_primary
            `,
        )
        .order("sort_order", {
          ascending: true,
        });

      if (imagesError) {
        console.error("Failed to insert product images:", imagesError);

        /*
         * Remove the product if
         * image database insert fails.
         */
        await supabaseAdmin
          .from("products")
          .delete()
          .eq("id", insertedProduct.id);

        return jsonError(
          imagesError.message || "Unable to save product images.",
          500,
        );
      }

      /* ------------------------------------------------------
         SUCCESS WITH IMAGES
      ------------------------------------------------------ */

      return NextResponse.json(
        {
          success: true,

          message: "Product created successfully.",

          product: {
            ...insertedProduct,

            product_images: insertedImages ?? [],
          },
        },
        {
          status: 201,
        },
      );
    }

    /* ========================================================
       NO IMAGES
    ======================================================== */

    return NextResponse.json(
      {
        success: true,

        message: "Product created successfully.",

        product: {
          ...insertedProduct,

          product_images: [],
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/admin/products failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to create product.",
      500,
    );
  }
}
