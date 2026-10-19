import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

type CartItem = {
  product_id?: string | null;
  productId?: string | null;

  variant_id?: string | null;
  variantId?: string | null;

  product_name?: string | null;
  name?: string | null;

  product_image?: string | null;
  product_image_url?: string | null;
  image_url?: string | null;
  image?: string | null;

  sku?: string | null;
  product_sku?: string | null;

  quantity_count?: number | null;
  quantity?: number | null;

  unit_price?: number | null;
  selling_price?: number | null;
  base_price?: number | null;
  price?: number | null;

  mrp?: number | null;
  product_mrp?: number | null;

  total_price?: number | null;

  net_quantity?: string | null;
  size?: string | null;

  variant_details?: unknown;
  variantDetails?: unknown;

  customization?: unknown;

  product_type?: string | null;
  productType?: string | null;
  is_custom?: boolean | null;
  isCustom?: boolean | null;
};

type OrderAddress = {
  country: string;
  landmark: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment variables are not configured.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/* ============================================================
   HELPERS
============================================================ */

function getQuantity(item: CartItem) {
  const quantity = Number(item.quantity_count ?? item.quantity ?? 0);

  return Number.isFinite(quantity) ? Math.floor(quantity) : 0;
}

function getUnitPrice(item: CartItem) {
  const price = Number(
    item.unit_price ?? item.selling_price ?? item.base_price ?? item.price ?? 0,
  );

  return Number.isFinite(price) && price >= 0 ? price : 0;
}

function getMrp(item: CartItem) {
  const mrp = Number(
    item.mrp ??
      item.product_mrp ??
      item.base_price ??
      item.price ??
      item.unit_price ??
      0,
  );

  return Number.isFinite(mrp) && mrp >= 0 ? mrp : 0;
}

function getProductId(item: CartItem) {
  return item.product_id ?? item.productId ?? null;
}

function getVariantId(item: CartItem) {
  return item.variant_id ?? item.variantId ?? null;
}

function getProductName(item: CartItem) {
  return item.product_name?.trim() || item.name?.trim() || "";
}

function getProductImage(item: CartItem) {
  return (
    item.product_image_url ??
    item.product_image ??
    item.image_url ??
    item.image ??
    null
  );
}

function getSku(item: CartItem) {
  return item.sku?.trim() || item.product_sku?.trim() || null;
}

function getVariantDetails(item: CartItem) {
  if (item.variant_details !== undefined && item.variant_details !== null) {
    return item.variant_details;
  }

  if (item.variantDetails !== undefined && item.variantDetails !== null) {
    return item.variantDetails;
  }

  const size = item.net_quantity ?? item.size ?? null;

  if (size) {
    return {
      size,
    };
  }

  return {};
}

/* ============================================================
   POST
============================================================ */

export async function POST(request: Request) {
  try {
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpaySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "RAZORPAY_KEY_SECRET is not configured.",
        },
        { status: 500 },
      );
    }

    /* ========================================================
       AUTHENTICATE USER
    ======================================================== */

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing authentication token.",
        },
        { status: 401 },
      );
    }

    const accessToken = authorization.slice(7).trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid authentication token.",
        },
        { status: 401 },
      );
    }

    const supabaseAdmin = getAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("Authenticated user lookup failed:", userError);

      return NextResponse.json(
        {
          success: false,
          error: "Your login session is invalid or expired.",
        },
        { status: 401 },
      );
    }

    /* ========================================================
       READ REQUEST
    ======================================================== */

    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      customer_name,
      customer_email,
      customer_phone,

      address,

      subtotal,
      delivery_charge,
      discount,
      coupon_code,
      total_amount,

      cart,
    } = body as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;

      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;

      address?: OrderAddress;

      subtotal?: number;
      delivery_charge?: number;
      discount?: number;
      coupon_code?: string | null;
      total_amount?: number;

      cart?: CartItem[];
    };

    /* ========================================================
       VALIDATE PAYMENT DETAILS
    ======================================================== */

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Razorpay payment details.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       VALIDATE CUSTOMER DETAILS
    ======================================================== */

    if (
      !customer_name?.trim() ||
      !customer_email?.trim() ||
      !customer_phone?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer details are required.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       VALIDATE ADDRESS
    ======================================================== */

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error: "Delivery address is required.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       VALIDATE CART
    ======================================================== */

    if (!Array.isArray(cart) || cart.length === 0 || cart.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       VALIDATE CART ITEMS

       order_items.quantity has:
       CHECK (quantity > 0)

       product_name is NOT NULL.

       unit_price, mrp and total_price are NOT NULL.
    ======================================================== */

    for (const item of cart) {
      const quantity = getQuantity(item);

      const productName = getProductName(item);

      const unitPrice = getUnitPrice(item);

      const mrp = getMrp(item);

      if (quantity <= 0 || quantity > 100 || !Number.isSafeInteger(quantity)) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid product quantity in cart.",
          },
          { status: 400 },
        );
      }

      if (!getProductId(item)) {
        return NextResponse.json(
          { success: false, error: "A product ID is missing from the cart." },
          { status: 400 },
        );
      }

      if (!productName) {
        return NextResponse.json(
          {
            success: false,
            error: "A product name is missing from the cart.",
          },
          { status: 400 },
        );
      }

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid product price in cart.",
          },
          { status: 400 },
        );
      }

      if (!Number.isFinite(mrp) || mrp < 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid product MRP in cart.",
          },
          { status: 400 },
        );
      }
    }

    /* ========================================================
       RE-CALCULATE PRICES FROM THE DATABASE

       Never trust prices, subtotal, shipping, discount, or total
       sent by the browser. These calculations must match the
       Create Order API pricing rules.
    ======================================================== */

    const subtotalValue = Number(subtotal ?? 0);
    const deliveryChargeValue = Number(delivery_charge ?? 0);
    const discountValue = Number(discount ?? 0);
    const totalAmountValue = Number(total_amount ?? 0);

    if (
      !Number.isFinite(subtotalValue) ||
      subtotalValue < 0 ||
      !Number.isFinite(deliveryChargeValue) ||
      deliveryChargeValue < 0 ||
      !Number.isFinite(discountValue) ||
      discountValue < 0 ||
      !Number.isFinite(totalAmountValue) ||
      totalAmountValue <= 0
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount." },
        { status: 400 },
      );
    }

    const normalizedCoupon = String(coupon_code ?? "")
      .trim()
      .toUpperCase();
    const firstOrderCoupon = "THEBACK5";
    const freeDeliveryCoupon = "VICKYFREEDEL";
    const freeDeliveryThreshold = 1999;
    const state = String(address.state ?? "").trim();

    if (!state) {
      return NextResponse.json(
        { success: false, error: "Delivery state is required." },
        { status: 400 },
      );
    }

    if (
      normalizedCoupon &&
      normalizedCoupon !== firstOrderCoupon &&
      normalizedCoupon !== freeDeliveryCoupon
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid coupon code." },
        { status: 400 },
      );
    }

    const authoritativePrices = new Map<string, number>();
    let calculatedSubtotal = 0;
    let totalQuantity = 0;

    for (const item of cart) {
      const productId = String(getProductId(item) ?? "").trim();
      const explicitType = String(
        item.product_type ?? item.productType ?? "normal",
      ).toLowerCase();
      const isCustom =
        item.is_custom === true ||
        item.isCustom === true ||
        explicitType === "custom";
      const productType = isCustom ? "custom" : explicitType;
      const quantity = getQuantity(item);

      if (
        !productId ||
        !["normal", "collectible", "custom"].includes(productType)
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid product in cart." },
          { status: 400 },
        );
      }

      const table =
        productType === "custom"
          ? "custom_products"
          : productType === "collectible"
            ? "collectibles"
            : "products";

      const { data: product, error: priceError } = await supabaseAdmin
        .from(table)
        .select("id, price")
        .eq("id", productId)
        .maybeSingle();

      if (priceError) {
        console.error(`Price lookup failed for ${table}:`, priceError.message);
        return NextResponse.json(
          { success: false, error: "Unable to validate product prices." },
          { status: 500 },
        );
      }

      const authoritativePrice = Number(product?.price);
      if (
        !product ||
        !Number.isFinite(authoritativePrice) ||
        authoritativePrice <= 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "A product is unavailable or has an invalid price.",
          },
          { status: 400 },
        );
      }

      const priceKey = `${productType}:${productId}`;
      authoritativePrices.set(priceKey, authoritativePrice);
      calculatedSubtotal += authoritativePrice * quantity;
      totalQuantity += quantity;

      // Reject manipulated client prices before writing order items.
      if (
        Math.round(getUnitPrice(item) * 100) !==
        Math.round(authoritativePrice * 100)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Cart prices have changed. Please refresh your cart.",
          },
          { status: 400 },
        );
      }
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));

    let calculatedDiscount = 0;
    if (normalizedCoupon === firstOrderCoupon) {
      const authenticatedEmail = String(user.email ?? "").trim();
      if (
        !authenticatedEmail ||
        customer_email?.trim().toLowerCase() !==
          authenticatedEmail.toLowerCase()
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Checkout email must match your signed-in account to use this coupon.",
          },
          { status: 400 },
        );
      }

      const { data: previousOrders, error: previousOrdersError } =
        await supabaseAdmin
          .from("orders")
          .select("id")
          .ilike("customer_email", authenticatedEmail)
          .limit(1);

      if (previousOrdersError) {
        console.error(
          "First-order coupon validation failed:",
          previousOrdersError.message,
        );
        return NextResponse.json(
          { success: false, error: "Unable to validate coupon eligibility." },
          { status: 500 },
        );
      }

      if ((previousOrders ?? []).length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "This coupon is only available to first-time customers.",
          },
          { status: 400 },
        );
      }

      calculatedDiscount = Math.round(calculatedSubtotal * 5) / 100;
    }

    const normalizedState = state.toLowerCase();
    const isTamilNadu = normalizedState === "tamil nadu";
    const isSouthIndia = [
      "kerala",
      "telangana",
      "andhra pradesh",
      "karnataka",
    ].includes(normalizedState);
    const isFreeDelivery =
      calculatedSubtotal > freeDeliveryThreshold ||
      normalizedCoupon === freeDeliveryCoupon;
    const calculatedDelivery = isFreeDelivery
      ? 0
      : isTamilNadu
        ? totalQuantity <= 3
          ? 50
          : 80
        : isSouthIndia
          ? totalQuantity <= 3
            ? 100
            : 130
          : totalQuantity <= 3
            ? 200
            : 230;

    const calculatedTotal = Number(
      (calculatedSubtotal + calculatedDelivery - calculatedDiscount).toFixed(2),
    );

    if (
      Math.round(subtotalValue * 100) !==
        Math.round(calculatedSubtotal * 100) ||
      Math.round(deliveryChargeValue * 100) !==
        Math.round(calculatedDelivery * 100) ||
      Math.round(discountValue * 100) !==
        Math.round(calculatedDiscount * 100) ||
      Math.round(totalAmountValue * 100) !== Math.round(calculatedTotal * 100)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Order totals do not match current product pricing. Please restart checkout.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       VERIFY RAZORPAY SIGNATURE AND FETCH PAYMENT STATE
    ======================================================== */

    const generatedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const generatedBuffer = Buffer.from(generatedSignature, "utf8");
    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    if (
      generatedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 },
      );
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      return NextResponse.json(
        { success: false, error: "Payment service is not configured." },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
    });
    const [razorpayOrder, razorpayPayment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);

    const expectedAmountPaise = Math.round(calculatedTotal * 100);
    if (
      razorpayOrder.id !== razorpay_order_id ||
      razorpayOrder.currency !== "INR" ||
      Number(razorpayOrder.amount) !== expectedAmountPaise ||
      razorpayPayment.order_id !== razorpay_order_id ||
      Number(razorpayPayment.amount) !== expectedAmountPaise ||
      razorpayPayment.currency !== "INR" ||
      razorpayPayment.status !== "captured"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment is not captured or the paid amount does not match the order total.",
        },
        { status: 400 },
      );
    }

    /* ========================================================
       IDEMPOTENCY: PREVENT THE SAME PAYMENT CREATING TWO ORDERS

       Requires the migration that adds a UNIQUE
       orders.razorpay_payment_id column.
    ======================================================== */

    const { data: existingOrder, error: existingOrderError } =
      await supabaseAdmin
        .from("orders")
        .select("id, order_number, payment_status, total_amount")
        .eq("razorpay_payment_id", razorpay_payment_id)
        .maybeSingle();

    if (existingOrderError) {
      console.error("Idempotency lookup failed:", existingOrderError.message);
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to confirm whether this payment was already processed.",
        },
        { status: 500 },
      );
    }

    if (existingOrder) {
      // A payment ID is processed once. Do not insert items or decrement stock again.
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: "This payment has already been processed.",
        order: existingOrder,
      });
    }

    /* ========================================================
       PREPARE DELIVERY ADDRESS

       orders.delivery_address = JSONB
    ======================================================== */

    const deliveryAddress = {
      country: address.country?.trim() ?? "",

      landmark: address.landmark?.trim() ?? "",

      addressLine1: address.addressLine1?.trim() ?? "",

      addressLine2: address.addressLine2?.trim() ?? "",

      state: address.state?.trim() ?? "",

      district: address.district?.trim() ?? "",

      city: address.city?.trim() ?? "",

      pincode: address.pincode?.trim() ?? "",
    };

    /* ========================================================
       GENERATE UNIQUE ORDER NUMBER

       orders.order_number:
       - NOT NULL
       - UNIQUE
       - no database default
    ======================================================== */

    const orderNumber = `ORD-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    /* ========================================================
       CREATE ORDER

       Actual orders columns being used:

       order_number
       customer_name
       customer_email
       customer_phone
       status
       payment_method
       payment_status
       subtotal
       shipping_amount
       total_amount
       delivery_address

       discount_amount uses database default = 0.
    ======================================================== */

    const orderPayload = {
      order_number: orderNumber,

      customer_name: customer_name.trim(),

      customer_email: customer_email.trim(),

      customer_phone: customer_phone.trim(),

      status: "Placed",

      payment_method: "Online Payment",

      payment_status: "Paid",

      razorpay_payment_id,

      subtotal: subtotalValue,

      shipping_amount: deliveryChargeValue,

      discount_amount: discountValue,

      total_amount: totalAmountValue,

      delivery_address: deliveryAddress,
    };

    console.log("Creating order server-side:", {
      order_number: orderNumber,

      user_id: user.id,
      subtotal: subtotalValue,

      shipping_amount: deliveryChargeValue,

      total_amount: totalAmountValue,
    });

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select()
      .single();

    if (orderError || !order) {
      console.error("Create order error:", orderError);

      return NextResponse.json(
        {
          success: false,
          error: orderError?.message || "Unable to create order.",
        },
        { status: 500 },
      );
    }

    /* ========================================================
       DETECT CUSTOM PRODUCTS

       Custom products live in custom_products, while normal
       products live in products.

       order_items.product_id has a foreign key to products.id,
       so a custom_products.id must NEVER be written into
       order_items.product_id.

       The checkout sends product_type/is_custom for custom items.
       We also verify against custom_products so this API remains
       safe if an older checkout payload does not include those
       fields.
    ======================================================== */

    const productIds = Array.from(
      new Set(
        cart
          .map((item) => getProductId(item))
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const customProductIds = new Set<string>();

    if (productIds.length > 0) {
      const { data: customProducts, error: customProductsError } =
        await supabaseAdmin
          .from("custom_products")
          .select("id")
          .in("id", productIds);

      if (customProductsError) {
        console.error("Custom product lookup error:", customProductsError);

        return NextResponse.json(
          {
            success: false,
            error:
              customProductsError.message ||
              "Unable to validate custom products.",
          },
          { status: 500 },
        );
      }

      for (const customProduct of customProducts ?? []) {
        if (customProduct?.id) {
          customProductIds.add(String(customProduct.id));
        }
      }
    }

    /* ========================================================
       DETECT COLLECTIBLES

       Collectibles are stored in the collectibles table, not
       products. order_items.product_id references products.id,
       so collectible IDs must not be written into that column.
    ======================================================== */

    const collectibleProductIds = new Set<string>();

    if (productIds.length > 0) {
      const { data: collectibles, error: collectiblesError } =
        await supabaseAdmin
          .from("collectibles")
          .select("id")
          .in("id", productIds);

      if (collectiblesError) {
        console.error("Collectible lookup error:", collectiblesError);

        return NextResponse.json(
          {
            success: false,
            error:
              collectiblesError.message ||
              "Unable to validate collectible products.",
          },
          { status: 500 },
        );
      }

      for (const collectible of collectibles ?? []) {
        if (collectible?.id) {
          collectibleProductIds.add(String(collectible.id));
        }
      }
    }

    const isCustomCartItem = (item: CartItem) => {
      const explicitType = String(
        item.product_type ?? item.productType ?? "",
      ).toLowerCase();

      return (
        item.is_custom === true ||
        item.isCustom === true ||
        explicitType === "custom" ||
        customProductIds.has(String(getProductId(item) ?? ""))
      );
    };

    const isCollectibleCartItem = (item: CartItem) => {
      const explicitType = String(
        item.product_type ?? item.productType ?? "",
      ).toLowerCase();

      return (
        explicitType === "collectible" ||
        collectibleProductIds.has(String(getProductId(item) ?? ""))
      );
    };

    /* ========================================================
       CREATE ORDER ITEMS

       IMPORTANT:
       - Normal product -> product_id = products.id
       - Custom product -> product_id = null

       Custom product information is preserved inside
       variant_details so it remains available to the order
       history without violating order_items_product_id_fkey.
    ======================================================== */

    const orderItems = cart.map((item) => {
      const quantity = getQuantity(item);
      const productId = String(getProductId(item) ?? "").trim();
      const explicitType = String(
        item.product_type ?? item.productType ?? "normal",
      ).toLowerCase();
      const isCustomByFlag =
        item.is_custom === true ||
        item.isCustom === true ||
        explicitType === "custom";
      const priceType = isCustomByFlag ? "custom" : explicitType;
      const unitPrice =
        authoritativePrices.get(`${priceType}:${productId}`) ?? 0;
      const mrp = Math.max(getMrp(item), unitPrice);

      const totalPrice = Number((unitPrice * quantity).toFixed(2));

      const isCustom = isCustomCartItem(item);
      const isCollectible = !isCustom && isCollectibleCartItem(item);
      const isSeparateCatalogItem = isCustom || isCollectible;

      const baseVariantDetails = getVariantDetails(item);

      const variantDetails = isSeparateCatalogItem
        ? {
            ...(baseVariantDetails &&
            typeof baseVariantDetails === "object" &&
            !Array.isArray(baseVariantDetails)
              ? baseVariantDetails
              : {}),
            ...(isCustom
              ? {
                  is_custom: true,
                  custom_product_id: getProductId(item),
                  customization: item.customization ?? null,
                }
              : {
                  is_collectible: true,
                  collectible_id: getProductId(item),
                }),
          }
        : baseVariantDetails;

      return {
        order_id: order.id,

        // Only normal product IDs can reference products.id.
        product_id: isSeparateCatalogItem ? null : getProductId(item),

        variant_id: isSeparateCatalogItem ? null : getVariantId(item),

        product_name: getProductName(item),

        variant_details: variantDetails,

        product_image_url: getProductImage(item),

        sku: getSku(item),

        quantity,

        unit_price: unitPrice,

        mrp,

        total_price: totalPrice,
      };
    });

    const { data: createdItems, error: orderItemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems)
      .select();

    if (
      orderItemsError ||
      !createdItems ||
      createdItems.length !== orderItems.length
    ) {
      console.error("Create order items error:", orderItemsError);

      /*
       * Remove the order because its items
       * could not be created.
       */
      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        {
          success: false,
          error: orderItemsError?.message || "Unable to create order items.",
        },
        { status: 500 },
      );
    }

    /* ========================================================
       UPDATE PRODUCT STOCK
    ======================================================== */

    for (const item of cart) {
      const productId = getProductId(item);

      const purchasedQuantity = getQuantity(item);

      // Custom products do not use stock updates in this flow.
      if (isCustomCartItem(item)) {
        continue;
      }

      if (!productId || purchasedQuantity <= 0) {
        continue;
      }

      const isCollectible = isCollectibleCartItem(item);
      const inventoryTable = isCollectible ? "collectibles" : "products";

      const { data: product, error: productError } = await supabaseAdmin
        .from(inventoryTable)
        .select("id, stock")
        .eq("id", productId)
        .single();

      if (productError || !product) {
        console.error(`Get ${inventoryTable} stock error:`, productError);

        return NextResponse.json(
          {
            success: false,
            error:
              productError?.message ||
              `${isCollectible ? "Collectible" : "Product"} not found while updating stock.`,
          },
          { status: 500 },
        );
      }

      const currentStock = Number(product.stock ?? 0);
      if (!Number.isFinite(currentStock) || currentStock < purchasedQuantity) {
        console.error("Insufficient stock after payment was captured:", {
          productId,
          currentStock,
          purchasedQuantity,
        });
        return NextResponse.json(
          {
            success: false,
            error:
              "Payment was received, but stock needs manual order review. Please contact support.",
          },
          { status: 409 },
        );
      }
      const newStock = currentStock - purchasedQuantity;

      // Compare-and-set prevents two concurrent checkouts from overwriting
      // each other's stock changes. A stock value changed by another request
      // makes this update affect zero rows and requires manual review.
      const { data: updatedStockRows, error: updateStockError } =
        await supabaseAdmin
          .from(inventoryTable)
          .update({ stock: newStock })
          .eq("id", productId)
          .eq("stock", currentStock)
          .select("id");

      if (
        updateStockError ||
        !updatedStockRows ||
        updatedStockRows.length !== 1
      ) {
        console.error(
          "Update product stock failed or stock changed concurrently:",
          {
            productId,
            inventoryTable,
            error: updateStockError?.message,
          },
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Payment was received, but inventory could not be safely updated. Please contact support before retrying.",
            manualReviewRequired: true,
          },
          { status: 409 },
        );
      }
    }

    /* ========================================================
       DELETE USER CART

       cart_items DOES contain user_id.
    ======================================================== */

    const { error: cartError } = await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (cartError) {
      console.error("Normal cart cleanup error:", cartError);

      /*
       * Do not fail the order because the
       * cart cleanup failed.
       */
    }

    const { error: customCartError } = await supabaseAdmin
      .from("custom_cart_items")
      .delete()
      .eq("user_id", user.id);

    if (customCartError) {
      console.error("Custom cart cleanup error:", customCartError);

      /*
       * Do not fail the order because the
       * cart cleanup failed.
       */
    }

    /* ========================================================
       SUCCESS
    ======================================================== */

    console.log("ORDER FINALIZED SUCCESSFULLY:", {
      orderId: order.id,

      orderNumber: order.order_number,

      userId: user.id,
    });

    return NextResponse.json({
      success: true,

      message: "Payment verified and order created successfully.",

      order,
    });
  } catch (error) {
    console.error("Razorpay verification/order finalization error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Payment verification failed.",
      },
      { status: 500 },
    );
  }
}
