import Link from "next/link";
import type { ToolContent } from "@/lib/tool-content";
import { getTool } from "@/lib/tools";

function renderInline(text: string) {
  // Render simple markdown bold (**text**) and inline code (`text`)
  const parts: (string | React.ReactNode)[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    if (m.startsWith("**")) {
      parts.push(<strong key={key++}>{m.slice(2, -2)}</strong>);
    } else if (m.startsWith("`")) {
      parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-gray-100 text-emerald-700 text-xs">{m.slice(1, -1)}</code>);
    }
    lastIndex = match.index + m.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export default function ToolContentSection({ content }: { content: ToolContent }) {
  const related = content.relatedTools
    .map((slug) => getTool(slug))
    .filter((t): t is NonNullable<ReturnType<typeof getTool>> => Boolean(t));

  return (
    <section className="border-t bg-gray-50" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed not-prose mb-8">
            {renderInline(content.h1Subtitle)}
          </p>

          {content.intro.map((para, i) => (
            <p key={i}>{renderInline(para)}</p>
          ))}

          <h2>Key features</h2>
          <ul>
            {content.features.map((f, i) => (
              <li key={i}>
                <strong>{f.title}</strong> — {renderInline(f.desc)}
              </li>
            ))}
          </ul>

          <h2>How to use</h2>
          <ol>
            {content.howTo.map((s, i) => (
              <li key={i}>
                <strong>{s.title}</strong> — {renderInline(s.desc)}
              </li>
            ))}
          </ol>

          <h2>When to use</h2>
          <ul>
            {content.useCases.map((u, i) => (
              <li key={i}>{renderInline(u)}</li>
            ))}
          </ul>

          <h2>Frequently asked questions</h2>
          {content.faq.map((item, i) => (
            <div key={i} className="mb-5">
              <h3 className="text-base font-semibold mt-0 mb-2">{item.q}</h3>
              <p className="m-0">{renderInline(item.a)}</p>
            </div>
          ))}

          {related.length > 0 && (
            <>
              <h2>Related tools</h2>
              <div className="not-prose grid gap-3 sm:grid-cols-3 mt-4">
                {related.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/pdf/${tool.slug}`}
                    className="block rounded-xl border bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <p className="font-semibold text-sm text-gray-900">{tool.name}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
