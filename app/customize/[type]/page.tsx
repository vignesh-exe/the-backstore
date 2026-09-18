"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const PRODUCTS = {
  oversized: {
    title: "Custom Oversized T-Shirt",
    shortTitle: "Oversized Tee",
    fit: "Oversized fit",
    price: 599,
    gsm: 240,
    description:
      "Premium oversized cotton t-shirt with a relaxed silhouette, built for high-quality custom printing.",
    black: "/images/custom/oversized/black.jpg",
    white: "/images/custom/oversized/white.jpg",
  },
  regular: {
    title: "Custom Regular T-Shirt",
    shortTitle: "Regular Tee",
    fit: "Regular fit",
    price: 499,
    gsm: 240,
    description:
      "Premium regular-fit cotton t-shirt with a clean silhouette, built for high-quality custom printing.",
    black: "/images/custom/regular/black.png",
    white: "/images/custom/regular/white.png",
  },
} as const;

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

function Icon({
  name,
  size = 18,
}: {
  name: "arrow-left" | "arrow-right" | "check" | "plus" | "minus" | "upload";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow-left") {
    return (
      <svg {...common}>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
    );
  }

  if (name === "arrow-right") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "minus") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function UploadBox({
  title,
  file,
  onChange,
}: {
  title: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="group block cursor-pointer rounded-2xl border border-[#CBCAC8]/8 bg-[#0D0D0D] p-4 transition-colors hover:border-[#DA0D12]/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-[#CBCAC8]">
            {title}
          </p>
          <p className="mt-1 text-[10px] text-[#555]">
            PNG, JPG or WEBP · Max 5MB
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CBCAC8]/8 text-[#666362] transition-colors group-hover:border-[#DA0D12]/35 group-hover:text-[#DA0D12]">
          <Icon name="upload" size={15} />
        </span>
      </div>

      <div className="mt-4 flex min-h-20 items-center justify-center rounded-xl border border-dashed border-[#CBCAC8]/10 bg-[#111111] px-4 text-center">
        {file ? (
          <span className="max-w-full truncate text-xs text-[#CBCAC8]">
            {file.name}
          </span>
        ) : (
          <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#444]">
            Click to upload
          </span>
        )}
      </div>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}

export default function CustomProductPage() {
  const params = useParams<{ type: string }>();
  const product =
    PRODUCTS[params.type as keyof typeof PRODUCTS] ?? PRODUCTS.oversized;

  const [selectedColor, setSelectedColor] = useState<"Black" | "White">(
    "Black",
  );
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]>("M");
  const [quantity, setQuantity] = useState(1);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);

  const image = selectedColor === "Black" ? product.black : product.white;
  const total = useMemo(
    () => product.price * quantity,
    [product.price, quantity],
  );

  const changeQuantity = (next: number) => {
    setQuantity(Math.min(10, Math.max(1, next)));
  };

  const goToCustomize = () => {
    const uploaded = [frontFile, backFile, leftFile, rightFile].filter(Boolean);

    if (uploaded.length === 0) {
      toast.error("Please upload at least one design image.");
      return;
    }

    toast.success(
      "Your customization is ready. Cart integration can be connected to the existing custom-product API next.",
    );
  };

  return (
    <main className="min-h-screen bg-[#080808] text-[#CBCAC8]">
      <section className="px-4 pb-20 pt-28 sm:px-7 sm:pt-32 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-6 flex items-center gap-2">
            <Link
              href="/customize"
              className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#666362] transition-colors hover:text-[#CBCAC8]"
            >
              <Icon name="arrow-left" size={15} />
              Back to customize
            </Link>
          </div>

          <div className="mb-8 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.25em] text-[#555]">
            <span>The Backstore</span>
            <span className="text-[#DA0D12]">/</span>
            <span>Customize</span>
            <span className="text-[#DA0D12]">/</span>
            <span className="text-[#CBCAC8]">{product.shortTitle}</span>
          </div>

          <div className="mb-8 overflow-hidden rounded-[30px] border border-[#DA0D12]/20 bg-[#111111]">
            <div className="flex gap-3 border-b border-[#DA0D12]/10 bg-[#DA0D12]/[0.04] px-5 py-4 sm:px-7">
              <div className="mt-0.5 text-[#DA0D12]">!</div>
              <div>
                <p className="font-mono text-[7px] uppercase tracking-[0.24em] text-[#DA0D12]">
                  Important notice
                </p>
                <p className="mt-1 max-w-4xl text-xs leading-5 text-[#777]">
                  Upload your artwork in the placement sections below. Keep
                  important artwork away from the edges to allow for a clean
                  print.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_480px]">
            <div>
              <div className="overflow-hidden rounded-[30px] border border-[#CBCAC8]/8 bg-[#111111]">
                <div className="relative aspect-square bg-[#0D0D0D] sm:aspect-[1.05]">
                  <Image
                    src={image}
                    alt={`${product.title} ${selectedColor}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain p-8 sm:p-14"
                  />

                  <div className="absolute left-5 top-5 rounded-full border border-[#CBCAC8]/10 bg-[#080808]/75 px-3 py-2 backdrop-blur-md">
                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#CBCAC8]">
                      {product.fit}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#CBCAC8]/8 px-5 py-5 sm:px-7">
                  <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#555]">
                    Apparel colour
                  </p>

                  <div className="mt-3 flex gap-3">
                    {(["Black", "White"] as const).map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-3 rounded-full border px-4 py-2.5 transition-all ${
                          selectedColor === color
                            ? "border-[#DA0D12] bg-[#DA0D12]/10"
                            : "border-[#CBCAC8]/10 bg-[#0D0D0D] hover:border-[#CBCAC8]/25"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full ${
                            color === "Black"
                              ? "bg-black ring-1 ring-white/30"
                              : "bg-white ring-1 ring-black/30"
                          }`}
                        />
                        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#CBCAC8]">
                          {color}
                        </span>
                        {selectedColor === color && (
                          <Icon name="check" size={13} />
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="mt-3 text-[10px] text-[#555]">
                    Only black and white are available for custom apparel.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[30px] border border-[#CBCAC8]/8 bg-[#111111] p-5 sm:p-7">
                <div className="mb-5">
                  <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
                    Artwork
                  </p>
                  <h2
                    className="mt-1 text-3xl uppercase leading-none text-[#CBCAC8]"
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    Upload your design
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-[#555]">
                    Add artwork to one or more positions. At least one design is
                    required.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <UploadBox
                    title="Front design"
                    file={frontFile}
                    onChange={setFrontFile}
                  />
                  <UploadBox
                    title="Back design"
                    file={backFile}
                    onChange={setBackFile}
                  />
                  <UploadBox
                    title="Left sleeve"
                    file={leftFile}
                    onChange={setLeftFile}
                  />
                  <UploadBox
                    title="Right sleeve"
                    file={rightFile}
                    onChange={setRightFile}
                  />
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[30px] border border-[#CBCAC8]/8 bg-[#111111] p-5 sm:p-7">
                <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
                  Custom apparel
                </p>

                <h1
                  className="mt-2 text-5xl uppercase leading-[0.88] text-[#CBCAC8] sm:text-6xl"
                  style={{
                    fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                  }}
                >
                  {product.title}
                </h1>

                <p className="mt-4 text-sm leading-6 text-[#666362]">
                  {product.description}
                </p>

                <div className="mt-6 flex items-end justify-between gap-4 border-b border-[#CBCAC8]/8 pb-6">
                  <div>
                    <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[#555]">
                      Price
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-[#CBCAC8]">
                      ₹{product.price}
                    </p>
                  </div>

                  <span className="rounded-full border border-[#DA0D12]/20 bg-[#DA0D12]/8 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.16em] text-[#DA0D12]">
                    {product.gsm} GSM Cotton
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]">
                      Select size
                    </p>
                    <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-[#444]">
                      XS — XXL
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 rounded-xl border font-mono text-[8px] uppercase transition-all ${
                          selectedSize === size
                            ? "border-[#DA0D12] bg-[#DA0D12] text-white"
                            : "border-[#CBCAC8]/10 bg-[#0D0D0D] text-[#777] hover:border-[#CBCAC8]/25 hover:text-[#CBCAC8]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#CBCAC8]">
                    Quantity
                  </p>

                  <div className="mt-3 inline-flex overflow-hidden rounded-xl border border-[#CBCAC8]/10 bg-[#0D0D0D]">
                    <button
                      type="button"
                      onClick={() => changeQuantity(quantity - 1)}
                      className="flex h-11 w-11 items-center justify-center text-[#666362] hover:bg-white/5 hover:text-[#CBCAC8]"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="minus" size={14} />
                    </button>

                    <span className="flex h-11 min-w-12 items-center justify-center border-x border-[#CBCAC8]/8 font-mono text-[9px] text-[#CBCAC8]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => changeQuantity(quantity + 1)}
                      className="flex h-11 w-11 items-center justify-center text-[#666362] hover:bg-white/5 hover:text-[#CBCAC8]"
                      aria-label="Increase quantity"
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-[#CBCAC8]/8 bg-[#0D0D0D] p-4">
                  <div className="flex items-center justify-between font-mono text-[8px] text-[#555]">
                    <span>Price</span>
                    <span>₹{product.price}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between font-mono text-[8px] text-[#555]">
                    <span>Quantity</span>
                    <span>{quantity}</span>
                  </div>

                  <div className="my-4 h-px bg-[#CBCAC8]/8" />

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#CBCAC8]">
                      Total
                    </span>
                    <span className="text-lg font-semibold text-[#CBCAC8]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToCustomize}
                  className="group mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#DA0D12] px-5 py-4 font-mono text-[8px] uppercase tracking-[0.2em] text-white transition-all hover:bg-[#b90b10]"
                >
                  Customize & Continue
                  <Icon name="arrow-right" size={15} />
                </button>

                <div className="mt-6 space-y-3 border-t border-[#CBCAC8]/8 pt-5">
                  {[
                    "Premium 240 GSM cotton",
                    "High-quality custom printing",
                    "Only black and white apparel colours",
                    "Made for your uploaded artwork",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-[10px] text-[#666362]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DA0D12]/10 text-[#DA0D12]">
                        <Icon name="check" size={11} />
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-7 rounded-[30px] border border-[#CBCAC8]/8 bg-[#111111] p-5 sm:p-7">
            <p className="font-mono text-[7px] uppercase tracking-[0.25em] text-[#DA0D12]">
              Why choose it
            </p>

            <h2
              className="mt-1 text-3xl uppercase leading-none text-[#CBCAC8]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              Built for custom work.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Premium cotton fabric",
                "Soft and comfortable",
                "High-quality printing",
                "Made with your design",
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-[#CBCAC8]/7 bg-[#0D0D0D] p-4"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DA0D12]/10 text-[#DA0D12]">
                    <Icon name="check" size={13} />
                  </div>
                  <p className="mt-4 text-xs text-[#777]">{feature}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
