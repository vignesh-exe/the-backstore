import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

const VALID_STATUSES: OrderStatus[] = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
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

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !user) {
    console.error("Admin order status auth failed:", error);

    return {
      user: null,
      error: "Your login session is invalid or expired.",
    };
  }

  return {
    user,
    error: null,
  };
}

export async function PATCH(request: Request) {
  try {
    if (!supabaseAdmin) {
      return jsonError("Supabase server configuration is missing.", 500);
    }

    const { user, error: authError } = await getAuthenticatedUser(request);

    if (!user) {
      return jsonError(authError || "Authentication is required.", 401);
    }

    let body: {
      order_id?: unknown;
      status?: unknown;
      tracking_id?: unknown;
    };

    try {
      body = (await request.json()) as typeof body;
    } catch {
      return jsonError("Invalid request body.");
    }

    const orderId =
      typeof body.order_id === "string" ? body.order_id.trim() : "";

    const status = typeof body.status === "string" ? body.status.trim() : "";

    const trackingId =
      typeof body.tracking_id === "string" ? body.tracking_id.trim() : null;

    if (!orderId) {
      return jsonError("Order ID is required.");
    }

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      return jsonError("Invalid order status.");
    }

    const trackingStatuses: OrderStatus[] = [
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    if (trackingStatuses.includes(status as OrderStatus) && !trackingId) {
      return jsonError(
        "Tracking ID is required for shipped and delivery statuses.",
      );
    }

    const updatePayload: {
      status: OrderStatus;
      tracking_id?: string | null;
    } = {
      status: status as OrderStatus,
    };

    if (trackingStatuses.includes(status as OrderStatus)) {
      updatePayload.tracking_id = trackingId;
    } else if (trackingId !== null) {
      updatePayload.tracking_id = trackingId;
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .select(
        `
        id,
        order_number,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        subtotal,
        shipping_amount,
        total_amount,
        payment_method,
        payment_status,
        status,
        created_at,
        updated_at,
        tracking_id
      `,
      )
      .maybeSingle();

    if (error) {
      console.error("Supabase order status update failed:", error);

      return jsonError(error.message || "Unable to update order status.", 500);
    }

    if (!data) {
      return jsonError("Order was not found or could not be updated.", 404);
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/status failed:", error);

    return jsonError(
      error instanceof Error ? error.message : "Unable to update order status.",
      500,
    );
  }
}
