"use client";

import { FormEvent, useState } from "react";

import { supabase } from "@/lib/supabase";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
};

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

export default function RegisterModal({
  isOpen,
  onClose,
  onLogin,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Store the form reference before any await calls.
    // React may clear event.currentTarget after the async
    // event handler yields.
    const form = event.currentTarget;

    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") || "").trim();

    const phone = String(formData.get("phone") || "").trim();

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(formData.get("password") || "");

    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!fullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!phone) {
      setErrorMessage("Please enter your phone number.");
      return;
    }

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Step 1:
       * Create the user in Supabase Authentication.
       *
       * The email + password entered here will become
       * the credentials used by the Login modal.
       */
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
            },
          },
        });

      if (signUpError) {
        throw signUpError;
      }

      const user = signUpData.user;

      if (!user) {
        throw new Error("Account could not be created. Please try again.");
      }

      /*
       * Step 2:
       * Store the customer's profile information
       * in the profiles table.
       *
       * The profile ID is the same UUID as the
       * Supabase Auth user ID.
       */
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: fullName,
          email,
          phone,
        },
        {
          onConflict: "id",
        },
      );

      if (profileError) {
        throw profileError;
      }

      /*
       * Email confirmation has been disabled in Supabase,
       * so a session should be available immediately.
       */
      if (!signUpData.session) {
        setSuccessMessage("Account created successfully. You can now login.");
      } else {
        setSuccessMessage("Account created successfully. You can now login.");
      }

      // Use the stored form reference instead of
      // event.currentTarget after the await calls.
      form.reset();

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Registration error:", {
        error,
        message: error instanceof Error ? error.message : String(error),
        details:
          typeof error === "object" && error !== null
            ? JSON.stringify(error, null, 2)
            : null,
      });

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "Something went wrong while creating your account.";

      if (
        message.toLowerCase().includes("already registered") ||
        message.toLowerCase().includes("already exists")
      ) {
        setErrorMessage(
          "An account with this email already exists. Please login instead.",
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#161616] shadow-2xl shadow-black/60">
        {/* Glow */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#DA0D12]/10 blur-[85px]"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#80060B]/10 blur-[90px]"
          aria-hidden="true"
        />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close register modal"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#424141]/50 text-[#666362] transition-all hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/10 hover:text-[#CBCAC8]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="text-center">
            <div className="relative mx-auto flex h-[62px] w-[180px] items-center justify-center">
              <>
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
              </>
            </div>

            <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.3em] text-[#666362]">
              Join the pack
            </p>

            <h2
              id="register-modal-title"
              className="mt-2 font-display text-4xl leading-none tracking-wide text-[#CBCAC8]"
            >
              JOIN
              <span className="text-[#DA0D12]"> US.</span>
            </h2>

            <p className="mx-auto mt-3 max-w-xs text-[11px] leading-5 text-[#666362]">
              Create your Backstore account and become part of the pack.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="register-full-name"
                className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
              >
                Full Name
              </label>

              <input
                id="register-full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="ENTER YOUR FULL NAME"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="register-phone"
                className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
              >
                Phone Number
              </label>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="ENTER YOUR PHONE NUMBER"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
              >
                Email ID
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="ENTER YOUR EMAIL"
                className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="CREATE A PASSWORD"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 pr-11 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#666362] transition-colors hover:text-[#CBCAC8]"
                >
                  <EyeIcon className="h-4 w-4" closed={!showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="CONFIRM YOUR PASSWORD"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 pr-11 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#666362] transition-colors hover:text-[#CBCAC8]"
                >
                  <EyeIcon className="h-4 w-4" closed={!showConfirmPassword} />
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 pt-1">
              <input
                type="checkbox"
                name="terms"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/10 bg-[#080808] accent-[#DA0D12]"
              />

              <span className="text-[10px] leading-5 text-[#666362]">
                I agree to the{" "}
                <span className="text-[#CBCAC8]">Terms &amp; Conditions</span>{" "}
                and <span className="text-[#CBCAC8]">Privacy Policy</span>.
              </span>
            </label>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/5 px-3 py-2.5 text-center text-[10px] leading-4 text-[#DA0D12]">
                {errorMessage}
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-center text-[10px] leading-4 text-green-400">
                {successMessage}
              </div>
            )}

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}

              {!loading && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-5 text-center">
            <p className="text-xs text-[#666362]">Already have an account?</p>

            <button
              type="button"
              onClick={onLogin}
              className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8]"
            >
              Login to your account
            </button>
          </div>

          {/* Bottom brand line */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#DA0D12]/50" />
            <PawIcon className="h-4 w-4 text-[#DA0D12]/50" />
            <span className="h-px w-8 bg-[#DA0D12]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
