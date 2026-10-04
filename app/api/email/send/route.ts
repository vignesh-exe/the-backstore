import { Resend } from "resend";

import WelcomeEmail from "@/emails/WelcomeEmail";
import OrderPlacedEmail from "@/emails/OrderPlacedEmail";
import OrderShippedEmail from "@/emails/OrderShippedEmail";
import OrderDeliveredEmail from "@/emails/OrderDeliveredEmail";
import CancellationRequestEmail from "@/emails/CancellationRequestEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderPlacedItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string | null;
  isCustom?: boolean;
  customColor?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const type = typeof body?.type === "string" ? body.type : "";

    const fullName =
      typeof body?.fullName === "string" ? body.fullName.trim() : "";

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    /*
     * ---------------------------------------------------------
     * COMMON VALIDATION
     * ---------------------------------------------------------
     */

    if (
      ![
        "welcome",
        "order-placed",
        "order-shipped",
        "order-delivered",
        "cancellation-request",
      ].includes(type)
    ) {
      return Response.json(
        {
          error: "Unsupported email type.",
        },
        {
          status: 400,
        },
      );
    }

    if (!fullName || !email) {
      return Response.json(
        {
          error: "fullName and email are required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");

      return Response.json(
        {
          error: "Email service is not configured.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * WELCOME EMAIL
     * ---------------------------------------------------------
     */

    if (type === "welcome") {
      const { data, error } = await resend.emails.send({
        from: "The Backstore <orders@thebackstore.in>",

        to: [email],

        subject: "Welcome to the Backstore Family 🐾",

        react: WelcomeEmail({
          fullName,
        }),
      });

      if (error) {
        console.error("Resend welcome email error:", error);

        return Response.json(
          {
            error: error.message,
          },
          {
            status: 500,
          },
        );
      }

      return Response.json({
        success: true,
        id: data?.id ?? null,
      });
    }

    /*
     * ---------------------------------------------------------
     * CANCELLATION REQUEST EMAIL
     * ---------------------------------------------------------
     */

    if (type === "cancellation-request") {
      const orderNumber =
        typeof body?.orderNumber === "string" ? body.orderNumber.trim() : "";

      const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

      if (!orderNumber) {
        return Response.json(
          {
            error: "orderNumber is required for cancellation-request email.",
          },
          {
            status: 400,
          },
        );
      }

      if (!reason) {
        return Response.json(
          {
            error: "reason is required for cancellation-request email.",
          },
          {
            status: 400,
          },
        );
      }

      const { data, error } = await resend.emails.send({
        from: "The Backstore <orders@thebackstore.in>",

        to: [email],

        subject: `Cancellation request received — ${orderNumber}`,

        react: CancellationRequestEmail({
          fullName,
          orderNumber,
          reason,
        }),
      });

      if (error) {
        console.error("Resend cancellation request email error:", error);

        return Response.json(
          {
            error: error.message,
          },
          {
            status: 500,
          },
        );
      }

      return Response.json({
        success: true,
        id: data?.id ?? null,
      });
    }

    /*
     * ---------------------------------------------------------
     * ORDER SHIPPED EMAIL
     * ---------------------------------------------------------
     */

    if (type === "order-shipped") {
      const orderNumber =
        typeof body?.orderNumber === "string" ? body.orderNumber.trim() : "";

      const trackingId =
        typeof body?.trackingId === "string" ? body.trackingId.trim() : "";

      if (!orderNumber) {
        return Response.json(
          {
            error: "orderNumber is required for order-shipped email.",
          },
          {
            status: 400,
          },
        );
      }

      if (!trackingId) {
        return Response.json(
          {
            error: "trackingId is required for order-shipped email.",
          },
          {
            status: 400,
          },
        );
      }

      const { data, error } = await resend.emails.send({
        from: "The Backstore <orders@thebackstore.in>",

        to: [email],

        subject: `Your Backstore order is on the way — ${orderNumber}`,

        react: OrderShippedEmail({
          fullName,
          orderNumber,
          trackingId,
        }),
      });

      if (error) {
        console.error("Resend order shipped email error:", error);

        return Response.json(
          {
            error: error.message,
          },
          {
            status: 500,
          },
        );
      }

      return Response.json({
        success: true,
        id: data?.id ?? null,
      });
    }

    /*
     * ---------------------------------------------------------
     * ORDER DELIVERED EMAIL
     * ---------------------------------------------------------
     */

    if (type === "order-delivered") {
      const orderNumber =
        typeof body?.orderNumber === "string" ? body.orderNumber.trim() : "";

      if (!orderNumber) {
        return Response.json(
          {
            error: "orderNumber is required for order-delivered email.",
          },
          {
            status: 400,
          },
        );
      }

      /*
       * Order Delivered email uses the same order information
       * required by the OrderDeliveredEmail component.
       */

      const items: OrderPlacedItem[] = Array.isArray(body?.items)
        ? body.items.map((item: OrderPlacedItem) => ({
            name: typeof item?.name === "string" ? item.name : "",

            size: typeof item?.size === "string" ? item.size : "",

            quantity: Number(item?.quantity) || 0,

            price: Number(item?.price) || 0,

            image: typeof item?.image === "string" ? item.image : null,

            isCustom: Boolean(item?.isCustom),

            customColor:
              typeof item?.customColor === "string" ? item.customColor : null,
          }))
        : [];

      const totalAmount = Number(body?.totalAmount) || 0;

      const paymentMethod =
        typeof body?.paymentMethod === "string"
          ? body.paymentMethod.trim()
          : "";

      if (!items.length) {
        return Response.json(
          {
            error:
              "At least one order item is required for order-delivered email.",
          },
          {
            status: 400,
          },
        );
      }

      if (!paymentMethod) {
        return Response.json(
          {
            error: "paymentMethod is required for order-delivered email.",
          },
          {
            status: 400,
          },
        );
      }

      const { data, error } = await resend.emails.send({
        from: "The Backstore <orders@thebackstore.in>",

        to: [email],

        subject: `Your Backstore order has been delivered — ${orderNumber}`,

        react: OrderDeliveredEmail({
          fullName,
          orderNumber,
          items,
          totalAmount,
          paymentMethod,
        }),
      });

      if (error) {
        console.error("Resend order delivered email error:", error);

        return Response.json(
          {
            error: error.message,
          },
          {
            status: 500,
          },
        );
      }

      return Response.json({
        success: true,
        id: data?.id ?? null,
      });
    }

    /*
     * ---------------------------------------------------------
     * ORDER PLACED EMAIL
     * ---------------------------------------------------------
     */

    const orderNumber =
      typeof body?.orderNumber === "string" ? body.orderNumber.trim() : "";

    const items: OrderPlacedItem[] = Array.isArray(body?.items)
      ? body.items.map((item: OrderPlacedItem) => ({
          name: typeof item?.name === "string" ? item.name : "",

          size: typeof item?.size === "string" ? item.size : "",

          quantity: Number(item?.quantity) || 0,

          price: Number(item?.price) || 0,

          image: typeof item?.image === "string" ? item.image : null,

          isCustom: Boolean(item?.isCustom),

          customColor:
            typeof item?.customColor === "string" ? item.customColor : null,
        }))
      : [];

    const subtotal = Number(body?.subtotal) || 0;

    const shippingAmount = Number(body?.shippingAmount) || 0;

    const discount = Number(body?.discount) || 0;

    const totalAmount = Number(body?.totalAmount) || 0;

    const couponCode =
      typeof body?.couponCode === "string" ? body.couponCode.trim() : null;

    const paymentMethod =
      typeof body?.paymentMethod === "string" ? body.paymentMethod.trim() : "";

    if (!orderNumber) {
      return Response.json(
        {
          error: "orderNumber is required for order-placed email.",
        },
        {
          status: 400,
        },
      );
    }

    if (!items.length) {
      return Response.json(
        {
          error: "At least one order item is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!paymentMethod) {
      return Response.json(
        {
          error: "paymentMethod is required for order-placed email.",
        },
        {
          status: 400,
        },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "The Backstore <orders@thebackstore.in>",

      to: [email],

      subject: `Your Backstore order is confirmed — ${orderNumber}`,

      react: OrderPlacedEmail({
        fullName,
        orderNumber,
        items,
        subtotal,
        shippingAmount,
        discount,
        couponCode,
        totalAmount,
        paymentMethod,
      }),
    });

    if (error) {
      console.error("Resend order placed email error:", error);

      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      success: true,
      id: data?.id ?? null,
    });
  } catch (error) {
    console.error("Email API error:", error);

    return Response.json(
      {
        error: "Failed to send email.",
      },
      {
        status: 500,
      },
    );
  }
}
