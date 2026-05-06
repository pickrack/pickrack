import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Developer Tools — JSON, Base64, JWT, Hash, Regex, UUID",
  description:
    "Free developer utilities that run entirely in your browser. JSON formatter, Base64 codec, JWT decoder, hash generator, regex tester, UUID. Tokens and payloads never leave your tab.",
  alternates: { canonical: `${SITE_URL}/tools/dev/` },
};

const FAQ = [
  {
    q: "Why are developer tools important to be browser-side?",
    a: "Devs frequently work with sensitive data: API tokens, JWTs containing user IDs, JSON payloads with PII, hashes of credentials. Server-side tools (even reputable ones) log requests for analytics. Browser-side tools mean your tokens never leave your tab — verifiable in DevTools → Network.",
  },
  {
    q: "How are these tools different from JSONFormatter.org, Base64Decode.org?",
    a: "Most popular dev tool sites are server-side and ad-heavy. Pickrack runs everything client-side and uses minimal ads (none inside the tool itself). The functionality is similar; the privacy + UX is the differentiator.",
  },
  {
    q: "Do you have a CLI version of these tools?",
    a: "Not currently — but the underlying primitives are all native (jq for JSON, base64 for Base64, openssl for hashing). Pickrack adds a polished UI on top. We may open-source a unified CLI in the future.",
  },
  {
    q: "Can I integrate Pickrack into my dev workflow?",
    a: "Yes — bookmark individual tools or the catalog page. Most tools accept URL parameters (e.g., `?input=...`) to pre-populate, useful for sharing examples or creating bookmarklets.",
  },
  {
    q: "Are there API endpoints for these tools?",
    a: "Browser-side tools don't have APIs — everything runs in JavaScript locally. For programmatic use, install the underlying libraries directly (e.g., `npm i jose` for JWT, `crypto.subtle` for hashing).",
  },
  {
    q: "Do you support tree view / collapsible JSON?",
    a: "v1 is plain text. Tree view is on the roadmap. For complex nested JSON, VS Code with the JSON Viewer extension or jq locally is more comfortable.",
  },
];

export default function DevHubPage() {
  return <CategoryHub categoryId="dev" faq={FAQ} />;
}
