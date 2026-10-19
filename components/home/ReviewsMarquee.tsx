"use client";

const reviews = [
  {
    quote: "T-shirt received bro Amazing 😻❤️",
    name: "Bharani",
    category: "T-SHIRTS",
  },
  {
    quote: "Received bro Nalla irukku ♥️✨",
    name: "Arun S/o Murugan",
    category: "T-SHIRTS",
  },
  {
    quote: "It's really looking good I like it 😍❤️",
    name: "Dharineesh R. P.",
    category: "T-SHIRTS",
  },
  {
    quote: "T-shirt super-ah irukku bro i loved it so much",
    name: "Krigibopika",
    category: "T-SHIRTS",
  },
  {
    quote: "Super bro💗🔥",
    name: "Abimanyu",
    category: "T-SHIRTS",
  },
  {
    quote: "Nice bro 👌❤️",
    name: "Soorya Kumar B.",
    category: "T-SHIRTS",
  },
  {
    quote: "Vanthuduchu naa  Super-ah irukku Thanks naa 🫶💖",
    name: "Pavithra",
    category: "T-SHIRTS",
  },
  {
    quote: "It was so nice Thank you ♥️✨",
    name: "Gokulalakshmi",
    category: "T-SHIRTS",
  },
  {
    quote: "Size quality ellame super anna 🔥🔥🔥",
    name: "Harini",
    category: "T-SHIRTS",
  },
  {
    quote: "Nalla irukku arumai Thank you ❤️✨",
    name: "Nasser Hussain S.",
    category: "T-SHIRTS",
  },
  {
    quote: "It's awesome 😍❤️",
    name: "Prasanna",
    category: "T-SHIRTS",
  },
  {
    quote: "T-shirt super-ah irukku bro Romba thanks 🤩👌❤️",
    name: "Jayasurya P",
    category: "T-SHIRTS",
  },
  {
    quote: "Super bro 💓✨",
    name: "Abimanyu",
    category: "T-SHIRTS",
  },
  {
    quote: "Thanks bro! Quality super ah irukku 💯♥️",
    name: "Nanthakumar",
    category: "T-SHIRTS",
  },
  {
    quote: "Nalla irukku Quality vera level 🔥🔥❤️",
    name: "Mothinivaas",
    category: "T-SHIRTS",
  },
  {
    quote: "Quality is good and the fit is perfect.",
    name: "Arun K.",
    category: "T-SHIRTS",
  },
  {
    quote: "Loved the design, looks even better in person.",
    name: "Karthik S.",
    category: "T-SHIRTS",
  },
  {
    quote: "Good material and comfortable to wear.",
    name: "Vignesh M.",
    category: "T-SHIRTS",
  },
  {
    quote: "Print quality is really nice. Worth the price.",
    name: "Praveen",
    category: "T-SHIRTS",
  },
  {
    quote: "Loved the oversized fit. Will order again.",
    name: "Hari P.",
    category: "T-SHIRTS",
  },
  {
    quote: "Good quality and nice packaging.",
    name: "Sanjay",
    category: "T-SHIRTS",
  },
  {
    quote: "Simple and unique designs. Really liked it.",
    name: "Dinesh",
    category: "T-SHIRTS",
  },
  {
    quote: "T-shirt looks exactly like the pictures.",
    name: "Ajay.",
    category: "T-SHIRTS",
  },
];

type Review = (typeof reviews)[number];

function ReviewCard({ quote, category, name }: Review) {
  return (
    <article className="flex w-[270px] shrink-0 flex-col justify-between border border-white/10 bg-[#111111] p-5 transition-colors duration-300 hover:border-[#DA0D12]/60 sm:w-[330px] sm:p-7">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#CBCAC8]">
            {category}
          </span>
          <span
            aria-label="Customer review"
            className="shrink-0 text-sm tracking-[0.1em] text-[#DA0D12]"
          >
            ♥
          </span>
        </div>
        <p className="mt-7 min-h-[90px] text-xl leading-snug tracking-tight text-[#F3EBDD] sm:text-2xl">
          “{quote}”
        </p>
      </div>
      <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#DA0D12] text-sm font-bold text-white">
          {name.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-[#F3EBDD]">
            {name}
          </p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#777777]">
            VERIFIED CUSTOMER FEEDBACK
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
            <ReviewCard key={`${review.name}-${index}`} {...review} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] items-center justify-between px-4 sm:mt-10 sm:px-7 lg:px-10">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#777777]">
          T-SHIRTS / CUSTOMER REVIEWS
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
