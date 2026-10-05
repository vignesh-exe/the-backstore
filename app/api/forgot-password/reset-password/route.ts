import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const verifyResetToken = (token: string) => {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");

    const parts = decoded.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const [id, expiresAtString, signature] = parts;

    if (!id || !expiresAtString || !signature) {
      return null;
    }

    const expiresAt = Number(expiresAtString);

    if (!Number.isFinite(expiresAt)) {
      return null;
    }

    if (expiresAt <= Date.now()) {
      return null;
    }

    const payload = `${id}.${expiresAt}`;

    const expectedSignature = createHmac(
      "sha256",
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
      .update(payload)
      .digest("hex");

    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    return {
      id,
      expiresAt,
    };
  } catch (error) {
    console.error("Reset token verification error:", error);
    return null;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const resetToken =
      typeof body?.resetToken === "string" ? body.resetToken.trim() : "";

    const password = typeof body?.password === "string" ? body.password : "";

    if (!email) {
      return Response.json(
        {
          error: "Email address is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!resetToken) {
      return Response.json(
        {
          error:
            "Your password reset session is invalid. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    if (!password) {
      return Response.json(
        {
          error: "New password is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          error: "Password must be at least 6 characters.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error("Supabase server configuration is missing.");

      return Response.json(
        {
          error: "Server configuration error.",
        },
        {
          status: 500,
        },
      );
    }

    /* ================================================== */
    /* VERIFY RESET TOKEN                                 */
    /* ================================================== */

    const tokenData = verifyResetToken(resetToken);

    if (!tokenData) {
      return Response.json(
        {
          error:
            "Your password reset session has expired. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    /* ================================================== */
    /* GET VERIFIED OTP RECORD                            */
    /* ================================================== */

    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("password_reset_otps")
      .select("id, user_id, email, expires_at, verified_at")
      .eq("id", tokenData.id)
      .eq("email", email)
      .not("verified_at", "is", null)
      .maybeSingle();

    if (otpError) {
      console.error("Password reset OTP lookup error:", otpError);

      return Response.json(
        {
          error: "Unable to validate password reset request.",
        },
        {
          status: 500,
        },
      );
    }

    if (!otpRecord) {
      return Response.json(
        {
          error:
            "Your password reset session is invalid. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    /* ================================================== */
    /* CHECK OTP SESSION EXPIRY                           */
    /* ================================================== */

    const otpExpiresAt = new Date(otpRecord.expires_at).getTime();

    if (Number.isNaN(otpExpiresAt) || otpExpiresAt <= Date.now()) {
      await supabaseAdmin
        .from("password_reset_otps")
        .delete()
        .eq("id", otpRecord.id);

      return Response.json(
        {
          error: "Your OTP session has expired. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    /* ================================================== */
    /* UPDATE SUPABASE AUTH PASSWORD                      */
    /* ================================================== */

    const { error: updatePasswordError } =
      await supabaseAdmin.auth.admin.updateUserById(otpRecord.user_id, {
        password,
      });

    if (updatePasswordError) {
      console.error("Supabase password update error:", updatePasswordError);

      return Response.json(
        {
          error:
            updatePasswordError.message ||
            "Unable to change password. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    /* ================================================== */
    /* DELETE USED RESET SESSION                          */
    /* ================================================== */

    const { error: deleteError } = await supabaseAdmin
      .from("password_reset_otps")
      .delete()
      .eq("id", otpRecord.id);

    if (deleteError) {
      console.error("Unable to delete used reset OTP:", deleteError);
    }

    return Response.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return Response.json(
      {
        error: "Unable to change password. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
