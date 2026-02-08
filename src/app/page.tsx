import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  const posts = await sanityFetch<Post[]>({ query: POSTS_QUERY });

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-editorial text-2xl text-warm-gray italic">
          No articles yet.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div>
      <section className="mb-12">
        <h2 className="font-editorial text-lg font-normal text-warm-gray tracking-widest uppercase mb-6">
          Articles
        </h2>
        <hr className="divider mb-12" />
      </section>

      <section className="mb-16">
        <Link
          href={`/posts/${featured.slug.current}`}
          className="group block"
        >
          {featured.publishedAt && (
            <time className="text-xs text-medium-gray tracking-widest uppercase">
              {formatDate(featured.publishedAt)}
            </time>
          )}
          <h2 className="font-editorial text-3xl md:text-4xl font-normal leading-tight mt-3 text-ink transition-editorial group-hover:text-warm-gray">
            {featured.title}
          </h2>
        </Link>
        <hr className="divider mt-12" />
      </section>

      {rest.length > 0 && (
        <section>
          <ul>
            {rest.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/posts/${post.slug.current}`}
                  className="group block py-8"
                >
                  {post.publishedAt && (
                    <time className="text-xs text-medium-gray tracking-widest uppercase">
                      {formatDate(post.publishedAt)}
                    </time>
                  )}
                  <h3 className="font-editorial text-xl md:text-2xl font-normal leading-snug mt-2 text-ink transition-editorial group-hover:text-warm-gray">
                    {post.title}
                  </h3>
                </Link>
                <hr className="divider" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
