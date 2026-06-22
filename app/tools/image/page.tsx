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
    a: "Yes — every Pickrack image tool works on Chrome, Safari, Firefox, and Edge on both desktop and mobile. Performance on very large images (over 20MB) may be slower on phones — desktops are faster for batch work.",
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
    a: "Practical limit is around 50MB per image, depending on your device's RAM. No daily quota, no signup. Upload as many as you need.",
  },
];

const intro = (
  <>
    <h2>Why Pickrack image tools run in your browser</h2>
    <p>
      Image processing online has historically meant uploading your photo to a third-party server, waiting, then downloading the result. That model dates from a time when JavaScript engines were too slow to handle decoding and re-encoding images at acceptable speed. Both of those constraints are gone in 2026. Modern browsers expose the <strong>Canvas API</strong>, <strong>Web Workers</strong>, and <strong>WebAssembly</strong>, which together let JavaScript do everything from JPEG re-encoding to neural-network background removal at near-native speed.
    </p>
    <p>
      Every one of Pickrack&apos;s eight image tools runs <em>entirely in your browser</em>. Open DevTools, switch to the Network tab, click any tool button — there are no upload requests. Your photo is loaded into browser memory, processed on your device, and downloaded back. There is no server-side path for these tools. We could not access your image even if we wanted to.
    </p>
    <h2>Which Pickrack image tool to use when</h2>
    <ul>
      <li><strong>Shrinking a photo before email or upload</strong> — use <a href="/tools/image/image-compressor/">Image Compressor</a>. Adjustable JPG quality, typical 1-3MB photo compresses to 200-400KB without visible loss.</li>
      <li><strong>Changing dimensions for social or web</strong> — use <a href="/tools/image/image-resizer/">Image Resizer</a>. Aspect ratio locked by default, common presets for Instagram, Twitter, LinkedIn, profile photos.</li>
      <li><strong>Converting between formats</strong> — use <a href="/tools/image/image-converter/">Image Converter</a>. Supports JPG↔PNG↔WebP↔AVIF in any direction. WebP is typically 30% smaller than JPG at equivalent quality; AVIF is even smaller but browser support varies.</li>
      <li><strong>iPhone HEIC photos that won&apos;t open on Windows</strong> — use <a href="/tools/image/heic-to-jpg/">HEIC to JPG</a>. Batch up to 50 photos at once. JPG output works everywhere.</li>
      <li><strong>Removing the background of a photo</strong> — use <a href="/tools/image/background-remover/">Background Remover</a>. Uses <a href="https://github.com/imgly/background-removal-js" target="_blank" rel="noopener noreferrer">@imgly/background-removal</a>, an ONNX runtime WebAssembly model. The first conversion downloads ~30MB of model weights into your browser cache; subsequent conversions are instant.</li>
      <li><strong>Cropping to a specific aspect ratio</strong> — use <a href="/tools/image/image-cropper/">Image Cropper</a>. Preset ratios (1:1 Instagram, 16:9 YouTube, 9:16 stories) or freeform drag handles. PNG or JPG export.</li>
      <li><strong>Enlarging a small image 2-4×</strong> — use <a href="/tools/image/image-upscaler/">Image Upscaler</a>. Stepped bicubic resampling. Honest about limits: not an AI super-resolution model (Real-ESRGAN-style), so won&apos;t hallucinate missing detail.</li>
      <li><strong>Extracting brand colors from an image</strong> — use <a href="/tools/image/color-palette/">Color Palette Extractor</a>. Median-cut quantization. Adjustable 3-12 swatches with hex/RGB/CSS-array output.</li>
    </ul>
    <h2>EXIF, privacy, and what compression actually does</h2>
    <p>
      Canvas-based image processing has a side-effect that&apos;s worth being explicit about: <strong>EXIF metadata is stripped</strong>. Camera model, GPS coordinates, capture timestamp, lens information — all gone in the output. This is almost always a privacy benefit. Photos shared online stop leaking your home address. Photos posted to dating apps stop revealing the time you took them. If you want to <em>preserve</em> EXIF (for example, when archiving photos by date), use a desktop tool like <code>exiftool</code> to copy metadata back from the original onto the compressed output.
    </p>
    <p>
      Image compression here uses the browser&apos;s standard JPEG/WebP/PNG encoders. They are <strong>not as aggressive</strong> as paid tools like TinyPNG (which runs custom MozJPEG with smarter quantization) — typical Pickrack compression is 10-20% larger than TinyPNG output for the same visual quality. The tradeoff: TinyPNG uploads your photo, Pickrack does not. For most people most of the time, that tradeoff is worth it.
    </p>
  </>
);

export default function ImageHubPage() {
  return <CategoryHub categoryId="image" intro={intro} faq={FAQ} />;
}
