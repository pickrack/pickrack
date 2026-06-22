"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      // Placeholder: would integrate with your email service (Resend, Mailchimp, etc.)
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-12 border-t border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Get notified when new tools launch</h2>
        <p className="text-gray-600 mb-6">
          We ship 1–2 new tools every month. Subscribe to be the first to know about AI tools, new categories, and major updates.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || status === "success" || !email.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition disabled:opacity-60 whitespace-nowrap inline-flex items-center gap-2"
          >
            {status === "success" ? (
              <>
                <Check className="w-4 h-4" /> Subscribed
              </>
            ) : status === "loading" ? (
              "Subscribing..."
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          No spam. Unsubscribe anytime. We share your email only with our email service provider.
        </p>
      </div>
    </section>
  );
}
