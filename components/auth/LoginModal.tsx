"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import Script from "next/script";

import { supabase } from "@/lib/supabase";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

function PawIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="32" cy="39" rx="14" ry="12" fill="currentColor" />

      <ellipse
        cx="17"
        cy="25"
        rx="6.5"
        ry="9"
        transform="rotate(-24 17 25)"
        fill="currentColor"
      />

      <ellipse
        cx="27"
        cy="18"
        rx="6.5"
        ry="9"
        transform="rotate(-8 27 18)"
        fill="currentColor"
      />

      <ellipse
        cx="39"
        cy="18"
        rx="6.5"
        ry="9"
        transform="rotate(8 39 18)"
        fill="currentColor"
      />

      <ellipse
        cx="49"
        cy="25"
        rx="6.5"
        ry="9"
        transform="rotate(24 49 25)"
        fill="currentColor"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function EyeIcon({
  className = "",
  closed = false,
}: {
  className?: string;
  closed?: boolean;
}) {
  if (closed) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 6a15.5 15.5 0 0 1-3.2 3.8" />
        <path d="M6.2 6.2A15.4 15.4 0 0 0 2.5 10c1 2 4.5 6 9.5 6 1.1 0 2.1-.2 3-.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default function LoginModal({
  isOpen,
  onClose,
  onRegister,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [googleReady, setGoogleReady] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [forgotLoading, setForgotLoading] = useState(false);

  const [forgotMessage, setForgotMessage] = useState("");

  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const googleInitializedRef = useRef(false);

  /*
   * Reset Google initialization when
   * the modal closes.
   */
  useEffect(() => {
    if (!isOpen) {
      googleInitializedRef.current = false;
      setGoogleReady(false);
    }
  }, [isOpen]);

  /*
   * Get first name
   */
  const getFirstName = (
    user: any,
    profile?: {
      full_name?: string | null;
    } | null,
  ) => {
    return (
      profile?.full_name?.trim().split(" ")[0] ||
      user?.user_metadata?.first_name ||
      user?.user_metadata?.full_name?.trim().split(" ")[0] ||
      user?.user_metadata?.name?.trim().split(" ")[0] ||
      "User"
    );
  };

  /*
   * Get existing profile or create
   * one when necessary.
   */
  const ensureProfile = async (user: any) => {
    if (!user?.id) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to load profile:", profileError);
    }

    /*
     * Existing profile
     */
    if (profile) {
      return profile;
    }

    /*
     * Google profile information
     */
    const fullName =
      user.user_metadata?.full_name || user.user_metadata?.name || "";

    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

    /*
     * Create profile
     */
    const { data: createdProfile, error: createProfileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          email: user.email ?? null,
          phone: user.phone ?? null,
          avatar_url: avatarUrl,
        },
        {
          onConflict: "id",
        },
      )
      .select("full_name, email, phone, avatar_url")
      .single();

    if (createProfileError) {
      /*
       * Authentication has already succeeded.
       * Do not sign the user out just because
       * profile creation failed.
       */
      console.error("Failed to create profile:", createProfileError);

      return null;
    }

    return createdProfile;
  };

  /*
   * Notify the rest of the application
   * that authentication has changed.
   */
  const notifyAuthentication = (firstName: string) => {
    window.localStorage.setItem("backstore_user_first_name", firstName);

    window.dispatchEvent(
      new CustomEvent("backstore:login", {
        detail: {
          firstName,
        },
      }),
    );

    /*
     * Also dispatch the generic auth
     * event used by existing components.
     */
    window.dispatchEvent(new CustomEvent("janavi-auth-changed"));
  };

  /*
   * EMAIL / PASSWORD LOGIN
   */
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (loginError) {
        console.error("Email login error:", loginError);

        setError(loginError.message || "Invalid email or password.");

        return;
      }

      const user = loginData.user;

      if (!user) {
        setError("Unable to get user information.");
        return;
      }

      const profile = await ensureProfile(user);

      const firstName = getFirstName(user, profile);

      setSuccessMessage(`Welcome ${firstName}!`);

      notifyAuthentication(firstName);

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * GOOGLE LOGIN
   *
   * This follows the same Google Identity
   * Services approach as the reference file.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!googleReady) {
      return;
    }

    if (!googleButtonRef.current) {
      return;
    }

    if (googleInitializedRef.current) {
      return;
    }

    /*
     * Google Client ID
     *
     * This must be added to .env.local.
     */
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured.");

      setError("Google login is not configured.");

      return;
    }

    /*
     * Make sure Google Identity Services
     * has loaded.
     */
    if (typeof window === "undefined" || !window.google?.accounts?.id) {
      console.error("Google Identity Services SDK is not available.");

      return;
    }

    try {
      googleInitializedRef.current = true;

      /*
       * Initialize Google Identity Services
       */
      window.google.accounts.id.initialize({
        client_id: clientId,

        callback: async (response: { credential?: string }) => {
          try {
            setIsLoading(true);
            setError("");
            setSuccessMessage("");

            /*
             * Google must return a credential.
             */
            if (!response?.credential) {
              console.error("Google credential missing.");

              setError("Google login failed. Please try again.");

              return;
            }

            /*
             * Send Google credential
             * to Supabase.
             */
            const { data, error: googleError } =
              await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
              });

            if (googleError) {
              console.error("Supabase Google login error:", googleError);

              setError(
                googleError.message || "Google login failed. Please try again.",
              );

              return;
            }

            const user = data.user;

            if (!user) {
              setError("Unable to get Google user information.");

              return;
            }

            /*
             * Create/load Backstore profile.
             */
            const profile = await ensureProfile(user);

            const firstName = getFirstName(user, profile);

            /*
             * Login successful.
             */
            setSuccessMessage(`Welcome ${firstName}!`);

            notifyAuthentication(firstName);

            setTimeout(() => {
              onClose();
            }, 500);
          } catch (error) {
            console.error("Google login failed:", error);

            setError(
              error instanceof Error
                ? error.message
                : "Google login failed. Please try again.",
            );
          } finally {
            setIsLoading(false);
          }
        },
      });

      /*
       * Clear previous Google button.
       */
      googleButtonRef.current.innerHTML = "";

      /*
       * Calculate Google button width.
       */
      const googleButtonWidth = Math.min(
        350,
        googleButtonRef.current.clientWidth || 350,
      );

      /*
       * Render Google's official button.
       */
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: googleButtonWidth,
      });
    } catch (error) {
      console.error("Failed to initialize Google Login:", error);

      googleInitializedRef.current = false;
    }
  }, [googleReady, isOpen]);

  /*
   * FORGOT PASSWORD
   */
  const handleForgotPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setForgotMessage("");
    setError("");

    const normalizedEmail = forgotEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setForgotMessage("Please enter your email address.");

      return;
    }

    try {
      setForgotLoading(true);

      const redirectTo = `${window.location.origin}/reset-password`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo,
        },
      );

      if (resetError) {
        console.error("Password reset error:", resetError);

        setForgotMessage(
          resetError.message || "Unable to send password reset email.",
        );

        return;
      }

      setForgotMessage(
        "If an account exists with this email, a password reset link has been sent.",
      );
    } catch (error) {
      console.error("Password reset failed:", error);

      setForgotMessage(
        error instanceof Error
          ? error.message
          : "Unable to send password reset email.",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Google Identity Services */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Google Identity Services loaded.");

          setGoogleReady(true);
        }}
        onReady={() => {
          console.log("Google Identity Services ready.");

          setGoogleReady(true);
        }}
        onError={() => {
          console.error("Failed to load Google Identity Services.");

          setError("Unable to load Google Login.");
        }}
      />

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Modal */}
        <div className="relative w-full max-w-[390px] overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#161616] shadow-2xl shadow-black/60">
          {/* Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#DA0D12]/10 blur-[80px]"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#80060B]/10 blur-[90px]"
            aria-hidden="true"
          />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close login modal"
            disabled={isLoading}
            className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#424141]/50 text-[#666362] transition-all hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/10 hover:text-[#CBCAC8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

          <div className="relative p-5 sm:p-6">
            {/* Header */}
            <div className="text-center">
              <div className="relative mx-auto flex h-[62px] w-[180px] items-center justify-center">
                <div
                  className="absolute inset-[2px] bg-[#DA0D12]"
                  style={{
                    clipPath:
                      "polygon(3% 15%, 13% 9%, 24% 13%, 36% 7%, 49% 11%, 61% 6%, 74% 12%, 86% 7%, 97% 14%, 94% 86%, 84% 92%, 73% 88%, 61% 94%, 49% 89%, 37% 94%, 24% 89%, 12% 93%, 3% 86%, 1% 24%)",
                  }}
                />

                <div
                  className="absolute inset-[4px] opacity-15"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, #CBCAC8 1px, transparent 1.3px)",
                    backgroundSize: "11px 11px",
                    clipPath:
                      "polygon(3% 15%, 13% 9%, 24% 13%, 36% 7%, 49% 11%, 61% 6%, 74% 12%, 86% 7%, 97% 14%, 94% 86%, 84% 92%, 73% 88%, 61% 94%, 49% 89%, 37% 94%, 24% 89%, 12% 93%, 3% 86%, 1% 24%)",
                  }}
                />

                <img
                  src="/logo/backstore-logo.png"
                  alt="The Backstore"
                  className="relative z-10 h-[52px] w-auto max-w-[155px] object-contain"
                />
              </div>

              <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
                Welcome back to the pack
              </p>

              <h2
                id="login-modal-title"
                className="mt-2 font-display text-4xl leading-none tracking-wide text-[#CBCAC8]"
              >
                LOG
                <span className="text-[#DA0D12]"> IN.</span>
              </h2>

              <p className="mx-auto mt-3 max-w-xs text-[11px] leading-5 text-[#666362]">
                Sign in to access your orders, wishlist and account.
              </p>
            </div>

            {/* Forgot Password */}
            {showForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#666362]">
                    Reset your password
                  </p>

                  <p className="mx-auto mt-2 max-w-[280px] text-[11px] leading-5 text-[#666362]">
                    Enter your registered email and we&apos;ll send you a
                    password reset link.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="forgot-email"
                    className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                  >
                    Email ID
                  </label>

                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    autoComplete="email"
                    required
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                  />
                </div>

                {forgotMessage && (
                  <div className="rounded-xl border border-white/[0.08] bg-[#080808] px-3 py-2.5 text-center text-[10px] leading-4 text-[#CBCAC8]">
                    {forgotMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex w-full items-center justify-center rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotMessage("");
                    setError("");
                  }}
                  className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8]"
                >
                  ← Back to Login
                </button>
              </form>
            ) : (
              <>
                {/* Login Form */}
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                    >
                      Email ID
                    </label>

                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      required
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setForgotMessage("");
                          setForgotEmail("");
                          setShowForgotPassword(true);
                        }}
                        disabled={isLoading}
                        className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                        placeholder="ENTER YOUR PASSWORD"
                        className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3.5 pr-11 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        disabled={isLoading}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#666362] transition-colors hover:text-[#CBCAC8] disabled:opacity-50"
                      >
                        <EyeIcon className="h-4 w-4" closed={!showPassword} />
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/5 px-3 py-2.5 text-center text-[10px] leading-4 text-[#DA0D12]">
                      {error}
                    </div>
                  )}

                  {/* Success */}
                  {successMessage && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-center text-[10px] leading-4 text-green-400">
                      {successMessage}
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "Signing In..." : "Login"}

                    {!isLoading && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#666362]">
                    Or
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>

                {/* Google */}
                <div className="relative min-h-[44px] w-full">
                  <div
                    ref={googleButtonRef}
                    className={`flex min-h-[44px] w-full justify-center overflow-hidden transition-opacity ${
                      isLoading
                        ? "pointer-events-none opacity-0"
                        : "opacity-100"
                    }`}
                  />

                  {!googleReady && !isLoading && (
                    <div className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-white/[0.08] bg-[#080808]">
                      <span className="text-[10px] text-[#666362]">
                        Loading Google Login...
                      </span>
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#080808]">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#666362]/30 border-t-[#DA0D12]" />
                    </div>
                  )}
                </div>

                {/* Register */}
                <div className="mt-5 text-center">
                  <p className="text-xs text-[#666362]">
                    Don&apos;t have an account?
                  </p>

                  <button
                    type="button"
                    onClick={onRegister}
                    disabled={isLoading}
                    className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Create an account
                  </button>
                </div>
              </>
            )}

            {/* Bottom brand line */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#DA0D12]/50" />
              <PawIcon className="h-4 w-4 text-[#DA0D12]/50" />
              <span className="h-px w-8 bg-[#DA0D12]/50" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
