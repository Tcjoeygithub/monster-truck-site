import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Free Monster Truck Coloring Pages. Unofficial fan site, not affiliated with Monster Jam.",
};

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl font-bold text-brand-black mb-6">
        Disclaimer
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Last updated: March 30, 2026
      </p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Unofficial Fan Site
          </h2>
          <p>
            Free Monster Truck Coloring Pages is an unofficial fan site. We are{" "}
            <strong>
              not affiliated with, endorsed by, sponsored by, or connected to
              Monster Jam, Feld Entertainment, or any official monster truck
              organization, team, or driver
            </strong>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Original Artwork
          </h2>
          <p>
            All coloring page illustrations on this Site are original fan art
            created for educational and entertainment purposes. Our monster truck
            designs use original creative names and do not reproduce any
            copyrighted or trademarked artwork. Any resemblance to real monster
            trucks is for fan appreciation purposes only.
          </p>
          <p className="mt-3">
            Where editorial references to real monster truck names appear in our
            text content (such as &ldquo;inspired by&rdquo; or &ldquo;for fans
            of&rdquo;), these are used in a nominative fair use context for
            informational and descriptive purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            No Professional Advice
          </h2>
          <p>
            The content on this Site is provided for entertainment and
            educational purposes only. It does not constitute professional advice
            of any kind. Parental supervision is recommended when children use
            the Internet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Accuracy of Information
          </h2>
          <p>
            While we strive to keep the information on our Site accurate and
            up-to-date, we make no representations or warranties of any kind
            about the completeness, accuracy, reliability, or suitability of the
            information, products, or services contained on the Site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
            Copyright Concerns
          </h2>
          <p>
            If you believe any content on this Site infringes on your copyright
            or intellectual property rights, please contact us immediately
            through our{" "}
            <a href="/contact" className="text-brand-orange hover:underline">
              Contact Page
            </a>{" "}
            and we will promptly address the concern.
          </p>
        </section>
      </div>
    </div>
  );
}
