import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Free Monster Truck Coloring Pages. Questions, feedback, or copyright concerns — we'd love to hear from you.",
};

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl font-bold text-brand-black mb-6">
        Contact Us
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg">
          Have a question, suggestion, or just want to say hi? We&rsquo;d love
          to hear from you!
        </p>

        <div className="bg-brand-gray rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold text-brand-black mb-3">
            Get in Touch
          </h2>
          <p>
            Email us at:{" "}
            <a
              href="mailto:hello@freemonstertruckcoloringpages.com"
              className="text-brand-orange hover:underline font-semibold"
            >
              hello@freemonstertruckcoloringpages.com
            </a>
          </p>
        </div>

        <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
          Common Reasons to Reach Out
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Coloring page suggestions</strong> &mdash; Have an idea for a
            monster truck coloring page? We&rsquo;re always looking for new
            inspiration!
          </li>
          <li>
            <strong>Technical issues</strong> &mdash; Having trouble printing or
            downloading? Let us know and we&rsquo;ll help.
          </li>
          <li>
            <strong>Copyright concerns</strong> &mdash; If you believe any
            content on our site infringes on your intellectual property, please
            contact us immediately and we will address it promptly.
          </li>
          <li>
            <strong>Partnerships and collaborations</strong> &mdash; Interested
            in working together? We&rsquo;re open to ideas.
          </li>
          <li>
            <strong>Just saying hi</strong> &mdash; We love hearing from
            families who enjoy our coloring pages!
          </li>
        </ul>

        <p className="text-gray-500 text-sm mt-8">
          We typically respond within 1&ndash;2 business days. Thanks for your
          patience!
        </p>
      </div>
    </div>
  );
}
