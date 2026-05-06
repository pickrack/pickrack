import type { Metadata } from "next";
import { POLICY_LAST_UPDATED, CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `How ${SITE_NAME} collects, uses, and protects your information. Includes cookies, analytics, advertising, and your rights under GDPR and CCPA.`;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/privacy/` },
};

export default function PrivacyPage() {
  const jsonLd = buildWebPageJsonLd("privacy", "Privacy Policy", PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: {POLICY_LAST_UPDATED}</p>

      <p>
        This Privacy Policy describes how <strong>{SITE_NAME}</strong> ({SITE_URL}, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and shares information when you visit our website. We respect your privacy and aim to be clear about what data is involved.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Information you give us</h3>
      <p>If you contact us via email, we receive your email address and the contents of your message. We use this only to respond.</p>

      <h3>1.2 Information collected automatically</h3>
      <p>When you visit {SITE_NAME}, our servers and third-party services may automatically log:</p>
      <ul>
        <li>IP address (anonymized where possible)</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Pages viewed, time spent, and referring URL</li>
        <li>Device type (desktop, mobile, tablet)</li>
      </ul>

      <h2>2. Cookies and Similar Technologies</h2>
      <p>{SITE_NAME} uses cookies and similar tracking technologies to operate the site and serve advertising. The main categories:</p>
      <ul>
        <li><strong>Essential cookies</strong> — needed for the site to function (e.g., security, session).</li>
        <li><strong>Analytics cookies</strong> — Google Analytics 4, to understand how visitors use the site (page views, popular content).</li>
        <li><strong>Advertising cookies</strong> — Google AdSense, to show ads relevant to your interests and measure ad performance.</li>
      </ul>
      <p>For details, see our <a href="/cookies">Cookie Policy</a>.</p>

      <h2>3. Third-Party Services We Use</h2>

      <h3>3.1 Google Analytics</h3>
      <p>We use Google Analytics 4 (GA4) to measure traffic. GA4 may set cookies and collect data including IP address, browser, device, and pages viewed. Google&#39;s privacy practices: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.</p>

      <h3>3.2 Google AdSense</h3>
      <p>We display ads served by Google AdSense. Google and its partners use cookies (including the DoubleClick cookie) to serve ads based on your visits to this site and other sites on the internet. You can opt out of personalized ads at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">google.com/settings/ads</a>.</p>
      <p>Third-party vendors, including Google, use cookies to serve ads based on a user&#39;s prior visits to our website or other websites. Google&#39;s use of advertising cookies enables it and its partners to serve ads based on your visit to {SITE_NAME} and/or other sites on the Internet.</p>

      <h3>3.3 Cloudflare</h3>
      <p>We use Cloudflare for content delivery, DNS, and security. Cloudflare may collect IP and request metadata for those purposes. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">cloudflare.com/privacypolicy</a>.</p>

      <h3>3.4 Affiliate Links</h3>
      <p>Some external links on {SITE_NAME} are affiliate links. When you click and make a purchase, we may earn a commission at no extra cost to you. Click tracking is performed by the affiliate program (e.g., Amazon Associates, individual SaaS partner programs), not by {SITE_NAME}. See our <a href="/disclosure">Affiliate Disclosure</a>.</p>

      <h2>4. How We Use Your Information</h2>
      <ul>
        <li>Operate and improve the site</li>
        <li>Measure traffic and content performance</li>
        <li>Serve relevant advertising</li>
        <li>Respond to messages you send us</li>
        <li>Detect and prevent abuse, fraud, and security issues</li>
      </ul>

      <h2>5. How We Share Information</h2>
      <p>We do not sell your personal information. We share data only with:</p>
      <ul>
        <li>Service providers listed in section 3 (Google, Cloudflare) acting on our behalf</li>
        <li>Authorities when legally required</li>
      </ul>

      <h2>6. Your Rights</h2>

      <h3>6.1 GDPR (European users)</h3>
      <p>If you are in the European Economic Area or UK, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction or deletion</li>
        <li>Object to or restrict processing</li>
        <li>Port your data to another service</li>
        <li>Withdraw consent at any time</li>
        <li>Lodge a complaint with your local Data Protection Authority</li>
      </ul>

      <h3>6.2 CCPA (California users)</h3>
      <p>California residents have the right to know what personal information we collect, request deletion, and opt out of any sale of personal information. {SITE_NAME} does not sell personal information.</p>

      <h3>6.3 Exercising your rights</h3>
      <p>To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>

      <h2>7. Data Retention</h2>
      <p>Analytics data is retained per Google Analytics defaults (14 months for user-level data). Email correspondence is retained as long as the conversation is active. Server logs are rotated and deleted after 30 days.</p>

      <h2>8. Children&#39;s Privacy</h2>
      <p>{SITE_NAME} is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this policy. The &quot;Last updated&quot; date at the top reflects the most recent change. Material changes will be highlighted on the homepage for at least 14 days.</p>

      <h2>10. Contact</h2>
      <p>Questions about this policy? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </article>
  );
}
