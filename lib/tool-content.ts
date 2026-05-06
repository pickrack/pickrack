import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export type ToolFAQ = { q: string; a: string };
export type ToolStep = { title: string; desc: string };
export type ToolFeature = { title: string; desc: string };

export type ToolContent = {
  slug: string;
  h1Subtitle: string;
  intro: string[];
  features: ToolFeature[];
  howTo: ToolStep[];
  useCases: string[];
  faq: ToolFAQ[];
  relatedTools: string[];
};

export const toolContentMap: Record<string, ToolContent> = {
  "merge-pdf": {
    slug: "merge-pdf",
    h1Subtitle:
      "Combine multiple PDF files into one document. Drag to reorder, browser-side processing, no upload, no signup, no watermark.",
    intro: [
      "**Merge PDF online** is one of the most-requested PDF operations. Whether you're combining bank statements, assembling chapters of a manuscript, or stitching together signed contracts, you need a tool that just works without watermarks, signups, or a daily limit.",
      "Pick Rack's **Merge PDF** tool runs entirely in your browser using the open-source [pdf-lib](https://github.com/Hopding/pdf-lib) library. Your files never leave your device — they are processed locally in your browser memory and discarded when you close the tab. No upload, no server-side storage, no privacy concerns for sensitive documents.",
      "It's free with no daily limit, no file count limit (your browser memory is the only constraint), and no watermark on the output. Files up to 200MB each work smoothly on modern hardware.",
    ],
    features: [
      { title: "100% browser-side privacy", desc: "Files never upload to a server. All processing happens in your browser, ideal for confidential documents." },
      { title: "Drag-to-reorder UI", desc: "Once files are added, use up/down arrows to set the merge order. Preview file names and sizes before you commit." },
      { title: "No file count limit", desc: "Merge 2 PDFs, 20 PDFs, or 200 — only your browser memory limits the operation." },
      { title: "Encrypted PDFs supported", desc: "If you have view permission, encrypted PDFs are merged transparently. Output is decrypted." },
      { title: "Free forever, no watermark", desc: "No premium tier, no daily quota, no &quot;upgrade to remove watermark&quot; nag screen. Free means free." },
    ],
    howTo: [
      { title: "Step 1: Add your PDFs", desc: "Drop two or more PDF files into the upload area, or click to browse. They appear in an ordered list." },
      { title: "Step 2: Set the merge order", desc: "Use the up/down arrows next to each file to arrange them. Remove files with the X button if needed." },
      { title: "Step 3: Click Merge PDFs", desc: "Processing typically completes in 1-5 seconds. A green Download button appears." },
      { title: "Step 4: Download merged.pdf", desc: "Save to your device. The merged file contains all pages of all input PDFs in your chosen order." },
    ],
    useCases: [
      "**Combine bank statements** from multiple months into a single archive",
      "**Assemble a portfolio** of work samples (case studies, designs, references)",
      "**Stitch contract sections** that arrived in separate emails into one signed document",
      "**Merge book chapters** drafted as separate files before final review",
      "**Compile receipts** for an expense report or tax submission",
      "**Combine scanned pages** from a multi-pass scanner into one document",
    ],
    faq: [
      { q: "Is this Merge PDF tool really free?", a: "Yes, completely free with no daily limit, no signup, no watermark. The site is supported by display advertising and affiliate commissions on unrelated products. Tool functionality is fully unrestricted." },
      { q: "Are my PDF files uploaded to your server?", a: "No. All processing happens in your browser using the pdf-lib JavaScript library. Files load into your browser memory, get merged, and are discarded when you close the tab. Nothing is sent to our servers." },
      { q: "What's the maximum file size I can merge?", a: "Each input file can be up to 200MB. Total combined size is limited only by your browser memory (most modern browsers handle 1-2GB before slowing down). For very large archives, merge in batches." },
      { q: "Do encrypted (password-protected) PDFs work?", a: "Yes, if you have view permission. Encrypted PDFs are merged into the output as decrypted content. If you need to keep encryption, use the Protect PDF tool on the merged result." },
      { q: "Can I merge PDFs of different page sizes?", a: "Yes. Each input PDF keeps its original page sizes in the merged output. The result will have mixed page sizes if your inputs do." },
      { q: "Does this work on mobile?", a: "Yes, on any modern mobile browser (Chrome, Safari, Firefox, Edge). For very large merges (>100MB total), mobile performance may be slower than desktop." },
      { q: "Will the merged PDF have any quality loss?", a: "No. pdf-lib copies pages without re-encoding, so text stays vector-sharp and images remain at original resolution. Output file size is approximately the sum of inputs." },
      { q: "Can I keep my files private?", a: "This tool already keeps files private — they never leave your device. For additional security, run the tool in an offline environment after the page loads." },
    ],
    relatedTools: ["split-pdf", "rotate-pdf", "compress-pdf"],
  },

  "split-pdf": {
    slug: "split-pdf",
    h1Subtitle:
      "Extract specific pages or page ranges from a PDF. Browser-side processing, no upload, no watermark.",
    intro: [
      "**Split PDF** is essential when you need only part of a long document — sending chapter 3 of a 200-page report to a colleague, extracting your name from a multi-person registration list, or breaking a book into smaller files for easier reading on a tablet.",
      "Pick Rack's **Split PDF** tool extracts pages by range. Specify what you want with simple notation like `1-3, 5, 7-10` and the tool produces a single new PDF containing exactly those pages, in the order you specified. Processing happens entirely in your browser using [pdf-lib](https://github.com/Hopding/pdf-lib) — your file never uploads.",
      "Free, no watermark, no signup, no daily limit. Works on PDFs up to 200MB.",
    ],
    features: [
      { title: "Flexible page range syntax", desc: "Combine ranges and single pages: 1-3, 5, 7-10 extracts pages 1, 2, 3, 5, 7, 8, 9, 10 in that order." },
      { title: "Browser-side privacy", desc: "Your PDF never uploads. All page extraction happens in your browser memory." },
      { title: "Page count preview", desc: "After upload, the tool shows the total page count so you know your valid range." },
      { title: "Vector-sharp output", desc: "Pages are copied without re-encoding — text and images stay at original quality." },
      { title: "No watermark, free forever", desc: "Output PDF has zero added marks. No premium tier, no daily limit." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drag or click to add a single PDF (up to 200MB). The tool reports the total page count." },
      { title: "Step 2: Enter page range", desc: "Type pages in the format 1-3, 5, 7-10 (combine ranges and single pages with commas)." },
      { title: "Step 3: Click Extract pages", desc: "Processing takes 1-3 seconds." },
      { title: "Step 4: Download extracted.pdf", desc: "The output contains only your selected pages, preserving original quality." },
    ],
    useCases: [
      "**Send only the relevant chapter** of a long report to a colleague",
      "**Extract your form** from a multi-person scanned PDF",
      "**Break a textbook into chapters** for easier reading on tablet or phone",
      "**Pull invoices** from a year-end accounting PDF for a tax return",
      "**Isolate a single contract** from a packet of multiple agreements",
      "**Save bandwidth** by sending only specific pages instead of an entire 100MB file",
    ],
    faq: [
      { q: "What page range format does this tool accept?", a: "Use comma-separated values. Single pages: 1, 5, 9. Ranges: 1-3 or 7-10. Combine: 1-3, 5, 7-10. The tool extracts pages in the order you specify." },
      { q: "Can I split a PDF into multiple files at once?", a: "This version outputs a single file containing your selected pages. To create multiple separate output files, run the tool once per range. A multi-output ZIP version may be added in the future." },
      { q: "What happens if I enter an invalid range?", a: "The tool validates input before extracting. Invalid tokens (e.g., letters, ranges where start > end, pages beyond the total count) show a clear error message and don't process anything." },
      { q: "Does the order of pages matter in my range?", a: "Yes. Pages appear in the output in the same order you list them. Specifying 5, 1, 3 produces a PDF with pages 5, then 1, then 3." },
      { q: "Will the extracted PDF be smaller than the original?", a: "Approximately, yes — output size is roughly proportional to the fraction of pages extracted. For lossless splitting, no compression is applied. For smaller files, run the result through Compress PDF afterward." },
      { q: "Can I extract pages from an encrypted PDF?", a: "Yes, if you have view permission. The extracted output is decrypted. Re-protect with the Protect PDF tool if needed." },
      { q: "Is there a page count limit?", a: "No. You can extract any number of pages from any size PDF (up to the 200MB input limit). Output PDFs of 1 to thousands of pages all work." },
    ],
    relatedTools: ["merge-pdf", "rotate-pdf", "compress-pdf"],
  },

  "rotate-pdf": {
    slug: "rotate-pdf",
    h1Subtitle:
      "Rotate every page of a PDF by 90, 180, or 270 degrees. Fix sideways scans and upside-down pages instantly.",
    intro: [
      "**Rotate PDF** is the fix for one of the most common scanning frustrations: pages that come out sideways or upside-down. Rather than re-scan the document, you can rotate digitally in seconds — and the rotation is permanent in the saved file (not just a view setting).",
      "Pick Rack's **Rotate PDF** tool rotates all pages of a PDF by a chosen angle (90, 180, or 270 degrees clockwise) using the [pdf-lib](https://github.com/Hopding/pdf-lib) library directly in your browser. No upload, no quality loss, no watermark, no signup.",
      "Useful for: scans that came out wrong-way-up, mobile camera captures of receipts and contracts, multi-page documents where the orientation is inconsistent.",
    ],
    features: [
      { title: "All four orientations", desc: "Rotate by 90, 180, or 270 degrees. To restore the original, rotate by the complementary amount (e.g., 270 + 90 = 360)." },
      { title: "Browser-side, no upload", desc: "Your PDF stays on your device. Privacy guaranteed for confidential scans." },
      { title: "Permanent rotation", desc: "Rotation is saved into the file metadata. Recipients see correct orientation regardless of viewer." },
      { title: "No quality loss", desc: "Only metadata is changed — text remains vector-sharp, images keep original resolution." },
      { title: "All pages or none", desc: "Rotates every page uniformly. For per-page rotation, run the tool multiple times with extracted ranges." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drag or click to add a single PDF up to 200MB." },
      { title: "Step 2: Choose rotation angle", desc: "90° (clockwise quarter turn), 180° (upside down), or 270° (counter-clockwise)." },
      { title: "Step 3: Click Rotate", desc: "Processing finishes in under a second for most files." },
      { title: "Step 4: Download rotated.pdf", desc: "Save the rotated file. All pages are now correctly oriented." },
    ],
    useCases: [
      "**Fix sideways scans** from a flatbed scanner that processed pages in the wrong orientation",
      "**Correct mobile photos** of contracts or receipts converted to PDF",
      "**Rotate engineering drawings** that need landscape orientation for printing",
      "**Fix mixed-orientation documents** where some pages came out wrong",
      "**Prepare PDFs for tablet reading** where you prefer landscape over portrait",
    ],
    faq: [
      { q: "Does the rotation persist when I open the PDF in another viewer?", a: "Yes. The rotation is written into the page metadata, not just applied as a view setting. Adobe Reader, Foxit, Preview, and all browser PDF viewers will show the rotated orientation." },
      { q: "Can I rotate only specific pages, not all of them?", a: "Not directly. To rotate a single page, use Split PDF to extract it, rotate the extracted file, then merge back. A per-page rotation feature may be added later." },
      { q: "Will the file size change after rotation?", a: "No, rotation only updates page metadata. File size, image quality, and text fidelity are identical to the input." },
      { q: "What if I need to rotate 45 degrees or another non-standard angle?", a: "The PDF format only supports rotations in 90-degree increments. For other angles, you would need to re-render pages as images and rotate, which loses quality. Most viewers support 90/180/270 only." },
      { q: "Can I rotate an encrypted PDF?", a: "Yes, if you have view permission. The output preserves the encryption-removed content. Re-encrypt with Protect PDF if needed." },
      { q: "Is rotating reversible?", a: "Yes. To restore a 90° rotation, rotate by 270° (or rotate 90° three more times). 180° is undone by another 180° rotation." },
    ],
    relatedTools: ["merge-pdf", "split-pdf", "watermark-pdf"],
  },

  "watermark-pdf": {
    slug: "watermark-pdf",
    h1Subtitle:
      "Add a custom text watermark to every page of a PDF — diagonal, with adjustable opacity, font size, and position.",
    intro: [
      "**Add a watermark to PDF** is the standard way to mark documents as DRAFT, CONFIDENTIAL, or for-distribution before sharing. Watermarks discourage unauthorized copying, label document status clearly, and add accountability to information that might leak.",
      "Pick Rack's **Watermark PDF** tool adds custom text to every page of a PDF — your choice of text, font size, opacity, and position (diagonal across the page, centered, or at the bottom). All processing is browser-side via [pdf-lib](https://github.com/Hopding/pdf-lib): your file never uploads.",
      "Free, no signup, no watermark from us (just the one you choose), works on files up to 200MB.",
    ],
    features: [
      { title: "Custom text up to 50 characters", desc: "Type DRAFT, CONFIDENTIAL, your name, or any short phrase." },
      { title: "Adjustable opacity (10-100%)", desc: "Subtle background watermarks at 20-30% or strong overlays at 80-100% — your choice." },
      { title: "Font size 20-120 pt", desc: "Match the watermark to your page size and visual prominence preference." },
      { title: "Three position presets", desc: "Diagonal (45° across the page), centered, or near the bottom — covers most use cases." },
      { title: "Browser-side, never uploads", desc: "Confidential documents stay on your device — perfect for legal, HR, or financial files." },
    ],
    howTo: [
      { title: "Step 1: Upload PDF", desc: "Drop a single PDF (up to 200MB) into the tool." },
      { title: "Step 2: Customize the watermark", desc: "Enter the watermark text, then adjust opacity, font size, and position to taste." },
      { title: "Step 3: Click Apply watermark", desc: "Each page is stamped with your text. Processing is instant for most files." },
      { title: "Step 4: Download watermarked.pdf", desc: "Save the marked file. Original is untouched." },
    ],
    useCases: [
      "**Mark draft documents** with DRAFT to prevent confusion with finalized versions",
      "**Stamp confidential business plans** with CONFIDENTIAL before sharing externally",
      "**Add your name** to portfolio PDFs you share with potential clients (light branding)",
      "**Mark contract drafts** with DO NOT SIGN before final review is complete",
      "**Identify training material** copies with the trainee's name to track distribution",
      "**Add timestamps** like &quot;REVIEW — 2026 Q2&quot; for documents that go through cycles",
    ],
    faq: [
      { q: "Can I use my company logo as a watermark?", a: "This tool supports text watermarks only. Image watermarks are planned for a future update. For now, a text watermark with your company name in a distinctive font works similarly." },
      { q: "Can the watermark be removed by a recipient?", a: "Watermarks added with this tool are baked into the page content, not a separate layer. They cannot be removed in Adobe Reader or most PDF tools without specialized software. However, technically motivated users can extract and re-render PDF content — for high-security needs, combine watermarking with password protection." },
      { q: "What color is the watermark?", a: "Currently, all watermarks are dark red. A future update may add color picker options. Dark red provides good visibility on most light-colored documents while staying readable when overlaid on text." },
      { q: "Can I add different watermarks to different pages?", a: "Not in this tool — every page receives the same watermark. To watermark only certain pages, split the PDF first, watermark the parts that need it, and merge back together." },
      { q: "Why is my watermark text cut off on the page?", a: "If your text is too long for the chosen font size, parts may extend beyond the page. Either shorten the text (max 50 characters) or reduce the font size." },
      { q: "Does adding a watermark increase the file size much?", a: "Minimally — typically 1-5KB regardless of the number of pages. Watermarks are applied as text drawing instructions, not as embedded images." },
    ],
    relatedTools: ["protect-pdf", "merge-pdf", "rotate-pdf"],
  },

  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    h1Subtitle:
      "Convert one or more JPG/PNG images into a single PDF document. Choose A4, US Letter, or fit-to-image page size.",
    intro: [
      "**Convert JPG to PDF** is essential for creating polished documents from images: receipts for expense reports, scanned ID cards for online forms, photo albums you want to share as a single file, or assembled reference sheets.",
      "Pick Rack's **JPG to PDF** tool combines multiple images into one PDF in any order you choose. Page sizes: A4 (210×297mm), US Letter (8.5×11 inches), or fit-to-image (page exactly matches each image). Browser-side processing via [pdf-lib](https://github.com/Hopding/pdf-lib).",
      "Supports JPG, JPEG, and PNG inputs. Each image becomes one PDF page, centered on the chosen page size. Free, no signup, no watermark.",
    ],
    features: [
      { title: "Multiple images, single PDF", desc: "Combine any number of JPG and PNG images into one document. Drag to reorder before conversion." },
      { title: "Three page-size options", desc: "A4 (international), US Letter (North America), or fit-to-image (page = image size, useful for photo albums)." },
      { title: "Auto-centered with margins", desc: "On A4/Letter, images are centered with 20pt margins. Aspect ratio is preserved (no distortion)." },
      { title: "JPG and PNG both supported", desc: "Mix formats in a single conversion. PNGs with transparency are flattened to white background in the PDF." },
      { title: "Browser-side privacy", desc: "Images never upload — important for scans of IDs, receipts, or personal photos." },
    ],
    howTo: [
      { title: "Step 1: Add images", desc: "Drop or click to add JPG and/or PNG files (up to 50MB each)." },
      { title: "Step 2: Choose page size", desc: "A4 for international standard, Letter for North America, or fit-to-image for exact size." },
      { title: "Step 3: Reorder if needed", desc: "Use up/down arrows to set the page order." },
      { title: "Step 4: Click Convert to PDF", desc: "All selected images are combined into a single downloadable PDF." },
    ],
    useCases: [
      "**Combine receipt photos** for an expense report (one PDF instead of 12 separate JPGs)",
      "**Scan IDs to PDF** when an online form requires a single PDF upload",
      "**Create a photo album PDF** to share with family — a single file is easier than dozens of images",
      "**Assemble reference sheets** from screenshots or photographs into one document",
      "**Convert phone-scanned documents** (multiple JPG photos) to a proper multi-page PDF",
      "**Build product catalogs** from product photos plus brief descriptions",
    ],
    faq: [
      { q: "What image formats does this tool support?", a: "JPG, JPEG, and PNG. WebP and GIF are not supported in the current version. Most image editors can convert WebP/GIF to JPG before using this tool." },
      { q: "Will my images lose quality?", a: "JPG images are embedded at original quality (no re-encoding). PNG images are converted to JPG-compatible representation in the PDF, which may slightly affect transparency areas (rendered as white) but otherwise preserves quality." },
      { q: "Can I make a multi-image-per-page PDF (like a contact sheet)?", a: "Not directly — this tool puts one image per page. For contact-sheet style layouts, use a dedicated photo software (Photoshop, GIMP) or LibreOffice Impress." },
      { q: "Why does my A4 PDF have wide margins around small images?", a: "A4 mode centers each image on a fixed-size page. If your image is smaller than A4, the empty space is white margin. Use &quot;Fit image&quot; mode if you want the page to match the image's exact dimensions." },
      { q: "Can I add text or captions to the PDF?", a: "Not in this tool — output is image-only. To add text, open the resulting PDF in a PDF editor (LibreOffice Draw, Foxit free editor) and add text boxes." },
      { q: "What if my image is rotated wrong?", a: "EXIF rotation is auto-applied by the browser when reading the file. If your image still appears wrong, rotate it in any image viewer (or run the resulting PDF through Rotate PDF) before conversion." },
      { q: "How big can the input files be?", a: "Up to 50MB per image. For very high-resolution images, consider downscaling first — most use cases don't need 50MB-per-page." },
    ],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "compress-pdf"],
  },

  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    h1Subtitle:
      "Render each page of a PDF as a JPG image. Single-page → JPG, multi-page → ZIP archive. Three quality presets.",
    intro: [
      "**Convert PDF to JPG** turns every page of a PDF into an image — useful for sharing PDF content on platforms that don't support PDF (Instagram, Twitter, certain CMSs), creating thumbnails for content preview, or extracting visual reference material from a document.",
      "Pick Rack's **PDF to JPG** tool runs entirely in your browser using [Mozilla's PDF.js](https://github.com/mozilla/pdf.js) for rendering and [JSZip](https://github.com/Stuk/jszip) for packaging multi-page output. Your file never uploads to a server.",
      "Single-page PDFs download as a single .jpg. Multi-page PDFs are bundled into a ZIP archive named YourFile-pages.zip with one image per page.",
    ],
    features: [
      { title: "Single page or ZIP archive", desc: "1-page PDF outputs as 1 JPG. Multi-page PDFs are zipped automatically with descriptive filenames." },
      { title: "Three quality presets", desc: "Low (1× scale, 70% quality), Medium (1.5×, 85%), High (2.5×, 95%). Match output to your use case." },
      { title: "Browser-side rendering", desc: "PDF.js renders pages locally. Your PDF never uploads — privacy for confidential documents." },
      { title: "Progress indicator", desc: "For multi-page PDFs, the tool shows current page being rendered (e.g., &quot;Rendering page 8/24&quot;)." },
      { title: "Sequential filenames", desc: "Output images are named {pdf-name}-page-001.jpg, -page-002.jpg, etc. Numeric padding ensures correct alphabetical sorting." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drop or click to add a single PDF (up to 100MB)." },
      { title: "Step 2: Choose image quality", desc: "Medium is recommended for most uses. Use High for printing, Low for web thumbnails." },
      { title: "Step 3: Click Convert to JPG", desc: "Pages render one by one. Multi-page PDFs may take 10-30 seconds depending on size and quality." },
      { title: "Step 4: Download JPG or ZIP", desc: "Single JPG (1-page PDF) or ZIP archive of all pages (multi-page)." },
    ],
    useCases: [
      "**Share PDF content on Instagram** as image carousels (one slide per page)",
      "**Create thumbnails** of PDFs for blog post galleries or product catalog previews",
      "**Extract diagrams from technical PDFs** to embed in slides or websites",
      "**Archive a presentation** as images for systems that don't accept PDF",
      "**Send a quick preview** of a long document via messaging apps that prefer images",
      "**Build OCR training data** from PDF pages using image-based OCR systems",
    ],
    faq: [
      { q: "What's the difference between the three quality levels?", a: "Quality combines render scale (canvas resolution) and JPG compression. Low: 1× scale, 70% quality (smaller files, faster). Medium: 1.5×, 85% (balanced). High: 2.5×, 95% (sharper text, larger files, slower)." },
      { q: "Can I get PNG output instead of JPG?", a: "Currently JPG only. PNG support may be added — JPG is the default because output sizes are dramatically smaller for typical PDF content (text on white background)." },
      { q: "Why does High quality take so long?", a: "Higher scale produces larger canvases. A 24-page PDF at 2.5× scale renders 24 large bitmaps and JPG-encodes each. Total time may be 30-60s for large PDFs. Lower quality is significantly faster." },
      { q: "Will my PDF upload to your servers?", a: "No. PDF.js runs in your browser; rendering happens locally. Your file is never sent over the network. Even the worker JavaScript is loaded once from a CDN — after that, the page works offline." },
      { q: "Does this work on mobile?", a: "Yes, on modern mobile browsers. For very large PDFs (50+ pages at High quality), mobile may run out of memory — try Medium or Low quality instead." },
      { q: "Can I convert specific pages only?", a: "Currently the tool converts all pages. To convert only specific pages, first use Split PDF to extract the pages you want, then convert the smaller PDF here." },
      { q: "What if my PDF is encrypted?", a: "PDF.js can read most encrypted PDFs if you have view permission. If the PDF is locked with a user password (read-protected), use Unlock PDF first." },
    ],
    relatedTools: ["jpg-to-pdf", "split-pdf", "compress-pdf"],
  },

  "compress-pdf": {
    slug: "compress-pdf",
    h1Subtitle:
      "Reduce PDF file size with low/medium/high compression. Server-side Ghostscript engine. Free, no signup, no watermark.",
    intro: [
      "**Compress PDF** is needed when a file is too large to email, too slow to upload, or simply taking up unnecessary space. Most PDFs — especially those with embedded images — can be compressed by 30-80% with no visible loss for screen reading.",
      "Pick Rack's **Compress PDF** tool uses [Ghostscript](https://www.ghostscript.com), the industry-standard PostScript and PDF processor, to re-encode embedded images at lower resolution and strip redundant metadata. Three preset levels balance file size against visual quality.",
      "Free, no daily limit, no signup, no watermark. Files up to 100MB.",
    ],
    features: [
      { title: "Three compression levels", desc: "Low (300 dpi, modest reduction, print-ready), Medium (150 dpi, balanced for screen), High (72 dpi, max reduction)." },
      { title: "Industry-standard engine", desc: "Ghostscript powers PDF compression in major commercial tools. Output is broadly compatible." },
      { title: "Real reduction stats", desc: "After compression, the tool shows original vs compressed size and the percentage saved." },
      { title: "Server-side processing", desc: "File uploads over HTTPS, gets compressed, then deleted immediately. Nothing logged or stored." },
      { title: "No watermark, no signup", desc: "Output is your compressed PDF, nothing added. No daily quota, no premium tier." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drop or click to add a single PDF (up to 100MB). Encrypted PDFs need to be unlocked first." },
      { title: "Step 2: Choose compression level", desc: "Medium for general use, Low for print quality, High for maximum size reduction." },
      { title: "Step 3: Click Compress", desc: "Server processes typically in 5-30 seconds depending on file size." },
      { title: "Step 4: Review and download", desc: "See before/after sizes and percentage saved, then download compressed.pdf." },
    ],
    useCases: [
      "**Email attachments** under 25MB Gmail limit (or 10MB for stricter providers)",
      "**Speed up uploads** to file-sharing services or cloud storage",
      "**Reduce mobile data usage** when sharing PDFs over cellular connections",
      "**Save server storage** for archives of historical PDFs",
      "**Faster website downloads** for hosted PDF documents (e-books, reports, brochures)",
      "**Meet upload size limits** on government forms, job applications, or LMS submissions",
    ],
    faq: [
      { q: "How much will my PDF shrink?", a: "Image-heavy PDFs typically reduce 50-90%. Text-only PDFs reduce 5-30%. Already-optimized PDFs may not reduce much. Run the tool to see actual results — there's no guess-and-check needed." },
      { q: "Will text become blurry after compression?", a: "Text in PDFs is stored as vector instructions, not as images, so compression doesn't affect text sharpness at any level. Only embedded images are re-encoded." },
      { q: "What's the difference between Low, Medium, High?", a: "Internally these map to Ghostscript PDFSETTINGS=/printer (300 dpi, suitable for printing), /ebook (150 dpi, balanced for screen), and /screen (72 dpi, smallest files, web-only quality)." },
      { q: "Can I use this for confidential documents?", a: "The file is uploaded over HTTPS, processed, and deleted from server temp storage immediately. Nothing is logged or stored. Still, for highly sensitive content, consider self-hosting Ghostscript locally (apt install ghostscript on Linux) for full control." },
      { q: "Why are encrypted PDFs not supported?", a: "Ghostscript needs the PDF in a readable form to re-encode it. Use Unlock PDF first to remove password protection, then compress. You can re-encrypt afterward with Protect PDF." },
      { q: "Does compression damage scanned documents?", a: "High compression at 72 dpi may make scanned text harder to read, especially for small fonts. For scanned documents, prefer Medium (150 dpi) or run OCR first to convert images to text, which compresses much better." },
      { q: "Can I batch-compress multiple PDFs?", a: "Currently one file at a time. For batch compression, run Ghostscript locally with a loop, or use this tool repeatedly." },
    ],
    relatedTools: ["pdf-to-jpg", "merge-pdf", "split-pdf"],
  },

  "pdf-to-markdown": {
    slug: "pdf-to-markdown",
    h1Subtitle:
      "Extract PDF text with layout preserved. Paste into ChatGPT, Claude, Notion, or any AI tool for sharper responses.",
    intro: [
      "**Extract PDF to Markdown** has become a standard workflow for anyone working with AI. When you feed a PDF directly to ChatGPT or Claude through a &quot;chat with PDF&quot; feature, internal extraction often loses document structure — headings flatten into paragraphs, tables turn into mush, and the model wastes attention disambiguating layout.",
      "**Markdown changes that.** Large language models are trained on text, including billions of pages of Markdown. They process structured headings, lists, and indentation natively. Extracting PDF to Markdown yourself, then pasting the cleaned text into your preferred AI, almost always produces sharper, more accurate responses.",
      "Pick Rack's **PDF to Markdown** tool uses [pdftotext](https://en.wikipedia.org/wiki/Pdftotext) (Poppler) with the `-layout` flag to preserve columns and indentation. Output is plain text, valid as Markdown, ready for LLM input.",
    ],
    features: [
      { title: "Layout preserved", desc: "Multi-column layouts, indented lists, and table-like structures retain their relative positions." },
      { title: "AI-ready output", desc: "Plain text that ChatGPT, Claude, Gemini all process natively. Better than PDF binary input every time." },
      { title: "Copy or download", desc: "Click Copy to paste straight into a chat tab, or Download .md to save to your Notion / Obsidian / Git repo." },
      { title: "Server-side speed", desc: "Poppler pdftotext is a C library — extracts a 100-page PDF in 1-3 seconds." },
      { title: "No signup, no watermark", desc: "Output is the raw extraction. No promotional text, no quota, no daily limit." },
    ],
    howTo: [
      { title: "Step 1: Upload PDF", desc: "Drop or click to add a single PDF (up to 30MB). Text-based PDFs work; scanned image PDFs need OCR first." },
      { title: "Step 2: Click Extract to Markdown", desc: "Server processes in 1-5 seconds for typical files." },
      { title: "Step 3: Review the output", desc: "Output shows in a scrollable preview. Check that the structure looks right." },
      { title: "Step 4: Copy or download", desc: "Copy to clipboard for pasting into AI chats, or Download .md to save the file." },
    ],
    useCases: [
      "**Feed long PDFs to ChatGPT / Claude** for accurate summaries, Q&A, and analysis",
      "**Build RAG pipelines** — Markdown is the standard input format for chunking and embedding",
      "**Import research papers to Obsidian or Notion** while preserving document structure",
      "**Archive PDFs as searchable text** for command-line grep or indexed search",
      "**Generate AI training data** from a corpus of PDF reference materials",
      "**Translate or rewrite long PDFs** by feeding the Markdown to a translation/rewriting AI",
    ],
    faq: [
      { q: "Why Markdown instead of just PDF chat?", a: "Most &quot;chat with PDF&quot; features use opaque internal extraction that may merge headings, fragment tables, or skip footnotes. Doing the extraction yourself with this tool, then feeding clean Markdown to your preferred AI, almost always produces 30-50% better responses on long documents." },
      { q: "Does this output have Markdown syntax like # headers?", a: "Output is plain text with layout preserved (indentation, line breaks, columns). It does NOT add Markdown heading marks (#, ##) or list bullets — the source PDF doesn't carry that semantic information. The output IS valid Markdown (plain text always is) and works as LLM input regardless." },
      { q: "Will scanned PDFs work?", a: "No. Scanned PDFs are images without a text layer — pdftotext returns an empty result. Use OCR first to add a text layer, then run extraction. Tesseract (free, open source) is the standard OCR for this." },
      { q: "How much text can I extract?", a: "File size limit is 30MB, which usually covers 100-300+ page PDFs depending on density. There's no character or word limit on the output." },
      { q: "Are tables extracted correctly?", a: "Tables become space-aligned text rows — readable for AI but not Markdown table syntax. For better table handling on complex tables, paid tools like LlamaParse can output cleaner Markdown tables." },
      { q: "Is my PDF private during extraction?", a: "The PDF uploads over HTTPS to our server, is processed by pdftotext in a temp directory, and the temp files are deleted immediately. Nothing is logged or stored. The text output is returned and shown in your browser only." },
      { q: "What about DOCX, XLSX, PPTX support?", a: "Currently PDF only. Multi-format extraction (Word, Excel, PowerPoint to Markdown) is planned. For those formats today, try Microsoft's open-source MarkItDown or Pandoc." },
    ],
    relatedTools: ["compress-pdf", "split-pdf", "merge-pdf"],
  },

  "unlock-pdf": {
    slug: "unlock-pdf",
    h1Subtitle:
      "Remove password protection from a PDF you own. Server-side qpdf, free, no logging. You must know the password.",
    intro: [
      "**Unlock PDF** removes password protection so you can edit, copy, print, or share a PDF without entering credentials each time. This is for PDFs you protected yourself or received with the password — not for cracking unknown passwords (which this tool deliberately does not do).",
      "Pick Rack's **Unlock PDF** tool uses [qpdf](https://qpdf.sourceforge.io), the open-source PDF transformation library, server-side. You upload over HTTPS, provide the password, and receive the unlocked PDF. The file and password are deleted immediately — nothing is logged.",
      "Free, no signup, no watermark. Files up to 100MB.",
    ],
    features: [
      { title: "Industry-standard qpdf engine", desc: "qpdf is used in the Linux ecosystem for decades — reliable on edge cases other tools miss." },
      { title: "AES-256 supported", desc: "Modern encryption (AES-128, AES-256) and legacy RC4 all work, given the correct password." },
      { title: "No logging", desc: "Your password is held in memory only for the duration of the qpdf call (a few seconds), then garbage-collected. Server logs do not record passwords." },
      { title: "Clear error on wrong password", desc: "If the password is incorrect, the tool returns a clean &quot;Wrong password&quot; message rather than failing silently." },
      { title: "Free, no signup", desc: "No daily quota, no premium tier. Use as often as needed." },
    ],
    howTo: [
      { title: "Step 1: Upload protected PDF", desc: "Drop or click to add the encrypted PDF (up to 100MB)." },
      { title: "Step 2: Enter the password", desc: "Type the password you used to protect the file (or the one provided to you)." },
      { title: "Step 3: Click Remove password", desc: "Server decrypts in under 5 seconds for most files." },
      { title: "Step 4: Download unlocked.pdf", desc: "The output has all original content but no password requirement." },
    ],
    useCases: [
      "**You forgot you protected an old PDF** and want to share it freely now",
      "**You received a protected PDF with the password** and need a clean copy for your archive",
      "**You need to use the PDF in a workflow** that doesn't support encrypted files (Notion upload, certain RSS readers)",
      "**You're consolidating PDFs** and want to merge/edit without re-entering the password each step",
      "**You want to add OCR to a protected scanned PDF** and your OCR tool requires unprotected input",
    ],
    faq: [
      { q: "Will this tool crack a password I don't know?", a: "No. This tool deliberately does not attempt to brute-force or guess passwords. It requires the correct password, then removes the encryption. Tools that crack PDF passwords exist but are intended for security research, not casual use." },
      { q: "Is sending my password over the internet safe?", a: "The connection is HTTPS-encrypted end-to-end, so no one can intercept the password in transit. The server holds it in memory only during the qpdf call, then releases it. Server access logs do not capture form data. For extreme paranoia, run qpdf locally: apt install qpdf, then qpdf --decrypt --password=YOUR_PWD input.pdf output.pdf." },
      { q: "What's the difference between user password and owner password?", a: "User password (open password) is required to view the PDF. Owner password limits actions (printing, copying) for users who can already view. This tool removes user-password protection. If your PDF has only an owner password, qpdf can usually remove it without any password." },
      { q: "Can I unlock a PDF protected with AES-256?", a: "Yes. qpdf supports AES-128 and AES-256, the modern PDF encryption standards. Older RC4 protection also works." },
      { q: "What if qpdf fails to unlock my file even with the right password?", a: "Some PDFs are corrupted or use non-standard encryption. The tool returns a clear error in that case. Try opening the file in Adobe Reader or Foxit, then save-as a new PDF to normalize it before unlocking." },
      { q: "Does the unlocked PDF have any difference from the original?", a: "Content is identical — text, images, fonts, structure all preserved. The only change is that encryption metadata is removed. File size is typically very slightly smaller after unlocking." },
      { q: "Is this legal?", a: "Yes, when you have permission to access the PDF. This tool does not bypass DRM (which is illegal in many jurisdictions) — it only removes password protection that you have the right to remove. Don't use it on PDFs you don't own or aren't authorized to access." },
    ],
    relatedTools: ["protect-pdf", "compress-pdf", "merge-pdf"],
  },

  "word-to-pdf": {
    slug: "word-to-pdf",
    h1Subtitle:
      "Convert DOCX, DOC, or ODT documents to PDF using LibreOffice on the server. Preserves formatting, fonts, embedded images, and tables. Free, no watermark, no signup.",
    intro: [
      "**Convert Word to PDF** is the most-searched PDF operation worldwide in 2026 — about 100 search interest points on Google Trends, far ahead of any other format conversion. Whether you're sharing a finalized contract, submitting a CV that won't reflow on the recipient's machine, or archiving a manuscript, PDF is the universal delivery format.",
      "Pick Rack's **Word to PDF** tool uses [LibreOffice](https://www.libreoffice.org) headless on the server — the same engine professional document workflows have used for over a decade. Output preserves formatting (fonts, headings, paragraph styles), embedded images, tables, headers/footers, page breaks, and most styling.",
      "Free, no signup, no watermark, no daily quota. Files up to 30MB.",
    ],
    features: [
      { title: "Industry-standard LibreOffice engine", desc: "Same headless conversion used by Linux servers, government agencies, and enterprise document pipelines." },
      { title: "Preserves formatting", desc: "Fonts, headings, paragraph styles, embedded images, tables, headers, footers, and page breaks all carry through. Output looks like the source." },
      { title: "DOCX, DOC, and ODT supported", desc: "Modern Microsoft Office (DOCX), legacy Office (DOC), and OpenDocument (ODT). LibreOffice handles all three natively." },
      { title: "No watermark, no signup", desc: "Output is your converted PDF — no promotional banners, no daily limit, no &quot;upgrade to remove watermark&quot; nag." },
      { title: "Server-side, deleted immediately", desc: "File uploads over HTTPS, gets converted, then deleted from server temp storage. No logging." },
    ],
    howTo: [
      { title: "Step 1: Upload your Word document", desc: "Drop or click to add a single .docx, .doc, or .odt file (up to 30MB)." },
      { title: "Step 2: Click Convert to PDF", desc: "Server processes via LibreOffice. Most files complete in 5-15 seconds." },
      { title: "Step 3: Download the PDF", desc: "Output PDF downloads directly with the same base name as the input file." },
    ],
    useCases: [
      "**Submit professional documents** (CV, cover letter, proposal) in PDF format that displays consistently regardless of the recipient's software",
      "**Lock down a contract** before sending — recipients can read but cannot easily edit",
      "**Archive Word documents** in PDF/A-friendly format for long-term storage",
      "**Convert manuscripts** for online submission systems that require PDF only",
      "**Share academic papers** where reviewers need consistent page numbering and footnote layout",
      "**Email-friendly delivery** — recipients open PDF without needing Word installed",
    ],
    faq: [
      { q: "Will the converted PDF look exactly like the original Word document?", a: "Very close, but not pixel-perfect 100% of the time. LibreOffice handles standard Word features (headings, paragraphs, tables, images, headers/footers) accurately. Edge cases that may shift slightly: complex SmartArt, embedded Excel charts, custom WordArt, very specific font kerning, and macro-driven content. For standard documents (95% of use cases) the conversion is indistinguishable." },
      { q: "Are my fonts preserved in the output PDF?", a: "Yes, when the fonts are embedded in the source document or available on the server. Standard Microsoft fonts (Arial, Times New Roman, Calibri, Cambria) and major Linux fonts (Liberation, DejaVu) work. If your document uses an exotic font not on the server, LibreOffice substitutes the closest match — usually unnoticeable for most readers." },
      { q: "Can I convert .doc files (legacy Word format)?", a: "Yes. Pick Rack accepts .docx (Office 2007+), .doc (legacy Office 97-2003), and .odt (OpenDocument). All three convert to PDF via the same LibreOffice engine." },
      { q: "What is the maximum file size?", a: "30MB per file. For larger documents (long manuscripts, image-heavy reports), split into sections, convert each, then merge the resulting PDFs using Pick Rack's Merge PDF tool." },
      { q: "Does the PDF output include hyperlinks from the Word document?", a: "Yes. Internal links (table of contents, cross-references) and external URLs are preserved as clickable hyperlinks in the output PDF, working correctly in Adobe Reader, Foxit, Preview, and browser PDF viewers." },
      { q: "Is my Word document private during conversion?", a: "The file uploads over HTTPS to the server, gets processed in a private temp directory by LibreOffice, then the temp directory and all files are deleted immediately after the response is sent. Nothing is logged or persisted. For absolute privacy, run LibreOffice locally yourself: `libreoffice --headless --convert-to pdf input.docx` produces identical output." },
      { q: "Can I convert multiple Word files at once?", a: "Currently the tool processes one file per conversion. For batch conversion, upload files individually. A batch interface may be added in the future." },
      { q: "Will tracked changes and comments appear in the PDF?", a: "By default, accepted tracked changes appear as final text and comments are not included. If you need to preserve markup, accept or reject all changes in Word first, then convert. Comments in the Word document do not transfer to the PDF." },
    ],
    relatedTools: ["pdf-to-word", "merge-pdf", "compress-pdf"],
  },

  "pdf-to-word": {
    slug: "pdf-to-word",
    h1Subtitle:
      "Convert PDF to editable Word document (.docx) using LibreOffice on the server. Best for text-based PDFs. Free, no signup, no watermark.",
    intro: [
      "**Convert PDF to Word** is the third most-searched PDF operation worldwide in 2026, just behind \"word to pdf\" itself. The use case: you received a PDF document, you need to edit it, but the source file isn't available — converting back to Word gives you an editable .docx that you can revise in Microsoft Word, LibreOffice Writer, or Google Docs.",
      "Pick Rack's **PDF to Word** tool uses [LibreOffice](https://www.libreoffice.org) on the server to extract text, paragraphs, headings, tables, and basic formatting from PDF and write them into a fresh DOCX file. Output is a real editable Word document, not just a screenshot wrapper.",
      "Best with **text-based PDFs** (PDFs created from Word, exported from a writing app, or saved from a browser). Scanned image PDFs (no text layer) produce empty Word files — those need OCR first.",
    ],
    features: [
      { title: "Real editable Word output", desc: "Output is a genuine .docx with editable text, paragraph structure, and tables — not just an image wrapped in a Word file." },
      { title: "LibreOffice engine", desc: "Uses the open-source LibreOffice headless converter, the same tool used in enterprise document pipelines." },
      { title: "Preserves text and basic formatting", desc: "Headings, paragraphs, bold/italic, lists, and most tables transfer accurately. Complex layouts (multi-column, sidebars) may need manual cleanup." },
      { title: "Encrypted PDFs flagged early", desc: "Password-protected PDFs are detected before processing — clear error message tells you to unlock first." },
      { title: "No watermark, free forever", desc: "Output Word file has no promotional content, no daily limit, no signup wall." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drop or click to add a single PDF (up to 30MB). Encrypted PDFs need to be unlocked first." },
      { title: "Step 2: Click Convert to Word", desc: "Server processes via LibreOffice. Most files complete in 10-30 seconds depending on length." },
      { title: "Step 3: Download the .docx", desc: "Output Word document downloads directly. Open in Word, LibreOffice Writer, or Google Docs to edit." },
    ],
    useCases: [
      "**Edit a contract** received as PDF when the original Word file isn't available",
      "**Update a CV/resume** that you only have as PDF",
      "**Adapt a template** to a new client by editing the Word version of an existing PDF",
      "**Extract a paragraph** from a long PDF by converting the whole thing and copy/pasting",
      "**Translate a document** by converting to Word, replacing text, then re-converting to PDF",
      "**Repurpose academic papers** for blog posts or articles where you need editable text",
    ],
    faq: [
      { q: "Will the Word output look exactly like the source PDF?", a: "Approximately, yes. Headings, paragraphs, lists, bold/italic, and most tables come through accurately for standard PDFs (those created from Word or similar tools). Complex layouts (multi-column newspapers, magazine-style design with sidebars) may require manual cleanup in Word. Plain reports and articles convert cleanly." },
      { q: "Can I convert scanned PDFs (images of pages, no text layer)?", a: "Not directly. Scanned PDFs are images — LibreOffice produces an empty Word document because there is no text to extract. To convert a scanned PDF, run OCR (optical character recognition) first to add a text layer. Tools like Tesseract (free, open-source) or commercial OCR services do this. After OCR, the resulting PDF can be converted to Word." },
      { q: "Does the Word output include images from the PDF?", a: "Often, yes — embedded images in the PDF are extracted and placed in the Word document. Some images (those rendered as part of a complex graphical PDF rather than embedded as bitmaps) may not transfer. Verify the output before relying on image fidelity." },
      { q: "Why are some characters missing or wrong in my output?", a: "Two common causes: (1) the source PDF uses non-standard fonts that map ambiguously to Unicode, causing characters like ligatures (fi, fl) to appear wrong; (2) the PDF was generated from a tool that didn't embed proper font information. For best results, ensure the source PDF is from a recent version of Word, Google Docs, or a similar standard editor." },
      { q: "Are tables preserved correctly?", a: "Simple tables (regular rows/columns, single-line cells) usually transfer well. Complex tables (merged cells across multiple rows, deeply nested tables, or tables with non-rectangular cells) may need manual cleanup. For data extraction specifically, consider Pick Rack's PDF to Markdown tool — Markdown table format is often easier to clean up." },
      { q: "What if my PDF is password-protected?", a: "The tool detects encrypted PDFs and refuses to process them with a clear error message. Use Pick Rack's [Unlock PDF](/tools/pdf/unlock-pdf/) tool to remove the password (you must know the password), then convert the unlocked PDF to Word." },
      { q: "Is my PDF private during conversion?", a: "Yes. The PDF uploads over HTTPS, gets processed by LibreOffice in a private temp directory, then the directory and all files are deleted immediately after the response is sent. Nothing is logged or stored. The connection is encrypted end-to-end." },
      { q: "Can I convert just specific pages?", a: "Currently the tool converts the entire PDF. To convert only specific pages, use Pick Rack's [Split PDF](/tools/pdf/split-pdf/) tool first to extract the pages you need, then convert the smaller PDF to Word." },
    ],
    relatedTools: ["word-to-pdf", "pdf-to-markdown", "unlock-pdf"],
  },

  "protect-pdf": {
    slug: "protect-pdf",
    h1Subtitle:
      "Add AES-256 password protection to a PDF. Server-side qpdf, no logging, no signup. Compatible with all modern PDF viewers.",
    intro: [
      "**Password-protect a PDF** is the right move whenever you share confidential information by email, cloud link, or USB drive. Encrypted PDFs require the correct password before anyone — sender, recipient, or interceptor — can view the content.",
      "Pick Rack's **Protect PDF** tool uses [qpdf](https://qpdf.sourceforge.io) with AES-256 encryption, the strongest standard supported by the PDF specification. Output works in Adobe Reader, Foxit, Preview, all browser PDF viewers, and any modern PDF software.",
      "Free, no signup, no watermark, no logging. Files up to 100MB.",
    ],
    features: [
      { title: "AES-256 encryption", desc: "The strongest PDF encryption standard. Considered cryptographically secure — practically uncrackable without the password." },
      { title: "Universal compatibility", desc: "Works in Adobe Reader, Foxit, Preview, Chrome/Firefox/Safari built-in PDF viewers, and all major mobile PDF apps." },
      { title: "Same password for view and edit", desc: "Simple UX — one password gates both opening and editing. For separate user/owner passwords, use qpdf locally with custom flags." },
      { title: "Server-side processing", desc: "File uploads over HTTPS, gets encrypted, and is deleted from temp storage. Password held only during the brief qpdf call." },
      { title: "Free, no quota", desc: "Use as often as you need. No daily limit, no signup, no premium tier." },
    ],
    howTo: [
      { title: "Step 1: Upload PDF", desc: "Drop or click to add a single PDF (up to 100MB). Must NOT already be encrypted (use Unlock PDF first if needed)." },
      { title: "Step 2: Enter and confirm password", desc: "Minimum 4 characters. Use a strong password — long, mix of character types, hard to guess." },
      { title: "Step 3: Click Add password", desc: "Server encrypts in 2-5 seconds for most files." },
      { title: "Step 4: Download protected.pdf", desc: "Save the encrypted file. The password you set is required to open it." },
    ],
    useCases: [
      "**Email contracts, NDAs, confidential reports** with an encryption layer beyond what the email provider offers",
      "**Share tax returns and financial statements** with your accountant securely",
      "**Protect personal IDs (passport scans, driver license)** before storing in cloud drives",
      "**Lock medical records** for patient privacy (HIPAA compliance baseline)",
      "**Secure design files and IP** when sending to external collaborators or vendors",
      "**Protect children's school records** before emailing to teachers or institutions",
    ],
    faq: [
      { q: "How strong is AES-256 encryption for PDF?", a: "AES-256 is the strongest encryption supported by the PDF standard and is considered cryptographically secure. Without the password, brute-forcing AES-256 is computationally infeasible (would take longer than the age of the universe with current technology). The weakness is always in password strength, not the algorithm." },
      { q: "What makes a strong PDF password?", a: "12+ characters, mix of uppercase, lowercase, numbers, symbols. Avoid dictionary words, names, dates, or common patterns. A passphrase like &quot;Correct-Horse-Battery-Staple-1972&quot; is stronger than &quot;P@ssw0rd123&quot; despite looking less complex." },
      { q: "Can I lose access to a protected PDF if I forget the password?", a: "Yes. Without the password, the file is unrecoverable. Always store passwords in a password manager (1Password, Bitwarden, KeePass) and ensure you have at least one backup." },
      { q: "Why not separate user and owner passwords?", a: "PDF supports two password levels: user password (required to view) and owner password (required to modify). This tool sets both to the same password for simplicity. For advanced separation, run qpdf locally: qpdf --encrypt USER OWNER 256 -- input.pdf output.pdf." },
      { q: "Will the protected PDF work on iPhone, iPad, Android?", a: "Yes. All major mobile PDF viewers (Apple Preview/Books, Adobe Acrobat, Foxit Mobile, Google Drive PDF viewer) support AES-256 protected PDFs and will prompt for the password on open." },
      { q: "Can I encrypt an already-encrypted PDF with a new password?", a: "Not with this tool. Unlock first using Unlock PDF (with the existing password), then re-encrypt with this tool using the new password." },
      { q: "Is my password sent to your server?", a: "Yes, over HTTPS for the duration of the encryption operation (a few seconds). The password is held in process memory only and not written to logs or storage. After the operation, it's gone. For extreme paranoia, run qpdf locally and never send the password over any network." },
    ],
    relatedTools: ["unlock-pdf", "watermark-pdf", "merge-pdf"],
  },

  "pptx-to-pdf": {
    slug: "pptx-to-pdf",
    h1Subtitle:
      "Convert PowerPoint presentations to PDF online. PPTX, PPT, ODP supported. Layout and fonts preserved.",
    intro: [
      "**PowerPoint to PDF** is the standard format conversion when you need to share a presentation that opens identically on every device — no font substitution, no &quot;PowerPoint required&quot;, no Mac/Windows formatting drift.",
      "Pick Rack's **PPTX to PDF** tool runs server-side using LibreOffice's headless engine — the same engine that powers WordPress's `wp-cli media regenerate` and most enterprise document servers. Files upload over HTTPS, get rendered to PDF, and are deleted immediately. We never log or store your file.",
      "Free, no signup, no watermark. PPTX, legacy PPT, and OpenDocument ODP files are all supported, up to 50MB. Conversion typically takes 5-15 seconds depending on slide count.",
    ],
    features: [
      { title: "Preserves slide layout exactly", desc: "Bullets, tables, images, and shapes render to PDF in their original positions. No reflow, no font size jumps." },
      { title: "Embeds custom fonts", desc: "If your PPTX uses non-standard fonts available on the LibreOffice server, they're embedded in the PDF. Otherwise, the closest substitute is used (rare on modern decks)." },
      { title: "Handles 100+ slide decks", desc: "Conversion is linear in slide count. A 200-slide investor pitch converts in ~30 seconds." },
      { title: "Animations rendered as static slides", desc: "Each slide is captured at its initial state. Animation steps are not preserved in PDF (PDF doesn't support animation)." },
      { title: "Speaker notes excluded by default", desc: "Output PDF contains slide content only — clean for sharing without &quot;internal notes&quot; leaking. (Speaker-notes export coming in v2.)" },
    ],
    howTo: [
      { title: "Step 1: Upload your presentation", desc: "Drag a PPTX, PPT, or ODP file (up to 50MB) into the dropzone." },
      { title: "Step 2: Click Convert to PDF", desc: "LibreOffice processes your file server-side. Wait 5-30 seconds depending on slide count." },
      { title: "Step 3: Download the PDF", desc: "A green download button appears. Click to save the converted PDF to your device." },
    ],
    useCases: [
      "**Send a deck to a client** who doesn't have PowerPoint installed",
      "**Archive a presentation** in a format that won't degrade as PowerPoint versions change",
      "**Print a deck** with consistent formatting (PowerPoint print preview can drift between versions)",
      "**Upload to a job application** that requires PDF format only",
      "**Email a slide deck** that opens identically on Mac, Windows, iOS, Android",
      "**Embed in a PDF portfolio** combining multiple decks into one file via Merge PDF",
    ],
    faq: [
      { q: "Why use server-side LibreOffice instead of browser conversion?", a: "Browser-based PPTX rendering is unreliable — the OOXML format is too complex for any JavaScript library to render with full fidelity. LibreOffice has 25 years of engineering invested in PowerPoint compatibility, including the same code Microsoft uses internally for Office Online compatibility testing." },
      { q: "Will my custom fonts render correctly?", a: "If the font is embedded in your PPTX (use File → Options → Save → &quot;Embed fonts&quot; in PowerPoint), yes. If it's only referenced by name and not available on the server, LibreOffice substitutes the closest match — usually visually identical for common fonts (Calibri, Arial, Helvetica)." },
      { q: "Does this support PowerPoint's built-in animations and transitions?", a: "No — PDF doesn't support animation. Each slide is exported in its initial visual state. If you need animated output, export from PowerPoint as a video (MP4) instead." },
      { q: "What about embedded videos and audio?", a: "Videos and audio are not embedded in the PDF (PDF supports embedded media but most viewers don't reliably play them). The slide where they were placed shows the poster image only." },
      { q: "Are speaker notes included in the PDF?", a: "No, speaker notes are excluded by default — output is the slides only. This matches how most users share decks (notes are private to the presenter). A speaker-notes export option is on the roadmap." },
      { q: "Is there a slide count limit?", a: "Effective limit is the 50MB upload cap and 90-second conversion timeout. Most decks of up to 200 slides convert successfully." },
      { q: "Why is my converted PDF much larger than my PPTX?", a: "PPTX is highly compressed and references images/fonts. PDF embeds them as raw streams. A 5MB PPTX with high-resolution images often becomes a 15-30MB PDF. Run Compress PDF on the result to shrink it 50-80%." },
      { q: "What's the difference between PPTX, PPT, and ODP?", a: "PPTX is modern PowerPoint (Office 2007+). PPT is legacy PowerPoint (1997-2003 binary format, OLE2). ODP is OpenDocument Presentation, used by LibreOffice Impress, Apache OpenOffice, and Google Slides export. All three are supported." },
    ],
    relatedTools: ["pdf-to-pptx", "compress-pdf", "merge-pdf"],
  },

  "pdf-to-pptx": {
    slug: "pdf-to-pptx",
    h1Subtitle:
      "Convert PDF to PowerPoint with each page as a slide. Image-per-slide approach for layout-perfect output.",
    intro: [
      "**PDF to PowerPoint** conversion is one of the most-requested but least-reliable PDF operations. Most online tools claim to extract editable text, but the result is almost always broken: misaligned columns, scrambled paragraphs, missing fonts, and overlapping shapes. The OOXML format is too rigid to absorb arbitrary PDF layouts.",
      "Pick Rack's **PDF to PPTX** tool takes the honest approach: each PDF page is rendered as a high-resolution PNG (144 DPI by default) and embedded as the full background of a 16:9 widescreen slide. The layout is **identical** to the original PDF — every line, every column, every graphic is exactly where it was. The tradeoff: text is not editable.",
      "If you need editable text from a PDF, [PDF to Word](/tools/pdf/pdf-to-word/) gives you a much better result. Use this PDF to PPTX tool when layout fidelity matters more than editability — like when you want to use a PDF document as the base for a presentation deck without redesigning it.",
    ],
    features: [
      { title: "Layout fidelity 100%", desc: "Each PDF page renders as a sharp PNG embedded in a slide. Every column, font, color, and graphic is identical to the original." },
      { title: "16:9 widescreen output", desc: "Slides match modern PowerPoint defaults. Output works in PowerPoint, Keynote, Google Slides, LibreOffice Impress." },
      { title: "Free, no signup, no watermark", desc: "Most online PDF→PPTX tools watermark heavily or limit to 3 pages on free tier. Pickrack is unlimited and watermark-free." },
      { title: "Privacy-first server processing", desc: "PDFs upload over HTTPS, get rendered, and are deleted immediately. Nothing logged, nothing stored." },
      { title: "Up to 200 pages per conversion", desc: "Suitable for converting medium-length reports, slide decks, and document handouts. Larger PDFs should be split first." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drop a PDF (up to 30MB, max 200 pages) into the dropzone." },
      { title: "Step 2: Click Convert to PowerPoint", desc: "Each page renders as a 144 DPI PNG and embeds in a 16:9 slide. Conversion takes 5-30 seconds." },
      { title: "Step 3: Download the PPTX", desc: "Open in PowerPoint, Keynote, or Google Slides. Each slide is a high-resolution image of the original PDF page." },
    ],
    useCases: [
      "**Use a brochure as a presentation backdrop** without redesigning slides from scratch",
      "**Walk a client through a contract** by stepping through PDF pages as a deck",
      "**Embed a research PDF** as visual reference inside a larger pitch deck",
      "**Convert a poster PDF** into a single slide for screen-share during a video call",
      "**Archive a PDF as PPTX** when the team prefers PowerPoint over PDF readers",
      "**Build a slide deck from infographic PDFs** without losing design fidelity",
    ],
    faq: [
      { q: "Why isn't the text editable in the output PPTX?", a: "Each page is rendered as an image and embedded as a slide background. This is the only way to guarantee 100% layout fidelity. PDF→editable PPTX is unreliable — even Adobe Acrobat Pro produces broken output for most non-trivial PDFs. If you need editable text, use PDF to Word instead — DOCX is more flexible than PPTX for arbitrary layouts." },
      { q: "What resolution are the images?", a: "144 DPI by default — sharp on standard 1080p projectors and most laptop displays. For ultra-high-DPI monitors (4K, Retina), text may look slightly soft on close inspection. Higher resolution would multiply file size 4x for marginal gain." },
      { q: "Can I edit anything in the output?", a: "Yes — you can add text boxes, shapes, animations, and transitions on top of the image-slide. The PDF page remains as the static background. This is great for narrating over a PDF document during a presentation." },
      { q: "Why is the output PPTX larger than my PDF?", a: "PNG images are uncompressed. A 2MB text-heavy PDF often becomes a 15-25MB PPTX. To reduce size, save the deck from PowerPoint with &quot;Compress images&quot; → Email (96 ppi) — this typically cuts size by 70-80%." },
      { q: "Are there alternatives that produce editable text?", a: "Yes: (1) [PDF to Word](/tools/pdf/pdf-to-word/) extracts text into DOCX with editable formatting; (2) Adobe Acrobat Pro ($19.99/mo) does its own image-to-text PPTX conversion that's more aggressive but often produces broken output; (3) Manually retype the most important slides — for important decks this is faster than fixing broken auto-conversion." },
      { q: "Does this work for PDFs with selectable text?", a: "Yes, but the text becomes part of the rendered image — not selectable in the output PPTX. The visual quality is identical regardless of whether the source PDF was text-based or scanned." },
      { q: "What aspect ratio is the output?", a: "16:9 widescreen (13.333 x 7.5 inches), matching modern PowerPoint defaults. PDF pages with very different aspect ratios (e.g., 8.5x11 portrait) will appear letterboxed with white margins on the slide." },
      { q: "Is there a page limit?", a: "Yes, 200 pages per conversion. This protects against abuse via huge PDFs that would generate massive PPTX files. Split your PDF first if you need to convert more pages." },
    ],
    relatedTools: ["pdf-to-word", "pdf-to-jpg", "split-pdf"],
  },

  "epub-to-pdf": {
    slug: "epub-to-pdf",
    h1Subtitle:
      "Convert EPUB ebooks to PDF for printing or PDF readers. Calibre engine preserves chapters and TOC.",
    intro: [
      "**EPUB to PDF** is the conversion you need when an ebook needs to leave its reader and become a printable, shareable, archivable document. EPUB is brilliant for reflowable reading on Kindle, Kobo, or Apple Books — but PDF is the lingua franca for printing, university submissions, legal archives, and any system that demands fixed-page format.",
      "Pick Rack's **EPUB to PDF** tool uses [Calibre](https://calibre-ebook.com/), the gold-standard open-source ebook converter maintained for over 15 years. Calibre handles EPUB 2 and EPUB 3, preserves your table of contents as PDF bookmarks, embeds chapter structure, and applies clean typography defaults.",
      "Free, no signup, no watermark. Files up to 50MB are supported. Conversion typically takes 30-90 seconds for novel-length books due to Calibre's full text-flow analysis.",
    ],
    features: [
      { title: "Calibre conversion engine", desc: "The same engine used by millions of Kindle users to convert their personal libraries. Robust, predictable, well-tested across thousands of EPUB variants." },
      { title: "Table of contents as PDF bookmarks", desc: "Your EPUB's chapter structure becomes navigable bookmarks in the PDF — clickable in any modern PDF viewer." },
      { title: "Hyperlinks preserved", desc: "Internal cross-references (footnotes, chapter links) and external URLs remain clickable in the converted PDF." },
      { title: "Cover image included", desc: "If your EPUB has a cover image, it appears as the first page of the PDF." },
      { title: "No watermark, no signup", desc: "Output PDF has zero added marks. Most online EPUB→PDF tools watermark heavily — Pickrack is genuinely free." },
    ],
    howTo: [
      { title: "Step 1: Upload your EPUB", desc: "Drop a single .epub file (up to 50MB) into the dropzone." },
      { title: "Step 2: Click Convert to PDF", desc: "Calibre processes the ebook server-side. Wait 30-90 seconds — Calibre does full text-flow analysis to produce clean output." },
      { title: "Step 3: Download the PDF", desc: "A green download button appears. The PDF includes cover, table of contents (as bookmarks), and all chapters." },
    ],
    useCases: [
      "**Print a Kindle book** by converting EPUB → PDF first (most printers don't accept EPUB)",
      "**Submit an ebook as an academic reference** when the journal demands PDF format",
      "**Archive personal library** in PDF format for long-term cross-platform access",
      "**Annotate an ebook** in a PDF reader (GoodReader, PDF Expert) that has better markup tools than Kindle",
      "**Send an EPUB to someone without an ebook reader** — they can read the PDF in any browser",
      "**Convert public-domain Project Gutenberg EPUBs** for offline PDF distribution",
    ],
    faq: [
      { q: "What's the difference between EPUB and PDF?", a: "EPUB is reflowable — text wraps to fit any screen size, font size is adjustable, and the layout is dynamic. PDF is fixed-page — each page is exactly the same on every device, like a printed page. EPUB is better for reading on phones; PDF is better for printing, archiving, and exact-layout sharing." },
      { q: "Does this preserve the table of contents?", a: "Yes. Calibre converts the EPUB's nav.xhtml or toc.ncx into PDF bookmarks. Open the PDF in Adobe Reader, Preview, or Foxit and click the bookmarks icon to see the navigable chapter list." },
      { q: "Will the output PDF have the EPUB's cover image?", a: "Yes, if your EPUB includes a cover image (most do). It becomes page 1 of the PDF." },
      { q: "Can I convert DRM-protected EPUBs (Kindle, Apple Books, Adobe DE)?", a: "No. DRM-protected ebooks cannot be converted by any tool — including this one — without first removing DRM, which is illegal in many jurisdictions. Only convert EPUBs you own DRM-free (Project Gutenberg, Standard Ebooks, books from DRM-free publishers like O'Reilly, No Starch Press, Pragmatic Bookshelf)." },
      { q: "Why does conversion take 30-90 seconds?", a: "Calibre does full text-flow analysis: cleaning up CSS, normalizing font sizes, generating page breaks, embedding fonts, and rendering each page. The result is a much cleaner PDF than a faster &quot;dump-to-PDF&quot; converter would produce." },
      { q: "What about EPUB 3 features like fixed-layout, multimedia, MathML?", a: "Fixed-layout EPUB 3 (used for comics, picture books) converts but layout fidelity depends on the source. Multimedia (audio, video) is not embedded in the PDF. MathML equations render as text or images depending on Calibre's interpretation." },
      { q: "Can I customize page size, margins, or font?", a: "v1 uses Calibre defaults (Letter size, 1-inch margins, 12pt serif). Custom page sizes (A4, A5, Kindle-sized) and margin controls are on the roadmap. For full control, install Calibre desktop locally and use ebook-convert with custom CLI flags." },
      { q: "What's the file size limit?", a: "50MB EPUB. Most novels are 1-5MB; technical books with images are 10-30MB; image-heavy comic books can exceed 50MB and would need to be split first." },
    ],
    relatedTools: ["pdf-to-epub", "compress-pdf", "merge-pdf"],
  },

  "pdf-to-epub": {
    slug: "pdf-to-epub",
    h1Subtitle:
      "Convert PDF to EPUB ebook for Kindle, Kobo, Apple Books. Reflowable text with adjustable font size.",
    intro: [
      "**PDF to EPUB** conversion gives you back the gift of reflowable text. PDFs are designed for fixed-page printing — they look fine on a 24-inch monitor but torture you on a 6-inch ebook reader where you have to pinch-zoom every page. EPUB reflows to fit any screen, with adjustable font size and dark mode.",
      "Pick Rack's **PDF to EPUB** tool uses [Calibre](https://calibre-ebook.com/), which has spent 15+ years tuning its PDF→EPUB heuristics. It detects chapter breaks, flows text around images, and produces an EPUB you can actually read on a Kindle Paperwhite or Kobo Clara without rage-quitting.",
      "Free, no signup, no watermark. Best with text-based PDFs (academic papers, novels, reports). Scanned PDFs need OCR first to extract text — without OCR, the EPUB will be empty.",
    ],
    features: [
      { title: "Calibre PDF heuristics", desc: "Detects chapter starts, drops repeated headers/footers, joins paragraphs broken across pages. Far cleaner than naive PDF→text dump." },
      { title: "Reflowable text", desc: "EPUB output adapts to any screen size and font size. No more pinch-zooming on a 6-inch e-reader." },
      { title: "Embedded cover", desc: "First page of the PDF becomes the EPUB cover (visible in the Kindle/Kobo library view)." },
      { title: "Free, no signup, no watermark", desc: "Most online PDF→EPUB tools require signup or watermark. Pickrack is genuinely free with no daily quota." },
      { title: "Privacy-first server processing", desc: "PDFs upload over HTTPS, get converted by Calibre, then deleted immediately. Nothing logged or stored." },
    ],
    howTo: [
      { title: "Step 1: Upload your PDF", desc: "Drop a PDF (up to 30MB) into the dropzone. Text-based PDFs work best — scanned PDFs need OCR first." },
      { title: "Step 2: Click Convert to EPUB", desc: "Calibre processes the PDF — flows text, detects chapters, and builds EPUB structure. Wait 20-60 seconds." },
      { title: "Step 3: Download and sideload", desc: "Email the .epub to your Kindle (it'll auto-convert to AZW3) or sideload to Kobo/Apple Books via USB or cloud sync." },
    ],
    useCases: [
      "**Read research papers on Kindle** instead of squinting at PDFs",
      "**Convert a novel PDF** to EPUB for comfortable reading on a Kobo or PocketBook",
      "**Send a long article to Boox or reMarkable** in their preferred reflowable format",
      "**Archive a PDF book** in a future-proof EPUB format that any reader can render",
      "**Convert a free academic PDF** (e.g., from arXiv) for offline reading on a low-power e-reader",
      "**Migrate a PDF library** to a Kindle, Kobo, or Calibre library in EPUB format",
    ],
    faq: [
      { q: "How well does PDF to EPUB conversion actually work?", a: "Excellent for text-based PDFs with clear chapter structure (novels, academic papers, reports). Mixed for PDFs with complex layouts (multi-column journals, graphics-heavy magazines). Poor for scanned PDFs without OCR — the EPUB will be empty because there's no extractable text. For complex layouts, expect to spend 5-10 minutes cleaning up the EPUB in Calibre desktop afterward." },
      { q: "Why is my converted EPUB empty or showing only blank pages?", a: "The PDF probably has scanned image content with no underlying text layer. Run the PDF through OCR first (Adobe Acrobat, ABBYY FineReader, Tesseract) to add a text layer, then convert. Pickrack's OCR tool is on the roadmap." },
      { q: "Will the EPUB work on Kindle?", a: "Yes. Email the .epub to your Send-to-Kindle address (settings → My Account → Devices) and Amazon auto-converts to AZW3 within minutes. Or use the Send to Kindle desktop app for direct sideloading." },
      { q: "Does it preserve images?", a: "Yes. Calibre extracts embedded PDF images and re-embeds them in the EPUB. Image positioning may shift due to reflow — they'll be inline rather than at fixed coordinates. For image-heavy content, fixed-layout EPUB or PDF is a better choice." },
      { q: "What about footnotes, citations, and cross-references?", a: "Calibre attempts to detect footnotes and convert them to EPUB-style popup footnotes (clickable, opens inline). Cross-references usually become hyperlinks. Quality varies with PDF source — academic PDFs with consistent footnote formatting work well; messy PDFs may have broken references." },
      { q: "Will tables, charts, and equations look right?", a: "Tables: usually OK, sometimes wrap awkwardly. Charts: preserved as images. Equations: depend on PDF source — text-based equations may look fine; LaTeX-rendered equations may be split or distorted. For technical/scientific reading, EPUB output should be reviewed before sharing." },
      { q: "What's the difference between EPUB and AZW3 (Kindle format)?", a: "EPUB is the open standard used by Kobo, Apple Books, and most non-Amazon readers. AZW3 (Kindle Format X) is Amazon's proprietary format, derived from EPUB but with DRM hooks. Send EPUB to Kindle via email and Amazon auto-converts. Or use Calibre desktop's `convert` to make AZW3 directly if you need it." },
      { q: "Can I edit the EPUB after conversion?", a: "Yes — install Calibre desktop (free) and use its built-in editor. You can fix text flow issues, adjust the table of contents, replace the cover, and customize CSS. Calibre also has a regex-based search/replace tool useful for cleaning up OCR errors." },
    ],
    relatedTools: ["epub-to-pdf", "pdf-to-word", "pdf-to-markdown"],
  },

  "image-compressor": {
    slug: "image-compressor",
    h1Subtitle:
      "Compress JPG, PNG, WebP images with adjustable quality. Browser-side, real-time preview, no upload.",
    intro: [
      "**Image Compressor** reduces file size for web upload, email attachments, or storage savings. Modern phones produce 5-10MB photos that are massive for upload — compressed to 500KB-1MB they look identical to most viewers.",
      "Pickrack's compressor runs entirely in your browser using the Canvas API and re-encoding via `toBlob()`. No upload, no server processing — verifiable in DevTools → Network. Quality slider lets you trade off size vs visual quality with live preview.",
      "Free, no signup, no watermark. Common compression result: JPG 80% quality typically reduces file size 60-75% with no visible quality loss. WebP usually beats JPG by 25-35% at equivalent visual quality.",
    ],
    features: [
      { title: "Adjustable quality 30-100%", desc: "Slider with live preview. 80% is the sweet spot for most photos — 60-75% smaller than original with no visible loss." },
      { title: "Convert + compress", desc: "Compress while converting format: JPG → WebP for smaller results, PNG → JPG for photo-style content." },
      { title: "Before/after comparison", desc: "Side-by-side preview shows original vs compressed at your chosen quality. See artifacts before committing." },
      { title: "Browser-side privacy", desc: "Canvas API + toBlob run locally. Your images never upload. Verifiable in DevTools." },
      { title: "Batch ready", desc: "Drop multiple images at once, compress all with same settings, download as ZIP." },
    ],
    howTo: [
      { title: "Step 1: Drop your image(s)", desc: "Up to 50MB per file. JPG, PNG, WebP, AVIF supported." },
      { title: "Step 2: Adjust quality", desc: "80% is good default. Drag slider — preview updates live." },
      { title: "Step 3: Download", desc: "Single image: direct download. Multiple: ZIP archive of compressed images." },
    ],
    useCases: [
      "**Email attachments** — Gmail caps at 25MB; compress big photos to fit",
      "**Web upload** — Marketplaces (eBay, Etsy) often have per-image size limits (5-10MB)",
      "**Blog images** — smaller files = faster page load + better Core Web Vitals",
      "**Storage savings** — 1000 phone photos at 1MB instead of 5MB saves 4GB",
      "**Social media** — Instagram/X auto-compress; pre-compressing keeps better quality",
      "**Document attachments** — shrink images before embedding in PDF/Word/Slack",
    ],
    faq: [
      { q: "How does this compare to TinyPNG?", a: "TinyPNG uses superior compression algorithms (custom MozJPEG-like + PNGOUT) but uploads your image to their server. Pickrack uses standard browser-canvas re-encoding which is 10-20% less efficient but never uploads. Privacy > marginal compression for most users." },
      { q: "Why is my output not as small as TinyPNG's?", a: "Browser canvas uses standard JPEG encoder — TinyPNG runs custom MozJPEG with smarter quantization. For maximum compression, use a desktop tool like Squoosh app, ImageOptim (Mac), or run MozJPEG locally." },
      { q: "Does it preserve EXIF metadata (camera, GPS)?", a: "No — Canvas re-encoding strips all EXIF. This is a privacy benefit (camera/GPS info removed from output). To keep EXIF, use a desktop tool like exiftool to copy metadata after compression." },
      { q: "What format compresses best?", a: "WebP usually beats JPG by 25-35% at same quality, and supports transparency unlike JPG. AVIF is even better (~50% smaller than JPG) but slower to encode/decode. JPG is most compatible (every viewer supports it)." },
      { q: "Is there quality loss with PNG → JPG?", a: "Yes. PNG is lossless (every pixel exact); JPG is lossy. For photographs, JPG quality 85+ is visually identical to PNG at much smaller size. For graphics with sharp edges (logos, screenshots), PNG → JPG can show artifacts; use PNG → WebP instead." },
      { q: "What's the maximum file size I can compress?", a: "50MB per image. Beyond that, browsers may run out of memory. For photos > 50MB (typical of RAW or 100MP cameras), use a desktop tool." },
      { q: "Can I batch compress?", a: "Yes — drop multiple images at once. All compress with the same quality setting. Output: ZIP archive." },
      { q: "Does compression affect image quality permanently?", a: "Yes — JPEG/WebP are lossy. Each re-compression slightly degrades quality. Compress once from the original, never re-compress an already-compressed file." },
    ],
    relatedTools: ["image-resizer", "image-converter", "heic-to-jpg"],
  },

  "image-converter": {
    slug: "image-converter",
    h1Subtitle:
      "Convert between PNG, JPG, WebP, AVIF formats. Batch support, browser-side processing.",
    intro: [
      "**Image Converter** changes image file format — for compatibility (a system requires JPG only), for size (WebP is ~30% smaller than JPG), or for transparency support (JPG → PNG when transparency needed).",
      "Pickrack's converter uses the Canvas API to decode source format and `toBlob()` to encode the target. Browser-native, no server roundtrip. Supports PNG, JPG, WebP, and AVIF (where browser supports — Chrome and Firefox have full AVIF; Safari is partial).",
      "Free, no signup. Drop one image or multiple, pick the target format, download. For format-specific options (quality for JPG/WebP/AVIF, transparency for PNG), Image Compressor offers more control.",
    ],
    features: [
      { title: "4 output formats", desc: "PNG (lossless, transparent), JPG (small, no transparency), WebP (smaller, transparent), AVIF (smallest, modern only)." },
      { title: "Batch conversion", desc: "Drop multiple images, convert all at once, download as ZIP. No file count limit (browser memory permitting)." },
      { title: "Auto-detect input format", desc: "Canvas decodes JPG, PNG, WebP, AVIF, GIF, BMP automatically. No manual format selection for input." },
      { title: "Browser-side privacy", desc: "Images stay in your browser memory. Zero uploads — verify in DevTools → Network." },
      { title: "Quality preset for lossy formats", desc: "JPG/WebP/AVIF default to 92% quality (high). For more granular control, use Image Compressor." },
    ],
    howTo: [
      { title: "Step 1: Drop image(s)", desc: "Single or batch (multiple files at once). Up to 50MB each." },
      { title: "Step 2: Pick target format", desc: "PNG for lossless/transparency, JPG for max compatibility, WebP for best size/quality balance, AVIF for cutting-edge size." },
      { title: "Step 3: Download", desc: "Single: direct file. Batch: ZIP archive." },
    ],
    useCases: [
      "**Convert PNG screenshots to JPG** for emailing (PNG is often 5-10x larger)",
      "**Modernize old JPG library** to WebP for 30% storage savings",
      "**Convert HEIC for compatibility** — though HEIC to JPG has its own dedicated tool",
      "**Convert GIF animation to WebP** (animated WebP is much smaller than animated GIF)",
      "**Make a transparent logo** by converting JPG → PNG (note: JPG has no transparency, so transparency is lost going JPG → PNG; only useful when source is PNG and you need different format)",
      "**Prepare images for AVIF deployment** for Cloudflare Polish or Vercel Image",
    ],
    faq: [
      { q: "Which format is best?", a: "Depends on use case: PNG for lossless / transparency / pixel art / screenshots. JPG for photographs (smaller, no transparency). WebP for web (smaller than JPG, supports transparency, supported by all major browsers since 2020). AVIF for cutting-edge web (~50% smaller than JPG; Chrome/Firefox/Edge support, Safari partial in 2026)." },
      { q: "Why is my JPG larger than the PNG I converted from?", a: "Rare but happens with images that have very few colors (logos, icons). PNG compresses repeated patterns extremely well; JPG can't compete. For graphics, prefer PNG or WebP. For photos, JPG/WebP win." },
      { q: "Is AVIF supported everywhere?", a: "Chrome (Aug 2020+), Firefox (Oct 2021+), Edge (April 2022+) all support AVIF natively. Safari has partial support since 16.0 (Sept 2022). For broad compatibility, WebP is safer; AVIF for max compression on modern browsers." },
      { q: "Does converting JPG → WebP add visible artifacts?", a: "JPG is already lossy, so converting to WebP at high quality (90+) preserves what's in the JPG. You don't recover quality from compression but you don't add much new artifacts either. For best results, convert from the highest-quality source available (the original PNG/RAW, not a re-encoded JPG)." },
      { q: "Will it batch convert different formats together?", a: "Yes — drop a mix of JPG, PNG, HEIC, etc. and the converter outputs all in your chosen target format." },
      { q: "Does it preserve transparency?", a: "PNG → WebP/AVIF keeps transparency. PNG → JPG fills the transparent area with white (JPG doesn't support transparency). Pickrack defaults to white fill; configurable in v2." },
      { q: "What's the maximum batch size?", a: "Limited by browser memory (~500MB total practical). 100 typical photos process in ~30 seconds." },
      { q: "Does it work offline?", a: "Yes once the page loads. Canvas API is built into every modern browser." },
    ],
    relatedTools: ["image-compressor", "image-resizer", "heic-to-jpg"],
  },

  "heic-to-jpg": {
    slug: "heic-to-jpg",
    h1Subtitle:
      "Convert iPhone HEIC photos to JPG or PNG. Browser-side — your photos stay on your device.",
    intro: [
      "**HEIC to JPG Converter** solves the iPhone photo compatibility problem. iPhones save in HEIC (High Efficiency Image Container) format since iOS 11 (2017) — smaller than JPG but unsupported by many Windows tools, web upload forms, email clients, and older software. Converting to JPG makes photos universally compatible.",
      "Pickrack's converter runs entirely in your browser using the `heic2any` library (MIT license, ~150KB). Photos never upload — important for privacy of personal photos, family snaps, and anything you'd rather not send to a random cloud service.",
      "Free, no signup, batch supported. Output as JPG (smallest, lossy) or PNG (lossless, larger). Quality slider for JPG output. Drop a single photo or 50 at once.",
    ],
    features: [
      { title: "Browser-side privacy", desc: "heic2any library runs in your tab. Photos never upload. Verifiable in DevTools → Network." },
      { title: "Batch convert (up to 50 at once)", desc: "Drop your iPhone export folder. All photos convert in parallel and download as ZIP." },
      { title: "JPG or PNG output", desc: "JPG for smaller files (recommended for photos). PNG for lossless quality (recommended when image will be edited)." },
      { title: "Adjustable JPG quality", desc: "Default 92% (high). 80% for smaller files, 95+ for archival quality." },
      { title: "Works on Windows, Mac, Linux", desc: "Mac/iOS can natively convert HEIC, but Windows has limited support. Pickrack works the same everywhere." },
    ],
    howTo: [
      { title: "Step 1: Drop HEIC file(s)", desc: "Single or batch — up to 50 files, 50MB each." },
      { title: "Step 2: Choose output format + quality", desc: "JPG 92% works for 99% of cases. PNG for lossless." },
      { title: "Step 3: Download", desc: "Single: direct JPG file. Batch: ZIP of converted JPGs." },
    ],
    useCases: [
      "**Email iPhone photos to a Windows user** — Outlook/Gmail Windows preview HEIC poorly",
      "**Upload to a marketplace** (eBay, Etsy, Craigslist) that requires JPG format",
      "**Submit to a job application portal** that doesn't accept HEIC",
      "**Print photos** at a kiosk that only accepts JPG",
      "**Edit in older photo software** (Photoshop CS5, GIMP older versions) that doesn't open HEIC",
      "**Convert iPhone library** for backup to a non-iCloud service",
    ],
    faq: [
      { q: "Why does my iPhone save as HEIC instead of JPG?", a: "iOS 11+ defaults to HEIC for photos because it's ~50% smaller than JPG at same quality. To save as JPG instead: Settings → Camera → Formats → Most Compatible. Existing HEIC photos in your library can be converted with Pickrack." },
      { q: "Is my photo uploaded to your server?", a: "No. heic2any runs entirely in your browser using a JavaScript decoder. Photos process locally — verify in DevTools → Network. Zero requests during conversion." },
      { q: "Does it preserve EXIF metadata (camera, GPS, date)?", a: "Partial — heic2any preserves orientation and basic metadata but may lose some Apple-specific fields. For full metadata preservation, use exiftool locally to copy EXIF from HEIC to JPG after conversion." },
      { q: "What's the maximum file size?", a: "50MB per HEIC file. Live photos (HEIC + MOV) are typically under 5MB. Standard photos are 1-3MB. ProRAW HEIC can be 25-50MB." },
      { q: "Will quality drop converting to JPG?", a: "JPG is lossy, so technically yes — but at 92% quality, the difference is invisible to human eyes. For lossless output, choose PNG (larger files but pixel-perfect)." },
      { q: "Can I convert HEIC live photos (HEIC + MOV)?", a: "v1 converts only the HEIC still image, not the MOV video portion. You'd export the MOV separately from Photos.app or use a desktop tool." },
      { q: "Does it work on mobile browsers?", a: "Yes on Chrome and Safari mobile. Performance on iPhone is fast (heic2any is native to the platform). Useful when you need to convert photos on-the-go before emailing." },
      { q: "Are there iPhone-side alternatives?", a: "Yes — Photos.app on iOS will export to JPG when you AirDrop to a Mac with 'Most Compatible' enabled, or when you Share → Save to Files. But for batch conversion or non-Apple devices, Pickrack is faster." },
    ],
    relatedTools: ["image-compressor", "image-converter", "image-resizer"],
  },

  "background-remover": {
    slug: "background-remover",
    h1Subtitle:
      "Remove image background using AI directly in your browser. No upload, no signup, no daily limit.",
    intro: [
      "**Background Remover** isolates the subject of an image, replacing the background with transparency. Used for product photography, profile pictures, social media graphics, presentation visuals, and design mockups.",
      "Pickrack uses [@imgly/background-removal](https://github.com/imgly/background-removal-js), an open-source AI model that runs in your browser via WebAssembly + ONNX. **Your image never uploads** — the AI model (~30MB) downloads once and processes locally. Compare with remove.bg which charges $0.20/image after a tiny free tier.",
      "Free, no signup, no daily limit. First load downloads the model (~30MB, takes 10-30 seconds depending on connection); subsequent uses are instant from browser cache. Output: PNG with transparent background, ready to drop into any design.",
    ],
    features: [
      { title: "Browser-side AI (no upload)", desc: "ONNX model runs locally via WebAssembly. Verify in DevTools → Network — only the model downloads (once, cached); your image never uploads." },
      { title: "Free, unlimited", desc: "remove.bg gives 1 free image/month and charges $0.20/image after. Pickrack is unlimited because there's no server processing." },
      { title: "Works on people, products, animals", desc: "Trained on diverse imagery. Best results: clear subject-vs-background contrast. Hair edges work well; complex foliage edges work less well (industry-wide AI limitation)." },
      { title: "PNG output with transparency", desc: "Drop directly into Figma, Photoshop, Canva, Keynote — transparent areas stay transparent." },
      { title: "Privacy critical for personal photos", desc: "Profile pics, personal product shots, family photos — never leaves your device." },
    ],
    howTo: [
      { title: "Step 1: Drop your image", desc: "JPG, PNG, WebP up to 20MB. First-time use downloads the AI model (~30MB) — wait 10-30 seconds." },
      { title: "Step 2: Wait for processing", desc: "Subsequent images process in 5-15 seconds (model is cached after first download)." },
      { title: "Step 3: Download PNG", desc: "Output is PNG with transparent background. Drop into your design tool or save with a custom background applied." },
    ],
    useCases: [
      "**Product photos for e-commerce** — clean white background or transparent PNG for catalog overlays",
      "**Profile pictures** — remove busy background to focus on the person",
      "**Slide deck graphics** — drop a person/object onto any slide background without a square border",
      "**Social media posts** — Instagram-style isolated subject on colored background",
      "**Mockups + design comps** — quickly extract elements for visual sketches",
      "**Resume photos** — clean background for professional documents",
    ],
    faq: [
      { q: "Is this really running in my browser?", a: "Yes. Open DevTools → Network. You'll see the model files download from a CDN once (~30MB), then cached in IndexedDB. After that, processing happens locally with zero network requests. Model: ONNX format, runs via @imgly/background-removal package using WebAssembly." },
      { q: "Why is the first use slow?", a: "30MB model downloads to your browser cache. Subsequent uses load from cache — much faster. If you clear browser cache, it'll re-download." },
      { q: "How is this different from remove.bg?", a: "remove.bg uploads your image to their servers, processes there, returns the result. Charges per image after free tier. Pickrack runs the SAME class of AI model in your browser — never uploads, no charge, no daily limit. Quality is roughly comparable for typical use cases (remove.bg may edge out for complex hair/fur, due to their proprietary model fine-tuning)." },
      { q: "Why does the edge sometimes look ragged on hair or fur?", a: "AI background removal is hardest at fine edges (hair, fur, foliage, lace). Even premium tools like Adobe Photoshop's 'Remove Background' or remove.bg struggle here. For hero images requiring perfection, manual touch-up in Photoshop or GIMP after removal is standard." },
      { q: "Does it work for transparent backgrounds (PNG with alpha channel)?", a: "Yes — input can be PNG with transparency. The model identifies the subject and outputs new transparency around it (replacing the original background, even if the original was already transparent)." },
      { q: "Maximum file size?", a: "20MB recommended. Larger images take more memory and processing time. Resize to 2000px max dimension before processing for fastest results." },
      { q: "Does it strip EXIF metadata?", a: "Yes — output is fresh PNG with no metadata. Privacy benefit. To restore, copy EXIF from original using exiftool after processing." },
      { q: "Can I use this for commercial work?", a: "Yes — the @imgly/background-removal library is MIT licensed. The output PNG is yours. No license restrictions from Pickrack." },
    ],
    relatedTools: ["image-compressor", "image-resizer", "image-converter"],
  },

  "image-resizer": {
    slug: "image-resizer",
    h1Subtitle:
      "Resize JPG, PNG, WebP, AVIF images to any dimensions. Browser-side, no upload, no quality loss for downscaling.",
    intro: [
      "**Image Resizer** is the Swiss-army knife for everyday image work — uploading a profile photo to a service that demands exactly 400×400, shrinking a 4000px screenshot for an email, or matching the dimensions specified by a job application portal.",
      "Pick Rack's **Image Resizer** runs entirely in your browser using the Canvas API. Your image is loaded into a `<canvas>`, resized with high-quality bilinear interpolation, and re-encoded — all without leaving your device. No upload, no server processing, no data retention. Free, no signup, no watermark.",
      "Supports JPG, PNG, WebP, and AVIF. Lock aspect ratio toggle prevents distortion. Output format can be the same as input or converted (great for swapping a heavy PNG screenshot to a light WebP).",
    ],
    features: [
      { title: "Browser-side privacy", desc: "Image stays on your device. Canvas API does the resize, then encodes to JPG/PNG/WebP — never touches a server." },
      { title: "Aspect ratio lock", desc: "Toggle on to keep proportions; off to crop or stretch to exact dimensions." },
      { title: "Multi-format support", desc: "Input: JPG, PNG, WebP, AVIF, GIF. Output: same format or convert (WebP usually gives best size)." },
      { title: "High-quality downscale", desc: "Browser bilinear/lanczos resize. For typical web use, output is visually indistinguishable from professional desktop apps." },
      { title: "Free, no watermark", desc: "Output image has zero added marks. No premium tier, no daily quota." },
    ],
    howTo: [
      { title: "Step 1: Drop your image", desc: "Drop a JPG/PNG/WebP/AVIF (up to ~50MB practical) into the upload zone, or click to browse." },
      { title: "Step 2: Set width and height", desc: "Type new dimensions in pixels. Toggle aspect-ratio lock if you want proportions preserved." },
      { title: "Step 3: Choose output format", desc: "Keep the original format or switch to WebP for ~30% smaller files at same quality." },
      { title: "Step 4: Download", desc: "Click Resize, then Download. The processed image is saved to your device." },
    ],
    useCases: [
      "**Match a profile photo size** required by LinkedIn (400×400), Slack, GitHub",
      "**Shrink a screenshot** before emailing — 4K screenshots are usually 8MB, resized 1080p is ~500KB",
      "**Match a job application portal** that demands exact dimensions",
      "**Prepare a thumbnail** for YouTube (1280×720), blog post, or marketplace listing",
      "**Resize photos for a passport application** (often 600×600 px requirement)",
      "**Compress a logo** for a website without uploading to TinyPNG",
    ],
    faq: [
      { q: "Is my image uploaded to your server?", a: "No. The image stays in your browser memory. Canvas API does the resize locally, you click Download, and the file goes to your device. Verify in DevTools → Network tab — no upload requests fire." },
      { q: "What's the maximum image size I can resize?", a: "Practical limit is ~50MB or ~10000×10000 pixels — beyond that, browsers may slow down or run out of memory. For larger images, use a desktop app like ImageMagick." },
      { q: "Will the output have any quality loss?", a: "Downscaling (e.g., 4000×3000 → 1920×1440) is essentially lossless to the human eye. Upscaling produces visible blur — for AI upscaling, see Image Upscaler tool. JPG re-encoding adds minor artifacts; choose WebP or PNG for lossless re-encode." },
      { q: "Does this preserve EXIF metadata (camera, GPS)?", a: "No — Canvas API resize strips EXIF. This is actually a privacy benefit: your camera/location data is removed from the output. To preserve EXIF, use a desktop tool like ImageMagick or `exiftool`." },
      { q: "Can I resize multiple images at once?", a: "v1 supports one at a time. Batch resize is on the roadmap. For now, you can run multiple browser tabs in parallel — each is independent." },
      { q: "Why is my output JPG larger than expected?", a: "JPG quality defaults to 92 (high). For smaller files, change output to WebP (~30% smaller) or PNG (lossless, larger but no artifacts). For aggressive compression, also use Image Compressor afterward." },
      { q: "Does this work on mobile?", a: "Yes, on any modern mobile browser (Chrome, Safari, Firefox). For very large images (>20MB), mobile may slow down — desktop is faster." },
      { q: "Can I crop instead of resize?", a: "Use Image Cropper (coming soon). Image Resizer scales the entire image proportionally; cropping cuts a region." },
    ],
    relatedTools: ["jpg-to-pdf", "pdf-to-jpg"],
  },

  "base64-encoder": {
    slug: "base64-encoder",
    h1Subtitle:
      "Encode and decode Base64 strings instantly. Browser-side — no upload. Free, no signup.",
    intro: [
      "**Base64 Encoder/Decoder** is essential for developers working with API tokens, data URIs, JWT payloads, email attachments (MIME), or any system that transmits binary over text-only channels.",
      "Pickrack's Base64 tool runs entirely in your browser using native `btoa()` and `atob()` (with proper Unicode handling for non-ASCII text). Tokens, secrets, and data never leave your tab — verifiable in DevTools → Network.",
      "Free, no signup, no rate limit. Supports text mode (paste a string) and file mode (upload up to 10MB to encode binary as Base64).",
    ],
    features: [
      { title: "Text mode (instant)", desc: "Paste any text — UTF-8 properly encoded for Vietnamese, Chinese, Arabic, emoji. Decode reverses it back." },
      { title: "File mode", desc: "Upload an image or small file (up to 10MB) — get the data URI ready to embed in HTML, CSS, or JSON." },
      { title: "Auto-detect input direction", desc: "Type into either box; the other side updates live. Encode/decode based on which field you're editing." },
      { title: "Browser-side privacy", desc: "btoa/atob are native JavaScript APIs. Zero network calls during encoding — open DevTools to verify." },
      { title: "URL-safe variant", desc: "Toggle URL-safe Base64 (replace +/= with -_) for use in URLs, JWT tokens, or filenames." },
    ],
    howTo: [
      { title: "Step 1: Paste text or drop a file", desc: "Type into the input box, or click File mode and drop a file." },
      { title: "Step 2: Choose direction", desc: "Encode (text → Base64) or Decode (Base64 → text). Auto-detected for typical inputs." },
      { title: "Step 3: Copy the result", desc: "One-click copy. Use it in your code, URL, or config." },
    ],
    useCases: [
      "**Inspect a JWT payload** — copy the middle segment (between dots), Base64-decode to see claims",
      "**Embed a small image** as a data URI in CSS or HTML (`url(data:image/png;base64,...)`)",
      "**Encode credentials** for HTTP Basic Auth header (`Authorization: Basic base64(user:pass)`)",
      "**Decode an email attachment** that arrived as Base64 in a raw email source",
      "**Pass binary data** through a JSON-only API by Base64-encoding the payload",
      "**Test a webhook** that expects Base64-encoded body content",
    ],
    faq: [
      { q: "Is my text uploaded?", a: "No. btoa() and atob() are native JavaScript functions running in your browser. Verify in DevTools → Network — no requests fire during encoding/decoding." },
      { q: "Why does it fail for some Unicode characters?", a: "Native btoa() only handles Latin-1. For Unicode text (Vietnamese, Chinese, emoji), Pickrack uses TextEncoder + btoa pattern — full UTF-8 support." },
      { q: "What's the maximum file size?", a: "10MB practical limit. Beyond that, browsers may slow down. Base64 inflates size by ~33% so a 10MB file becomes ~13MB of text." },
      { q: "What's URL-safe Base64?", a: "Standard Base64 uses +, /, = which need percent-encoding in URLs. URL-safe variant replaces them with -, _, no padding. Used in JWT tokens." },
      { q: "Can I decode Base64-encoded files (images, PDFs)?", a: "Yes — paste the Base64 string in decode mode. Output is a binary blob; download as a file. For data URIs, paste only the part after the comma." },
      { q: "Is Base64 encryption?", a: "No. Base64 is encoding — fully reversible without a key. Don't use it to 'hide' secrets. For encryption, use AES via crypto.subtle." },
      { q: "Why does my decoded text look garbled?", a: "Either the Base64 was URL-safe (use URL-safe toggle) or it included padding-related bytes. Some Base64 strings are doubly encoded — try decode twice." },
      { q: "Does this support binary file Base64?", a: "Yes. File mode reads the file as binary and Base64-encodes the bytes. Output is a data URI with mime-type prefix or raw Base64 — your choice." },
    ],
    relatedTools: ["jwt-decoder", "hash-generator", "json-formatter"],
  },

  "jwt-decoder": {
    slug: "jwt-decoder",
    h1Subtitle:
      "Decode JWT header and payload. Inspect claims, expiry, and structure. Browser-side — tokens never leave your tab.",
    intro: [
      "**JWT Decoder** is critical for backend devs and API integrators. JWTs (JSON Web Tokens) carry claims about a user (ID, role, expiry) — when something breaks in auth, you need to inspect the payload to see what the token actually contains.",
      "Pickrack's decoder splits the JWT on dots, Base64-decodes header and payload, parses the JSON, and shows you the claims. **All in your browser** — your tokens (which often contain user IDs, session info, or service-account secrets) never upload anywhere. Verify in DevTools → Network.",
      "Free, no signup. The tool also flags expired tokens (exp claim in past) and shows time-until-expiry. Does NOT verify signatures — that requires the secret/public key, out of scope for a decode-only tool.",
    ],
    features: [
      { title: "Browser-side only", desc: "Token splits, decodes, and JSON-parses in your tab. Zero network calls during decoding." },
      { title: "Header + payload + signature", desc: "Three sections shown side-by-side. Header reveals algorithm (alg) and key ID (kid). Payload has the claims. Signature shown but not verified." },
      { title: "Expiry detection", desc: "Highlights `exp`, `nbf`, `iat` claims and shows time-until-expiry. Red badge for expired tokens." },
      { title: "Standard claims explained", desc: "Hovers explain `iss` (issuer), `sub` (subject), `aud` (audience), `jti` (JWT ID) — useful when debugging unfamiliar tokens." },
      { title: "URL-safe Base64 handled", desc: "JWTs use URL-safe Base64 with no padding. The decoder normalizes (- → +, _ → /, adds = padding) before decoding." },
    ],
    howTo: [
      { title: "Step 1: Paste your JWT", desc: "Format: xxx.yyy.zzz (3 segments separated by dots). Whitespace and Bearer prefix auto-stripped." },
      { title: "Step 2: Inspect the header and payload", desc: "Header shows the algorithm. Payload shows your claims, including expiry status." },
      { title: "Step 3: Use claims to debug", desc: "Check `exp` is in the future, `iss` matches your auth provider, `sub` matches the user ID you expect." },
    ],
    useCases: [
      "**Debug a 401 Unauthorized** — paste the failing JWT to see if it's expired or has the wrong audience",
      "**Verify token claims** during local dev — confirm `role: admin` is actually in the payload before testing privileged endpoints",
      "**Inspect a third-party JWT** (Auth0, Cognito, Okta) to see what custom claims they're emitting",
      "**Check token TTL** — see how long until your auth tokens expire",
      "**Read a refresh token's claims** to understand the rotation policy",
      "**Confirm key rotation** by inspecting `kid` (key ID) header field",
    ],
    faq: [
      { q: "Does this verify the JWT signature?", a: "No — only decodes. Signature verification requires the secret (HS256) or public key (RS256/ES256), which would mean uploading or fetching keys. Pickrack stays decode-only for safety. Use jwt.io with caution (server-side) or JWT libraries in your code (jose, jsonwebtoken) for verification." },
      { q: "Are JWTs encrypted?", a: "Standard JWTs are SIGNED but not encrypted — the payload is Base64 (not encrypted) and readable by anyone. Don't put secrets in JWT claims. JWE (JSON Web Encryption) is the encrypted variant — more rare." },
      { q: "Is my token sent to your server?", a: "No. Splitting on dots and Base64-decoding happens in your browser. Verify in DevTools → Network — zero network calls during decoding." },
      { q: "Why does my token decode to garbled text?", a: "Either it's not a real JWT (some 'tokens' are just opaque random strings) or the Base64 segments are corrupted. Check format: 3 segments separated by 2 dots, each segment is URL-safe Base64." },
      { q: "What does the alg field mean?", a: "The signing algorithm: HS256 (symmetric, shared secret), RS256/ES256 (asymmetric, public key). HS256 is common for backend services; RS256 for OAuth/OIDC providers." },
      { q: "Can I decode JWE (encrypted JWTs)?", a: "Not without the decryption key. Pickrack handles JWS (signed) only. JWE has 5 segments instead of 3 and requires the appropriate key." },
      { q: "What if my JWT is in the URL or auth header?", a: "Strip the `Bearer ` prefix or URL-decode first. The decoder accepts the raw 3-segment string." },
      { q: "Is exp in seconds or milliseconds?", a: "JWT spec uses Unix timestamp in SECONDS. The decoder converts to local time for display. Some libraries (looking at you, JavaScript) use milliseconds — double-check your backend." },
    ],
    relatedTools: ["base64-encoder", "json-formatter", "hash-generator"],
  },

  "hash-generator": {
    slug: "hash-generator",
    h1Subtitle:
      "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files. Web Crypto API, browser-side.",
    intro: [
      "**Hash Generator** computes cryptographic hashes — used for file integrity verification, password hashing (with proper salt), data deduplication, and content-addressable storage like Git's SHA-1.",
      "Pickrack uses the **Web Crypto API** (`crypto.subtle.digest`) — the same primitive that powers TLS, SSH, and disk encryption. SHA-1, SHA-256, and SHA-512 are computed natively. MD5 is provided via a small JavaScript implementation for legacy compatibility (don't use MD5 for security — only for non-cryptographic checksums).",
      "Free, no signup. Text mode for instant strings. File mode for files up to 100MB — useful for verifying downloads against published checksums.",
    ],
    features: [
      { title: "Four algorithms", desc: "MD5, SHA-1, SHA-256, SHA-512. All computed on every input — copy whichever you need." },
      { title: "Text and file modes", desc: "Paste text (UTF-8) or drop a file (up to 100MB). Files are read in chunks to avoid memory spikes." },
      { title: "Browser-side privacy", desc: "Web Crypto API runs locally. Files stay in browser memory; nothing uploads. Even sensitive content (private keys, credentials) is safe." },
      { title: "Live hashing as you type", desc: "Text mode updates hashes on every keystroke (debounced). Useful for testing exact-match scenarios." },
      { title: "Hex output, copy-to-clipboard", desc: "All hashes shown as lowercase hex. Click copy on any algorithm." },
    ],
    howTo: [
      { title: "Step 1: Paste text or drop a file", desc: "Text mode for strings, File mode for downloaded files (verify integrity)." },
      { title: "Step 2: Read the four hashes", desc: "MD5, SHA-1, SHA-256, SHA-512 all displayed simultaneously." },
      { title: "Step 3: Copy or compare", desc: "Compare against the published hash from a download page, GitHub release, or git log." },
    ],
    useCases: [
      "**Verify a downloaded file** matches the publisher's checksum (e.g., Linux ISO downloads)",
      "**Compute Git-style SHA-1** of a file to find it in object storage",
      "**Generate content-addressable IDs** (SHA-256 of a JSON payload as a unique key)",
      "**Check password hash format** for legacy systems still using MD5/SHA-1 (security audit context)",
      "**Compute Docker image digest** SHA-256 manually for verification",
      "**Generate stable test fixtures** by hashing input as a deterministic identifier",
    ],
    faq: [
      { q: "Is my file uploaded?", a: "No. Web Crypto API runs in your browser. File mode reads via FileReader in chunks; bytes never leave your tab. Verify in DevTools → Network." },
      { q: "Why MD5 if it's broken?", a: "MD5 is broken for cryptographic purposes (collision attacks since 2004) but still common for non-security uses: deduplication, change detection, legacy software compatibility. Pickrack provides it labeled — you decide if it's appropriate." },
      { q: "Why is SHA-1 still here?", a: "SHA-1 is theoretically broken (Google demonstrated a collision in 2017) but still used by Git for content addressing and some legacy systems. Pickrack provides it for those cases. For new security work, use SHA-256 or SHA-512." },
      { q: "Are these hashes secure for password storage?", a: "NO. Plain MD5/SHA-1/SHA-256/SHA-512 are NOT for password storage. Use bcrypt, scrypt, or Argon2 with salt. Pickrack does not provide those — install bcryptjs or argon2-browser in your code." },
      { q: "What's the maximum file size?", a: "100MB practical limit. Beyond that, browsers may run out of memory. Files >100MB should be hashed with a desktop tool (sha256sum on Linux, certUtil on Windows)." },
      { q: "Why do my hashes differ from another tool?", a: "Common cause: line-ending differences (\\n vs \\r\\n), trailing whitespace, BOM markers. Pickrack hashes the bytes you paste verbatim. Match line-endings between source and Pickrack input for exact comparison." },
      { q: "What about SHA-3 / Keccak?", a: "Web Crypto API supports SHA-256/384/512 but not SHA-3. For SHA-3, use a JavaScript library like js-sha3. Pickrack may add it later." },
      { q: "Can I verify a Bitcoin transaction hash?", a: "Bitcoin uses double SHA-256 (SHA-256 of SHA-256). To replicate, hash with SHA-256, then hash the result again. v2 of Pickrack may add a 'double SHA-256' option." },
    ],
    relatedTools: ["uuid-generator", "base64-encoder", "password-generator"],
  },

  "uuid-generator": {
    slug: "uuid-generator",
    h1Subtitle:
      "Generate cryptographic UUID v4 — single or up to 1000 in bulk. Browser crypto.randomUUID.",
    intro: [
      "**UUID Generator** produces universally unique identifiers — used for database primary keys, distributed systems, API tracking IDs, and anything needing collision-resistant IDs without coordination.",
      "Pickrack uses the browser's native `crypto.randomUUID()` — cryptographically random, RFC 4122 v4 compliant, and supported in all modern browsers since 2022. Generate a single UUID or bulk-generate up to 1000 at once for testing fixtures.",
      "Free, no signup, no rate limit. Bulk-copy as a list, or download as .txt. Format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` where x is random hex and y is from {8,9,a,b}.",
    ],
    features: [
      { title: "crypto.randomUUID() native", desc: "Uses CSPRNG — same entropy source as TLS, SSH. Each UUID has 122 bits of randomness. Collision probability is negligible (1 in 2^122)." },
      { title: "Single or bulk (1-1000)", desc: "Generate one for a config file, or 1000 for a test database fixture. Slider or input for bulk count." },
      { title: "Multiple formats", desc: "Standard hyphenated (default), uppercase, no-hyphen, braced ({uuid}), as URN (urn:uuid:...). Toggle live." },
      { title: "Copy + download", desc: "One-click copy of single UUID. Bulk: copy all, or download as .txt for import into databases." },
      { title: "Browser-side, no logging", desc: "UUIDs are not stored or logged. Each refresh generates fresh values." },
    ],
    howTo: [
      { title: "Step 1: Click Generate", desc: "Default: 1 UUID. Adjust count slider for bulk." },
      { title: "Step 2: Choose format", desc: "Standard UUID is the default; toggle for uppercase, no-hyphens, or other variants." },
      { title: "Step 3: Copy or download", desc: "Single UUIDs auto-copy. Bulk: Copy all to clipboard or Download as .txt." },
    ],
    useCases: [
      "**Database primary keys** — UUID v4 for distributed systems where you can't coordinate sequential IDs",
      "**Test fixture data** — bulk-generate 100 IDs for inserting into a staging database",
      "**API request tracking** — generate a unique ID per request for log correlation",
      "**Idempotency keys** — for retryable POST requests in payment APIs (Stripe, etc.)",
      "**Session tokens** for non-security identifiers (real session tokens need crypto-strength)",
      "**File names** in S3/GCS to avoid collisions — UUID-prefixed paths",
    ],
    faq: [
      { q: "Is crypto.randomUUID secure?", a: "Yes. It uses the same CSPRNG as crypto.getRandomValues — sourced from OS-level entropy (hardware noise, kernel pool). 122 random bits. Collision probability after 1 billion UUIDs is ~10^-18." },
      { q: "What's the difference between v4 and v1/v3/v5?", a: "v4 = random (most common). v1 = timestamp-based (leaks generation time). v3/v5 = namespace-based (deterministic from input). Pickrack outputs v4. For v5/3, use a library like uuid npm package." },
      { q: "Are these UUIDs cryptographically random?", a: "Yes — crypto.randomUUID uses the cryptographic RNG (same as TLS). Pickrack does not generate v4 from Math.random which would be insecure." },
      { q: "Can two people generate the same UUID?", a: "Mathematically possible but astronomically unlikely (~1 in 2^122). Generate 1 billion per second on every device on Earth for a million years; collision still unlikely." },
      { q: "What's the maximum bulk count?", a: "1000 per request, capped to keep UI responsive. For larger batches, use a CLI tool (`uuidgen` on Linux/Mac, `[guid]::NewGuid()` PowerShell)." },
      { q: "Why are some UUIDs lowercase and some uppercase?", a: "RFC 4122 specifies lowercase. Some legacy systems (especially Windows) use uppercase. Pickrack defaults to lowercase; toggle for uppercase." },
      { q: "Are these compatible with PostgreSQL UUID type?", a: "Yes. Postgres accepts both hyphenated and non-hyphenated formats. Insert directly: `INSERT INTO t (id) VALUES ('<uuid>')`." },
      { q: "Does it work offline?", a: "Yes once the page loads. crypto.randomUUID is built into modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)." },
    ],
    relatedTools: ["password-generator", "hash-generator", "base64-encoder"],
  },

  "regex-tester": {
    slug: "regex-tester",
    h1Subtitle:
      "Test regular expressions live with match highlighting, capture groups, and JavaScript flags.",
    intro: [
      "**Regex Tester** is essential for any developer who writes regular expressions — for input validation, log parsing, search-and-replace, or scraping. Iteration speed matters: change the pattern, see matches highlight live, fix edge cases without redeploying.",
      "Pickrack's regex tester uses native JavaScript `RegExp`. Type a pattern + flags, paste sample text, see matches highlighted in real-time with capture groups labeled. Supports all JS regex flags: `g` (global), `i` (case-insensitive), `m` (multiline), `s` (dotall), `u` (Unicode), `y` (sticky).",
      "Free, no signup. Note: JavaScript regex differs from PCRE (Perl/PHP) and Python `re` — lookbehind, named groups, atomic groups have varying support. Pickrack reflects pure JS regex behavior (use this for browser/Node.js code).",
    ],
    features: [
      { title: "Live highlighting", desc: "Matches highlighted as you type. Capture groups labeled with index or name (for named captures `(?<name>...)`)." },
      { title: "All JS flags supported", desc: "g i m s u y — toggle each. Tooltip explains what each flag does." },
      { title: "Match count + index", desc: "Total match count shown. Each match displayed with its starting offset." },
      { title: "Capture groups breakdown", desc: "For each match, see all capture groups with their values. Named groups labeled." },
      { title: "Common pattern library", desc: "Quick-load presets: email, URL, IPv4, IPv6, phone, date — to start from a known-working pattern." },
    ],
    howTo: [
      { title: "Step 1: Enter your regex pattern", desc: "Type the pattern (without leading/trailing slashes) and toggle flags." },
      { title: "Step 2: Paste test text", desc: "Multi-line input supported. Matches highlight as you type." },
      { title: "Step 3: Iterate", desc: "Adjust pattern/flags. Use the capture groups output to refine extractions." },
    ],
    useCases: [
      "**Validate email format** with anchored pattern + edge cases",
      "**Extract URLs** from a block of text using non-greedy matchers",
      "**Parse log lines** to pull out timestamps, error codes, status messages",
      "**Replace placeholders** in templates ({{name}} → John) — preview first",
      "**Validate phone numbers** in a specific country format",
      "**Find duplicate words** with backreferences (`\\b(\\w+)\\b.*\\b\\1\\b`)",
    ],
    faq: [
      { q: "Why does my pattern from Stack Overflow not work?", a: "Stack Overflow answers often use PCRE (Perl/PHP) or Python regex. JavaScript regex has limitations: no atomic groups, no possessive quantifiers, limited lookbehind support pre-Safari 16. Test on Pickrack to confirm JS compatibility." },
      { q: "Does this support lookbehind?", a: "Yes — modern JavaScript (ES2018+) supports `(?<=...)` positive and `(?<!...)` negative lookbehind. Older browsers may not. Pickrack runs in your browser, so Chrome/Firefox/Safari recent versions all support it." },
      { q: "What about named capture groups?", a: "Yes. `(?<year>\\d{4})` works in modern JS. Output shows the group by name." },
      { q: "Why is my regex matching fewer/more than expected?", a: "Common gotchas: `g` flag needed for all-matches (default returns first match only). Anchors `^` and `$` only work as expected with `m` (multiline) flag. `.` doesn't match newlines without `s` (dotall) flag." },
      { q: "Can I test PCRE / Python / Go regex here?", a: "No — Pickrack uses JavaScript RegExp. For PCRE, try regex101.com (separate dropdown for flavor). For Go, RE2 has fewer features (no backreferences, no lookbehind). Pickrack reflects JS behavior only." },
      { q: "Is there a regex security risk to be aware of?", a: "Yes — ReDoS (Regular Expression Denial of Service). Pathological patterns (e.g., `(a+)+`) can hang the engine on adversarial input. Pickrack runs your regex in YOUR browser, so a bad regex only freezes your tab. For production, validate regex performance with safe-regex npm or use RE2 engines." },
      { q: "What flags should I use most?", a: "`g` for global match (most common). `i` for case-insensitive. `m` for line-by-line anchoring. `s` if your pattern needs `.` to match newlines. `u` for proper Unicode (essential for emoji/non-Latin scripts)." },
      { q: "Does it support multiline regex with comments?", a: "JavaScript doesn't have a `x` (extended/verbose) flag. For complex patterns, build them as a string with comments and pass to `new RegExp(pattern, flags)` in your code. Pickrack tests the final compiled pattern." },
    ],
    relatedTools: ["json-formatter", "case-converter", "slug-generator"],
  },

  "json-formatter": {
    slug: "json-formatter",
    h1Subtitle:
      "Format, validate, and minify JSON instantly in your browser. Detects errors with line numbers. Free, no tracking.",
    intro: [
      "**JSON Formatter** is essential for anyone working with APIs, config files, or data interchange — making minified JSON readable, validating syntax before sending a request, or minifying a payload before deployment.",
      "Pick Rack's **JSON Formatter** is browser-side JavaScript: `JSON.parse` validates, `JSON.stringify` with indentation prettifies, and a custom error pointer shows exactly which character failed. **Your JSON never leaves your tab** — critical when debugging payloads with API tokens, user PII, or proprietary data.",
      "Free, no signup, no rate limit. Most online JSON formatters secretly send your data to their server for analytics — verify this in DevTools → Network. Pickrack runs zero network calls during formatting.",
    ],
    features: [
      { title: "Zero-network privacy", desc: "Formatting and validation happen entirely client-side. Open DevTools → Network tab and watch — no requests fire." },
      { title: "Error highlighting with line numbers", desc: "Invalid JSON shows the exact line and character offset where parsing failed. Faster than reading raw error messages." },
      { title: "Adjustable indent (2/4/8 spaces, tabs)", desc: "Match your team's style. Re-format on every paste." },
      { title: "Minify mode", desc: "Strip whitespace for production payloads. Useful for cURL commands, environment variables, or copy-paste into a config." },
      { title: "Sort keys alphabetically (optional)", desc: "Diff two JSON objects more easily by sorting keys before comparison." },
    ],
    howTo: [
      { title: "Step 1: Paste your JSON", desc: "Paste raw JSON (minified or formatted) into the input area." },
      { title: "Step 2: Choose indent + options", desc: "Pick 2 or 4 spaces, toggle minify, sort keys if needed." },
      { title: "Step 3: Copy formatted output", desc: "Output appears immediately. Click Copy to save to clipboard." },
    ],
    useCases: [
      "**Debug an API response** by formatting the raw JSON you got from cURL or a screenshot",
      "**Validate a config file** before committing — catch missing commas, trailing commas, unquoted keys",
      "**Minify a payload** before pasting into an environment variable or config string",
      "**Inspect a JWT payload** after Base64-decoding the middle segment",
      "**Compare two API responses** by formatting both with sorted keys, then diffing",
      "**Clean up GraphQL or REST examples** before pasting into documentation",
    ],
    faq: [
      { q: "Is my JSON sent to your server?", a: "No. All parsing, formatting, and validation runs in your browser using native JSON.parse and JSON.stringify. Verify in DevTools → Network — zero requests during formatting." },
      { q: "Does this support JSON5, JSONC (with comments), or JSON Lines?", a: "v1 supports strict JSON only — no comments, no trailing commas, no unquoted keys. JSON5 / JSONC support is on the roadmap. For JSON Lines (NDJSON), paste one object at a time, or split on newlines first." },
      { q: "What's the maximum size?", a: "Practical limit is ~50MB or 10 million rows. Browsers handle this fine; very large files may slow the textarea — paste-test before committing." },
      { q: "Why does it show 'Unexpected token' errors?", a: "JSON is strict: keys must be double-quoted, no trailing commas, no comments, true/false/null lowercase, no NaN/Infinity. The error message points to the failing position." },
      { q: "Can I see a tree view instead of plain text?", a: "v1 is text-only. Tree view (collapsible nested objects) is on the roadmap. For complex nested JSON, JSON5 + a desktop editor like VS Code with the JSON extension may be more comfortable." },
      { q: "Does it preserve key order?", a: "Yes by default. Toggle Sort Keys to alphabetize. JSON spec allows arbitrary order, so both are valid." },
      { q: "What about JSON Schema validation?", a: "Out of scope for this tool — try jsonlint.com or ajv-cli for schema validation. Pickrack's tool only checks syntax." },
      { q: "Can I beautify minified JSON like JSON.stringify(obj, null, 2)?", a: "Yes — that's the default formatting. Indent value is configurable." },
    ],
    relatedTools: [],
  },

  "case-converter": {
    slug: "case-converter",
    h1Subtitle:
      "Convert between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE.",
    intro: [
      "**Case Converter** is a daily-use tool for writers, developers, and editors. Headlines need Title Case. Function names use camelCase. Database columns use snake_case. URL paths use kebab-case. Constants use CONSTANT_CASE. Manually retyping is tedious — paste once, get every variant.",
      "Pickrack's converter shows all 8 case variants simultaneously. Live update as you type. Browser-side. Free, no signup.",
      "Unicode-aware: handles Vietnamese diacritics, accented Latin, and most non-Latin scripts. For Chinese/Japanese/Korean (no concept of case), output equals input.",
    ],
    features: [
      { title: "8 case variants live", desc: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE — all visible at once." },
      { title: "One-click copy each", desc: "Hover any variant and click copy. Faster than retyping or using IDE shortcuts." },
      { title: "Unicode-aware", desc: "Vietnamese đ → Đ correctly. Spanish ñ stays as ñ. German ß → SS in uppercase mode." },
      { title: "Smart Title Case", desc: "Capitalizes first letter of each word EXCEPT short conjunctions (the, of, a, and, or, but, in, on) per AP/Chicago style." },
      { title: "Browser-side", desc: "Pure JavaScript string ops. No tracking, no upload, no signup." },
    ],
    howTo: [
      { title: "Step 1: Paste or type your text", desc: "Single line or multi-paragraph input both work." },
      { title: "Step 2: View all 8 case variants instantly", desc: "Live update as you type. No 'Convert' button needed." },
      { title: "Step 3: Copy the variant you need", desc: "One click on the copy button next to any variant." },
    ],
    useCases: [
      "**Convert a function name** to a database column: `getUserName` → `get_user_name`",
      "**Make a URL slug** from a title: `My Blog Post` → `my-blog-post`",
      "**Format a constant** for code: `app environment` → `APP_ENVIRONMENT`",
      "**Apply Title Case** to a headline before publishing",
      "**Lowercase emails** from a CSV before deduplication",
      "**Convert kebab-case CSS class** to camelCase for React style props: `font-size` → `fontSize`",
    ],
    faq: [
      { q: "What's the difference between Title Case and Sentence case?", a: "Title Case capitalizes the first letter of each major word: 'My Blog Post About Cats'. Sentence case capitalizes only the first letter and proper nouns: 'My blog post about cats'. Pickrack provides both." },
      { q: "How does Smart Title Case differ from naive Title Case?", a: "Naive: capitalizes EVERY word, including 'the', 'of', 'and'. Smart: keeps short conjunctions and prepositions lowercase per AP/Chicago style: 'A Tale of Two Cities' (not 'A Tale Of Two Cities')." },
      { q: "Does it preserve line breaks and formatting?", a: "Yes. Multi-line input keeps line breaks. Markdown bold/italic syntax is preserved unchanged (only the text within is case-converted)." },
      { q: "Why is camelCase 'getUserName' but PascalCase 'GetUserName'?", a: "Convention: camelCase starts lowercase (used for variables, methods in Java/JS). PascalCase starts uppercase (used for class names, types). Pickrack provides both — pick what your codebase uses." },
      { q: "What about Vietnamese tone marks (dấu)?", a: "Tone marks are preserved through case conversion. 'tiếng việt' → 'Tiếng Việt' in Title Case. For removing diacritics, use Slug Generator instead." },
      { q: "Can I convert to alternating case (aLtErNaTiNg)?", a: "v1 has 8 case variants (no alternating). It's a common joke/spongebob style — may add as a 9th variant." },
      { q: "Does it work with HTML/Markdown formatting?", a: "Yes — only text content is converted; HTML tags and markdown syntax are preserved. Useful for converting blog post titles without breaking formatting." },
      { q: "What's CONSTANT_CASE used for?", a: "Programming constants — environment variable names (DATABASE_URL), enum values, configuration keys. Common in Python, Java, Go, Rust." },
    ],
    relatedTools: ["slug-generator", "word-counter", "lorem-ipsum"],
  },

  "lorem-ipsum": {
    slug: "lorem-ipsum",
    h1Subtitle:
      "Generate Lorem Ipsum placeholder text — words, sentences, or paragraphs. Adjustable length.",
    intro: [
      "**Lorem Ipsum Generator** produces classic placeholder text for design mockups, content drafts, layout testing, and CMS placeholders. Lorem Ipsum has been the design industry's standard dummy text since the 1500s — its irregular word lengths and Latin origin make it visually similar to real prose without the reader being distracted by content.",
      "Pickrack's generator outputs configurable text: by **words** (50, 100, 200), **sentences** (5, 10, 20), or **paragraphs** (1-10). Toggle the classic 'Lorem ipsum dolor sit amet, consectetur...' opener or skip it.",
      "Free, no signup. Pure browser JavaScript. Generated text is randomized each click — useful when you want variation across multiple mockup sections.",
    ],
    features: [
      { title: "3 generation modes", desc: "Words (count-based), Sentences (count-based), Paragraphs (count-based with realistic paragraph length)." },
      { title: "Classic 'Lorem ipsum dolor' opener", desc: "Toggle on for the canonical opening sentence; off for fully random Latin words." },
      { title: "Adjustable count", desc: "1-1000 words, 1-100 sentences, 1-20 paragraphs. Slider for fine control." },
      { title: "Real Latin word distribution", desc: "Source: De finibus bonorum et malorum by Cicero (45 BC). 200+ unique Latin words shuffled to mimic prose rhythm." },
      { title: "One-click copy", desc: "Generate, copy, paste into your design tool, draft, or CMS placeholder." },
    ],
    howTo: [
      { title: "Step 1: Choose mode", desc: "Words for short fills, Sentences for body copy, Paragraphs for full mockup sections." },
      { title: "Step 2: Set count", desc: "Slider or input field. Output updates live." },
      { title: "Step 3: Copy", desc: "One click. Paste into your Figma, Sketch, Penpot, draft post, or CMS." },
    ],
    useCases: [
      "**Mockup a blog post** layout before writing the actual content",
      "**Stress-test a design** with longer paragraphs to see how typography scales",
      "**Fill a CMS** with placeholder content during development",
      "**Generate sample data** for a database seed script (each row has unique text)",
      "**Test text truncation** with long Lorem strings (does your card cut off correctly at 3 lines?)",
      "**Demo client work** without revealing real content during early-stage design reviews",
    ],
    faq: [
      { q: "Where does 'Lorem ipsum' come from?", a: "It's a scrambled excerpt from Cicero's 'De finibus bonorum et malorum' (On the Ends of Goods and Evils, 45 BC). The original phrase 'dolorem ipsum quia dolor sit amet' was scrambled by a 16th-century printer. Used as design placeholder ever since." },
      { q: "Why use Latin instead of English?", a: "Latin word distribution mimics prose without the reader actually reading it. English placeholder ('the the the' or 'asdfasdf') is too noticeable; Latin looks like 'real text' to the eye while still being meaningless." },
      { q: "Are the generated paragraphs realistic length?", a: "Yes — 50-100 words per paragraph (matching average prose). Sentence length varies 8-20 words. Output is statistically similar to real article structure." },
      { q: "Can I get Lorem Ipsum in Vietnamese / Spanish / etc.?", a: "Pickrack v1 outputs Latin only (the design-industry standard). Localized variants exist (Hipster Ipsum, Bacon Ipsum, Pirate Ipsum) — search for those if you want themed placeholder text." },
      { q: "Does it generate the same text every time?", a: "No — words are shuffled randomly each generation. Click Generate again for a different output." },
      { q: "What's the maximum count?", a: "1000 words, 100 sentences, or 20 paragraphs. Beyond that, output gets repetitive (the source word list has only 200 unique words)." },
      { q: "Is it suitable for SEO testing?", a: "No — Lorem Ipsum is meaningless Latin and won't help with SEO simulations. For SEO testing, use real keyword-targeted content." },
      { q: "Does it work for typography testing (italic, accents)?", a: "Yes — Latin uses standard Latin alphabet, so basic typography renders. For diacritic testing (Vietnamese, accented Latin), include some pre-typed sample text alongside Lorem." },
    ],
    relatedTools: ["word-counter", "case-converter", "slug-generator"],
  },

  "slug-generator": {
    slug: "slug-generator",
    h1Subtitle:
      "Convert any text to URL-friendly slug. Strips Vietnamese diacritics, special chars, and spaces.",
    intro: [
      "**Slug Generator** converts a title (article headline, product name, blog post title) into a URL-friendly slug — lowercase, hyphens for spaces, no special characters, no diacritics. SEO-friendly URLs are short, readable, and stable.",
      "Pickrack's slug generator handles **Vietnamese diacritics** (đ → d, ư → u, ê → e), accented Latin (é → e), and general Unicode normalization. The output is pure ASCII alphanumeric + hyphens, safe for any URL or filesystem.",
      "Free, no signup, browser-side. Common use: paste a Vietnamese blog post title, get a clean English-letter URL slug ready for WordPress/Notion/Ghost CMS.",
    ],
    features: [
      { title: "Vietnamese diacritic stripping", desc: "đ → d, ư → u, ê → e, ô → o, ạ ả ã á à → a. All 6-tone Vietnamese converts to plain Latin." },
      { title: "Accented Latin normalization", desc: "café → cafe, naïve → naive, München → munchen. Spanish ñ → n, German ß → ss." },
      { title: "Live preview", desc: "Type a title; slug updates as you type. No Submit button." },
      { title: "Configurable separator", desc: "Default hyphen (most CMS), or underscore for technical contexts." },
      { title: "Max length cap", desc: "Optional — truncate at 60/80/100 chars for SEO best practice (Google recommends slugs under 60 chars)." },
    ],
    howTo: [
      { title: "Step 1: Paste your title", desc: "Article headline, product name, blog post title — any language including Vietnamese." },
      { title: "Step 2: Read the live slug output", desc: "Updates with each keystroke. Lowercase, hyphenated, no diacritics." },
      { title: "Step 3: Copy", desc: "One click. Paste into your CMS URL field, file name, or path." },
    ],
    useCases: [
      "**Vietnamese blog post → English slug**: 'Cách viết bài SEO hay' → 'cach-viet-bai-seo-hay'",
      "**Product name → URL**: 'Sữa Tắm Lifebuoy 500ml' → 'sua-tam-lifebuoy-500ml'",
      "**File name** for download: 'Hướng dẫn sử dụng.pdf' → 'huong-dan-su-dung.pdf'",
      "**Clean a messy URL** from a CMS that auto-generated weird characters",
      "**Generate consistent slugs** across a multi-language site (avoid mixing Vietnamese and English in URLs)",
      "**Bulk convert** product titles for an e-commerce SEO migration",
    ],
    faq: [
      { q: "Does it handle Vietnamese diacritics correctly?", a: "Yes — full coverage of all Vietnamese diacritics including đ/Đ. Tested with all 6 tones (sắc, huyền, hỏi, ngã, nặng, ngang) on every Vietnamese vowel. Common edge cases (ưo, ươ) handled correctly." },
      { q: "Why strip diacritics? URLs support Unicode now.", a: "Modern URLs support percent-encoded Unicode (RFC 3986). But: (1) percent-encoded URLs are ugly when shared, (2) some legacy systems still struggle with them, (3) ASCII slugs are more cache-friendly and shorter to type. Most CMS still default to ASCII slugs." },
      { q: "What about Chinese / Japanese / Korean text?", a: "v1 doesn't romanize CJK characters (would need pinyin/romaji conversion). For CJK, output preserves the characters as-is, percent-encoded if used in URL. For full romanization, use a dedicated tool." },
      { q: "Does it strip emoji?", a: "Yes — emoji and other non-Latin pictographs are removed entirely. Only ASCII alphanumeric + hyphens remain." },
      { q: "What's the default separator?", a: "Hyphen (-) — Google's recommendation for URL readability and SEO. Underscore (_) is legal but harder to read." },
      { q: "Why is my output cut off?", a: "Default no truncation. Toggle 'Max length' to 60 chars (SEO recommendation) — slugs longer than that get truncated at the last word boundary." },
      { q: "Can I preserve case?", a: "v1 always lowercases — consistent with URL best practice (uppercase URLs cause case-sensitivity bugs). For case-preservation, use Case Converter and combine manually." },
      { q: "Does this work for filenames on Windows/Mac/Linux?", a: "Yes — output is ASCII alphanumeric + hyphens, safe for all filesystems. Reserved names (CON, PRN, AUX on Windows) are not specially handled — append a suffix if needed." },
    ],
    relatedTools: ["case-converter", "word-counter", "lorem-ipsum"],
  },

  "word-counter": {
    slug: "word-counter",
    h1Subtitle:
      "Count words, characters, sentences, paragraphs, and reading time. Live update as you type.",
    intro: [
      "**Word Counter** is a daily-use tool for writers, editors, students, and SEO professionals. Count exact words for an essay assignment, monitor blog post length for SEO target ranges, check tweet/character limits for X/LinkedIn, or estimate reading time for a newsletter.",
      "Pick Rack's **Word Counter** updates live as you type — no Submit button, no rate limit, no upload. Built with simple browser JavaScript: word boundaries detected via Unicode-aware regex, sentence detection by punctuation, paragraph detection by blank lines.",
      "Free, no signup. Counts words, characters with spaces, characters without spaces, sentences, paragraphs, and reading time at 200 words/minute (adjustable). Useful when writing emails, articles, applications, social media, or copy.",
    ],
    features: [
      { title: "Live counting (no Submit button)", desc: "Stats update on every keystroke — no need to click anything." },
      { title: "Six metrics", desc: "Words, characters with spaces, characters without spaces, sentences, paragraphs, reading time." },
      { title: "Reading time at adjustable WPM", desc: "Default 200 wpm (average adult silent reading). Adjust to 150 (cautious) or 250 (fast) as needed." },
      { title: "Top words frequency", desc: "Quick view of most-used words — useful to catch repetition in your writing." },
      { title: "Browser-side, zero tracking", desc: "Your text stays in the textarea. Nothing logged or sent." },
    ],
    howTo: [
      { title: "Step 1: Paste or type your text", desc: "The textarea accepts any length — emails, essays, articles, books." },
      { title: "Step 2: Read the live stats", desc: "Words, characters, sentences, paragraphs, and reading time update on every keystroke." },
      { title: "Step 3: Adjust as needed", desc: "Cut to fit a Twitter post (280 chars), an essay limit (500 words), or an SEO target (1500-2500 words)." },
    ],
    useCases: [
      "**Hit an essay word limit** (500, 1000, 2500 words) without overshooting",
      "**Match SEO article range** — most ranking blog posts are 1,500-2,500 words",
      "**Stay under social media limits**: Twitter/X 280 chars, LinkedIn 3000, Instagram caption 2200",
      "**Estimate reading time** for newsletter or article preview ('5 min read')",
      "**Catch redundant words** via top-words frequency before submitting copy",
      "**Compare draft sizes** when revising — paste before/after to see net change",
    ],
    faq: [
      { q: "Is my text sent to your server?", a: "No. All counting runs in your browser. Type or paste freely — even sensitive drafts. Nothing is logged or transmitted." },
      { q: "How are words counted?", a: "Words are split by whitespace and filtered to non-empty tokens. Compound words like 'mother-in-law' count as one word; numbers like '2026' count as one word; URLs count as one word each." },
      { q: "Why does the character count differ between 'with spaces' and 'without spaces'?", a: "Twitter/X counts characters with spaces (each space is one character). Some forms count without. Both are shown so you can match either spec." },
      { q: "How is reading time calculated?", a: "Default formula: words ÷ 200 words/minute. Average adult silent reading is 200-250 wpm; aloud is ~150 wpm. Adjust the WPM input to match your audience." },
      { q: "Does this count Vietnamese, Chinese, Japanese characters correctly?", a: "Vietnamese: word counting uses whitespace, so works correctly. Chinese/Japanese without spaces: each character is treated as a 'word' since there are no spaces — approximate but reasonable for length comparison." },
      { q: "Can I save my text or count history?", a: "v1 is stateless — refresh and your text is gone (privacy benefit). For drafts, save to a separate document. History feature is on the roadmap with localStorage." },
      { q: "What about syllable counts or Flesch reading ease?", a: "Out of scope for this tool. For readability scores, try Hemingway Editor or Readable.com." },
      { q: "Is there a max length?", a: "No hard limit. Browsers handle ~5MB of text fine in a textarea. Beyond that, performance drops." },
    ],
    relatedTools: [],
  },

  "ai-summarizer": {
    slug: "ai-summarizer",
    h1Subtitle:
      "Summarize articles, documents, and notes with Claude Haiku 4.5. Short, medium, or detailed bullets. Free, no signup.",
    intro: [
      "**AI Summarizer** turns long articles, research papers, meeting transcripts, or technical docs into a digestible summary. Paste your text, pick the length, get an answer in 2-5 seconds. Powered by Anthropic's Claude Haiku 4.5 — the same model used by businesses for production AI workflows.",
      "Pickrack's summarizer is **task-focused, not chat-style**: there's no prompt to design, no &quot;please summarize&quot; nudge, no upselling to Pro. You paste text, you get a summary that matches the length you asked for. Output preserves the language of the input — Vietnamese in, Vietnamese out.",
      "Free with a generous daily quota (10 requests per IP per day). For higher-volume use, run Claude API directly with your own key — Pickrack uses no proprietary tricks.",
    ],
    features: [
      { title: "Three length modes", desc: "Short (2-3 sentences for tweet-length sharing), Medium (4-6 sentences for an exec brief), Long (8-12 bullet points for note-taking)." },
      { title: "Multilingual", desc: "Auto-detects language and summarizes in the same language. Tested with English, Vietnamese, Spanish, French, German, Chinese, Japanese." },
      { title: "Privacy-respecting", desc: "Your text is sent to Anthropic's API, processed, and the response is returned. Anthropic does not use API inputs for training. Pickrack stores nothing." },
      { title: "Fact-preserving", desc: "Haiku 4.5 with temperature=0.2 keeps the summary factual to the source. No fabricated numbers, no opinions added." },
      { title: "No signup, no watermark", desc: "Just paste and click. Daily quota of 10/IP — sustainable for casual use without API key setup." },
    ],
    howTo: [
      { title: "Step 1: Paste your text", desc: "Up to 12,000 characters (~3,000 tokens, ~6 pages of plain text). For longer documents, summarize in chunks." },
      { title: "Step 2: Choose length", desc: "Short for sharing, Medium for skimming, Long for note-taking with bullets." },
      { title: "Step 3: Click Summarize", desc: "Haiku responds in 2-5 seconds. Copy or download the summary." },
    ],
    useCases: [
      "**Brief a busy boss** on a 10-page report — paste, choose Short, copy the 3-sentence summary",
      "**Take notes from a long article** before saving to your knowledge base (Notion, Obsidian, Anytype)",
      "**Triage research papers** — summarize abstracts to decide what to read in full",
      "**Recap a Zoom transcript** — paste the raw transcript, get a meeting summary with key decisions",
      "**Make blog posts skimmable** — generate a TL;DR section to add at the top",
      "**Compare multiple sources** — summarize each separately, then read the summaries side-by-side",
    ],
    faq: [
      { q: "Is my text used to train AI?", a: "No. Anthropic's commercial API agreement explicitly excludes API inputs from training data. Pickrack does not store or log your input or the summary." },
      { q: "How accurate are the summaries?", a: "Claude Haiku 4.5 is among the most accurate small AI models for summarization (May 2026). For highly technical content (legal, medical, scientific), always verify critical claims against the source — AI can occasionally miss nuance or compress two ideas into one. For casual reading, summaries are reliable." },
      { q: "Can it summarize a PDF?", a: "Not directly in this tool — paste the text. To extract PDF text first, use Pickrack's [PDF to Markdown tool](/tools/pdf/pdf-to-markdown/), then paste the result here." },
      { q: "What's the maximum input length?", a: "12,000 characters (~3,000 tokens, ~6 pages of plain text, ~2,000 English words). For longer content, summarize chapter-by-chapter, then summarize the chapter summaries." },
      { q: "Does it work for non-English text?", a: "Yes — Vietnamese, Spanish, French, German, Chinese, Japanese, Korean, and more. Output preserves the input language. For mixed-language input, output follows the dominant language." },
      { q: "How is this different from ChatGPT or Gemini?", a: "ChatGPT/Gemini are open-ended chat — you have to know how to prompt. Pickrack's summarizer has the prompt baked in, length presets, and zero upselling. For more control, ChatGPT lets you iterate on the summary; Pickrack is one-shot." },
      { q: "What's the daily quota?", a: "10 summaries per IP per 24 hours, free tier. For higher volume, use the Anthropic API directly with your own key (~$0.002 per summary)." },
      { q: "Can I summarize a YouTube video?", a: "Not directly. Use a transcript service first (e.g., kome.ai, summarize.tech for YouTube), then paste the transcript here. Native YouTube transcript support is on the roadmap." },
    ],
    relatedTools: ["ai-translator", "ai-grammar-checker", "pdf-to-markdown"],
  },

  "ai-translator": {
    slug: "ai-translator",
    h1Subtitle:
      "Translate text into 20 languages with formatting preserved. Powered by Claude Haiku 4.5.",
    intro: [
      "**AI Translator** does what Google Translate can't always do well: translate while **preserving the document structure**. Markdown formatting, bullet points, paragraph breaks, code blocks, technical terms — all kept intact. Powered by Claude Haiku 4.5, the same model professional teams use for client-facing translation.",
      "Compared with Google Translate or DeepL, Claude is more contextually aware: it picks the right tone (formal vs casual), handles idioms naturally, and won't translate inside code blocks or technical identifiers. For short marketing copy, legal disclaimers, README files, or technical docs, the output is often usable without editing.",
      "Free with a daily quota (10 translations per IP per day). Supports 20 languages including English, Vietnamese, Spanish, French, German, Chinese, Japanese, Korean, Portuguese, Arabic, Hindi, Thai, Indonesian.",
    ],
    features: [
      { title: "Format preservation", desc: "Markdown bold/italic/code, bullet lists, numbered lists, line breaks, paragraph structure — all preserved exactly. Ideal for translating documentation or blog posts." },
      { title: "20 languages supported", desc: "English, Vietnamese, Spanish, French, German, Chinese (simplified + traditional), Japanese, Korean, Portuguese, Italian, Russian, Arabic, Hindi, Thai, Indonesian, Dutch, Polish, Turkish, Swedish." },
      { title: "Tone-aware", desc: "Maintains the source register (formal/casual/technical) rather than defaulting to one neutral style. A casual Twitter post stays casual; a legal disclaimer stays formal." },
      { title: "No signup, no watermark", desc: "Free with daily quota. Daily quota lets casual users translate without paying or signing up anywhere." },
      { title: "Privacy-first", desc: "Anthropic does not use API inputs for training. Pickrack does not log or store your text or translations." },
    ],
    howTo: [
      { title: "Step 1: Paste your source text", desc: "Up to 8,000 characters. Markdown formatting is preserved — paste raw markdown for documentation translation." },
      { title: "Step 2: Pick the target language", desc: "Click the language dropdown — popular options at top, full list below. Source language is auto-detected." },
      { title: "Step 3: Translate", desc: "Click Translate. Output appears in 2-5 seconds. Copy or download." },
    ],
    useCases: [
      "**Translate a README.md** for an open-source project — markdown structure preserved, code blocks untouched",
      "**Localize a landing page** copy from English → Vietnamese while keeping HTML/markdown intact",
      "**Translate a legal disclaimer** in formal tone — Claude maintains register better than Google Translate's default",
      "**Convert a casual blog post** for international readers without losing the conversational voice",
      "**Translate technical documentation** where preserving exact formatting matters more than fluent style",
      "**Turn a Twitter thread** into Spanish/Vietnamese/Japanese while keeping the line breaks per tweet",
    ],
    faq: [
      { q: "How is this different from Google Translate or DeepL?", a: "Google Translate is excellent for casual sentences and supports 130+ languages but often mangles markdown formatting and over-literalizes idioms. DeepL is more natural for European languages but doesn't always preserve markdown well. Pickrack's Claude-based translator excels at preserving format and choosing tone, with the tradeoff of fewer languages (20) and a daily quota." },
      { q: "Is my text used to train AI?", a: "No. Anthropic's commercial API explicitly excludes API inputs from training. Pickrack does not store or log inputs or translations." },
      { q: "What's the maximum input length?", a: "8,000 characters per request — about 1,500-2,000 English words or ~3-4 pages. For longer documents, translate paragraph-by-paragraph or use a desktop tool." },
      { q: "Does it work for technical content (code, APIs, math)?", a: "Yes — Claude is trained on technical content and handles code blocks, API names, and math notation gracefully (it leaves identifiers untranslated, translates only comments and prose). For very specialized domains (legal, medical, pharmaceutical), have a domain expert review before publishing." },
      { q: "Can I translate a Word document or PDF?", a: "Not directly — extract the text first ([PDF to Markdown](/tools/pdf/pdf-to-markdown/), [Word to PDF](/tools/pdf/word-to-pdf/) → markdown extract), then paste. Native document translation is on the roadmap." },
      { q: "What about regional dialects (US vs UK English, Mainland vs Taiwan Chinese)?", a: "v1 supports Chinese (Simplified) and Chinese (Traditional) separately. For other regional variations (Brazilian vs European Portuguese, US vs UK English), Claude defaults to the most common variant — specify in your input if you need a particular dialect." },
      { q: "How accurate is it?", a: "For everyday content (blog posts, marketing copy, casual messages), output is usually publication-ready. For high-stakes content (contracts, medical advice, court filings), always have a human translator review. AI translation, even from Claude, can occasionally miss legal nuance." },
      { q: "Daily quota?", a: "10 translations per IP per 24 hours. Reset is rolling — if you used 5 yesterday at 3pm, those slots free up at 3pm today." },
    ],
    relatedTools: ["ai-summarizer", "ai-grammar-checker", "pdf-to-markdown"],
  },

  "ai-grammar-checker": {
    slug: "ai-grammar-checker",
    h1Subtitle:
      "Fix grammar, spelling, and punctuation without changing your voice. See exactly what changed and why.",
    intro: [
      "**AI Grammar Checker** fixes objective errors — grammar, spelling, punctuation, capitalization — without rewriting your voice. The biggest complaint about Grammarly and similar tools is that they suggest style changes you didn't ask for, slowly homogenizing your writing. Pickrack's checker is the opposite: it fixes only what's wrong, leaves voice and style alone.",
      "Powered by Claude Haiku 4.5 with a strict system prompt: only flag spelling errors, missing articles, subject-verb mismatches, punctuation mistakes. Style preferences (Oxford comma, sentence length, word choice) are NOT changed unless they're objectively wrong.",
      "Output: corrected text + a list of every issue with the original phrase, the fix, and a brief reason. Verify the changes before accepting — AI can occasionally over-correct in domain-specific writing.",
    ],
    features: [
      { title: "Voice-preserving", desc: "Won't suggest style changes. Won't replace your word choice with a &quot;simpler&quot; alternative. Only fixes objective errors." },
      { title: "Issue-by-issue diff", desc: "Every change shown with original → fix + reason (&quot;subject-verb agreement&quot;, &quot;missing article&quot;, &quot;misspelling&quot;). Decide which to accept." },
      { title: "Multilingual", desc: "Works for English, Vietnamese, Spanish, French, German, and other major languages. For Vietnamese, catches diacritic errors, sai chính tả, and pronoun confusion." },
      { title: "Free, no signup", desc: "10 checks per IP per day. Sustainable for casual writing without paying for Grammarly Premium ($12/mo) or ProWritingAid ($10/mo)." },
      { title: "Privacy-first", desc: "Your draft is sent to Anthropic for processing, then the response is returned. Anthropic does not use API inputs for training. Pickrack stores nothing." },
    ],
    howTo: [
      { title: "Step 1: Paste your text", desc: "Up to 6,000 characters per check. For longer pieces, run paragraph-by-paragraph." },
      { title: "Step 2: Click Check", desc: "Haiku analyzes in 2-5 seconds and returns corrections + reasons." },
      { title: "Step 3: Review and accept changes", desc: "Each issue is shown separately. Click to accept or skip individual fixes. Copy the final corrected text." },
    ],
    useCases: [
      "**Final proofread of a blog post** before publishing — catch typos and grammar without losing your voice",
      "**Polish an email to a client** — fix subject-verb errors that an autocorrect missed",
      "**Check a Vietnamese essay** for chính tả and grammar without it suggesting Westernized phrasing",
      "**Verify a college application** essay — focus on objective errors, not style preferences",
      "**Quick review of a Slack message** before sending — small grammar fix, no style preaching",
      "**Check translated text** that came from another tool (DeepL, Google Translate) for grammar quality",
    ],
    faq: [
      { q: "How does this compare to Grammarly?", a: "Grammarly does grammar + style + tone + clarity + plagiarism on a paid tier. Pickrack does grammar + spelling + punctuation only, free with a daily quota. The narrower focus means fewer noisy suggestions — Grammarly users often disable style/tone hints because they over-correct. If you want full editing assistance, use Grammarly. If you want errors fixed without rewriting, use Pickrack." },
      { q: "Will it change my word choice?", a: "Only if the word is objectively wrong. &quot;Affect&quot; vs &quot;effect&quot; will be fixed if used wrongly. &quot;Buy&quot; will not be changed to &quot;purchase&quot; — that's a style preference, not an error." },
      { q: "Does it work in Vietnamese?", a: "Yes. Catches dấu (diacritic) errors, common chính tả mistakes (&quot;dấu&quot; vs &quot;giấu&quot;, &quot;chính&quot; vs &quot;chánh&quot;), and basic grammar issues. Less aggressive on style — Vietnamese style varies by region and audience." },
      { q: "Will it preserve markdown / formatting?", a: "Yes — bullets, paragraphs, bold, italic, code blocks are kept intact. Code blocks are NOT checked (they're not prose)." },
      { q: "What's the maximum input length?", a: "6,000 characters per check (~1,200 English words). For longer pieces, run paragraph-by-paragraph or split by sections." },
      { q: "Does it catch comma splices, semicolon errors, em-dashes?", a: "Yes for objective errors (e.g., comma where a period is grammatically required). For style preferences (Oxford comma, em-dash vs en-dash usage), it leaves them alone." },
      { q: "What about plagiarism or AI-detection?", a: "Out of scope — this tool is grammar only. For plagiarism, try Copyscape or Quetext. For AI-detection (which is unreliable in 2026 anyway), see GPTZero or Originality.ai." },
      { q: "Daily quota?", a: "10 checks per IP per 24 hours. Reset is rolling — independent of midnight." },
    ],
    relatedTools: ["ai-summarizer", "ai-translator", "word-counter"],
  },

  "qr-generator": {
    slug: "qr-generator",
    h1Subtitle:
      "Generate QR codes for URLs, text, WiFi credentials, or vCards. Adjustable size, error correction, download PNG/SVG.",
    intro: [
      "**QR Code Generator** builds scannable QR codes for URLs, plain text, WiFi auto-connect, vCard contact info, or any payload up to 4,000 characters. Common uses: restaurant menus, business cards, event posters, WiFi guest credentials, contactless payment links.",
      "Pickrack uses the open-source `qrcode` library running in your browser. The QR is generated locally and never sent to any tracking service — no shortener, no redirect, no analytics. Anyone scanning gets the data you encoded directly.",
      "Free, no signup. Download as PNG (raster, common) or SVG (vector, prints crisp at any size). Adjustable error correction level: L (7%) / M (15%) / Q (25%) / H (30%) — higher means more damage tolerance but bigger QR pattern.",
    ],
    features: [
      { title: "Multiple input types", desc: "URL, plain text, WiFi (auto-connect on scan), vCard (contact info), email, phone — each with proper formatting." },
      { title: "PNG + SVG download", desc: "PNG for screen / printing at known size; SVG for design tools, business cards, or any-size scaling." },
      { title: "Adjustable size 100-1000px", desc: "100px for inline use; 500px for posters; 1000px for high-DPI prints." },
      { title: "Error correction L/M/Q/H", desc: "Higher correction means QR survives smudges/damage. Logo-overlay use cases need Q or H so the partially-blocked pattern still scans." },
      { title: "No tracking, no shortener", desc: "Most online QR generators bake in their own URL shortener (and analytics). Pickrack encodes your URL DIRECTLY — no redirect, no tracking." },
    ],
    howTo: [
      { title: "Step 1: Pick input type + content", desc: "URL is most common. WiFi format: SSID + password + encryption type." },
      { title: "Step 2: Adjust size and error correction", desc: "Default 400px + M correction works for 90% of cases. Increase for posters or logo overlays." },
      { title: "Step 3: Download PNG or SVG", desc: "PNG for everyday use. SVG for design, vinyl printing, or business cards." },
    ],
    useCases: [
      "**Restaurant menu** — print a QR on the table that opens your online menu",
      "**WiFi guest network** — print on a placard so guests scan and auto-connect (no typing password)",
      "**Business card** — encode vCard so scanning adds you to phone contacts",
      "**Event poster** — QR linking to ticket page or RSVP form",
      "**Pay link** — encode a payment request URL (Stripe, PayPal, MoMo)",
      "**Product packaging** — link to instructions, registration, or warranty page",
    ],
    faq: [
      { q: "Does the QR code track who scans it?", a: "No. Pickrack encodes your URL directly into the QR pattern — no shortener, no redirect, no analytics. When someone scans, they go straight to your URL. Their device doesn't ping anything Pickrack-related." },
      { q: "Why use SVG over PNG?", a: "SVG scales infinitely — print at 1cm or 1m without pixelation. Best for business cards, posters, vinyl signs. PNG is fine for fixed-size screen or document use." },
      { q: "What's the maximum data length?", a: "QR can hold up to 4,296 alphanumeric characters or 2,953 bytes. Higher error correction reduces capacity. For long URLs, consider a URL shortener (your own, not embedded by us)." },
      { q: "Does it support logo overlay?", a: "v1 doesn't auto-overlay logos. Use error correction H (30%), download SVG, then overlay your logo in a design tool — the QR's redundancy keeps it scannable with up to 30% obscured." },
      { q: "What error correction level should I use?", a: "L (7%) — clean prints, tiny logo or no logo. M (15%) — default, most common. Q (25%) — outdoor poster, some weathering. H (30%) — logo overlay, vinyl that'll get scratched." },
      { q: "Can I generate WiFi QR for guests?", a: "Yes — WiFi format: `WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<password>;;`. Pickrack's WiFi mode formats this for you. iPhone (iOS 11+) and Android 10+ auto-connect on scan." },
      { q: "Will my QR work on all phones?", a: "Yes — QR is a 1994 standard with universal support. iOS Camera app (iOS 11+), Google Lens, and any QR scanner app all read standard QR. v1 of Pickrack uses standard QR (not Micro QR or rMQR)." },
      { q: "Is there a size minimum for printing?", a: "QR should be at least 2cm × 2cm for reliable phone scan from 30cm distance. For poster-size (scan from 1m+), use 10cm × 10cm. Higher data density = needs larger physical size." },
    ],
    relatedTools: ["password-generator", "uuid-generator", "slug-generator"],
  },

  "age-calculator": {
    slug: "age-calculator",
    h1Subtitle:
      "Calculate exact age in years, months, days, hours, minutes from a birth date. Browser-side, instant.",
    intro: [
      "**Age Calculator** computes precise age from a birth date — useful for forms requiring exact age in years/months/days, age-verification flows, anniversary calculations, retirement planning, or curiosity about exactly how many days you've been alive.",
      "Pickrack handles edge cases naturally: leap-year birthdays (Feb 29), end-of-month wraparound, time zones (uses local time consistent with the user). Calculation is browser-side using JavaScript Date — instant, no upload, no signup.",
      "Free, no signup. Outputs: years + months + days breakdown, total days, total hours, total minutes lived, and next birthday countdown. Optionally compare two arbitrary dates (not just birth → today).",
    ],
    features: [
      { title: "Years + months + days breakdown", desc: "Exact: e.g., '34 years, 5 months, 12 days' (not just '34.42 years')." },
      { title: "Total counters", desc: "Total days lived, hours, minutes — useful for milestones (10,000 days alive!)." },
      { title: "Next birthday countdown", desc: "Days until next birthday + day-of-week of next birthday." },
      { title: "Leap-year birthday handling", desc: "Born Feb 29? Calculator notes the special case and computes age correctly (most years celebrate Feb 28 or Mar 1)." },
      { title: "Date-to-date mode", desc: "Compute time between two arbitrary dates — for project length, gestation, time since an event." },
    ],
    howTo: [
      { title: "Step 1: Enter birth date", desc: "Date picker or type YYYY-MM-DD. Time defaults to 00:00 (midnight)." },
      { title: "Step 2: Pick reference date", desc: "Default 'today' for age. Or pick another date for date-to-date difference." },
      { title: "Step 3: Read the results", desc: "Years/months/days, totals, and next-birthday countdown." },
    ],
    useCases: [
      "**Government form** that asks for exact age in years and months",
      "**Insurance application** requiring age at next birthday for premium calculation",
      "**Retirement planning** — days until eligibility milestone (65, 67)",
      "**Curiosity** — how many days have I been alive? (10,000 days = ~27.4 years)",
      "**Anniversary tracking** — exactly how long since wedding day, work start date, etc.",
      "**Pet age** — convert dog years (subjectively) — though formula varies; use direct days count",
    ],
    faq: [
      { q: "How is age computed when birthday hasn't happened this year?", a: "If today is May 1 and birthday is Dec 1, you've completed Year-1, not Year. So someone born Dec 1, 1990 on May 1, 2026 is 35 years, 5 months, 0 days old (not 36)." },
      { q: "What about Feb 29 (leap-year birthdays)?", a: "Pickrack computes age based on calendar months. Someone born Feb 29, 2000 on Feb 28, 2026 is shown as 25 years, 11 months, 27 days — they technically 'celebrate' Mar 1 in non-leap years, but legal/calendar age varies by jurisdiction. Pickrack provides the strict calendar number." },
      { q: "Is the calculation in my time zone?", a: "Yes — uses the browser's local time zone. If you were born in a different time zone and care about exact hour, adjust the birth time accordingly." },
      { q: "What's the maximum date range?", a: "JavaScript Date supports ±100,000,000 days from Jan 1, 1970 (so years -271,821 to +275,760). For practical use, any human lifespan works." },
      { q: "Can I calculate age in dog years?", a: "v1 doesn't include species-specific conversions (dog/cat 'years' formulas vary by source). Calculate total days lived, then apply your preferred formula manually (common: dog 1 year = human 7 years is a myth; first 2 years are ~10 human, then ~4 per dog year)." },
      { q: "Why does it show different totals for hours and days?", a: "Days = floor of total. Hours = days × 24 + remaining hours from time-of-day. Tiny rounding differences come from leap seconds (ignored — Date.now uses Unix time)." },
      { q: "Can I share the result?", a: "Click Share to copy a permalink with your dates encoded in URL. Open the link to see the same calculation. URL doesn't track or store anywhere — just encodes the dates." },
      { q: "Does it work for negative time (date in the future)?", a: "Yes — for date-to-date mode. Birth date in the future doesn't make sense for age, so birth date is restricted to past for age mode." },
    ],
    relatedTools: ["password-generator", "qr-generator", "word-counter"],
  },

  "password-generator": {
    slug: "password-generator",
    h1Subtitle:
      "Generate strong, random, cryptographically-secure passwords. Length and character set fully configurable.",
    intro: [
      "**Password Generator** creates strong random passwords for new accounts, password rotations, or replacing weak ones identified by your password manager. The crypto-strength matters: weak generators (using Math.random or PHP rand()) are crackable in seconds.",
      "Pick Rack's **Password Generator** uses `crypto.getRandomValues()` — the browser's cryptographically-secure random API, the same primitive that powers HTTPS handshakes. Each character is independently random, drawn from your selected character pool. **No network call, no logging** — passwords are generated locally and never leave your tab.",
      "Free, no signup, no daily limit. Use it as a one-shot tool or generate dozens for testing. Pair with a password manager (1Password, Bitwarden, KeePass) — never reuse passwords across accounts.",
    ],
    features: [
      { title: "Cryptographically secure (crypto.getRandomValues)", desc: "Uses browser native CSPRNG — same entropy source as TLS keys. Each character independently random." },
      { title: "Adjustable length 8-128 characters", desc: "Default 16 (current NIST recommendation for human-typed). 32+ for system-only use. Some sites cap at 32 — generate to match." },
      { title: "Character set toggles", desc: "Lowercase, uppercase, numbers, symbols — toggle each. Some legacy sites reject symbols; uncheck and regenerate." },
      { title: "Exclude similar-looking characters", desc: "Toggle to remove 0/O, 1/l/I — useful for passwords you'll have to type or read out loud." },
      { title: "Copy to clipboard with auto-clear", desc: "Click Copy → password copies. Clipboard auto-clears after 30 seconds (configurable) to limit exposure." },
    ],
    howTo: [
      { title: "Step 1: Set length", desc: "16 for typical human use, 24-32 for high security, 12 if a site has a low cap." },
      { title: "Step 2: Toggle character sets", desc: "Default: all four (a-z, A-Z, 0-9, symbols). Uncheck symbols if a site rejects them." },
      { title: "Step 3: Generate and copy", desc: "Click Generate. Click the copy icon. Paste into the password field. Always also save to your password manager." },
    ],
    useCases: [
      "**Replace a weak password** flagged by your password manager (1Password, Bitwarden) as 'compromised' or 'weak'",
      "**Generate a master password** for a new vault — combine 4-5 random words instead for better recall",
      "**Rotate passwords** after a service breach (Have I Been Pwned alert)",
      "**Create test credentials** for staging environments — generate 100 in a row",
      "**Set strong WiFi passwords** when configuring a new router (24+ chars, no symbols if router doesn't support)",
      "**Protect a PDF** before emailing — pair with Pickrack's Protect PDF tool",
    ],
    faq: [
      { q: "Is my generated password sent to your server?", a: "No. Password is generated using crypto.getRandomValues() entirely in your browser. Verify in DevTools → Network — zero requests when you click Generate. The password exists only in your browser memory until you copy or refresh." },
      { q: "Why use crypto.getRandomValues instead of Math.random?", a: "Math.random is not cryptographically secure — it's seeded predictably and can be reverse-engineered, especially in older browsers. crypto.getRandomValues uses OS-level entropy (hardware noise, kernel entropy pool) — the same source TLS, SSH, and disk encryption use. Always use it for passwords, tokens, salts." },
      { q: "How long should my password be?", a: "16 characters with mixed case + numbers + symbols is the current NIST/OWASP minimum for human-typed passwords. 24-32 for high-security or system-only use. 12 only when forced by site limits — at 12, choose strict mixed-set to maintain entropy." },
      { q: "Should I include symbols?", a: "Yes when allowed — adds significant entropy. Some legacy systems (banking, hospital) reject symbols. If so, increase length to 20+ to compensate." },
      { q: "What's a passphrase, and is it stronger?", a: "A passphrase like 'correct-horse-battery-staple' uses real words. 4-5 random words from a 7,776-word list is ~50 bits of entropy — comparable to an 8-char random password. For master passwords (which you'll type frequently), passphrases are easier to remember; for system-only credentials, prefer the random password generator." },
      { q: "Can I generate the same password twice?", a: "Cryptographic random — collision probability is astronomical (~2⁻⁶⁴ for 16-char alphanumeric). Each click produces an independent random password." },
      { q: "Does this work offline?", a: "Yes once the page loads. The generator is pure JavaScript using crypto.getRandomValues which is built into every modern browser." },
      { q: "Should I store the password in my browser's autofill?", a: "Browser autofill (Chrome, Safari built-in) is OK for low-risk accounts. For email, banking, work logins, use a dedicated password manager (1Password, Bitwarden, Proton Pass) — they have better encryption, sync, and breach alerts." },
    ],
    relatedTools: [],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return toolContentMap[slug];
}

export function buildFAQJsonLd(slug: string): Record<string, unknown> | null {
  const content = toolContentMap[slug];
  if (!content || content.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildHowToJsonLd(slug: string): Record<string, unknown> | null {
  const content = toolContentMap[slug];
  if (!content || content.howTo.length === 0) return null;
  const seoName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to ${seoName}`,
    description: content.h1Subtitle,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    step: content.howTo.map((step, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: step.title,
      text: step.desc,
    })),
  };
}
