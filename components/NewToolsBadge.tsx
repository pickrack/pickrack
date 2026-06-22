import { Sparkles } from "lucide-react";

// Tools added recently (last 2 months)
const NEW_TOOLS = ["qr-art-generator", "qr-batch", "ai-image-upscaler", "ai-img2img"];

export function isNewTool(slug: string): boolean {
  return NEW_TOOLS.includes(slug);
}

export default function NewToolsBadge() {
  return (
    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
      <Sparkles className="w-3 h-3" />
      New
    </div>
  );
}
