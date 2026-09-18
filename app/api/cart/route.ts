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
   TYPES
============================================================ */

type AddToCartBody = {
  productId?: string;
  size?: string;
  quantity?: number | string;
};

const SIZE_KEYS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type SizeKey = (typeof SIZE_KEYS)[number];

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

function normalizeSize(value: unknown): SizeKey | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toUpperCase();

  return SIZE_KEYS.includes(normalized as SizeKey)
    ? (normalized as SizeKey)
    : null;
}

function normalizeQuantity(value: unknown) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity)) {
    return null;
  }

  const normalized = Math.floor(quantity);

  if (normalized < 1) {
    return null;
  }

  return normalized;
}

function normalizeSizes(value: unknown): Record<SizeKey, number> {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return SIZE_KEYS.reduce(
    (result, size) => {
      const rawValue = source[size] ?? source[size.toLowerCase()] ?? 0;

      const number = Number(rawValue);

      result[size] = Number.isFinite(number)
        ? Math.max(0, Math.floor(number))
        : 0;

      return result;
    },
    {} as Record<SizeKey, number>,
  );
}

async function getAuthenticatedUser(request: Request) {
  if (!supabaseAdmin) {
    return {
      user: null,
      error: "Supabase server configuration is missing.",
    };
  }

  const authorization = request.headers.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return {
      user: null,
      error: "Authentication is required.",
    };
  }

  const accessToken = authorization.slice(7).trim();

  if (!accessToken) {
    return {
      user: null,
      error: "Authentication is required.",
    };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    return {
      user: null,
      error: "Your session is invalid or has expired.",
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

/* ============================================================
   POST — ADD ITEM TO CART
============================================================ */

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    /* --------------------------------------------------------
       AUTHENTICATE USER
    -------------------------------------------------------- */

    const { user, error: authError } = await getAuthenticatedUser(request);

    if (!user) {
      return jsonError(authError || "Authentication is required.", 401);
    }

    /* --------------------------------------------------------
       READ REQUEST
    -------------------------------------------------------- */

    let body: AddToCartBody;

    try {
      body = (await request.json()) as AddToCartBody;
    } catch {
      return jsonError("Invalid request body.");
    }

    const productId =
      typeof body.productId === "string" ? body.productId.trim() : "";

    const size = normalizeSize(body.size);

    const quantity = normalizeQuantity(body.quantity);

    if (!productId) {
      return jsonError("Product ID is required.");
    }

    if (!size) {
      return jsonError("A valid product size is required.");
    }

    if (quantity === null) {
      return jsonError("Quantity must be at least 1.");
    }

    /* --------------------------------------------------------
       LOAD PRODUCT
    -------------------------------------------------------- */

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select(
        `
            id,
            name,
            price,
            mrp,
            stock,
            status,
            metadata
          `,
      )
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Cart product lookup failed:", productError);

      return jsonError(productError.message || "Unable to load product.", 500);
    }

    if (!product) {
      return jsonError("Product not found.", 404);
    }

    if (String(product.status ?? "").toLowerCase() !== "active") {
      return jsonError("This product is not currently available.", 400);
    }

    /* --------------------------------------------------------
       CHECK SIZE INVENTORY
    -------------------------------------------------------- */

    const sizes = normalizeSizes(product.metadata?.sizes);

    const availableStock = sizes[size];

    if (availableStock <= 0) {
      return jsonError(`${size} is out of stock.`, 400);
    }

    /* --------------------------------------------------------
       LOAD EXISTING CART ITEM
    -------------------------------------------------------- */

    const { data: existingItem, error: existingError } = await supabaseAdmin
      .from("cart_items")
      .select(
        `
            id,
            product_id,
            size,
            quantity
          `,
      )
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .eq("size", size)
      .maybeSingle();

    if (existingError) {
      console.error("Cart lookup failed:", existingError);

      return jsonError(existingError.message || "Unable to check cart.", 500);
    }

    /* --------------------------------------------------------
       CALCULATE FINAL QUANTITY
    -------------------------------------------------------- */

    const currentQuantity = Number(existingItem?.quantity ?? 0);

    const finalQuantity = currentQuantity + quantity;

    if (finalQuantity > availableStock) {
      return jsonError(
        `Only ${availableStock} ${size} item${
          availableStock === 1 ? "" : "s"
        } available.`,
        400,
      );
    }

    /* --------------------------------------------------------
       INSERT OR UPDATE CART
    -------------------------------------------------------- */

    let cartItem;

    if (existingItem) {
      const { data, error } = await supabaseAdmin
        .from("cart_items")
        .update({
          quantity: finalQuantity,
        })
        .eq("id", existingItem.id)
        .eq("user_id", user.id)
        .select(
          `
              id,
              user_id,
              product_id,
              size,
              quantity,
              created_at,
              updated_at
            `,
        )
        .single();

      if (error) {
        console.error("Cart update failed:", error);

        return jsonError(error.message || "Unable to update cart.", 500);
      }

      cartItem = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          size,
          quantity,
        })
        .select(
          `
              id,
              user_id,
              product_id,
              size,
              quantity,
              created_at,
              updated_at
            `,
        )
        .single();

      if (error) {
        console.error("Cart insert failed:", error);

        return jsonError(error.message || "Unable to add item to cart.", 500);
      }

      cartItem = data;
    }

    /* --------------------------------------------------------
       SUCCESS
    -------------------------------------------------------- */

    return NextResponse.json({
      success: true,

      message: existingItem ? "Cart quantity updated." : "Item added to cart.",

      cartItem,

      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
      },

      size,

      quantity: cartItem.quantity,

      availableStock,
    });
  } catch (error) {
    console.error("Add to cart API error:", error);

    return jsonError(
      error instanceof Error
        ? error.message
        : "Something went wrong while adding the item to cart.",
      500,
    );
  }
}
