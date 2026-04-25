import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import blogPosts from "@/data/blog-posts.json";

export const metadata: Metadata = {
  title: "Blog — Monster Truck Coloring Tips & Activities",
  description:
    "Helpful articles for parents and teachers about coloring activities, child development, and creative ways to use free printable monster truck coloring pages.",
};

export default function BlogIndex() {
  return (
    <TwoColumnLayout>
      <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-3">
        Coloring Tips &amp; Activities
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-3xl">
        Helpful guides for parents and teachers on coloring activities, child
        development, and creative ways to use our free printable monster truck
        coloring pages.
      </p>

      <div className="space-y-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white border-2 border-gray-100 hover:border-brand-orange rounded-xl p-6 transition-all hover:shadow-md group"
          >
            <h2 className="font-bold text-xl text-brand-black group-hover:text-brand-orange transition-colors mb-2">
              {post.title}
            </h2>
            <p className="text-gray-500 text-sm mb-3">{post.metaDescription}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.publishDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </Link>
        ))}
      </div>
    </TwoColumnLayout>
  );
}
