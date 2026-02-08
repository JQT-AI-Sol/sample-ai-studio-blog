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

function getVolNo(dateString: string) {
  const d = new Date(dateString);
  return { vol: d.getFullYear() - 2025, no: d.getMonth() + 1 };
}

export default async function Home() {
  const posts = await sanityFetch<Post[]>({ query: POSTS_QUERY });

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center animate-reveal">
        <p className="font-serif-jp text-2xl text-walnut">
          No articles yet.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const featuredVolNo = featured.publishedAt ? getVolNo(featured.publishedAt) : null;

  return (
    <div>
      {/* Featured Article Panel */}
      <section className="featured-panel -mx-6 px-8 py-14 md:px-14 md:py-20 mb-16 animate-reveal">
        <Link
          href={`/posts/${featured.slug.current}`}
          className="block relative z-10 group"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/60 border border-ivory/20 px-3 py-1">
              Featured
            </span>
            {featured.publishedAt && (
              <time className="text-xs tracking-[0.15em] uppercase text-ivory/50">
                {formatDate(featured.publishedAt)}
              </time>
            )}
            {featuredVolNo && (
              <span className="text-xs tracking-[0.15em] uppercase text-ivory/40 ml-auto">
                Vol.{featuredVolNo.vol} No.{featuredVolNo.no}
              </span>
            )}
          </div>

          <h2 className="font-serif-jp font-black text-3xl md:text-5xl leading-tight text-ivory mb-8">
            {featured.title}
          </h2>

          <span className="inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-ivory/70 hover-underline-grow group-hover:text-ivory transition-colors duration-300">
            Read Article
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </Link>
      </section>

      {/* Section Header */}
      {rest.length > 0 && (
        <>
          <div className="flex items-baseline justify-between mb-4 animate-reveal-delay-1">
            <h2 className="font-serif-jp text-lg font-bold tracking-wide">
              最新の記事
            </h2>
            <span className="font-display text-sm text-walnut tracking-[0.15em] uppercase">
              Latest Articles
            </span>
          </div>
          <hr className="divider-double mb-10 animate-reveal-delay-1" />

          {/* Article List */}
          <section>
            <ul>
              {rest.map((post, index) => {
                const num = String(index + 1).padStart(2, "0");
                const delayClass = `animate-reveal-delay-${Math.min(index + 2, 5)}`;

                return (
                  <li key={post._id} className={delayClass}>
                    <Link
                      href={`/posts/${post.slug.current}`}
                      className="group flex items-start gap-6 py-7 px-4 -mx-4 hover-bg-slide"
                    >
                      {/* Large number */}
                      <span className="font-display text-4xl md:text-5xl text-sand leading-none transition-colors duration-300 group-hover:text-burgundy shrink-0 pt-1">
                        {num}
                      </span>

                      <div className="flex-1 min-w-0">
                        {post.publishedAt && (
                          <time className="text-xs text-walnut tracking-[0.15em] uppercase">
                            {formatDate(post.publishedAt)}
                          </time>
                        )}
                        <h3 className="font-serif-jp text-xl md:text-2xl font-bold leading-snug mt-1.5 text-ink transition-colors duration-300 group-hover:text-burgundy">
                          {post.title}
                        </h3>
                      </div>

                      {/* Arrow on hover */}
                      <span className="text-sand text-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0 pt-3">
                        &rarr;
                      </span>
                    </Link>
                    <hr className="border-none h-px bg-sand" />
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
