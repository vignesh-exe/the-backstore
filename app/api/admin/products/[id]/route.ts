import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const SIZE_KEYS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

function normalizeSizes(value: unknown) {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return SIZE_KEYS.reduce(
    (sizes, size) => {
      const rawValue = source[size] ?? source[size.toLowerCase()] ?? 0;

      const numericValue = Number(rawValue);

      sizes[size] = Number.isFinite(numericValue)
        ? Math.max(0, Math.floor(numericValue))
        : 0;

      return sizes;
    },
    {} as Record<(typeof SIZE_KEYS)[number], number>,
  );
}

/* ============================================================
   GET SINGLE PRODUCT
============================================================ */

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    const { id } = await context.params;

    if (!id || !id.trim()) {
      return jsonError("Product ID is required.");
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (productError) {
      console.error("Failed to load product:", productError);

      return jsonError(productError.message || "Unable to load product.", 500);
    }

    if (!product) {
      return jsonError("Product not found.", 404);
    }

    const { data: productImages, error: imagesError } = await supabaseAdmin
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
      .eq("product_id", product.id)
      .order("sort_order", {
        ascending: true,
      });

    if (imagesError) {
      console.error("Failed to load product images:", imagesError);

      return jsonError(
        imagesError.message || "Unable to load product images.",
        500,
      );
    }

    /*
     * Variants are optional for the current product schema.
     * If the table is unavailable, the product itself still loads.
     */
    let variants: unknown[] = [];

    const { data: variantRows, error: variantsError } = await supabaseAdmin
      .from("product_variants")
      .select(
        `
            id,
            product_id,
            net_quantity,
            mrp,
            selling_price,
            inventory,
            display_order,
            created_at,
            updated_at
          `,
      )
      .eq("product_id", product.id)
      .order("display_order", {
        ascending: true,
      });

    if (variantsError) {
      console.warn(
        "Product variants could not be loaded:",
        variantsError.message,
      );
    } else {
      variants = variantRows ?? [];
    }

    const sortedImages = (productImages ?? []).slice().sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }

      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

    const imageUrls = sortedImages
      .map((image) => image.image_url)
      .filter(
        (url): url is string =>
          typeof url === "string" && url.trim().length > 0,
      );

    return NextResponse.json(
      {
        success: true,

        product: {
          ...product,

          /*
           * Size inventory is stored inside
           * products.metadata.sizes.
           *
           * Expose it as product.sizes so the
           * Edit Product page can populate the
           * individual size fields.
           */
          sizes: normalizeSizes(product?.metadata?.sizes),

          product_images: sortedImages,

          image_url: imageUrls[0] ?? null,

          image_urls: imageUrls,

          variants,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET /api/admin/products/[id] failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to load product.",
      500,
    );
  }
}

/* ============================================================
   PATCH SINGLE PRODUCT
============================================================ */

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    const { id } = await context.params;

    if (!id || !id.trim()) {
      return jsonError("Product ID is required.");
    }

    /* --------------------------------------------------------
       PARSE REQUEST

       The current Edit page sends JSON.
       Accept the current field names and the older field names
       so the route remains compatible with the existing UI.
    -------------------------------------------------------- */

    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonError("Invalid request body.");
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : null;

    const sku =
      typeof body.sku === "string"
        ? body.sku.trim()
        : typeof body.product_code === "string"
          ? body.product_code.trim()
          : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : typeof body.category_id === "string"
          ? body.category_id.trim()
          : "";

    const slug =
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug.trim()
        : createSlug(name);

    const priceValue = body.price ?? body.selling_price;

    const mrpValue = body.mrp ?? body.original_price;

    const stockValue = body.stock;

    const price = Number(priceValue);

    const mrp = Number(mrpValue);

    /*
     * Size inventory sent by the current Edit Product page.
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
     */
    const rawSizes =
      body.sizes && typeof body.sizes === "object"
        ? (body.sizes as Record<string, unknown>)
        : null;

    const sizeKeys = ["XS", "S", "M", "L", "XL", "XXL"] as const;

    const hasSizeInventory = rawSizes !== null;

    const normalizedSizes = sizeKeys.reduce(
      (result, size) => {
        const rawValue =
          rawSizes?.[size] ?? rawSizes?.[size.toLowerCase()] ?? 0;

        const numericValue = Number(rawValue);

        result[size] = Number.isFinite(numericValue)
          ? Math.max(0, Math.floor(numericValue))
          : 0;

        return result;
      },
      {} as Record<(typeof sizeKeys)[number], number>,
    );

    const calculatedSizeStock = sizeKeys.reduce(
      (total, size) => total + normalizedSizes[size],
      0,
    );

    const stock = hasSizeInventory ? calculatedSizeStock : Number(stockValue);

    /*
     * Current UI sends:
     *   status: "Active" | "Inactive" | "Out of Stock"
     *   featured: boolean
     *
     * Older UI may send:
     *   is_active: boolean
     *   is_featured: boolean
     */

    const status =
      typeof body.status === "string"
        ? body.status
        : body.is_active === false
          ? "Inactive"
          : stock === 0
            ? "Out of Stock"
            : "Active";

    const featured =
      typeof body.featured === "boolean"
        ? body.featured
        : Boolean(body.is_featured);

    let tags: string[] = [];

    if (Array.isArray(body.tags)) {
      tags = body.tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    /* --------------------------------------------------------
       VALIDATION
    -------------------------------------------------------- */

    if (!name) {
      return jsonError("Product name is required.");
    }

    if (!sku) {
      return jsonError("SKU is required.");
    }

    if (!category) {
      return jsonError("Product category is required.");
    }

    if (!slug) {
      return jsonError("Product slug is required.");
    }

    if (!Number.isFinite(price) || price < 0) {
      return jsonError("Selling price must be a valid non-negative number.");
    }

    if (!Number.isFinite(mrp) || mrp < 0) {
      return jsonError("MRP must be a valid non-negative number.");
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return jsonError("Stock must be a valid non-negative number.");
    }

    /* --------------------------------------------------------
       CHECK PRODUCT EXISTS
    -------------------------------------------------------- */

    const { data: existingProduct, error: existingProductError } =
      await supabaseAdmin
        .from("products")
        .select("id")
        .eq("id", id)
        .maybeSingle();

    if (existingProductError) {
      console.error("Failed to check existing product:", existingProductError);

      return jsonError(
        existingProductError.message || "Unable to update product.",
        500,
      );
    }

    if (!existingProduct) {
      return jsonError("Product not found.", 404);
    }

    /* --------------------------------------------------------
       CHECK SKU DUPLICATE

       Do not block the same product from keeping its own SKU.
    -------------------------------------------------------- */

    const { data: duplicateSku, error: duplicateSkuError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("sku", sku)
      .neq("id", id)
      .maybeSingle();

    if (duplicateSkuError) {
      console.error("Failed to check SKU:", duplicateSkuError);

      return jsonError(
        duplicateSkuError.message || "Unable to validate SKU.",
        500,
      );
    }

    if (duplicateSku) {
      return jsonError(`SKU "${sku}" is already used by another product.`, 409);
    }

    /* --------------------------------------------------------
       UPDATE PRODUCT

       Only columns confirmed in the current products table
       are written here.
    -------------------------------------------------------- */

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("products")
      .update({
        name,
        slug,
        description: description || null,
        brand:
          typeof body.brand === "string" && body.brand.trim()
            ? body.brand.trim()
            : "The Backstore",
        category,
        sku,
        price,
        mrp,
        stock,
        status,
        featured,
        tags,

        ...(hasSizeInventory
          ? {
              metadata: {
                sizes: normalizedSizes,
              },
            }
          : {}),

        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Failed to update product:", updateError);

      return jsonError(updateError.message || "Unable to update product.", 500);
    }

    /* --------------------------------------------------------
       RETURN CURRENT IMAGES

       Image replacement/upload is handled separately.
       Existing Cloudinary images are never overwritten or
       deleted by a normal product-details update.
    -------------------------------------------------------- */

    const { data: productImages, error: imagesError } = await supabaseAdmin
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
      .eq("product_id", id)
      .order("sort_order", {
        ascending: true,
      });

    if (imagesError) {
      console.warn(
        "Updated product, but could not reload product images:",
        imagesError,
      );
    }

    /* --------------------------------------------------------
       RESPONSE
    -------------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,

        message: "Product updated successfully.",

        product: {
          ...updatedProduct,

          sizes: updatedProduct?.metadata?.sizes ?? normalizedSizes,

          product_images: productImages ?? [],
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to update product.",
      500,
    );
  }
}

/* ============================================================
   PUT SINGLE PRODUCT
============================================================ */

export const PUT = PATCH;
