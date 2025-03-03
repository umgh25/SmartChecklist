import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

export default function ChecklistRedirect () {
  const router = useRouter();
  const { state } = router.query;


  useEffect(() => {
    if (!router.isReady) return;

    if (state) {
      try {
        const data = JSON.parse(decodeURIComponent(state as string));
        const newChecklist = {
          id: nanoid(10),
          title: data.title,
          items: data.items,
          createAt: new Date().toISOString(),
        };

        // Sauvegarder formulaire dans le local storage
        localStorage.setItem(`checklist-${newChecklist.id}`, JSON.stringify(newChecklist));

        // Rediriger vers l'URL avec l'ID de la checklist
        router.replace(`/checklist/${newChecklist.id}`);
      } catch (error) {
        console.error('Erreur lors du parsing de la checklist:', error);
        router.push('/');
        }
      } else {
        router.push('/');
      }
  }, [router.isReady, state]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirection...</h1>
      </div>
    </div>
  );
} 
    
