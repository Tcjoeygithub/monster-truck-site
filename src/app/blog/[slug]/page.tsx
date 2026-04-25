import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import blogPosts from "@/data/blog-posts.json";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
  };
}

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishDate,
    publisher: {
      "@type": "Organization",
      name: "Free Monster Truck Coloring Pages",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <TwoColumnLayout>
        <Breadcrumbs
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
        <article>
          <header className="mb-8">
            <h1 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-brand-black mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{post.author}</span>
              <span>·</span>
              <span>
                {new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>
          <div
            className="prose prose-gray max-w-3xl text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </TwoColumnLayout>
    </>
  );
}
