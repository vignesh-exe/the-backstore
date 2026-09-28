"use client";

export default function PromoMarquee() {
  const items = [
    "5% OFF ON FIRST ORDER",
    "USE CODE: THEBACK5",
    "FREE SHIPPING ABOVE ₹2999",
  ];

  return (
    <div className="fixed left-0 top-0 z-[200] w-full overflow-hidden border-b border-[#CBCAC8]/10 bg-[#080808]">
      <div className="flex w-max animate-[promo-marquee_22s_linear_infinite] whitespace-nowrap">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center py-[6px] font-mono text-[8px] uppercase tracking-[0.18em]"
          >
            <span className="mx-5 text-[#CBCAC8]/80">{items[0]}</span>

            <span className="text-[#DA0D12]">{items[1]}</span>

            <span className="mx-5 text-[#CBCAC8]/20">•</span>

            <span className="text-[#CBCAC8]/80">{items[2]}</span>

            <span className="mx-5 text-[#CBCAC8]/20">•</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes promo-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
