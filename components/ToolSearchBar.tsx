"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { TOOLS } from "@/lib/tools";
import { getCategory } from "@/lib/categories";

export default function ToolSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return TOOLS.filter(
      (t) => t.available && (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search 76+ tools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-4 py-3 rounded-full border bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          style={{ borderColor: "var(--color-border)" }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (query || results.length > 0) && (
        <div
          className="absolute top-full mt-2 w-full bg-white rounded-xl border shadow-lg z-50"
          style={{ borderColor: "var(--color-border)" }}
        >
          {results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((tool) => {
                const cat = getCategory(tool.category);
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${cat.slug}/${tool.slug}/`}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="font-medium text-sm text-gray-900">{tool.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{tool.description}</div>
                  </Link>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No tools found. Try a different search or <Link href="/tools/" className="text-emerald-600 hover:underline">browse all tools</Link>.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
