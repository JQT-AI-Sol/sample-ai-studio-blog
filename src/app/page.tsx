import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
};

export default async function Home() {
  const posts = await sanityFetch<Post[]>({ query: POSTS_QUERY });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Articles</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/posts/${post.slug.current}`}
                className="group block"
              >
                <h2 className="text-xl font-semibold group-hover:text-blue-600">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
