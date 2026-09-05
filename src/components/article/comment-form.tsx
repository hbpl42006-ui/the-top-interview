"use client";

import { useState, type FormEvent } from "react";
import { Clock, AlertTriangle } from "lucide-react";

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleSlug, name, message }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
      setName("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-3 rounded-lg border border-border bg-surface-muted p-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
        className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts..."
        required
        rows={3}
        className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-charcoal px-5 py-2 text-xs font-bold uppercase tracking-wide text-background transition hover:bg-brand disabled:opacity-60"
      >
        {status === "loading" ? "Posting..." : "Post Comment"}
      </button>
      {status === "done" && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-brand">
          <Clock size={13} /> Your comment has been submitted and is awaiting moderation.
        </p>
      )}
      {status === "error" && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-brand">
          <AlertTriangle size={13} /> {error}
        </p>
      )}
    </form>
  );
}
