"use client";

const reviews = [
  {
    quote: "The oversized fit is exactly what I was looking for.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "The collectible looks amazing on my shelf.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Great print quality and super comfortable fabric.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "The detailing on the figure is seriously impressive.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "The design stands out without trying too hard.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "A perfect addition to my collection.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Comfortable enough for everyday wear.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "Looks even better in person than online.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "The fit, finish, and overall vibe are on point.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "Love the sculpting and the little details.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Finally, a tee that matches my personality.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "The packaging made it feel special to unbox.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "The fabric feels good and the fit is relaxed.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "Exactly the collectible I wanted for my setup.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Bold design, clean print, easy to style.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "Great display piece for any fan.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "The oversized silhouette looks great with cargos.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "The finish and presentation are impressive.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "A fresh design compared with the usual basics.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "Adds the perfect touch to my collection shelf.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Good quality, great graphics, and a relaxed fit.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "A great find for anyone into collectibles.",
    category: "COLLECTIBLES",
    rating: 5,
  },
  {
    quote: "Easy to wear and makes the whole outfit better.",
    category: "T-SHIRTS",
    rating: 5,
  },
  {
    quote: "The kind of collectible you want to show off.",
    category: "COLLECTIBLES",
    rating: 5,
  },
];

function ReviewCard({ quote, category, rating }: (typeof reviews)[number]) {
  return (
    <article className="flex w-[270px] shrink-0 flex-col justify-between border border-white/10 bg-[#111111] p-5 transition-colors duration-300 hover:border-[#DA0D12]/60 sm:w-[330px] sm:p-7">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#CBCAC8]">
            {category}
          </span>
          <span
            aria-label={`${rating} out of 5 stars`}
            className="shrink-0 text-sm tracking-[0.1em] text-[#DA0D12]"
          >
            {"★".repeat(rating)}
          </span>
        </div>
        <p className="mt-7 min-h-[90px] text-xl leading-snug tracking-tight text-[#F3EBDD] sm:text-2xl">
          “{quote}”
        </p>
      </div>
      <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-4">
        <span className="flex h-8 w-8 items-center justify-center bg-[#DA0D12] text-sm font-bold text-white">
          B
        </span>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#F3EBDD]">
            THE BACKSTORE
          </p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#777777]">
            TEE & COLLECTIBLE CULTURE
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#080808] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto mb-8 max-w-[1280px] px-4 sm:mb-12 sm:px-7 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#DA0D12]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#DA0D12]">
            The Culture / The Community
          </span>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <h2
            className="text-5xl uppercase leading-[0.85] tracking-tight text-[#F3EBDD] sm:text-7xl lg:text-8xl"
            style={{
              fontFamily: "var(--font-bebas-neue), Impact, sans-serif",
            }}
          >
            WORD ON
            <br />
            <span className="text-[#DA0D12]">THE STREET.</span>
          </h2>
          <p className="max-w-xs text-sm leading-6 text-[#CBCAC8]">
            From everyday fits to shelf-worthy finds. The Backstore is about
            wearing what you love and collecting what you connect with.
          </p>
        </div>
      </div>

      <div className="group relative">
        <div className="flex w-max gap-4 pr-4 animate-review-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...reviews, ...reviews].map((review, index) => (
            <ReviewCard key={`${review.category}-${index}`} {...review} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] items-center justify-between px-4 sm:mt-10 sm:px-7 lg:px-10">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#777777]">
          T-SHIRTS / COLLECTIBLES
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#DA0D12]">
          KEEP IT DIFFERENT →
        </span>
      </div>

      <style jsx>{`
        @keyframes review-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-review-marquee {
          animation: review-marquee 100s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-review-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
