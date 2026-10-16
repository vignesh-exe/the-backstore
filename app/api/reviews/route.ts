import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

type ProductType = "t-shirt" | "collectible";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

function normalizeProductType(value: unknown): ProductType | null {
  if (value === undefined || value === null || value === "") return "t-shirt";
  if (value === "t-shirt" || value === "collectible") return value;
  return null;
}

async function getAuthenticatedUser(request: Request) {
  if (!supabaseAdmin) {
    return { user: null, error: "Supabase server configuration is missing." };
  }
  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return { user: null, error: "Please log in to submit a review." };
  }
  const accessToken = authorization.slice(7).trim();
  if (!accessToken) {
    return { user: null, error: "Please log in to submit a review." };
  }
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    return { user: null, error: "Your login session is invalid or expired." };
  }
  return { user: data.user, error: null };
}

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId")?.trim();
    const productType = normalizeProductType(searchParams.get("productType"));
    if (!productId) return jsonError("Product ID is required.");
    if (!productType) return jsonError("Invalid product type.");

    const { data, error } = await supabaseAdmin
      .from("product_reviews")
      .select(
        "id, product_id, product_type, user_id, customer_name, rating, review, created_at, updated_at",
      )
      .eq("product_id", productId)
      .eq("product_type", productType)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Failed to load product reviews:",
        JSON.stringify(error, null, 2),
      );
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, reviews: data ?? [] },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("GET /api/reviews failed:", error);
    return jsonError(
      "An unexpected error occurred while loading reviews.",
      500,
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    const { user, error: authError } = await getAuthenticatedUser(request);
    if (!user)
      return jsonError(authError || "Authentication is required.", 401);

    let body: {
      productId?: unknown;
      productType?: unknown;
      rating?: unknown;
      review?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid request body.");
    }

    const productId =
      typeof body.productId === "string" ? body.productId.trim() : "";
    const productType = normalizeProductType(body.productType);
    const rating = Number(body.rating);
    const review = typeof body.review === "string" ? body.review.trim() : "";

    if (!productId) return jsonError("Product ID is required.");
    if (!productType) return jsonError("Invalid product type.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return jsonError("Rating must be between 1 and 5.");
    }
    if (!review || review.length > 1000) {
      return jsonError("Review must contain between 1 and 1000 characters.");
    }

    const metadata = user.user_metadata ?? {};
    const customerName =
      String(
        metadata.full_name ||
          metadata.name ||
          user.email?.split("@")[0] ||
          "Customer",
      )
        .trim()
        .slice(0, 120) || "Customer";

    const { data, error } = await supabaseAdmin
      .from("product_reviews")
      .insert({
        product_id: productId,
        product_type: productType,
        user_id: user.id,
        customer_name: customerName,
        rating,
        review,
      })
      .select(
        "id, product_id, product_type, user_id, customer_name, rating, review, created_at, updated_at",
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return jsonError("You have already reviewed this product.", 409);
      }
      console.error("Failed to submit product review:", error);
      return jsonError("Unable to submit your review.", 500);
    }

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews failed:", error);
    return jsonError(
      "An unexpected error occurred while submitting your review.",
      500,
    );
  }
}
