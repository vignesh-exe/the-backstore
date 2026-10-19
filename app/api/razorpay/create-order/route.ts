import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type CheckoutItem = {
  product_id: string;
  product_type?: "normal" | "collectible" | "custom";
  quantity: number;
  size?: string;
};

type CreateOrderBody = {
  cart: CheckoutItem[];
  state: string;
  coupon_code?: string | null;
  customer_email: string;
};

const FREE_DELIVERY_THRESHOLD = 1999;
const FIRST_ORDER_COUPON = "THEBACK5";
const FREE_DELIVERY_COUPON = "VICKYFREEDEL";

const TAMIL_NADU_STATES = new Set(["tamil nadu"]);

const SOUTH_INDIA_STATES = new Set([
  "kerala",
  "telangana",
  "andhra pradesh",
  "karnataka",
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getDeliveryFee(state: string, quantity: number): number {
  const normalizedState = state.trim().toLowerCase();

  if (TAMIL_NADU_STATES.has(normalizedState)) {
    return quantity <= 3 ? 50 : 80;
  }

  if (SOUTH_INDIA_STATES.has(normalizedState)) {
    return quantity <= 3 ? 100 : 130;
  }

  return quantity <= 3 ? 200 : 230;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!keyId || !keySecret) {
      return errorResponse("Payment service is not configured.", 500);
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return errorResponse("Server database is not configured.", 500);
    }

    // Require a valid Supabase access token.
    const authorization = request.headers.get("authorization");
    const tokenMatch = authorization?.match(/^Bearer\s+(.+)$/i);
    const accessToken = tokenMatch?.[1]?.trim();

    if (!accessToken) {
      return errorResponse("Authentication required.", 401);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (authError || !user || !user.email) {
      return errorResponse(
        "Your session is invalid or expired. Please sign in again.",
        401,
      );
    }

    let body: Partial<CreateOrderBody>;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request body.", 400);
    }

    if (
      !Array.isArray(body.cart) ||
      body.cart.length === 0 ||
      body.cart.length > 50 ||
      typeof body.state !== "string" ||
      !body.state.trim() ||
      body.state.trim().length > 100 ||
      typeof body.customer_email !== "string" ||
      !EMAIL_REGEX.test(body.customer_email.trim()) ||
      body.customer_email.trim().length > 254
    ) {
      return errorResponse("Invalid checkout details.", 400);
    }

    const coupon = String(body.coupon_code ?? "")
      .trim()
      .toUpperCase();

    if (
      coupon &&
      coupon !== FIRST_ORDER_COUPON &&
      coupon !== FREE_DELIVERY_COUPON
    ) {
      return errorResponse("Invalid coupon code.", 400);
    }

    let subtotal = 0;
    let totalQuantity = 0;

    // Reject repeated product/type combinations to prevent ambiguous cart data.
    const seenItems = new Set<string>();

    for (const item of body.cart) {
      const productId = String(item?.product_id ?? "").trim();
      const quantity = item?.quantity;
      const productType = item?.product_type ?? "normal";

      if (
        !productId ||
        productId.length > 200 ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1 ||
        quantity > 100 ||
        !["normal", "collectible", "custom"].includes(productType)
      ) {
        return errorResponse("Invalid cart item.", 400);
      }

      const itemKey = `${productType}:${productId}`;

      if (seenItems.has(itemKey)) {
        return errorResponse(
          "Duplicate cart items detected. Please refresh your cart.",
          400,
        );
      }

      seenItems.add(itemKey);

      let product: { id: string; price: number | string | null } | null = null;

      let lookupError: { message: string } | null = null;

      if (productType === "collectible") {
        const result = await supabase
          .from("collectibles")
          .select("id, price")
          .eq("id", productId)
          .maybeSingle();

        product = result.data;
        lookupError = result.error;
      } else if (productType === "custom") {
        const result = await supabase
          .from("custom_products")
          .select("id, price")
          .eq("id", productId)
          .maybeSingle();

        product = result.data;
        lookupError = result.error;
      } else {
        const result = await supabase
          .from("products")
          .select("id, price")
          .eq("id", productId)
          .maybeSingle();

        product = result.data;
        lookupError = result.error;
      }

      if (lookupError) {
        console.error("Product price lookup failed:", lookupError.message);

        return errorResponse("Unable to validate cart prices.", 500);
      }

      const price = Number(product?.price);

      if (!product || !Number.isFinite(price) || price <= 0) {
        return errorResponse(
          "A product is unavailable or has an invalid price.",
          400,
        );
      }

      subtotal += price * quantity;
      totalQuantity += quantity;
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0 ||
      !Number.isSafeInteger(totalQuantity)
    ) {
      return errorResponse("Invalid order total.", 400);
    }

    let discount = 0;

    if (coupon === FIRST_ORDER_COUPON) {
      // Use the authenticated account's email, not the client-supplied email.
      const authenticatedEmail = user.email.trim();

      const { data: existingOrders, error: ordersError } = await supabase
        .from("orders")
        .select("id")
        .ilike("customer_email", authenticatedEmail)
        .limit(1);

      if (ordersError) {
        console.error(
          "First-order coupon validation failed:",
          ordersError.message,
        );

        return errorResponse("Unable to validate coupon eligibility.", 500);
      }

      if ((existingOrders ?? []).length > 0) {
        return errorResponse(
          "This coupon is only available to first-time customers.",
          400,
        );
      }

      discount = Math.round(subtotal * 5) / 100;
    }

    const freeDelivery =
      subtotal > FREE_DELIVERY_THRESHOLD || coupon === FREE_DELIVERY_COUPON;

    const deliveryFee = freeDelivery
      ? 0
      : getDeliveryFee(body.state, totalQuantity);

    const totalRupees = Math.max(0, subtotal + deliveryFee - discount);

    const amountInPaise = Math.round(totalRupees * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return errorResponse("Invalid payment amount.", 400);
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `backstore_${crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 20)}`,
    });

    return NextResponse.json({
      success: true,
      keyId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      pricing: {
        subtotal,
        deliveryFee,
        discount,
        total: totalRupees,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay create order failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return errorResponse("Failed to create payment order.", 500);
  }
}
