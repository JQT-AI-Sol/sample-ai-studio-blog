import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Blog",
  description: "A simple blog built with Next.js and Sanity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-offwhite text-ink`}>
        <header className="pt-12 pb-8">
          <div className="mx-auto max-w-3xl px-6">
            <Link href="/" className="block text-center group">
              <h1
                className={`${playfair.className} text-4xl font-normal tracking-tight text-ink transition-editorial`}
              >
                Blog
              </h1>
              <p className="mt-1 text-sm text-warm-gray tracking-widest uppercase">
                Stories & Ideas
              </p>
            </Link>
            <hr className="divider-bold mt-8" />
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-8">
          {children}
        </main>
        <footer className="mt-16 pb-12">
          <div className="mx-auto max-w-3xl px-6">
            <hr className="divider mb-6" />
            <p className="text-center text-sm text-medium-gray">
              &copy; {new Date().getFullYear()} Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
