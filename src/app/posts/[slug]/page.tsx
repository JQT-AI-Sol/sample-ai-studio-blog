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

  return (
    <article>
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-medium-gray tracking-wide transition-editorial hover:text-ink"
        >
          &larr; Articles
        </Link>
      </div>

      <header className="mb-12">
        {post.publishedAt && (
          <time className="block text-xs text-medium-gray tracking-widest uppercase mb-4">
            {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="font-editorial text-4xl md:text-5xl font-normal leading-tight tracking-tight text-ink">
          {post.title}
        </h1>
        <hr className="divider mt-10" />
      </header>

      <div className="prose prose-lg prose-gray max-w-none">
        <PortableText value={post.body} />
      </div>

      <footer className="mt-16">
        <hr className="divider mb-8" />
        <Link
          href="/"
          className="text-sm text-medium-gray tracking-wide transition-editorial hover:text-ink"
        >
          &larr; All Articles
        </Link>
      </footer>
    </article>
  );
}
