import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setChecklist(null);

    try {
      console.log('Début de la génération...');
      const result = await generateChecklist(prompt);
      console.log('Résultat reçu:', result);
      if (result.items && result.items.length > 0) {
        setIsLoading(false);
        const state = encodeURIComponent(JSON.stringify(result));
        router.push(`/checklist?state=${state}`);
      } else {
        setIsLoading(false);
        setError("Aucune étape n'a été générée. Veuillez réessayer avec une description plus détaillée.");
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : "Une erreur s'est produite lors de la génération de la checklist.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white relative overflow-hidden flex items-center justify-center">
      {/* Effet de fond subtil */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <Head>
        <title>Générateur de Checklist IA</title>
        <meta name="description" content="Créez des checklists personnalisées avec l'IA" />
      </Head>

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Générateur de Checklist IA
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Comment organiser une fête d'anniversaire..."
                className="flex-1 bg-[#1A1E26] border border-gray-700 rounded-lg px-4 py-3 
                         focus:border-[#6366F1] focus:outline-none transition-colors
                         placeholder:text-gray-500"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500
                         text-white rounded-lg px-8 py-3 font-medium
                         hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Génération...' : 'Générer'}
              </motion.button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

          {checklist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1E26] border border-gray-700 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Votre Checklist</h2>
              <ul className="space-y-3">
                {checklist.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {
                        setChecklist(
                          checklist.map((i) =>
                            i.id === item.id ? { ...i, completed: !i.completed } : i
                          )
                        );
                      }}
                      className="mt-1 rounded border-gray-600 bg-gray-700 text-emerald-500 
                               focus:ring-emerald-500 focus:ring-offset-0"
                    />
                    <span className={item.completed ? 'line-through text-gray-500' : ''}>
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
