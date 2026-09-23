"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type OrderConfirmationModalProps = {
  open: boolean;
  orderNumber?: string;
  onMyOrders: () => void;
  onContinueShopping: () => void;
};

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/20 text-xl leading-none transition-transform duration-200 group-hover:translate-x-1"
    >
      <span className="relative -mt-px">→</span>
    </span>
  );
}

function XIcon() {
  return (
    <span aria-hidden="true" className="relative block h-5 w-5">
      <span className="absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current" />
      <span className="absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
    </span>
  );
}

export default function OrderConfirmationModal({
  open,
  orderNumber,
  onMyOrders,
  onContinueShopping,
}: OrderConfirmationModalProps) {
  const router = useRouter();

  const handleMyOrders = () => {
    onMyOrders();
    router.push("/my-orders");
  };

  const handleContinueShopping = () => {
    onContinueShopping();
    router.push("/shop/t-shirts");
  };

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onContinueShopping();
        router.push("/shop/t-shirts");
      }
    };

    document.addEventListener("keydown", handleEscape);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onContinueShopping, router]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[20000] overflow-y-auto bg-[#050505]/95 px-3 py-3 backdrop-blur-xl sm:px-5 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close order confirmation"
        onClick={handleContinueShopping}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex min-h-full w-full items-center justify-center">
        <div className="relative w-full max-w-[620px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#101010] shadow-[0_30px_100px_rgba(0,0,0,0.8)] sm:rounded-[32px]">
          {/* Background system */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#DA0D12]/20 blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#DA0D12]/10 blur-[110px]"
          />

          {/* Red edge */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#DA0D12] sm:w-2" />

          {/* Close */}
          <button
            type="button"
            onClick={handleContinueShopping}
            aria-label="Close"
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.09] bg-[#181818]/90 text-[#777] backdrop-blur transition hover:border-[#DA0D12]/40 hover:bg-[#DA0D12]/10 hover:text-white sm:right-5 sm:top-5 sm:h-10 sm:w-10"
          >
            <XIcon />
          </button>

          <div className="relative">
            {/* Mobile / desktop top identity */}
            <div className="border-b border-white/[0.06] px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
              <div className="flex items-center justify-between pr-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#DA0D12] text-white shadow-[0_8px_22px_rgba(218,13,18,0.3)] sm:h-10 sm:w-10">
                    <CheckIcon />
                  </div>

                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#DA0D12]">
                      The Backstore
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#555]">
                      Payment successful
                    </p>
                  </div>
                </div>

                <span className="hidden font-mono text-[7px] uppercase tracking-[0.22em] text-[#3f3f3f] sm:block">
                  001 / CONFIRMED
                </span>
              </div>
            </div>

            {/* Main content */}
            <div className="px-4 pb-4 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:gap-7">
                {/* Copy */}
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#555]">
                    Order received
                  </p>

                  <h2
                    id="order-confirmation-title"
                    className="mt-2 max-w-[430px] text-[52px] uppercase leading-[0.8] tracking-[-0.025em] text-[#CBCAC8] sm:text-[72px]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    You&apos;re
                    <br />
                    <span className="text-[#DA0D12]">in.</span>
                  </h2>

                  <p className="mt-4 max-w-[390px] text-[12px] leading-5 text-[#777] sm:mt-5 sm:text-[13px] sm:leading-6">
                    Your Backstore order is confirmed. We&apos;ll keep you
                    posted as it makes its way from our side to yours.
                  </p>

                  {/* Order reference */}
                  {orderNumber && (
                    <div className="mt-5 max-w-[390px] overflow-hidden rounded-[16px] border border-[#DA0D12]/20 bg-[#DA0D12]/[0.045] sm:mt-6">
                      <div className="flex items-center justify-between border-b border-[#DA0D12]/10 px-3 py-2.5 sm:px-4">
                        <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#555]">
                          Order reference
                        </span>
                        <span className="rounded-full bg-[#DA0D12]/10 px-2.5 py-1 font-mono text-[6px] uppercase tracking-[0.16em] text-[#DA0D12]">
                          Confirmed
                        </span>
                      </div>

                      <div className="px-3 py-3 sm:px-4 sm:py-4">
                        <p className="break-all font-mono text-[15px] font-semibold leading-6 tracking-[0.12em] text-[#DA0D12] sm:text-lg sm:leading-7">
                          {orderNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-end">
                  <div className="mb-3 hidden lg:block">
                    <p className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#444]">
                      What&apos;s next?
                    </p>
                  </div>

                  <div className="grid gap-2.5">
                    <button
                      type="button"
                      onClick={handleMyOrders}
                      className="group relative flex min-h-[72px] w-full items-center justify-between overflow-hidden rounded-[20px] border border-white/[0.09] bg-[#171717] px-5 text-left transition duration-200 hover:border-white/[0.18] hover:bg-[#1c1c1c] active:scale-[0.99] sm:min-h-[82px] sm:px-6"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/[0.025] blur-2xl"
                      />

                      <span className="relative">
                        <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-[#555]">
                          01 / Track
                        </span>
                        <span className="mt-1 block text-[14px] uppercase tracking-[0.08em] text-[#CBCAC8] sm:text-[15px]">
                          My Orders
                        </span>
                      </span>

                      <ArrowRightIcon />
                    </button>

                    <button
                      type="button"
                      onClick={handleContinueShopping}
                      className="group relative flex min-h-[72px] w-full items-center justify-between overflow-hidden rounded-[20px] bg-[#DA0D12] px-5 text-left text-white shadow-[0_18px_45px_rgba(218,13,18,0.22)] transition duration-200 hover:bg-[#bd0b10] active:scale-[0.99] sm:min-h-[82px] sm:px-6"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/[0.08] blur-2xl"
                      />

                      <span className="relative">
                        <span className="block font-mono text-[7px] uppercase tracking-[0.2em] text-white/60">
                          02 / Discover
                        </span>
                        <span className="mt-1 block text-[14px] uppercase tracking-[0.08em] sm:text-[15px]">
                          Continue Shopping
                        </span>
                      </span>

                      <ArrowRightIcon />
                    </button>
                  </div>

                  <p className="mt-3 text-center font-mono text-[6px] uppercase tracking-[0.18em] text-[#3f3f3f] lg:text-left">
                    Built in Chennai / Made for everyday misfits
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3 sm:px-7">
              <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#383838]">
                BACKSTORE / ORDER SYSTEM
              </span>
              <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-[#383838]">
                THANK YOU
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
