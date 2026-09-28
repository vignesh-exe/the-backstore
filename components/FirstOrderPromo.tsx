"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function FirstOrderPromo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4 backdrop-blur-[3px]"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-[420px] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Promo Image */}
        <Image
          src="/images/promo/first-order-5-off.png"
          alt="5% off on first order"
          width={900}
          height={1200}
          priority
          className="h-auto w-full"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close promotion"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-lg text-white transition-opacity hover:opacity-80"
        >
          ×
        </button>
      </div>
    </div>
  );
}
