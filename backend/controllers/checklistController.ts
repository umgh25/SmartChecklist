import { Request, Response } from 'express';
import fetch from 'node-fetch';

if (!process.env.HF_API_KEY) {
  throw new Error('La clé API Hugging Face est manquante');
}

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct';

export const generateChecklist = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description requise' });
    }

    console.log('Génération de checklist pour:', description);

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `Crée une checklist détaillée pour: ${description}`,
        parameters: { temperature: 0.7, max_new_tokens: 200 }
      })
    });

    const data = await response.json();

    if (!response.ok || !data || !data[0]?.generated_text) {
      throw new Error('Réponse invalide de l\'API Hugging Face');
    }

    const checklistText = data[0].generated_text;
    const checklistItems = checklistText
      .split('\n')
      .filter(item => item.trim() && /^\d+\./.test(item)) // Garde seulement les lignes numérotées
      .map((item, index) => ({
        id: index + 1,
        text: item.replace(/^\d+\.\s*/, '').trim(),
        completed: false
      }));

    if (checklistItems.length === 0) {
      throw new Error('Aucun élément de checklist généré');
    }

    console.log('Checklist générée:', checklistItems);
    res.json(checklistItems);

  } catch (error) {
    console.error('Erreur détaillée:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la génération de la checklist',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};
