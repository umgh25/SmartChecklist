import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ChecklistItem } from '@/services/api';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ChecklistData {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
}

export default function ChecklistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    if (id) {
      // Récupérer depuis le localStorage
      const savedChecklist = localStorage.getItem(`checklist-${id}`);
      if (savedChecklist) {
        setChecklistData(JSON.parse(savedChecklist));
      }
      setLoading(false);
    }
  }, [router.isReady, id]);

  const toggleItem = (index: number) => {
    if (!checklistData) return;
    
    const newItems = [...checklistData.items];
    newItems[index] = {
      ...newItems[index],
      completed: !newItems[index].completed
    };
    
    const updatedChecklist = {
      ...checklistData,
      items: newItems
    };
    
    setChecklistData(updatedChecklist);
    localStorage.setItem(`checklist-${checklistData.id}`, JSON.stringify(updatedChecklist));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
        </div>
      </div>
    );
  }

  if (!checklistData) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Checklist non trouvée</h1>
          <Link 
            href="/"
            className="text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = checklistData.items.filter(item => item.completed).length;
  const progress = (completedCount / checklistData.items.length) * 100;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-6">
      {/* En-tête */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            ← Retour
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">ID: {checklistData.id}</span>
            <button 
              className="bg-[#6366F1] hover:bg-[#4F46E5] px-4 py-2 rounded-lg transition-colors"
              onClick={() => window.print()}
            >
              Imprimer
            </button>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-6">
          {checklistData.title}
        </h1>

        {/* Barre de progression */}
        <div className="bg-[#1A1E26] border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progression</span>
            <span>{completedCount} / {checklistData.items.length} tâches complétées</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500 transition-all duration-300"
            />
          </div>
        </div>
      </header>

      {/* Liste principale */}
      <main className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1E26] border border-gray-700 rounded-lg p-6 shadow-xl"
        >
          <div className="space-y-2">
            {checklistData.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#6366F1]/10 text-[#6366F1] font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleItem(index)}
                        className="peer w-5 h-5 border-2 border-gray-600 rounded-md 
                                 bg-transparent appearance-none cursor-pointer
                                 checked:border-[#6366F1] checked:bg-[#6366F1]
                                 hover:border-[#6366F1]/50 transition-all duration-200"
                      />
                      <svg
                        className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity duration-200"
                        viewBox="0 0 17 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 5.5L5.5 10L15.5 1" />
                      </svg>
                    </div>
                    <span className={`transition-all duration-200 text-sm md:text-base
                                   ${item.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                      {item.text}
                    </span>
                  </label>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
} 