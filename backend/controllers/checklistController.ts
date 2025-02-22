import { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.HF_API_KEY) {
  throw new Error('La clé API Hugging Face est manquante');
}

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct';

interface HFResponse {
  generated_text: string;
}

export const generateChecklist: RequestHandler = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      res.status(400).json({ error: 'Description requise' });
      return;
    }

    console.log('Génération de checklist pour:', description);

    const response = await axios.post(HF_API_URL, 
      {
        inputs: `Crée une checklist détaillée pour: ${description}`,
        parameters: { temperature: 0.7, max_new_tokens: 200 }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data as HFResponse[];

    if (!data || !data[0]?.generated_text) {
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
