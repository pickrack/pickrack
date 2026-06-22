"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/site-config";
import { listCategories } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const categories = listCategories();

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur bg-white/80" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm group-hover:bg-emerald-700 transition">
            PR
          </span>
          <span className="font-bold text-lg tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/tools/${cat.slug}/`}
              className="text-gray-700 hover:text-emerald-600 transition"
            >
              {cat.shortLabel}
            </Link>
          ))}
          <Link href="/blog" className="text-gray-700 hover:text-emerald-600 transition">Blog</Link>
          <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition">About</Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-sm font-medium text-emerald-600 hover:text-emerald-700"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white" style={{ borderColor: "var(--color-border)" }}>
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools/${cat.slug}/`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-700"
              >
                {cat.name} <span className="text-xs text-gray-400">({getToolsByCategory(cat.id).length})</span>
              </Link>
            ))}
            <div className="border-t my-2" style={{ borderColor: "var(--color-border)" }} />
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block py-2">Blog</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2">About</Link>
          </div>
        </div>
      )}
    </header>
  );
}
