export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold mb-2">Paste non trouvé</h1>
        <p className="text-slate-400 mb-6">
          Ce lien n&apos;existe pas ou a été supprimé.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
        >
          ← Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}
