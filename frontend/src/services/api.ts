import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface GeneratedChecklist {
  title: string;
  items: ChecklistItem[];
}

export const generateChecklist = async (prompt: string): Promise<GeneratedChecklist> => {
  try {
    console.log('Envoi de la requête au backend avec le prompt:', prompt);
    
    const response = await api.post('/checklists/generate', {
      prompt: prompt
    });

    console.log('Réponse du backend:', response.data);

    if (!response.data || !response.data.items) {
      throw new Error('Réponse invalide du serveur');
    }

    return {
      title: prompt,
      items: response.data.items.map((item: any, index: number) => ({
        id: `step-${index + 1}`,
        text: item.text,
        completed: false
      }))
    };
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw new Error('Erreur lors de la génération de la checklist. Veuillez réessayer.');
  }
};

export { api }; 