import type { Metadata } from "next";
import { POLICY_LAST_UPDATED, CONTACT_EMAIL, buildWebPageJsonLd } from "@/lib/policy-content";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

const PAGE_DESCRIPTION = `How ${SITE_NAME} earns revenue, our affiliate relationships, and our commitment to honest reviews.`;

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/disclosure/` },
};

export default function DisclosurePage() {
  const jsonLd = buildWebPageJsonLd("disclosure", "Affiliate & Advertising Disclosure", PAGE_DESCRIPTION);
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>Affiliate &amp; Advertising Disclosure</h1>
      <p className="text-sm text-gray-500">Last updated: {POLICY_LAST_UPDATED}</p>

      <p>
        <strong>{SITE_NAME}</strong> is a one-person operation. This page explains how we make money and the safeguards we put in place to keep our reviews honest.
      </p>

      <h2>1. We earn money from</h2>

      <h3>1.1 Display advertising</h3>
      <p>We display ads served by Google AdSense and similar networks. We have no control over which specific ads appear — that is determined by ad-serving algorithms based on context and viewer interests. We are paid based on impressions and clicks. This revenue does NOT influence which products or tools we review.</p>

      <h3>1.2 Affiliate links</h3>
      <p>Some external links on {SITE_NAME} are affiliate links. When you click such a link and make a purchase, the merchant pays us a commission at <strong>no additional cost to you</strong>. We participate in affiliate programs including (non-exhaustive list):</p>
      <ul>
        <li>Software / SaaS partner programs (e.g., individual tools we review)</li>
        <li>Marketplaces and digital goods (Gumroad, App Sumo, etc.)</li>
        <li>Hosting and infrastructure (e.g., domain registrars, cloud platforms)</li>
      </ul>
      <p>Affiliate links are marked <code>rel=&quot;sponsored&quot;</code> in HTML and we identify articles containing them at the top of the post.</p>

      <h2>2. How we choose what to review</h2>
      <p>Our editorial process:</p>
      <ol>
        <li>We identify a category or problem we have personally faced (or our readers have asked about)</li>
        <li>We research available tools — paid and free, well-known and obscure</li>
        <li>We test each candidate hands-on, using real workflows</li>
        <li>We write up our findings, ranking by usefulness — not by affiliate payout</li>
      </ol>
      <p>Tools we recommend most strongly are often <em>free or open-source</em> with no affiliate program at all. If a paid tool earns a top spot, it is because it genuinely beats the alternatives.</p>

      <h2>3. What we will never do</h2>
      <ul>
        <li>Accept payment to write a positive review</li>
        <li>Hide or remove negative findings to please an advertiser</li>
        <li>Promote a tool we have not personally used</li>
        <li>Publish &quot;sponsored content&quot; disguised as editorial</li>
        <li>Sell your data to advertisers or anyone else</li>
      </ul>

      <h2>4. FTC compliance (US)</h2>
      <p>We comply with the U.S. Federal Trade Commission&#39;s <a href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers" target="_blank" rel="noopener noreferrer">Endorsement Guides</a>. Affiliate relationships are disclosed at the top of any article that contains affiliate links and at the link level via <code>rel=&quot;sponsored&quot;</code>.</p>

      <h2>5. EU / UK compliance</h2>
      <p>We comply with EU and UK consumer protection rules including the Unfair Commercial Practices Directive and the UK Digital Markets, Competition and Consumers Act. Our material connections to merchants are disclosed clearly and conspicuously.</p>

      <h2>6. Your trust is our most valuable asset</h2>
      <p>We are a small, independent publisher. We do not have a sales team, brand partnerships team, or investors pressuring us to push specific products. Our reputation is the entire business — that is why we take honest reviews seriously.</p>
      <p>If you ever feel a review is not honest, please email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will investigate and, if warranted, correct the post publicly.</p>

      <h2>7. Contact</h2>
      <p>Questions about our advertising or affiliate practices? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
    </article>
  );
}
