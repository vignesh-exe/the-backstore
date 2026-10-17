"use client";

import { useMemo, useState } from "react";

const faqs = [
  {
    category: "ORDERS",
    question: "How can I place an order?",
    answer:
      "Browse our collection, select your product and size, add it to your cart, and complete checkout.",
  },
  {
    category: "ORDERS",
    question: "Can I cancel my order?",
    answer:
      "Cancellation depends on the current order status. Visit My Orders to check your order and submit a cancellation request if available.",
  },
  {
    category: "PAYMENTS",
    question: "What payment methods are accepted?",
    answer:
      "Available payment methods are displayed during checkout. Complete your payment using one of the options shown there.",
  },
  {
    category: "SHIPPING",
    question: "How much does delivery cost?",
    answer:
      "Delivery charges are calculated during checkout and shown before you place your order. Eligible offers may provide free delivery.",
  },
  {
    category: "SHIPPING",
    question: "How can I track my order?",
    answer:
      "Open My Orders to view your order status and tracking details when they become available.",
  },
  {
    category: "RETURNS",
    question: "How do I request help with an order?",
    answer:
      "Visit the Contact page and share your order number and issue so our team can assist you.",
  },
  {
    category: "PRODUCTS",
    question: "Are products available in different sizes?",
    answer:
      "Available sizes and product details are displayed on each product page. Check them before adding an item to your cart.",
  },
  {
    category: "PRODUCTS",
    question: "Can I buy collectibles and custom products?",
    answer:
      "Yes. Explore the relevant sections of The Backstore to view available collectibles and customization options.",
  },
];

export default function FAQsPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#F4EBDD] px-5 pb-16 pt-40 text-[#111111] sm:px-8 sm:pt-44 lg:px-16 lg:pt-48">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-[#E50914]">
          THE BACKSTORE / SUPPORT
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight text-[#111111] sm:text-7xl">
          FAQs<span className="text-[#E50914]">.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5B554D] sm:text-base">
          Everything you need to know about orders, payments, delivery, and
          products.
        </p>

        <div className="mt-10">
          <label htmlFor="faq-search" className="sr-only">
            Search frequently asked questions
          </label>
          <input
            id="faq-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions..."
            className="w-full rounded-2xl border border-[#D8CCBB] bg-[#FBF7F0] px-5 py-4 text-sm text-[#111111] outline-none transition placeholder:text-[#8B8175] focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
          />
        </div>

        <div className="mt-8 divide-y divide-[#D8CCBB] border-y border-[#D8CCBB]">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <section key={faq.question} className="py-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span>
                    <span className="mb-2 block text-[10px] font-semibold tracking-[0.25em] text-[#E50914]">
                      {faq.category}
                    </span>
                    <span className="text-base font-semibold text-[#111111] sm:text-lg">
                      {faq.question}
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-2xl font-light text-[#E50914]"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <p className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-[#5B554D]">
                    {faq.answer}
                  </p>
                )}
              </section>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="py-12 text-center text-sm text-[#71685D]">
              No questions found. Try another search.
            </p>
          )}
        </div>

        <div className="mt-12 rounded-2xl border border-[#D8CCBB] bg-[#EDE0CE] p-7 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#6E6255]">
            STILL NEED HELP?
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase text-[#111111]">
            Let&apos;s sort it out.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5B554D]">
            If you can&apos;t find your answer, contact our team for assistance.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-[#E50914] px-6 py-3 text-xs font-bold tracking-widest text-white transition hover:bg-[#BD0710]"
          >
            CONTACT US →
          </a>
        </div>
      </div>
    </main>
  );
}
