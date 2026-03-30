import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Free Monster Truck Coloring Pages. Please read before using our site.",
};

export default function Terms() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://freemonstertruckcoloringpages.com";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl font-bold text-brand-black mb-6">
        Terms of Service
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Last updated: March 30, 2026
      </p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Agreement to Terms
          </h2>
          <p>
            By accessing and using Free Monster Truck Coloring Pages at{" "}
            <strong>{siteUrl}</strong> (the &ldquo;Site&rdquo;), you agree to be
            bound by these Terms of Service. If you do not agree with any part
            of these terms, please do not use our Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Use of the Site
          </h2>
          <p>
            Our Site provides free printable coloring pages for personal,
            non-commercial use. You may:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>View, print, and download coloring pages for personal use</li>
            <li>Share printed coloring pages with family, friends, classrooms, and community groups</li>
            <li>Use coloring pages in educational settings such as schools, daycares, and libraries</li>
          </ul>
          <p className="mt-3">You may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Sell, redistribute, or sublicense our coloring pages</li>
            <li>Claim ownership or authorship of our coloring pages</li>
            <li>Use our coloring pages in any commercial product without written permission</li>
            <li>Modify our coloring pages and present them as your own work</li>
            <li>Use automated tools to bulk download content from the Site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Intellectual Property
          </h2>
          <p>
            All coloring page illustrations on this Site are original works
            created by us. They are protected by copyright law. The Site design,
            logos, text, and graphics are also our intellectual property.
          </p>
          <p className="mt-3">
            This is an unofficial fan site. We are not affiliated with, endorsed
            by, or connected to Monster Jam, Feld Entertainment, or any
            official monster truck organization. All monster truck names used on
            this site are original creative names created by us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            User-Provided Information
          </h2>
          <p>
            If you subscribe to our email or SMS notifications, you agree to
            provide accurate contact information. You may unsubscribe at any
            time. We will handle your information in accordance with our{" "}
            <a href="/privacy-policy" className="text-brand-orange hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Disclaimer of Warranties
          </h2>
          <p>
            The Site and all content are provided &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; without warranties of any kind, either
            express or implied. We do not warrant that the Site will be
            uninterrupted, error-free, or free of viruses or other harmful
            components.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Free Monster Truck Coloring
            Pages shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Advertising
          </h2>
          <p>
            Our Site displays advertisements provided by third-party advertising
            networks, including Google AdSense. These ads may use cookies and
            similar technologies. We are not responsible for the content of
            third-party advertisements. For more information, see our{" "}
            <a href="/privacy-policy" className="text-brand-orange hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            External Links
          </h2>
          <p>
            Our Site may contain links to external websites. We are not
            responsible for the content or practices of these third-party sites.
            We encourage you to review the terms and privacy policies of any
            site you visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Changes to These Terms
          </h2>
          <p>
            We reserve the right to modify these Terms of Service at any time.
            Changes will be effective immediately upon posting to the Site. Your
            continued use of the Site after changes are posted constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Contact Us
          </h2>
          <p>
            If you have any questions about these Terms of Service, please visit
            our{" "}
            <a href="/contact" className="text-brand-orange hover:underline">
              Contact Page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
