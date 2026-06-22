import Image from "next/image";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  pending?: boolean;
};

/**
 * Caption-bearing image for MDX posts. Lives outside the prose to avoid prose
 * styling pulling double margins on figcaption.
 *
 * `pending` renders a styled "screenshot pending" banner over the placeholder
 * so the user sees clearly which slots still need real captures.
 */
export default function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 720,
  pending = false,
}: FigureProps) {
  return (
    <figure className="not-prose my-8 rounded-2xl border bg-gray-50 overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="relative">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto block"
        />
        {pending && (
          <div className="absolute top-3 right-3 rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Screenshot pending
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="px-5 py-3 text-sm text-gray-600 border-t bg-white leading-relaxed" style={{ borderColor: "var(--color-border)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
