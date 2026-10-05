import { createHash, createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

const createResetToken = (id: string, expiresAt: number) => {
  const payload = `${id}.${expiresAt}`;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  return Buffer.from(`${payload}.${signature}`).toString("base64url");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

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

    if (!/^\d{4}$/.test(otp)) {
      return Response.json(
        {
          error: "Please enter the 4-digit OTP.",
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
    /* FIND OTP                                            */
    /* ================================================== */

    const { data: otpRecord, error: otpLookupError } = await supabaseAdmin
      .from("password_reset_otps")
      .select("id, user_id, email, otp_hash, expires_at, attempts, verified_at")
      .eq("email", email)
      .is("verified_at", null)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (otpLookupError) {
      console.error("OTP lookup error:", otpLookupError);

      return Response.json(
        {
          error: "Unable to verify OTP.",
        },
        {
          status: 500,
        },
      );
    }

    if (!otpRecord) {
      return Response.json(
        {
          error: "No active OTP found. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    /* ================================================== */
    /* CHECK EXPIRY                                        */
    /* ================================================== */

    const expiresAt = new Date(otpRecord.expires_at).getTime();

    if (Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
      await supabaseAdmin
        .from("password_reset_otps")
        .delete()
        .eq("id", otpRecord.id);

      return Response.json(
        {
          error: "This OTP has expired. Please request a new OTP.",
        },
        {
          status: 400,
        },
      );
    }

    /* ================================================== */
    /* CHECK ATTEMPTS                                      */
    /* ================================================== */

    if (otpRecord.attempts >= 5) {
      await supabaseAdmin
        .from("password_reset_otps")
        .delete()
        .eq("id", otpRecord.id);

      return Response.json(
        {
          error: "Too many incorrect attempts. Please request a new OTP.",
        },
        {
          status: 429,
        },
      );
    }

    /* ================================================== */
    /* VERIFY OTP                                         */
    /* ================================================== */

    const providedHash = hashOtp(otp);
    const storedHash = otpRecord.otp_hash;

    const hashesMatch =
      providedHash.length === storedHash.length &&
      timingSafeEqual(Buffer.from(providedHash), Buffer.from(storedHash));

    if (!hashesMatch) {
      const nextAttempts = otpRecord.attempts + 1;

      await supabaseAdmin
        .from("password_reset_otps")
        .update({
          attempts: nextAttempts,
        })
        .eq("id", otpRecord.id);

      const remainingAttempts = Math.max(0, 5 - nextAttempts);

      return Response.json(
        {
          error:
            remainingAttempts > 0
              ? `Invalid OTP. ${remainingAttempts} attempt${
                  remainingAttempts === 1 ? "" : "s"
                } remaining.`
              : "Too many incorrect attempts. Please request a new OTP.",
        },
        {
          status: remainingAttempts > 0 ? 400 : 429,
        },
      );
    }

    /* ================================================== */
    /* MARK OTP VERIFIED                                   */
    /* ================================================== */

    const { error: verifyUpdateError } = await supabaseAdmin
      .from("password_reset_otps")
      .update({
        verified_at: new Date().toISOString(),
      })
      .eq("id", otpRecord.id)
      .is("verified_at", null);

    if (verifyUpdateError) {
      console.error("OTP verification update error:", verifyUpdateError);

      return Response.json(
        {
          error: "Unable to complete OTP verification.",
        },
        {
          status: 500,
        },
      );
    }

    /* ================================================== */
    /* CREATE SHORT-LIVED RESET TOKEN                     */
    /* ================================================== */

    const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

    const resetToken = createResetToken(otpRecord.id, resetTokenExpiresAt);

    return Response.json({
      success: true,
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Verify password reset OTP error:", error);

    return Response.json(
      {
        error: "Unable to verify OTP. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
