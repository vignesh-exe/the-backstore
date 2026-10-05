import { createHash, randomInt } from "crypto";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const hashOtp = (otp: string) => createHash("sha256").update(otp).digest("hex");

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

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

    /* ================================================== */
    /* FIND USER                                          */
    /* ================================================== */

    let userId: string | null = null;

    let page = 1;
    const perPage = 1000;

    while (!userId) {
      const { data: usersData, error: usersError } =
        await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage,
        });

      if (usersError) {
        console.error("Unable to retrieve users:", usersError);

        return Response.json(
          {
            error: "Unable to process password reset request.",
          },
          {
            status: 500,
          },
        );
      }

      const matchingUser = usersData.users.find(
        (user) => user.email?.trim().toLowerCase() === email,
      );

      if (matchingUser) {
        userId = matchingUser.id;
        break;
      }

      if (usersData.users.length < perPage) {
        break;
      }

      page += 1;
    }

    if (!userId) {
      return Response.json(
        {
          error: "No account found with this email address.",
        },
        {
          status: 404,
        },
      );
    }

    /* ================================================== */
    /* INVALIDATE PREVIOUS OTPs                           */
    /* ================================================== */

    const { error: deleteError } = await supabaseAdmin
      .from("password_reset_otps")
      .delete()
      .eq("email", email)
      .is("verified_at", null);

    if (deleteError) {
      console.error("Unable to invalidate previous OTP:", deleteError);

      return Response.json(
        {
          error: "Unable to create password reset request.",
        },
        {
          status: 500,
        },
      );
    }

    /* ================================================== */
    /* GENERATE OTP                                       */
    /* ================================================== */

    const otp = randomInt(1000, 10000).toString();

    const otpHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    /* ================================================== */
    /* STORE OTP                                          */
    /* ================================================== */

    const { error: insertError } = await supabaseAdmin
      .from("password_reset_otps")
      .insert({
        user_id: userId,
        email,
        otp_hash: otpHash,
        expires_at: expiresAt,
        attempts: 0,
        verified_at: null,
      });

    if (insertError) {
      console.error("Unable to store OTP:", insertError);

      return Response.json(
        {
          error: "Unable to create password reset request.",
        },
        {
          status: 500,
        },
      );
    }

    /* ================================================== */
    /* SEND OTP EMAIL                                     */
    /* ================================================== */

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "The Backstore <orders@thebackstore.in>",
      to: [email],
      subject: "Your Backstore Password Reset OTP",
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>Password Reset OTP</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #080808;
                font-family: Arial, Helvetica, sans-serif;
                color: #ffffff;
              "
            >
              <div
                style="
                  max-width: 560px;
                  margin: 40px auto;
                  padding: 40px 30px;
                  background: #111111;
                  border: 1px solid #292929;
                  border-radius: 16px;
                  text-align: center;
                "
              >
                <div
                  style="
                    margin-bottom: 24px;
                  "
                >
                  <img
                    src="https://thebackstore.in/logo/backstore-logo.png"
                    alt="The Backstore"
                    style="
                      width: 220px;
                      max-width: 100%;
                      height: auto;
                    "
                  />
                </div>

                <h1
                  style="
                    margin: 0 0 12px;
                    font-size: 26px;
                    letter-spacing: 1px;
                    color: #ffffff;
                  "
                >
                  RESET YOUR PASSWORD
                </h1>

                <p
                  style="
                    margin: 0 0 28px;
                    font-size: 14px;
                    line-height: 1.6;
                    color: #999999;
                  "
                >
                  We received a request to reset your
                  Backstore account password.
                </p>

                <div
                  style="
                    display: inline-block;
                    padding: 18px 32px;
                    background: #da0d12;
                    border-radius: 12px;
                    margin-bottom: 24px;
                  "
                >
                  <span
                    style="
                      font-size: 34px;
                      font-weight: 700;
                      letter-spacing: 10px;
                      color: #ffffff;
                    "
                  >
                    ${otp}
                  </span>
                </div>

                <p
                  style="
                    margin: 0 0 8px;
                    font-size: 13px;
                    color: #bbbbbb;
                  "
                >
                  This OTP is valid for
                  <strong style="color: #ffffff;">
                    10 minutes
                  </strong>.
                </p>

                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #666666;
                  "
                >
                  If you did not request a password reset,
                  you can safely ignore this email.
                </p>

                <div
                  style="
                    margin-top: 32px;
                    padding-top: 20px;
                    border-top: 1px solid #292929;
                    font-size: 11px;
                    color: #555555;
                  "
                >
                  © ${new Date().getFullYear()}
                  The Backstore. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `,
    });

    if (emailError) {
      console.error("Resend OTP email error:", emailError);

      /* Remove OTP if email delivery failed */
      await supabaseAdmin
        .from("password_reset_otps")
        .delete()
        .eq("user_id", userId)
        .eq("otp_hash", otpHash);

      return Response.json(
        {
          error: "Unable to send OTP email. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      success: true,
      message: "OTP sent successfully.",
      emailId: emailData?.id ?? null,
    });
  } catch (error) {
    console.error("Send password reset OTP error:", error);

    return Response.json(
      {
        error: "Unable to process password reset request.",
      },
      {
        status: 500,
      },
    );
  }
}
