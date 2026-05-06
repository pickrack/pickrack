/** Whitelist of target languages for AI translator. Used by both API route and page. */
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "English",
  vi: "Vietnamese",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese (Simplified)",
  "zh-tw": "Chinese (Traditional)",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  it: "Italian",
  ru: "Russian",
  ar: "Arabic",
  hi: "Hindi",
  th: "Thai",
  id: "Indonesian",
  nl: "Dutch",
  pl: "Polish",
  tr: "Turkish",
  sv: "Swedish",
};

export const POPULAR_TARGETS: string[] = ["en", "vi", "es", "fr", "de", "zh", "ja", "ko"];
