import Link from "next/link";
import { SITE_NAME, SOCIAL } from "@/lib/site-config";
import { listCategories } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default function Footer() {
  const categories = listCategories();

  return (
    <footer className="border-t mt-16 bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand row */}
        <div className="grid gap-8 lg:grid-cols-4 mb-10">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
                PR
              </span>
              <span className="font-bold text-lg">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-600 leading-6 max-w-xs">
              Free online tools that respect your privacy. No signup, no daily limit, no watermark.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={SOCIAL.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
                style={{ borderColor: "var(--color-border)" }}
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
                style={{ borderColor: "var(--color-border)" }}
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Tool columns - sitewide listing of every tool, grouped by category */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            {categories.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              return (
                <div key={cat.id}>
                  <Link
                    href={`/tools/${cat.slug}/`}
                    className="font-semibold mb-3 text-sm uppercase tracking-wide text-gray-900 hover:text-emerald-600 inline-block"
                  >
                    {cat.name}
                  </Link>
                  <ul className="space-y-1.5 mt-2">
                    {tools.length === 0 && (
                      <li className="text-xs text-gray-400 italic">Coming soon</li>
                    )}
                    {tools.slice(0, 8).map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={`/tools/${cat.slug}/${tool.slug}/`}
                          className="text-gray-600 hover:text-emerald-600"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                    {tools.length > 8 && (
                      <li>
                        <Link
                          href={`/tools/${cat.slug}/`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium text-xs"
                        >
                          See all {tools.length} →
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Site links + AdSense disclosure row */}
        <div className="grid gap-6 sm:grid-cols-2 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/about" className="text-gray-600 hover:text-emerald-600">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-emerald-600">Contact</Link>
            <Link href="/blog" className="text-gray-600 hover:text-emerald-600">Blog</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-emerald-600">Privacy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-emerald-600">Terms</Link>
            <Link href="/cookies" className="text-gray-600 hover:text-emerald-600">Cookies</Link>
            <Link href="/disclosure" className="text-gray-600 hover:text-emerald-600">Disclosure</Link>
          </div>
          <p className="text-xs text-gray-500 sm:text-right">
            Some external links are affiliate. We only recommend tools we use ourselves.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-gray-500" style={{ borderColor: "var(--color-border)" }}>
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
