# Contributing to Pickrack

Thanks for considering a contribution! Pickrack is intentionally a small, focused codebase — every tool is auditable in a few hundred lines.

## Quick start

```bash
git clone https://github.com/pickrack/pickrack.git
cd pickrack
npm install
npm run dev
# Open http://localhost:3000
```

## Adding a new tool

A tool is roughly 4 files. Browser-side tools (recommended when possible) need no server infrastructure.

### 1. Add the tool entry to `lib/tools.ts`

```ts
{
  slug: "my-new-tool",         // URL slug — kebab-case
  name: "My New Tool",         // Display name
  description: "One-sentence description shown on hub + footer.",
  category: "dev",             // pdf | image | ai | dev | text | calc
  available: true,
  iconColor: "text-blue-600",
}
```

### 2. Add SEO metadata to `lib/tool-seo.ts`

```ts
"my-new-tool": {
  slug: "my-new-tool",
  name: "My New Tool",
  title: "My New Tool — Free Online, Browser-Side, No Signup",
  description: "Search-snippet description (140-160 chars). What it does + privacy + free + no signup.",
  keywords: ["my new tool", "tool keyword 2", /* 8-10 more variations */],
}
```

### 3. Add long-form content to `lib/tool-content.ts`

Each tool has ~700 words of structured content powering the FAQ + HowTo schema, the on-page guide, and Google's understanding of what the tool does. See existing entries (e.g., `json-formatter`, `image-resizer`) as templates. Required fields:

- `intro` — array of 3 paragraphs explaining the tool
- `features` — 5 features with title + desc
- `howTo` — 3 steps
- `useCases` — 6 bullet items
- `faq` — 8 question/answer pairs
- `relatedTools` — 3 slugs of related tools (cross-category preferred for topical signal)

### 4. Build the tool page

`app/tools/<category>/<slug>/page.tsx` — the React component (use `"use client"` for browser-side).

`app/tools/<category>/<slug>/layout.tsx` — five-line wrapper using `ToolLayoutShell`:

```tsx
import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tool-seo";
import ToolLayoutShell from "@/components/ToolLayoutShell";

const SLUG = "my-new-tool";

export const metadata: Metadata = buildToolMetadata(SLUG) ?? {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayoutShell slug={SLUG}>{children}</ToolLayoutShell>;
}
```

This auto-injects:
- Page metadata (title, description, OG, Twitter, canonical)
- WebApplication + BreadcrumbList JSON-LD
- FAQPage + HowTo JSON-LD from `tool-content.ts`
- The long-form content section below your tool UI

That's it. The new tool will appear in:
- Homepage category card count
- Header dropdown
- Footer category column
- `/tools` master catalog
- `/tools/<category>` hub
- Sitemap (auto-included)

## Design guidelines

- **Browser-side first.** Use Canvas API, Web Crypto, WebAssembly, native browser APIs whenever possible. Reach for server-side only when no browser equivalent exists at acceptable quality.
- **Privacy banner.** If your tool is server-side, include the amber warning banner pattern from existing server tools (e.g., `app/tools/pdf/compress-pdf/page.tsx`).
- **Copy buttons everywhere.** Every output should have a one-click copy. Use the `Copy` / `Check` Lucide icons.
- **Live preview where it makes sense.** For visual tools (image resize, color), update output as the user adjusts inputs. For heavy operations (AI, conversion), require a button click.
- **Live as you type.** For text/dev tools (JSON formatter, word counter, regex tester), update on every keystroke — no Submit button.
- **Error states.** Show errors inline (red border, red text, clear message). Never throw uncaught exceptions.
- **Mobile-friendly.** All tools should work on mobile browsers. Test at 375px viewport.
- **No tracking inside the tool.** Page-level GA4 is OK. Don't add analytics that capture the user's data (text input, file content, etc.).

## Code style

- TypeScript strict mode (already configured)
- Prefer named exports over default for utility functions
- Functional components with hooks
- Tailwind for styling — match existing color scheme per category (PDF rose, Image amber, AI violet, Dev blue, Text emerald, Calc indigo)
- No CSS-in-JS libraries — Tailwind only

## Pull request guidelines

1. **One tool per PR** — keeps reviews fast.
2. **Include a screenshot or short GIF** of the tool in action.
3. **Verify the build passes locally** — `npm run build` should complete without errors.
4. **Verify schema** — view-source on your tool page should show 4 `application/ld+json` blocks (WebApplication, BreadcrumbList, FAQPage, HowTo).
5. **Self-review** — does your tool follow the design guidelines above? Is privacy clear?

## What we will likely NOT accept

- Tools that send user data to a third-party API without disclosure (the user has to know what's happening)
- Tools that wrap a paid service as the "free" Pickrack version (we don't ride other people's quotas)
- Tools requiring crypto-mining or heavy persistent compute on the user's device
- Tools that depend on libraries with restrictive licenses (must be MIT/Apache/BSD compatible)
- Joke tools with no genuine use case (we have nothing against fun tools, but they should still be useful)

## Reporting bugs

Open a GitHub issue with:
- Tool slug (e.g., `pdf-to-word`)
- Browser + version (e.g., Chrome 130 on macOS)
- What you tried (file type/size, input)
- Expected behavior
- Actual behavior
- Console errors if any (DevTools → Console)

## Code of conduct

Be respectful in issues, PRs, and discussions. We're a small project; let's keep it pleasant.

## License

By contributing, you agree your contributions are licensed under [MIT](./LICENSE) — same as the project.
