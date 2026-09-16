"use client";

const products = [
  {
    id: 1,
    name: "THE BACKSIDE TEE",
    price: "₹999",
    category: "OVERSIZED / BLACK",
    tag: "NEW",
    bg: "bg-[#e9e9e9]",
    shirt: "bg-black",
  },
  {
    id: 2,
    name: "GOOD DOG TEE",
    price: "₹999",
    category: "GRAPHIC / WHITE",
    tag: "HOT",
    bg: "bg-[#f3f3f3]",
    shirt: "bg-white",
  },
  {
    id: 3,
    name: "NO RULES TEE",
    price: "₹1,099",
    category: "OVERSIZED / RED",
    tag: "DROP 03",
    bg: "bg-[#e8e8e8]",
    shirt: "bg-[#ff2d32]",
  },
  {
    id: 4,
    name: "STREET PACK TEE",
    price: "₹999",
    category: "GRAPHIC / BLACK",
    tag: "NEW",
    bg: "bg-[#ededed]",
    shirt: "bg-black",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M20.8 8.7c0 5.5-8.8 11-8.8 11S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

export default function NewDrop() {
  return (
    <section className="relative overflow-hidden bg-white py-24 text-black sm:py-28 lg:py-36">
      {/* =========================================================
          COMIC BACKGROUND
      ========================================================= */}

      {/* Halftone */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.2px, transparent 1.2px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Red diagonal graphic */}
      <div
        className="pointer-events-none absolute -right-[15%] top-[15%] h-[350px] w-[65%] rotate-[-8deg] bg-[#ff2d32] opacity-90 sm:h-[450px]"
        style={{
          clipPath:
            "polygon(8% 0, 100% 12%, 92% 88%, 0 100%)",
        }}
      />

      {/* Black diagonal graphic */}
      <div
        className="pointer-events-none absolute -left-[20%] bottom-[10%] h-[180px] w-[60%] rotate-[5deg] bg-black sm:h-[230px]"
        style={{
          clipPath:
            "polygon(0 18%, 90% 0, 100% 80%, 8% 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* =======================================================
            SECTION HEADER
        ======================================================= */}

        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            {/* Small comic label */}
            <div className="mb-5 inline-flex -rotate-2 items-center gap-2 border-2 border-black bg-[#ff2d32] px-4 py-2 shadow-[5px_5px_0_#000]">
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em]">
                Fresh from the pack
              </span>
            </div>

            <h2
              className="text-[clamp(4rem,9vw,8rem)] font-black uppercase leading-[0.75] tracking-[-0.06em]"
              style={{
                fontFamily:
                  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                WebkitTextStroke: "1.5px #000",
              }}
            >
              NEW
              <br />
              <span className="text-[#ff2d32]">DROP.</span>
            </h2>
          </div>

          {/* Right description */}
          <div className="max-w-sm md:pb-2">
            <p className="font-mono text-xs font-bold uppercase leading-relaxed tracking-[0.12em] text-black/60">
              Fresh designs. Heavy attitude.
              <br />
              Limited pieces from the latest
              <br />
              Backstore collection.
            </p>

            <a
              href="/shop"
              className="group mt-6 inline-flex items-center gap-3 border-b-2 border-black pb-2 text-xs font-black uppercase tracking-[0.15em]"
            >
              View All Products

              <span className="transition-transform duration-200 group-hover:translate-x-2">
                <ArrowIcon />
              </span>
            </a>
          </div>
        </div>

        {/* =======================================================
            PRODUCT GRID
        ======================================================= */}

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group relative"
            >
              {/* Product image area */}
              <div
                className={`relative aspect-[4/5] overflow-hidden border-[3px] border-black ${product.bg}`}
              >
                {/* Comic rays */}
                <div
                  className="absolute inset-0 opacity-10 transition-transform duration-700 group-hover:scale-110"
                  style={{
                    background:
                      "repeating-conic-gradient(from 0deg, #000 0deg 5deg, transparent 5deg 15deg)",
                  }}
                />

                {/* Dummy shirt */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`relative h-[62%] w-[57%] ${product.shirt} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[-2deg]`}
                    style={{
                      clipPath:
                        "polygon(23% 0, 39% 7%, 61% 7%, 77% 0, 100% 16%, 87% 38%, 76% 27%, 76% 100%, 24% 100%, 24% 27%, 13% 38%, 0 16%)",
                    }}
                  >
                    {/* Shirt graphic */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-black uppercase ${
                            product.shirt === "bg-white"
                              ? "text-black"
                              : "text-white"
                          }`}
                          style={{
                            fontFamily:
                              "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                          }}
                        >
                          B
                        </div>

                        <div
                          className={`mt-1 text-[7px] font-black uppercase tracking-[0.3em] ${
                            product.shirt === "bg-white"
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          BACKSTORE
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product tag */}
                <div className="absolute left-4 top-4 -rotate-3 border-2 border-black bg-[#ff2d32] px-3 py-1 shadow-[3px_3px_0_#000]">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider">
                    {product.tag}
                  </span>
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black transition-all duration-200 hover:bg-[#ff2d32]"
                >
                  <HeartIcon />
                </button>

                {/* Hover shop button */}
                <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    type="button"
                    className="flex h-12 w-full items-center justify-center gap-3 border-2 border-black bg-[#ff2d32] text-xs font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    Quick Add
                    <ArrowIcon />
                  </button>
                </div>

                {/* Comic number */}
                <span className="absolute bottom-3 left-4 font-mono text-[9px] font-black text-black/40">
                  0{index + 1}
                </span>
              </div>

              {/* Product information */}
              <div className="relative border-x-[3px] border-b-[3px] border-black bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className="text-xl font-black uppercase leading-none tracking-[-0.02em]"
                      style={{
                        fontFamily:
                          "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
                      }}
                    >
                      {product.name}
                    </h3>

                    <p className="mt-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-black/50">
                      {product.category}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-black">
                    {product.price}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* =======================================================
            BOTTOM COMIC CTA
        ======================================================= */}

        <div className="mt-14 flex justify-center">
          <a
            href="/shop"
            className="group relative inline-flex items-center gap-5 border-[3px] border-black bg-black px-8 py-4 text-white shadow-[7px_7px_0_#ff2d32] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#ff2d32]"
          >
            <span className="font-black uppercase tracking-[0.12em]">
              See the whole pack
            </span>

            <span className="transition-transform duration-200 group-hover:translate-x-2">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}