"use client";

import { useState, useCallback, useEffect } from "react";

export default function CopyRawUrlButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [rawUrl, setRawUrl] = useState(`/api/pastes/${slug}/raw`);

  useEffect(() => {
    setRawUrl(`${window.location.origin}/api/pastes/${slug}/raw`);
  }, [slug]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(rawUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = rawUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [rawUrl]);

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-colors cursor-pointer shrink-0"
    >
      {copied ? "✓" : "📋"}
    </button>
  );
}
