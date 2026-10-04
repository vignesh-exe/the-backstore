import Link from "next/link";

const COLLECTIONS = [
  {
    name: "Anime",
    number: "01",
    image: "/collections/anime.png",
  },
  {
    name: "Comic",
    number: "02",
    image: "/collections/comic.png",
  },
  {
    name: "Kollywood",
    number: "03",
    image: "/collections/kollywood.png",
  },
  {
    name: "Sports",
    number: "04",
    image: "/collections/sports.png",
  },
  {
    name: "Cinephile",
    number: "05",
    image: "/collections/cinephile.png",
  },
  {
    name: "F1",
    number: "06",
    image: "/collections/f1.png",
  },
  {
    name: "Football",
    number: "07",
    image: "/collections/football.png",
  },
  {
    name: "Cricket",
    number: "08",
    image: "/collections/cricket.png",
  },
  {
    name: "Memes",
    number: "09",
    image: "/collections/memes.png",
  },
  {
    name: "Motivational Quotes",
    number: "10",
    image: "/collections/motivational-quotes.png",
  },
  {
    name: "Garage Culture",
    number: "11",
    image: "/collections/garage-culture.png",
  },
  {
    name: "Music",
    number: "12",
    image: "/collections/music.png",
  },
];

function CollectionArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[17px] w-[17px]"
      aria-hidden="true"
    >
      <path
        d="M5 12H18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13 7L18 12L13 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CollectionsSection() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-4 pb-8 pt-16 text-[#CBCAC8] sm:px-7 sm:pb-10 sm:pt-20 lg:px-10 lg:pb-12 lg:pt-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#DA0D12]/[0.05] blur-[110px]" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#DA0D12]/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-[1280px]">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-[#DA0D12]" />

              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
                The Backstore / Explore
              </p>
            </div>

            <h2
              className="text-[clamp(4rem,9vw,7rem)] uppercase leading-[0.78] tracking-[0.01em] text-[#CBCAC8]"
              style={{
                fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
              }}
            >
              Collections
            </h2>
          </div>

          <p className="max-w-sm text-[12px] leading-5 text-[#555] lg:pb-1">
            Explore the world of The Backstore — cinema, motorsport, anime,
            sports and street culture.
          </p>
        </div>

        {/* =========================================================
            COLLECTION GRID
        ========================================================== */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((collection) => (
            <Link
              key={collection.name}
              href={`/shop/t-shirts?collection=${encodeURIComponent(
                collection.name,
              )}`}
              className="group relative h-[155px] overflow-hidden rounded-[22px] border border-[#CBCAC8]/10 bg-[#111111] transition-all duration-500 hover:-translate-y-1 hover:border-[#DA0D12]/40 sm:h-[165px] lg:h-[175px]"
            >
              {/* =====================================================
                  BLURRED BACKGROUND IMAGE
              ====================================================== */}

              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={collection.image}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full scale-110 object-cover opacity-35 blur-[3px] grayscale transition-all duration-700 group-hover:scale-115 group-hover:opacity-45 group-hover:blur-[2px] group-hover:grayscale-0"
                />
              </div>

              {/* =====================================================
                  BLACK IMAGE OVERLAY
              ====================================================== */}

              {/* <div className="absolute inset-0 bg-black/65 transition-all duration-500 group-hover:bg-black/50" /> */}

              {/* Strong bottom gradient */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" /> */}

              {/* Red hover glow */}
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#DA0D12]/0 blur-[60px] transition-all duration-500 group-hover:bg-[#DA0D12]/15" />

              {/* =====================================================
                  CONTENT
              ====================================================== */}

              <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[8px] tracking-[0.25em] text-white/35">
                    {collection.number}
                  </span>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/55 backdrop-blur-sm transition-all duration-300 group-hover:border-[#DA0D12] group-hover:bg-[#DA0D12] group-hover:text-white">
                    <CollectionArrow />
                  </span>
                </div>

                {/* Bottom content */}
                <div>
                  <p className="mb-1 font-mono text-[7px] uppercase tracking-[0.28em] text-white/35">
                    Collection
                  </p>

                  <h3
                    className="max-w-[90%] truncate text-[34px] uppercase leading-[0.82] text-[#F1F1EF] transition-transform duration-500 group-hover:translate-x-1 sm:text-[40px]"
                    title={collection.name}
                    style={{
                      fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
                    }}
                  >
                    {collection.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* =========================================================
            VIEW ALL
        ========================================================== */}

        <div className="mt-5 flex justify-end">
          <Link
            href="/shop/t-shirts"
            className="group inline-flex items-center gap-3 rounded-full border border-[#CBCAC8]/10 px-5 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[#666362] transition-all duration-300 hover:border-[#DA0D12]/40 hover:bg-[#DA0D12] hover:text-white"
          >
            View all T-Shirts
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <CollectionArrow />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
