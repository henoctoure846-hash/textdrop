"use client";

import { useState, useCallback } from "react";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{
    url: string;
    rawUrl: string;
    slug: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      setError("Veuillez coller du texte avant de générer un lien.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() || undefined, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const data = await res.json();
      setResult({ url: data.url, rawUrl: data.rawUrl, slug: data.slug });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [title, content]);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  const reset = useCallback(() => {
    setTitle("");
    setContent("");
    setResult(null);
    setError("");
  }, []);

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-brand-600/30">
              T
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TextDrop</h1>
              <p className="text-xs text-slate-400">
                Partagez vos textes • Lisible par les IA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              En ligne
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {!result ? (
          <div className="animate-fade-in">
            {/* Hero text */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-brand-300 to-brand-400 bg-clip-text text-transparent">
                Collez. Partagez. Lisez.
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto">
                Collez n&apos;importe quel texte et obtenez un lien unique. Le
                lien est lisible par tous — humains et intelligences
                artificielles.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Title field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Titre{" "}
                  <span className="text-slate-500 font-normal">
                    (optionnel)
                  </span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mon article, Notes de réunion, Documentation API..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              {/* Content textarea */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Contenu
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Collez votre texte ici... (articles, notes, code, documentation, etc.)"
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-y font-mono text-sm leading-relaxed"
                />
                <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                  <span>
                    {wordCount.toLocaleString()} mots •{" "}
                    {charCount.toLocaleString()} caractères
                  </span>
                  <span>Pas de limite de taille</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg transition-all shadow-lg shadow-brand-600/20 hover:shadow-brand-600/40 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  "🔗 Générer le lien"
                )}
              </button>
            </div>

            {/* Features */}
            <div className="mt-12 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🔗",
                  title: "Lien unique",
                  desc: "Chaque texte obtient une URL courte et permanente.",
                },
                {
                  icon: "🤖",
                  title: "Lisible par les IA",
                  desc: "Endpoint texte brut accessible par ChatGPT, Claude, etc.",
                },
                {
                  icon: "⚡",
                  title: "Instantané",
                  desc: "Collez, cliquez, partagez. Pas d'inscription requise.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Result */
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
                ✅
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Lien généré avec succès !
              </h2>
              <p className="text-slate-400">
                Votre texte est maintenant accessible via les liens ci-dessous.
              </p>
            </div>

            <div className="space-y-4">
              {/* Main URL */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 glow-pulse">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">
                    🌐 Lien de lecture (humains)
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.url, "url")}
                    className="text-xs px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"
                  >
                    {copied === "url" ? "✓ Copié !" : "Copier"}
                  </button>
                </div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-brand-300 hover:text-brand-200 break-all font-mono text-sm transition-colors"
                >
                  {result.url}
                </a>
              </div>

              {/* Raw URL for AI */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                    🤖 Lien brut (IA &amp; machines)
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.rawUrl, "raw")}
                    className="text-xs px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  >
                    {copied === "raw" ? "✓ Copié !" : "Copier"}
                  </button>
                </div>
                <a
                  href={result.rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-emerald-300 hover:text-emerald-200 break-all font-mono text-sm transition-colors"
                >
                  {result.rawUrl}
                </a>
                <p className="text-xs text-slate-500 mt-2">
                  Ce lien renvoie du texte brut — parfait pour ChatGPT, Claude,
                  Gemini, ou tout autre IA.
                </p>
              </div>

              {/* JSON API URL */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                    📡 API JSON
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${result.url.replace("/p/", "/api/pastes/")}`,
                        "api"
                      )
                    }
                    className="text-xs px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
                  >
                    {copied === "api" ? "✓ Copié !" : "Copier"}
                  </button>
                </div>
                <code className="block text-amber-300 break-all text-sm">
                  {result.url.replace("/p/", "/api/pastes/")}
                </code>
                <p className="text-xs text-slate-500 mt-2">
                  Endpoint JSON structuré avec titre, contenu et métadonnées.
                </p>
              </div>
            </div>

            {/* New paste button */}
            <button
              onClick={reset}
              className="mt-8 w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-medium transition-colors cursor-pointer"
            >
              ✨ Créer un nouveau TextDrop
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-slate-500">
          TextDrop — Partagez vos textes instantanément. Tous les liens sont
          publics et accessibles.
        </div>
      </footer>
    </div>
  );
}
