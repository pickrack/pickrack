import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Calculators & Generators — QR, Password, Age, Currency, BMI",
  description:
    "Free everyday calculators and generators. QR code generator, strong password generator, age calculator, currency converter, tip calculator, BMI. Browser-side, no signup.",
  alternates: { canonical: `${SITE_URL}/tools/calc/` },
};

const FAQ = [
  {
    q: "Are these calculators accurate?",
    a: "Yes — math operations are exact. Currency conversion uses live rates from exchangerate-api.com (updated every hour) which is sourced from major banks. Tip and BMI calculators use standard formulas. Age calculator uses the date arithmetic for leap years.",
  },
  {
    q: "Why use a browser-based password generator instead of a built-in one?",
    a: "Most password managers (1Password, Bitwarden, Apple Passwords) have built-in generators. Pickrack's tool is for situations where you need a strong password but don't have a manager open — registration on a kiosk, helping a friend, or generating for a remote system. Always store the result in a manager afterward.",
  },
  {
    q: "Are the QR codes I generate trackable?",
    a: "No — QR codes are generated client-side using a JavaScript library. There's no shortener, no redirect, no analytics. The QR code is a direct URL/text encoding. Anyone scanning it goes directly to the content you encoded.",
  },
  {
    q: "Does the currency converter use real-time rates?",
    a: "Yes — rates are fetched from exchangerate-api.com (free tier) and cached for 1 hour. For trading purposes, use a dedicated finance app — these rates are interbank, not retail (your bank may charge a 2-4% spread on top).",
  },
  {
    q: "How do BMI calculators handle different units?",
    a: "Toggle between metric (kg, cm) and imperial (lb, ft+in). Formula is: BMI = weight_kg / (height_m)². Note: BMI is a rough screening — not a clinical diagnosis. Athletes with high muscle mass often have BMI in 'overweight' range despite being fit.",
  },
  {
    q: "Can I save my calculation history?",
    a: "v1 is stateless. localStorage history is on the roadmap. For now, paste results into a notes app or spreadsheet.",
  },
];

const intro = (
  <>
    <h2>Why every calculator here is browser-side</h2>
    <p>
      A password generator that sends your generated password to a server is a contradiction. A QR code generator that logs every URL you encode defeats the point. An age calculator that needs an internet connection is silly. Pickrack&apos;s six calc/generator tools all run <strong>entirely in your browser</strong> — they have to, because the threat model demands it. (The Currency Converter additionally calls exchangerate-api.com directly from your browser to fetch live mid-market rates; the rates are cached locally for an hour.)
    </p>
    <p>
      The most security-sensitive of these is the password generator. It uses <code>crypto.getRandomValues</code> from the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener noreferrer">Web Crypto API</a>, which is a cryptographically secure pseudo-random number generator built into every modern browser. It is <strong>not</strong> <code>Math.random</code> — that function is fast but predictable, and is not safe for security purposes. Many cheap online password generators get this wrong. You can verify Pickrack&apos;s implementation in the source: <a href="https://github.com/pickrack/pickrack/blob/main/app/tools/calc/password-generator/page.tsx" target="_blank" rel="noopener noreferrer">password-generator/page.tsx</a>.
    </p>
    <h2>The six calc tools and what they&apos;re good at</h2>
    <ul>
      <li><strong><a href="/tools/calc/password-generator/">Password Generator</a></strong> — generates strong random passwords using cryptographically secure browser entropy. Configurable length (8-128 characters), character classes (uppercase, lowercase, digits, symbols), and exclusion of ambiguous characters (0/O, 1/l/I) for typing on systems without copy-paste. Always store the result in a password manager (1Password, Bitwarden, Apple Passwords, KeePass).</li>
      <li><strong><a href="/tools/calc/qr-generator/">QR Code Generator</a></strong> — generates QR codes for URLs, plain text, Wi-Fi credentials (SSID + password + security type), vCards (digital business cards), and email mailto: links. Output as PNG (raster, good for printing on photos) or SVG (vector, infinite resolution, smaller file size). No URL shortener in the middle — the QR encodes whatever you put in it directly.</li>
      <li><strong><a href="/tools/calc/age-calculator/">Age Calculator</a></strong> — compute age in years/months/days/hours/minutes from any birth date, with leap-year handling. Also shows days until next birthday. Useful for visa applications, legal documents, retirement planning, and the small surprise of finding out you&apos;ve been alive 14,000+ days.</li>
      <li><strong><a href="/tools/calc/tip-calculator/">Tip Calculator</a></strong> — split a bill, add a tip, optionally round up the total. 7 currencies (USD, EUR, GBP, VND, JPY, AUD, CAD) with currency-appropriate decimal handling. Useful at the restaurant table when you don&apos;t want to fumble with a calculator app.</li>
      <li><strong><a href="/tools/calc/bmi-calculator/">BMI Calculator</a></strong> — Body Mass Index from height and weight with both metric (cm/kg) and imperial (ft+in/lb) units. Shows the healthy weight range for your specific height, plus a color-coded gauge. Privacy-first — height and weight never leave your browser.</li>
      <li><strong><a href="/tools/calc/currency-converter/">Currency Converter</a></strong> — convert between 28 major currencies with live mid-market rates from exchangerate-api.com, cached for an hour. Decimal handling per currency (JPY/VND/KRW/IDR show no decimals). Note: real bank transaction rates are typically 2-4% worse than mid-market.</li>
    </ul>
    <p>
      If you have a specific calculator you wish existed — anything that fits the model of &quot;browser-side, instant, no signup&quot; — open an issue at <a href="https://github.com/pickrack/pickrack/issues" target="_blank" rel="noopener noreferrer">github.com/pickrack/pickrack/issues</a>. Most calculators are under 200 lines of code; many will land within a week of being requested.
    </p>
  </>
);

export default function CalcHubPage() {
  return <CategoryHub categoryId="calc" intro={intro} faq={FAQ} />;
}
