import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  body: any[];
};

function getVolNo(dateString: string) {
  const d = new Date(dateString);
  return { vol: d.getFullYear() - 2025, no: d.getMonth() + 1 };
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: POST_SLUGS_QUERY,
  });
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: POST_QUERY,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  const volNo = post.publishedAt ? getVolNo(post.publishedAt) : null;

  return (
    <article className="animate-reveal">
      {/* Back link */}
      <div className="mb-10">
        <Link href="/" className="back-link">
          <span className="arrow">&larr;</span>
          All Articles
        </Link>
      </div>

      <header className="mb-14">
        {/* Date and Vol/No */}
        <div className="flex items-center gap-4 mb-6">
          {post.publishedAt && (
            <time className="text-sm text-gold tracking-[0.15em] uppercase font-medium">
              {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {volNo && (
            <span className="issue-badge">
              Vol.{volNo.vol} No.{volNo.no}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif-jp font-black text-4xl md:text-5xl lg:text-7xl leading-[1.15] tracking-tight text-ink">
          {post.title}
        </h1>

        {/* Decorative line with diamond */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-sand" />
          <span className="text-sand text-sm">&#9670;</span>
          <div className="flex-1 h-px bg-sand" />
        </div>
      </header>

      {/* Article body with drop cap */}
      <div className="drop-cap prose prose-lg prose-stone max-w-none" style={{ letterSpacing: '0.04em', lineHeight: 2 }}>
        <PortableText value={post.body} />
      </div>

      {/* End mark */}
      <div className="mt-12 text-center">
        <span className="text-ink text-lg">&#9632;</span>
      </div>

      {/* Footer navigation */}
      <footer className="mt-12">
        <hr className="divider-double mb-8" />
        <div className="flex items-center justify-between">
          <Link href="/" className="back-link">
            <span className="arrow">&larr;</span>
            All Articles
          </Link>
          <a
            href="#"
            onClick={undefined}
            className="text-sm text-walnut tracking-wide transition-colors duration-300 hover:text-ink"
          >
            Back to Top &uarr;
          </a>
        </div>
      </footer>
    </article>
  );
}
