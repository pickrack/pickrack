/**
 * Minimal Anthropic API client. Uses fetch directly to avoid SDK bundle weight.
 * Reads ANTHROPIC_API_KEY from process.env. Defaults to Haiku 4.5 (fastest/cheapest).
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";

export const HAIKU = "claude-haiku-4-5-20251001";
export const SONNET = "claude-sonnet-4-6";
export const OPUS = "claude-opus-4-7";

export type AnthropicMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AnthropicOptions = {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  system?: string;
  /** Abort after this many ms. Default 60s (Haiku usually responds in 1-5s). */
  timeoutMs?: number;
};

export class AnthropicError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AnthropicError";
  }
}

export async function anthropicMessage(
  messages: AnthropicMessage[],
  options: AnthropicOptions = {}
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AnthropicError("ANTHROPIC_API_KEY not configured on server", 500);
  }

  const {
    model = HAIKU,
    maxTokens = 1024,
    temperature = 0,
    system,
    timeoutMs = 60_000,
  } = options;

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens,
    temperature,
    messages,
  };
  if (system) body.system = system;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": API_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      let parsed: { error?: { message?: string } } | null = null;
      try {
        parsed = JSON.parse(errBody);
      } catch {
        /* not JSON */
      }
      const msg = parsed?.error?.message || errBody.slice(0, 200) || `HTTP ${res.status}`;
      throw new AnthropicError(msg, res.status);
    }

    const data = (await res.json()) as {
      content: Array<{ type: string; text?: string }>;
    };

    const text = data.content
      .filter((c) => c.type === "text" && typeof c.text === "string")
      .map((c) => c.text!)
      .join("");

    if (!text) {
      throw new AnthropicError("Empty response from Anthropic", 502);
    }
    return text;
  } catch (e) {
    if (e instanceof AnthropicError) throw e;
    if (e instanceof Error && e.name === "AbortError") {
      throw new AnthropicError("Request timed out", 504);
    }
    throw new AnthropicError(e instanceof Error ? e.message : String(e), 500);
  } finally {
    clearTimeout(timeoutId);
  }
}
