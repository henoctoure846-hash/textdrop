"use client";

import { useState, useCallback } from "react";

interface CopyButtonProps {
  text: string;
  label: string;
  variant?: "default" | "small";
}

export default function CopyButton({
  text,
  label,
  variant = "default",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  if (variant === "small") {
    return (
      <button
        onClick={handleCopy}
        className="px-2 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-colors cursor-pointer shrink-0"
      >
        {copied ? "✓" : "📋"}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-400 text-xs font-medium hover:bg-brand-600/30 transition-colors cursor-pointer"
    >
      {copied ? "✓ Copié !" : label}
    </button>
  );
}
