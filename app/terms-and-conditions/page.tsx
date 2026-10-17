"use client";

import { useState } from "react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of The Backstore website, including browsing, creating an account, purchasing products, and using customization features. By using the website, you agree to these terms.",
      "If you do not agree to these terms, please do not use the website.",
    ],
  },
  {
    title: "2. Eligibility and Accounts",
    paragraphs: [
      "You are responsible for providing accurate information when creating an account or placing an order and for keeping your login credentials secure.",
      "You are responsible for activity carried out through your account. Please contact us promptly if you believe your account has been accessed without authorization.",
    ],
  },
  {
    title: "3. Products and Availability",
    paragraphs: [
      "We make reasonable efforts to display product descriptions, images, prices, sizes, and availability accurately. Colours may appear differently depending on your screen and device.",
      "Products are subject to availability. We may update, limit, or discontinue products and product options without notice, subject to applicable law and any order already accepted.",
    ],
  },
  {
    title: "4. Prices, Offers, and Coupons",
    paragraphs: [
      "Prices, applicable taxes, delivery charges, and the final payable amount are shown during checkout. Please review the order summary before completing payment.",
      "Promotional codes are subject to their stated eligibility, validity, and conditions. Unless expressly stated, offers cannot be combined and may be limited to particular customers, products, or orders.",
    ],
  },
  {
    title: "5. Orders and Payment",
    paragraphs: [
      "Submitting an order is an offer to purchase the selected products. An order confirmation does not necessarily mean that an order has been accepted if payment, stock, pricing, or verification issues remain unresolved.",
      "Payments may be handled by third-party payment providers. You must provide accurate billing and contact information and follow the payment provider's applicable terms.",
    ],
  },
  {
    title: "6. Shipping and Delivery",
    paragraphs: [
      "Estimated delivery times and delivery charges are displayed where available. Delivery timelines are estimates and may be affected by courier operations, weather, service disruptions, or other circumstances outside our reasonable control.",
      "Please ensure that your shipping address and contact details are correct. Additional information about delivery may be shown during checkout or in your order confirmation.",
    ],
  },
  {
    title: "7. Cancellations, Returns, and Refunds",
    paragraphs: [
      "Cancellation, return, exchange, and refund requests are subject to the policy displayed on the website and applicable law. Eligibility may depend on the product type, order status, and condition of the item.",
      "Customized or made-to-order products may have different cancellation or return conditions, subject to applicable law. Please review the relevant policy or contact us before placing an order if you are unsure.",
    ],
  },
  {
    title: "8. Customization and User Content",
    paragraphs: [
      "If you upload text, artwork, images, or other material for customization, you confirm that you have the rights and permissions needed to use that material and that it does not unlawfully infringe another person's rights.",
      "You must not submit content that is unlawful, threatening, discriminatory, deceptive, or otherwise abusive. We may decline customization requests that we reasonably believe violate these terms or applicable law.",
    ],
  },
  {
    title: "9. Intellectual Property",
    paragraphs: [
      "Unless otherwise stated, the website and its content—including branding, text, graphics, design, and software—are owned by or licensed to The Backstore and are protected by applicable intellectual property laws.",
      "You may use the website for personal, non-commercial shopping purposes. You may not copy, reproduce, distribute, or commercially exploit website content without permission, except where permitted by law.",
    ],
  },
  {
    title: "10. Acceptable Use",
    paragraphs: [
      "You must not misuse the website, attempt unauthorized access, interfere with its operation, submit malicious code, engage in fraudulent activity, or use the website in a way that violates applicable law.",
    ],
  },
  {
    title: "11. Third-Party Services",
    paragraphs: [
      "The website may rely on third-party services for payments, delivery, analytics, or other features. Those services may be governed by separate terms and policies. To the extent permitted by law, The Backstore is not responsible for independent third-party services outside its control.",
    ],
  },
  {
    title: "12. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, The Backstore will not be liable for indirect or consequential losses arising from use of the website. Nothing in these terms excludes or limits liability that cannot legally be excluded or limited.",
      "The website is provided subject to availability, and we do not guarantee uninterrupted or error-free operation. We will address issues as reasonably practicable.",
    ],
  },
  {
    title: "13. Changes to These Terms",
    paragraphs: [
      "We may revise these Terms and Conditions from time to time. Updated terms will be posted on this page. Your continued use of the website after an update takes effect indicates acceptance of the revised terms to the extent permitted by law.",
    ],
  },
  {
    title: "14. Governing Law and Contact",
    paragraphs: [
      "These terms are subject to applicable laws. Any governing-law or dispute-resolution provisions should be reviewed and finalized for the jurisdiction in which The Backstore operates.",
      "For questions about these terms, contact us through the Contact page on The Backstore website.",
    ],
  },
];

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState("1. Acceptance of Terms");

  return (
    <main className="min-h-screen bg-[#F4EBDD] px-5 pb-16 pt-40 text-[#111111] sm:px-8 sm:pt-44 lg:px-16 lg:pt-48">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-[#E50914]">
          THE BACKSTORE / LEGAL
        </p>

        <h1 className="text-4xl font-black uppercase tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
          TERMS &amp; CONDITIONS<span className="text-[#E50914]">.</span>
        </h1>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5B554D] sm:text-base">
          Please read these terms before browsing, purchasing, or using the
          customization features on The Backstore.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-[#D8CCBB] bg-[#EDE0CE] px-4 py-2 text-xs tracking-wider text-[#6E6255]">
          Last updated: 17 October 2026
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <aside className="h-fit rounded-2xl border border-[#D8CCBB] bg-[#EDE0CE] p-5 lg:sticky lg:top-28">
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#E50914]">
              ON THIS PAGE
            </p>
            <nav aria-label="Terms sections" className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${sectionId(section.title)}`}
                  onClick={() => setActiveSection(section.title)}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    activeSection === section.title
                      ? "bg-[#E50914] font-semibold text-white"
                      : "text-[#332E28] hover:bg-[#F4EBDD] hover:text-[#E50914]"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0 rounded-2xl border border-[#D8CCBB] bg-[#FBF7F0] p-6 sm:p-9">
            {sections.map((section) => (
              <section
                key={section.title}
                id={sectionId(section.title)}
                className="scroll-mt-32 border-b border-[#E5D9C8] py-7 first:pt-0 last:border-b-0 last:pb-0"
              >
                <h2 className="text-lg font-bold uppercase tracking-wide text-[#111111] sm:text-xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-[#5B554D] sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <div className="mt-12 rounded-2xl border border-[#D8CCBB] bg-[#EDE0CE] p-7 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#6E6255]">
            QUESTIONS ABOUT THESE TERMS?
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase text-[#111111]">
            Need a hand?
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5B554D]">
            Contact The Backstore if you need clarification about an order or
            these terms.
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
