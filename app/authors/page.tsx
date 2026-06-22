import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

const PAGE_DESCRIPTION = `Authors writing for ${SITE_NAME}. Currently a solo operation maintained by founder David Pham, San Jose.`;

export const metadata: Metadata = {
  title: `Authors — ${SITE_NAME}`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/authors/` },
};

export default function AuthorsIndexPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Authors</h1>
      <p className="mt-3 text-gray-600 text-lg">
        {SITE_NAME} is currently a solo project. Every tool, every blog post, and every comparison is built and written by one person.
      </p>

      <div className="mt-8">
        <Link
          href="/authors/david-pham/"
          className="block rounded-2xl border bg-white hover:border-emerald-400 transition p-6 group"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-5">
            <Image
              src="/authors/david-pham-256.png"
              alt="David Pham"
              width={96}
              height={96}
              className="rounded-2xl ring-2 ring-emerald-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 m-0">David Pham</h2>
              <p className="text-sm text-emerald-700 font-medium mt-0.5">Founder &amp; Solo Developer</p>
              <p className="mt-2 text-sm text-gray-600">
                San Jose, California. Computer Science grad from San Jose State University. Former engineer at Adobe Creative Cloud and Figma plugin platform. Founded Pickrack in 2022.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 shrink-0" />
          </div>
        </Link>
      </div>
    </article>
  );
}
