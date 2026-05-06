import type { Metadata } from "next";
import CategoryHub from "@/components/CategoryHub";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Free Image Tools — Compress, Resize, Convert, Background Remove",
  description:
    "Free image tools that run in your browser. Compress JPG/PNG, resize, convert formats, remove background. No upload, no signup, no daily limit, no watermark.",
  alternates: { canonical: `${SITE_URL}/tools/image/` },
};

const FAQ = [
  {
    q: "Why are these image tools browser-side?",
    a: "Modern browsers can do image processing as fast as a desktop app using the Canvas API and WebAssembly. Keeping it in your browser means your photos never touch a server — no risk of leaks, no upload time, no rate limits.",
  },
  {
    q: "Do these tools work on my phone?",
    a: "Yes — every Pickrack image tool works on Chrome, Safari, Firefox, and Edge on both desktop and mobile. Performance on very large images (>20MB) may be slower on phones — desktops are faster for batch work.",
  },
  {
    q: "What image formats are supported?",
    a: "JPG/JPEG, PNG, WebP, AVIF, and GIF (input). Output formats depend on the tool — typically JPG, PNG, WebP. AVIF support varies by browser.",
  },
  {
    q: "Do these tools strip EXIF metadata (camera, GPS)?",
    a: "Most do, as a side-effect of canvas-based processing — this is actually a privacy benefit (your camera/GPS data is removed from the output). To preserve EXIF, use a desktop tool like ImageMagick or `exiftool`.",
  },
  {
    q: "How do these compare to TinyPNG, Squoosh, Photopea?",
    a: "TinyPNG and similar are server-side (you upload, they process). Squoosh and Photopea are also browser-side. Pickrack is closer to Squoosh in approach but with broader workflow tools (resize + convert + crop + watermark in one place) and explicit privacy-first messaging.",
  },
  {
    q: "Are there file size or count limits?",
    a: "Practical limit is ~50MB per image, depending on your device's RAM. No daily quota, no signup. Upload as many as you need.",
  },
];

export default function ImageHubPage() {
  return <CategoryHub categoryId="image" faq={FAQ} />;
}
