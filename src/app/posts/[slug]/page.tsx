import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
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
      <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
      {post.publishedAt && (
        <time className="mb-8 block text-sm text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
      <div className="prose prose-gray max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
