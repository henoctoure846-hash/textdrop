import { db } from "@/db";
import { pastes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CopyButton from "./CopyButton";
import CopyRawUrlButton from "./CopyRawUrlButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const [paste] = await db
    .select()
    .from(pastes)
    .where(eq(pastes.slug, slug))
    .limit(1);

  if (!paste) {
    return { title: "Paste non trouvé — TextDrop" };
  }

  const title = paste.title || "TextDrop";
  const description = paste.content.substring(0, 200).replace(/\n/g, " ");

  return {
    title: `${title} — TextDrop`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PastePage({ params }: Props) {
  const { slug } = await params;

  const [paste] = await db
    .select()
    .from(pastes)
    .where(eq(pastes.slug, slug))
    .limit(1);

  if (!paste) {
    notFound();
  }

  const createdAt = new Date(paste.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const wordCount = paste.content.trim().split(/\s+/).length;
  const charCount = paste.content.length;

  // Calculate reading time (average 200 wpm for French)
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-sm font-bold shadow-md shadow-brand-600/30">
              T
            </div>
            <span className="font-bold text-sm">TextDrop</span>
          </a>
          <div className="flex items-center gap-2">
            <CopyButton text={paste.content} label="Copier le texte" />
            <a
              href={`/api/pastes/${slug}/raw`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-colors"
            >
              📄 Texte brut
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <article>
          {/* Title */}
          {paste.title && (
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-brand-300 bg-clip-text text-transparent leading-tight">
              {paste.title}
            </h1>
          )}

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-8 pb-4 border-b border-white/10">
            <span>📅 {createdAt}</span>
            <span className="text-slate-600">•</span>
            <span>{wordCount.toLocaleString()} mots</span>
            <span className="text-slate-600">•</span>
            <span>{charCount.toLocaleString()} caractères</span>
            <span className="text-slate-600">•</span>
            <span>⏱️ ~{readingTime} min de lecture</span>
          </div>

          {/* The actual text content */}
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-base font-normal break-words">
              {paste.content}
            </div>
          </div>
        </article>

        {/* Bottom info card for AI access */}
        <div className="mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            🤖 Accès pour les IA
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Pour donner ce texte à une IA (ChatGPT, Claude, Gemini...), utilisez
            le lien brut ci-dessous. L&apos;IA pourra lire et reproduire
            l&apos;intégralité du contenu.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-emerald-300 bg-black/30 px-3 py-2 rounded-lg break-all">
              /api/pastes/{slug}/raw
            </code>
            <CopyRawUrlButton slug={slug} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>TextDrop — Partagez vos textes instantanément</span>
          <a
            href="/"
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            ✨ Créer un nouveau TextDrop
          </a>
        </div>
      </footer>
    </div>
  );
}
