import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/tool-seo";
import ToolLayoutShell from "@/components/ToolLayoutShell";

const SLUG = "case-converter";

export const metadata: Metadata = buildToolMetadata(SLUG) ?? {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolLayoutShell slug={SLUG}>{children}</ToolLayoutShell>;
}
