import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }: ComponentProps<"a">) => {
      const url = href ?? "";
      const isExternal = /^https?:\/\//.test(url) && !url.startsWith("https://pickrack.com");
      if (isExternal) {
        return (
          <a href={url} target="_blank" rel="noopener noreferrer nofollow sponsored" {...props}>
            {children}
          </a>
        );
      }
      return (
        <Link href={url} {...props}>
          {children}
        </Link>
      );
    },
    ...components,
  };
}
