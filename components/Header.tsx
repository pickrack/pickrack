"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, Image as ImageIcon, Sparkles, Code2, Type, Calculator } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";
import { listCategories, type Category } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools";

const CATEGORY_ICONS: Record<Category["iconName"], React.ComponentType<{ className?: string }>> = {
  FileText,
  Image: ImageIcon,
  Sparkles,
  Code2,
  Type,
  Calculator,
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = listCategories();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur bg-white/80" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm group-hover:bg-emerald-700 transition">
            PR
          </span>
          <span className="font-bold text-lg tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-gray-700 hover:text-emerald-600 transition"
              aria-expanded={open}
              aria-haspopup="true"
            >
              Tools <ChevronDown className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div
                className="absolute left-0 top-full mt-2 w-72 rounded-2xl border bg-white shadow-lg p-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Link
                  href="/tools"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 hover:bg-gray-50 mb-1"
                >
                  <p className="font-semibold text-sm text-gray-900">All Tools</p>
                  <p className="text-xs text-gray-500">Browse the full catalog</p>
                </Link>
                <div className="border-t my-1" style={{ borderColor: "var(--color-border)" }} />
                {categories.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.iconName];
                  const count = getToolsByCategory(cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/tools/${cat.slug}/`}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-gray-50"
                    >
                      <div className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-lg ${cat.bgColor} ${cat.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900">
                          {cat.name} <span className="text-xs text-gray-400 font-normal">({count})</span>
                        </p>
                        <p className="text-xs text-gray-500 truncate">{cat.tagline}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
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
            <Link href="/tools" onClick={() => setMobileOpen(false)} className="block py-2 font-semibold">All Tools</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tools/${cat.slug}/`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 pl-4 text-gray-700"
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
