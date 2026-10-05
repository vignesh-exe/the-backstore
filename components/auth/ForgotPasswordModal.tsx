"use client";
import { FormEvent, useState } from "react";
type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
};
type ForgotStep = "email" | "otp" | "password";
export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onLogin,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const resetFlow = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setMessage("");
    setError("");
  };
  const handleClose = () => {
    resetFlow();
    onClose();
  };
  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to send OTP. Please try again.");
        return;
      }
      setEmail(normalizedEmail);
      setMessage("A 4-digit OTP has been sent to your email address.");
      setStep("otp");
    } catch (error) {
      console.error("Send OTP failed:", error);
      setError("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalizedOtp = otp.trim();
    if (!/^\d{4}$/.test(normalizedOtp)) {
      setError("Please enter the 4-digit OTP.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: normalizedOtp }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Invalid OTP. Please try again.");
        return;
      }
      setResetToken(data?.resetToken || "");
      setMessage("OTP verified successfully.");
      setStep("password");
    } catch (error) {
      console.error("Verify OTP failed:", error);
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          resetToken,
          password: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to change password. Please try again.");
        return;
      }
      setMessage("Password changed successfully. Redirecting to login...");
      setTimeout(() => {
        resetFlow();
        onLogin();
      }, 800);
    } catch (error) {
      console.error("Change password failed:", error);
      setError("Unable to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) handleClose();
      }}
    >
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#161616] shadow-2xl shadow-black/60">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#DA0D12]/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#80060B]/10 blur-[90px]" />
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          aria-label="Close forgot password modal"
          className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#424141]/50 text-[#666362] transition-all hover:border-[#DA0D12]/30 hover:bg-[#DA0D12]/10 hover:text-[#CBCAC8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          ×
        </button>
        <div className="relative p-5 sm:p-6">
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
              id="forgot-password-title"
              className="mt-2 font-display text-4xl leading-none tracking-wide text-[#CBCAC8]"
            >
              {step === "email" && (
                <>
                  RESET<span className="text-[#DA0D12]">.</span>
                </>
              )}
              {step === "otp" && (
                <>
                  VERIFY<span className="text-[#DA0D12]">.</span>
                </>
              )}
              {step === "password" && (
                <>
                  NEW PASSWORD<span className="text-[#DA0D12]">.</span>
                </>
              )}
            </h2>
            <p className="mx-auto mt-3 max-w-xs text-[11px] leading-5 text-[#666362]">
              {step === "email" &&
                "Enter your registered email to receive a 4-digit OTP."}
              {step === "otp" && `Enter the 4-digit OTP sent to ${email}.`}
              {step === "password" && "Enter and confirm your new password."}
            </p>
          </div>
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  placeholder="ENTER YOUR EMAIL"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                />
              </div>
              {message && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-center text-[10px] leading-4 text-green-400">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/5 px-3 py-2.5 text-center text-[10px] leading-4 text-[#DA0D12]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8] disabled:opacity-50"
              >
                ← Back to Login
              </button>
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="forgot-otp"
                  className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                >
                  4-Digit OTP
                </label>
                <input
                  id="forgot-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  autoComplete="one-time-code"
                  required
                  placeholder="ENTER OTP"
                  className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3 text-center text-[18px] font-semibold tracking-[0.5em] text-[#CBCAC8] outline-none transition-all placeholder:text-[10px] placeholder:tracking-[0.2em] focus:border-[#DA0D12]/60"
                />
              </div>
              {message && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-center text-[10px] leading-4 text-green-400">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/5 px-3 py-2.5 text-center text-[10px] leading-4 text-[#DA0D12]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                  setMessage("");
                }}
                disabled={loading}
                className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DA0D12] transition-colors hover:text-[#CBCAC8] disabled:opacity-50"
              >
                ← Change Email
              </button>
            </form>
          )}
          {step === "password" && (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="ENTER NEW PASSWORD"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3.5 pr-11 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#666362] hover:text-[#CBCAC8]"
                  >
                    {showNewPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#666362]"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="CONFIRM NEW PASSWORD"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080808] px-3.5 py-3.5 pr-11 text-[13px] text-[#CBCAC8] outline-none transition-all placeholder:text-[#666362]/70 focus:border-[#DA0D12]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#666362] hover:text-[#CBCAC8]"
                  >
                    {showConfirmPassword ? "◉" : "◌"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="rounded-xl border border-[#DA0D12]/20 bg-[#DA0D12]/5 px-3 py-2.5 text-center text-[10px] leading-4 text-[#DA0D12]">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-center text-[10px] leading-4 text-green-400">
                  {message}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#DA0D12] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#80060B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          )}
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#DA0D12]/50" />
            <span className="text-[#DA0D12]/50">🐾</span>
            <span className="h-px w-8 bg-[#DA0D12]/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
