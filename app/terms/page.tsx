import type { Metadata } from "next";
import { POLICY_LAST_UPDATED, CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `Terms of Service governing your use of ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: "Terms of Service",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/terms/` },
};

export default function TermsPage() {
  const jsonLd = buildWebPageJsonLd("terms", "Terms of Service", PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: {POLICY_LAST_UPDATED}</p>

      <p>
        These Terms of Service govern your use of <strong>{SITE_NAME}</strong> ({SITE_URL}). By accessing the site, you agree to these terms. If you do not agree, do not use the site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>You may use {SITE_NAME} for lawful purposes only. You agree not to:</p>
      <ul>
        <li>Use the site in a way that violates any applicable law or regulation</li>
        <li>Attempt to gain unauthorized access to our servers, accounts, or systems</li>
        <li>Run automated bots, scrapers, or crawlers that overload the service</li>
        <li>Upload content that contains viruses, malware, or harmful code</li>
        <li>Reproduce, duplicate, or copy our content without permission for commercial use</li>
      </ul>

      <h2>2. Tools and Services</h2>
      <p>{SITE_NAME} offers free online tools (PDF processing, file conversion, etc.). When you use these tools:</p>
      <ul>
        <li>You retain ownership of files you upload</li>
        <li>You are responsible for ensuring you have the right to process those files</li>
        <li>Files are processed and deleted from our servers after use (browser-side tools never upload your files at all)</li>
        <li>We do not access, view, or store the contents of your files for any purpose other than executing your requested operation</li>
        <li>Tools are provided &quot;as is&quot; with no guarantee of accuracy or fitness for purpose</li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>All content on {SITE_NAME} — articles, reviews, code, logos, design — is owned by {SITE_NAME} or its licensors and protected by copyright. You may:</p>
      <ul>
        <li>Read, share, and link to articles for non-commercial use</li>
        <li>Quote brief excerpts with attribution and a link back</li>
      </ul>
      <p>You may NOT republish full articles, train AI models on our content, or use our content for commercial purposes without written permission.</p>

      <h2>4. User Content</h2>
      <p>{SITE_NAME} does not currently accept user-generated content (no comments, no submissions). If we add such features in the future, separate terms will apply.</p>

      <h2>5. Affiliate Links and Advertising</h2>
      <p>Some external links are affiliate links. When you click and complete a purchase, we may receive a commission at no additional cost to you. We display advertising via Google AdSense and similar networks. See our <a href="/disclosure">Affiliate Disclosure</a> for details.</p>

      <h2>6. Third-Party Links</h2>
      <p>{SITE_NAME} contains links to third-party websites. We are not responsible for the content, privacy practices, or terms of those sites. Use them at your own risk.</p>

      <h2>7. Disclaimers</h2>
      <p>{SITE_NAME} is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. We do not guarantee:</p>
      <ul>
        <li>Uninterrupted or error-free operation</li>
        <li>The accuracy, completeness, or usefulness of any content</li>
        <li>That any tool will produce a specific result for your particular use case</li>
        <li>That the site is free from viruses or other harmful components</li>
      </ul>
      <p>Reviews and recommendations reflect personal opinion at the time of writing. Tools and services change; verify current features before making decisions.</p>

      <h2>8. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, {SITE_NAME}, its operators, and contributors are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the site, including loss of data, lost profits, or business interruption — even if we have been advised of the possibility of such damages.</p>

      <h2>9. Indemnification</h2>
      <p>You agree to indemnify and hold harmless {SITE_NAME} from any claims, damages, or expenses arising from your violation of these Terms or your misuse of the site.</p>

      <h2>10. Termination</h2>
      <p>We may suspend or terminate your access to {SITE_NAME} at any time, without notice, for conduct that we determine violates these Terms or is harmful to the site or other users.</p>

      <h2>11. Governing Law</h2>
      <p>These Terms are governed by applicable consumer protection laws of your country of residence. Any dispute shall first be addressed via good-faith communication at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

      <h2>12. Changes to These Terms</h2>
      <p>We may update these Terms from time to time. The &quot;Last updated&quot; date reflects the most recent change. Continued use of the site after changes means you accept the updated Terms.</p>

      <h2>13. Contact</h2>
      <p>Questions? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </article>
  );
}
