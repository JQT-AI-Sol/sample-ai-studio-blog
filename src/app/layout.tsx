import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Literary Review",
  description: "Essays, Criticism, and Stories — 思考と言葉の交差点",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${notoSansJP.variable} ${cormorant.variable} bg-cream text-ink`}
      >
        <header className="pt-10 pb-6">
          <div className="mx-auto max-w-4xl px-6">
            {/* Animated top rule */}
            <div className="h-px bg-sand animate-expand-width mb-6" />

            {/* Top badges row */}
            <div className="flex items-center justify-between text-walnut mb-6 animate-reveal-delay-1">
              <span className="issue-badge">Est. 2026</span>
              <span className="text-xs tracking-[0.2em] uppercase">
                思考と言葉の交差点
              </span>
              <span className="issue-badge">東京</span>
            </div>

            {/* Masthead title */}
            <Link href="/" className="block text-center group animate-reveal">
              <h1 className="masthead-title text-5xl md:text-7xl text-ink">
                The Literary Review
              </h1>
              <p className="mt-3 text-xs tracking-[0.3em] uppercase text-walnut font-display">
                Essays &middot; Criticism &middot; Stories
              </p>
            </Link>

            {/* Double rule: thick gradient + thin */}
            <div className="mt-8 animate-reveal-delay-2">
              <hr className="masthead-rule" />
              <hr className="border-none border-t border-sand mt-1.5 h-px bg-sand" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-8">
          {children}
        </main>

        <footer className="mt-16 pb-12">
          <div className="mx-auto max-w-4xl px-6">
            {/* Double rule */}
            <hr className="divider-double mb-8" />

            <div className="flex flex-col items-center gap-4">
              <p className="font-display text-sm tracking-[0.2em] uppercase text-walnut">
                The Literary Review
              </p>

              {/* Diamond ornament */}
              <span className="text-sand text-lg">&#9670;</span>

              <p className="text-xs text-walnut tracking-wide">
                &copy; {new Date().getFullYear()} The Literary Review. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
