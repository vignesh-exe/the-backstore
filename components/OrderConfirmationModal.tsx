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
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
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
      className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      {/* Background click */}
      <button
        type="button"
        aria-label="Close order confirmation"
        onClick={onContinueShopping}
        className="absolute inset-0 cursor-default"
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[30px]
          border
          border-[#CBCAC8]/10
          bg-[#111111]
          shadow-[0_30px_120px_rgba(0,0,0,0.7)]
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#DA0D12]/10 blur-[75px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#DA0D12]/5 blur-[85px]" />

        {/* Close */}
        <button
          type="button"
          onClick={onContinueShopping}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#CBCAC8]/10
            bg-[#161616]
            text-[#666362]
            transition
            hover:border-[#DA0D12]/30
            hover:text-[#CBCAC8]
          "
        >
          <XIcon />
        </button>

        <div className="relative px-6 py-9 text-center sm:px-10 sm:py-11">
          {/* Success icon */}
          <div
            className="
              mx-auto
              flex
              h-[76px]
              w-[76px]
              items-center
              justify-center
              rounded-full
              bg-[#DA0D12]
              text-white
              shadow-[0_18px_50px_rgba(218,13,18,0.28)]
            "
          >
            <CheckIcon />
          </div>

          {/* Small label */}
          <p
            className="
              mt-7
              font-mono
              text-[8px]
              uppercase
              tracking-[0.32em]
              text-[#DA0D12]
            "
          >
            The Backstore / Order Confirmed
          </p>

          {/* Heading */}
          <h2
            id="order-confirmation-title"
            className="
              mt-3
              text-5xl
              uppercase
              leading-[0.9]
              tracking-tight
              text-[#CBCAC8]
              sm:text-6xl
            "
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            You&apos;re in.
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-[390px] text-sm leading-6 text-[#666362]">
            Your Backstore order has been placed successfully. We&apos;ll keep
            you updated about your order and delivery.
          </p>

          {/* Order number */}
          {orderNumber && (
            <div
              className="
                mx-auto
                mt-6
                w-fit
                min-w-[210px]
                rounded-2xl
                border
                border-[#DA0D12]/15
                bg-[#DA0D12]/[0.06]
                px-6
                py-4
              "
            >
              <p
                className="
                  font-mono
                  text-[7px]
                  uppercase
                  tracking-[0.22em]
                  text-[#555]
                "
              >
                Order number
              </p>

              <p
                className="
                  mt-2
                  font-mono
                  text-sm
                  font-semibold
                  tracking-[0.12em]
                  text-[#DA0D12]
                "
              >
                {orderNumber}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onMyOrders}
              className="
                inline-flex
                h-12
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#CBCAC8]/10
                bg-[#161616]
                px-5
                font-mono
                text-[8px]
                uppercase
                tracking-[0.16em]
                text-[#CBCAC8]
                transition
                hover:border-[#CBCAC8]/25
                hover:bg-[#1B1B1B]
              "
            >
              My Orders
              <ArrowRightIcon />
            </button>

            <button
              type="button"
              onClick={onContinueShopping}
              className="
                inline-flex
                h-12
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#DA0D12]
                px-5
                font-mono
                text-[8px]
                uppercase
                tracking-[0.16em]
                text-white
                shadow-[0_12px_30px_rgba(218,13,18,0.16)]
                transition
                hover:bg-[#b90b10]
              "
            >
              Continue Shopping
              <ArrowRightIcon />
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-6">
            <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-[#3F3F3F]">
              Thanks for choosing The Backstore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
