import { useRouter } from 'next/router';
import { ChecklistItem } from '@/services/api';
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
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const savedChecklist = localStorage.getItem(`checklist-${id}`);
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      }
      setLoading(false);
    }
  }, [router.isReady, id]);

  const toggleItem = (index: number) => {
    if (!checklist) return;

    const newItems = [...checklist.items];
    newItems[index] = {
      ...newItems[index],
      completed: !newItems[index].completed
    };

    const updatedChecklist = {
      ...checklist,
      items: newItems
    };

    setChecklist(updatedChecklist);
    localStorage.setItem(`checklist-${id}`, JSON.stringify(updatedChecklist));
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

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4">
      {checklist ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">{checklist.title}</h1>
          <ul>
            {checklist.items.map((item, index) => (
              <li key={item.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(index)}
                />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Checklist introuvable.</p>
      )}
    </div>
  );
}
