import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Free Monster Truck Coloring Pages. Built by a dad for his son and all kids who love monster trucks.",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <h1 className="font-[var(--font-display)] text-3xl font-bold text-brand-black mb-6">
        About Us
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <p className="text-lg">
          Welcome to Free Monster Truck Coloring Pages! This site was built by a
          dad for his son &mdash; and for all the kids out there who love monster
          trucks as much as we do.
        </p>

        <p>
          It started simple: my boy wanted to color monster trucks, but I
          couldn&rsquo;t find good free coloring pages that were actually
          designed for little kids. Most were either too complex, too boring, or
          covered in ads. So I decided to make my own.
        </p>

        <p>
          Every coloring page on this site is original artwork created
          specifically for young kids ages 2&ndash;8. We focus on bold, clean
          outlines that are easy for little hands to color. Simple enough for
          toddlers, cool enough for first graders.
        </p>

        <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
          What Makes Us Different
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Made for kids, not algorithms</strong> &mdash; Every page is
            designed with little hands in mind. Bold outlines, large colorable
            areas, age-appropriate detail.
          </li>
          <li>
            <strong>100% free</strong> &mdash; No paywalls, no premium tiers, no
            &ldquo;download 3 then pay.&rdquo; Every page is free to print and
            download.
          </li>
          <li>
            <strong>New pages regularly</strong> &mdash; We add new monster truck
            coloring pages frequently so there&rsquo;s always something fresh.
          </li>
          <li>
            <strong>Print-friendly</strong> &mdash; Hit the Print button and get
            a clean, single-page coloring sheet. No headers, no ads, no wasted
            paper.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-brand-black mt-8 mb-3">
          A Note to Parents
        </h2>
        <p>
          This site is built with your family in mind. We keep things safe,
          simple, and fun. If you have feedback, suggestions for new truck
          designs, or just want to say hi, head over to our{" "}
          <a href="/contact" className="text-brand-orange hover:underline">
            Contact Page
          </a>
          .
        </p>

        <p>
          Happy coloring!
        </p>
      </div>
    </div>
  );
}
