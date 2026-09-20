"use client";

import { useEffect } from "react";

type OrderConfirmationModalProps = {
  open: boolean;
  orderNumber?: string;
  onMyOrders: () => void;
  onContinueShopping: () => void;
};

function CheckIcon() {
  return (
    <span aria-hidden="true" className="relative block h-8 w-8">
      <span className="absolute left-[6px] top-[15px] h-[4px] w-[10px] rotate-45 rounded-full bg-current" />
      <span className="absolute left-[12px] top-[13px] h-[4px] w-[18px] -rotate-45 origin-left rounded-full bg-current" />
    </span>
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
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onContinueShopping();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onContinueShopping]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[20000] overflow-y-auto bg-[#050505]/95 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close order confirmation"
        onClick={onContinueShopping}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative z-10 flex min-h-full w-full items-center justify-center">
        <div className="relative w-full max-w-[760px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101010] shadow-[0_40px_140px_rgba(0,0,0,0.8)] sm:rounded-[42px]">
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
            onClick={onContinueShopping}
            aria-label="Close"
            className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.09] bg-[#181818]/90 text-[#777] backdrop-blur transition hover:border-[#DA0D12]/40 hover:bg-[#DA0D12]/10 hover:text-white sm:right-6 sm:top-6 sm:h-12 sm:w-12"
          >
            <XIcon />
          </button>

          <div className="relative">
            {/* Mobile / desktop top identity */}
            <div className="border-b border-white/[0.06] px-5 pb-5 pt-7 sm:px-10 sm:pb-6 sm:pt-9">
              <div className="flex items-center justify-between pr-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DA0D12] text-white shadow-[0_10px_30px_rgba(218,13,18,0.3)] sm:h-11 sm:w-11">
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
            <div className="px-5 pb-5 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:gap-10">
                {/* Copy */}
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#555]">
                    Order received
                  </p>

                  <h2
                    id="order-confirmation-title"
                    className="mt-3 max-w-[560px] text-[64px] uppercase leading-[0.78] tracking-[-0.025em] text-[#CBCAC8] sm:text-[88px]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    You&apos;re
                    <br />
                    <span className="text-[#DA0D12]">in.</span>
                  </h2>

                  <p className="mt-6 max-w-[440px] text-[13px] leading-6 text-[#777] sm:mt-7 sm:text-sm sm:leading-7">
                    Your Backstore order is confirmed. We&apos;ll keep you
                    posted as it makes its way from our side to yours.
                  </p>

                  {/* Order reference */}
                  {orderNumber && (
                    <div className="mt-7 max-w-[440px] overflow-hidden rounded-[22px] border border-[#DA0D12]/20 bg-[#DA0D12]/[0.045] sm:mt-8">
                      <div className="flex items-center justify-between border-b border-[#DA0D12]/10 px-4 py-3 sm:px-5">
                        <span className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#555]">
                          Order reference
                        </span>
                        <span className="rounded-full bg-[#DA0D12]/10 px-2.5 py-1 font-mono text-[6px] uppercase tracking-[0.16em] text-[#DA0D12]">
                          Confirmed
                        </span>
                      </div>

                      <div className="px-4 py-4 sm:px-5 sm:py-5">
                        <p className="break-all font-mono text-[15px] font-semibold leading-6 tracking-[0.12em] text-[#DA0D12] sm:text-lg sm:leading-7">
                          {orderNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-end">
                  <div className="mb-4 hidden lg:block">
                    <p className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#444]">
                      What&apos;s next?
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={onMyOrders}
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
                        <span className="mt-1.5 block text-[15px] uppercase tracking-[0.08em] text-[#CBCAC8] sm:text-base">
                          My Orders
                        </span>
                      </span>

                      <ArrowRightIcon />
                    </button>

                    <button
                      type="button"
                      onClick={onContinueShopping}
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
                        <span className="mt-1.5 block text-[15px] uppercase tracking-[0.08em] sm:text-base">
                          Continue Shopping
                        </span>
                      </span>

                      <ArrowRightIcon />
                    </button>
                  </div>

                  <p className="mt-4 text-center font-mono text-[7px] uppercase tracking-[0.18em] text-[#3f3f3f] lg:text-left">
                    Built in Chennai / Made for everyday misfits
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-4 sm:px-10">
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
