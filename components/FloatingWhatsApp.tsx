"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mobile Help Bubble */}
      {showBubble && (
        <div
          className="
            md:hidden
            fixed
            bottom-[82px]
            right-5
            z-[151]
            rounded-xl
            bg-white
            px-3.5
            py-2.5
            text-black
            shadow-[0_8px_22px_rgba(0,0,0,0.25)]
            animate-in
            fade-in
            duration-300
          "
        >
          <p className="whitespace-nowrap text-[11px] font-medium text-[#6B7280]">
            Need Help?
          </p>

          <p className="mt-0.5 whitespace-nowrap text-[15px] font-bold leading-tight text-black">
            Chat with us
          </p>

          {/* Bubble Arrow */}
          <div
            className="
              absolute
              -bottom-1.5
              right-5
              h-3
              w-3
              rotate-45
              bg-white
            "
          />
        </div>
      )}

      {/* Desktop WhatsApp Button */}
      <a
        href="https://wa.me/message/EHQ3ZIHL7VS2C1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="
          hidden
          md:flex
          fixed
          bottom-6
          right-6
          z-[150]
          items-center
          gap-2
          rounded-full
          border
          border-black/10
          bg-white
          px-4
          py-2.5
          text-black
          shadow-[0_12px_30px_rgba(0,0,0,0.3)]
          transition-all
          duration-200
          hover:scale-105
          hover:shadow-[0_16px_35px_rgba(0,0,0,0.4)]
        "
      >
        <FaWhatsapp size={24} className="shrink-0 text-[#25D366]" />

        <div className="leading-tight">
          <p className="text-[10px] font-medium text-black/55">Need Help?</p>

          <p className="text-sm font-bold text-black">Chat with us</p>
        </div>
      </a>

      {/* Mobile WhatsApp Icon */}
      <a
        href="https://wa.me/message/EHQ3ZIHL7VS2C1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="
          md:hidden
          fixed
          bottom-5
          right-5
          z-[150]
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-[0_10px_25px_rgba(0,0,0,0.3)]
          transition-transform
          duration-200
          hover:scale-105
          active:scale-95
        "
      >
        <FaWhatsapp size={26} />
      </a>
    </>
  );
}
