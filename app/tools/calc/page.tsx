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

export default function CalcHubPage() {
  return <CategoryHub categoryId="calc" faq={FAQ} />;
}
