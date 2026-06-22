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

const intro = (
  <>
    <h2>Why developers should care that these run in-browser</h2>
    <p>
      Every working developer has the same daily problem: you copy a JWT from a Slack thread to decode it, you paste a JSON blob from a production log to format it, you generate a SHA-256 hash to compare a file against a published checksum. The fastest path is usually a Google search → click first result → paste. The first result is almost always a server-side tool that logs your input for analytics, often with a banner ad in the middle of the result.
    </p>
    <p>
      That &quot;harmless&quot; copy-paste workflow has produced real incidents. Tokens leaked through online JWT decoders. Internal API endpoints exposed via JSON formatters whose operators got curious. Production credentials hashed at sites whose database later leaked. The fix is not better operational discipline — engineers have other things to think about. The fix is to use tools that <em>can&apos;t</em> log your input because they don&apos;t have a server.
    </p>
    <p>
      Pickrack&apos;s six developer tools all run <strong>entirely in your browser</strong>. JSON formatting is a <code>JSON.parse</code> + <code>JSON.stringify</code> in JavaScript. Base64 encoding is the native <code>btoa</code>/<code>atob</code> with a TextEncoder fallback for full UTF-8 (Vietnamese, emoji). JWT decoding is a Base64URL split into header/payload/signature, decoded into JSON. Hash generation uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto" target="_blank" rel="noopener noreferrer">Web Crypto API</a> (built into the browser, FIPS-validated implementation). UUIDs use <code>crypto.randomUUID</code>. Regex testing uses the native JavaScript regex engine. None of this code makes a network request. You can verify with DevTools → Network.
    </p>
    <h2>The six developer tools and what they replace</h2>
    <ul>
      <li><strong><a href="/tools/dev/json-formatter/">JSON Formatter</a></strong> — replaces JSONFormatter.org, JSON Editor Online. Formats with 2-space or 4-space indent, validates syntax, shows error position on invalid input.</li>
      <li><strong><a href="/tools/dev/base64-encoder/">Base64 Encoder/Decoder</a></strong> — replaces Base64Decode.org. Full UTF-8 support (Vietnamese, Chinese, emoji) which most simple <code>btoa</code> wrappers break.</li>
      <li><strong><a href="/tools/dev/jwt-decoder/">JWT Decoder</a></strong> — replaces jwt.io. Decodes header + payload, shows expiration as a human-readable date, signature verification on the roadmap.</li>
      <li><strong><a href="/tools/dev/hash-generator/">Hash Generator</a></strong> — replaces miscellaneous hash tools. MD5 (legacy compat only), SHA-1 (Git compat), SHA-256, SHA-512. Note: do not use plain hashes for password storage — use bcrypt, scrypt, or Argon2.</li>
      <li><strong><a href="/tools/dev/uuid-generator/">UUID Generator</a></strong> — replaces uuidgenerator.net. Generates 1-1000 v4 UUIDs at once. Compatible with PostgreSQL <code>uuid</code> type.</li>
      <li><strong><a href="/tools/dev/regex-tester/">Regex Tester</a></strong> — replaces regex101 for quick checks. Live match highlighting, capture group display, six common presets (email, URL, phone, ISO date, IPv4, hex color).</li>
    </ul>
    <h2>What we don&apos;t replace (and shouldn&apos;t)</h2>
    <p>
      Pickrack&apos;s dev tools are <em>complementary</em> to your main toolchain, not a replacement. For complex regex work, <a href="https://regex101.com" target="_blank" rel="noopener noreferrer">regex101</a> is still better — it has explanation mode, multiple flavors (Python, PHP, JavaScript), and is the de facto standard. For deeply nested JSON exploration, <code>jq</code> on the command line or VS Code&apos;s JSON tree view is more efficient. For full JWT signature verification with public keys, <a href="https://github.com/panva/jose" target="_blank" rel="noopener noreferrer">the <code>jose</code> npm library</a> is the right choice. Pickrack is the &quot;quick check before going back to my real workflow&quot; layer.
    </p>
  </>
);

export default function DevHubPage() {
  return <CategoryHub categoryId="dev" intro={intro} faq={FAQ} />;
}
