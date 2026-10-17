"use client";

import { useState } from "react";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      'The Backstore ("we", "our", or "us") respects your privacy. This Privacy Policy explains what information may be collected when you browse our website, create an account, place an order, or contact us, and how that information is used.',
      "By using our website, you acknowledge this policy. If you do not agree with it, please discontinue use of the website.",
    ],
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "Depending on how you use the website, we may collect information you provide, such as your name, email address, phone number, shipping and billing address, account details, order information, and messages sent to our support team.",
      "We may also collect technical information such as your IP address, browser type, device information, pages viewed, and basic usage data through cookies or similar technologies.",
    ],
  },
  {
    title: "3. How We Use Information",
    paragraphs: [
      "We use information to operate and maintain the website, process orders and payments, arrange delivery, provide customer support, manage returns or cancellation requests, improve our products and services, prevent fraud, and communicate important order or account updates.",
      "Where permitted by law and your preferences, we may also use your contact details to send promotional messages. You can opt out of marketing communications where an unsubscribe option is provided.",
    ],
  },
  {
    title: "4. Payments",
    paragraphs: [
      "Payments may be processed by third-party payment providers. Payment information is handled by the relevant provider according to its own terms and privacy practices. We do not intend to store full payment card details on our website.",
    ],
  },
  {
    title: "5. Cookies and Similar Technologies",
    paragraphs: [
      "Our website may use cookies or similar technologies to support essential features, remember preferences, maintain sessions, understand website usage, and improve the shopping experience. You can manage cookies through your browser settings, although disabling some cookies may affect website functionality.",
    ],
  },
  {
    title: "6. Sharing of Information",
    paragraphs: [
      "We may share relevant information with service providers who help operate the website, process payments, deliver orders, provide analytics, or support customer service. We may also disclose information when required by law, to protect our rights and users, or as part of a business transfer.",
      "We do not sell your personal information as a standalone product.",
    ],
  },
  {
    title: "7. Data Retention and Security",
    paragraphs: [
      "We retain information for as long as reasonably necessary to provide our services, maintain order and business records, resolve disputes, enforce agreements, and meet legal obligations. We use reasonable safeguards designed to protect information, but no internet transmission or storage system can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "8. Your Choices and Rights",
    paragraphs: [
      "Depending on applicable law, you may be able to request access to, correction of, or deletion of certain personal information, or object to certain uses. You can update account details where account tools are available and contact us to make a privacy-related request.",
    ],
  },
  {
    title: "9. Third-Party Services and Links",
    paragraphs: [
      "Our website may contain links to third-party websites or use third-party services. Their privacy practices are governed by their own policies, and we encourage you to review those policies before sharing information with them.",
    ],
  },
  {
    title: "10. Children's Privacy",
    paragraphs: [
      "Our website is not intended for children to use independently to make purchases. If you believe a child has provided personal information to us inappropriately, contact us so we can review the matter.",
    ],
  },
  {
    title: "11. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. The revised version will be posted on this page with an updated effective date.",
    ],
  },
  {
    title: "12. Contact Us",
    paragraphs: [
      "For questions or requests about this Privacy Policy, please contact us through the Contact page on The Backstore website.",
    ],
  },
];

const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("1. Introduction");

  return (
    <main className="min-h-screen bg-[#F4EBDD] px-5 pb-16 pt-40 text-[#111111] sm:px-8 sm:pt-44 lg:px-16 lg:pt-48">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.35em] text-[#E50914]">
          THE BACKSTORE / LEGAL
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
          PRIVACY POLICY<span className="text-[#E50914]">.</span>
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#5B554D] sm:text-base">
          Your privacy matters. This page explains how information is handled
          when you use The Backstore website.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-[#D8CCBB] bg-[#EDE0CE] px-4 py-2 text-xs tracking-wider text-[#6E6255]">
          Effective date: 17 October 2026
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <aside className="h-fit rounded-2xl border border-[#D8CCBB] bg-[#EDE0CE] p-5 lg:sticky lg:top-28">
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[#E50914]">
              ON THIS PAGE
            </p>
            <nav aria-label="Privacy policy sections" className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.title}
                  href={`#${sectionId(section.title)}`}
                  onClick={() => setActiveSection(section.title)}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${activeSection === section.title ? "bg-[#E50914] font-semibold text-white" : "text-[#332E28] hover:bg-[#F4EBDD] hover:text-[#E50914]"}`}
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
            PRIVACY QUESTIONS?
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase text-[#111111]">
            We&apos;re here to help.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5B554D]">
            Contact The Backstore if you have a question about how your
            information is handled.
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
