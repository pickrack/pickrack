import type { Metadata } from "next";
import { POLICY_LAST_UPDATED, CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `Which cookies ${SITE_NAME} uses, why, and how to control them.`;

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/cookies/` },
};

export default function CookiesPage() {
  const jsonLd = buildWebPageJsonLd("cookies", "Cookie Policy", PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Cookie Policy</h1>
      <p className="text-sm text-gray-500">Last updated: {POLICY_LAST_UPDATED}</p>

      <p>
        This Cookie Policy explains what cookies <strong>{SITE_NAME}</strong> uses, why we use them, and how you can control them. It supplements our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What is a cookie?</h2>
      <p>A cookie is a small text file that a website saves to your device. It allows the site to remember you across pages and visits, measure traffic, or serve relevant advertising.</p>

      <h2>2. Cookies we use</h2>

      <h3>2.1 Strictly necessary cookies</h3>
      <p>None at this time. {SITE_NAME} does not require login, session, or shopping cart functionality, so no strictly necessary cookies are set by us directly.</p>

      <h3>2.2 Analytics cookies (Google Analytics 4)</h3>
      <table>
        <thead>
          <tr><th>Cookie</th><th>Purpose</th><th>Duration</th></tr>
        </thead>
        <tbody>
          <tr><td><code>_ga</code></td><td>Distinguishes unique users</td><td>2 years</td></tr>
          <tr><td><code>_ga_[ID]</code></td><td>Persists session state</td><td>2 years</td></tr>
          <tr><td><code>_gid</code></td><td>Distinguishes users (24h)</td><td>1 day</td></tr>
        </tbody>
      </table>

      <h3>2.3 Advertising cookies (Google AdSense)</h3>
      <p>When AdSense ads are displayed, Google and its partners may set cookies including:</p>
      <ul>
        <li><code>__gads</code> / <code>__gpi</code> — measure ad impressions and clicks (Google AdSense)</li>
        <li><code>IDE</code> / <code>DSID</code> — DoubleClick advertising and conversion tracking</li>
        <li>Other cookies set by Google ad partners depending on the ads served</li>
      </ul>
      <p>These cookies enable Google to serve ads based on your visits to {SITE_NAME} and other websites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a> or via the <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance opt-out</a>.</p>

      <h3>2.4 CDN cookies (Cloudflare)</h3>
      <p>Cloudflare may set cookies for security and performance:</p>
      <ul>
        <li><code>__cf_bm</code> — bot management, identifies trusted web traffic (30 minutes)</li>
        <li><code>cf_clearance</code> — proves the visitor passed a security check (varies)</li>
      </ul>

      <h2>3. How to control cookies</h2>

      <h3>3.1 Browser settings</h3>
      <p>Most browsers let you block, delete, or be notified about cookies. Instructions:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h3>3.2 Opt-out tools</h3>
      <ul>
        <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
        <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
        <li><a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">DAA WebChoices</a> (US)</li>
        <li><a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">Your Online Choices</a> (EU)</li>
      </ul>

      <h2>4. What happens if you disable cookies</h2>
      <p>Disabling cookies will not break {SITE_NAME} — pages and articles will still load normally. However:</p>
      <ul>
        <li>Analytics will be incomplete or absent (we won&#39;t see your visit)</li>
        <li>Ads may be less relevant to you</li>
        <li>Some embedded third-party content may not function</li>
      </ul>

      <h2>5. Updates to this policy</h2>
      <p>We may update this Cookie Policy as our use of cookies evolves. The &quot;Last updated&quot; date reflects the most recent change.</p>

      <h2>6. Contact</h2>
      <p>Questions about cookies? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </article>
  );
}
