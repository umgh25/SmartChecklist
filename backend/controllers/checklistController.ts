import { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.HF_API_KEY) {
  throw new Error('La clé API Hugging Face est manquante');
}

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

const systemPrompt = `Tu es un assistant spécialisé dans la création de checklists techniques en français.
Tu dois ABSOLUMENT répondre en français et uniquement sur le sujet demandé.

Ta tâche est de générer une checklist étape par étape technique et précise.
Format de réponse STRICT à suivre :
1. Chaque étape doit être une instruction technique précise
2. Chaque étape DOIT commencer par un verbe d'action à l'infinitif en français (ex: Créer, Configurer, Implémenter...)
3. Les étapes doivent suivre une progression logique de développement
4. Les étapes doivent être spécifiques au développement React
5. Retourne UNIQUEMENT la liste des étapes numérotées
6. Chaque étape doit être sur une nouvelle ligne

Exemple pour une fonctionnalité React :
1. Créer un nouveau composant React
2. Importer les dépendances nécessaires
3. Définir la structure du composant
4. Implémenter la logique métier
5. Ajouter les styles CSS

IMPORTANT : 
- Répondre UNIQUEMENT en français
- Rester STRICTEMENT dans le contexte du développement React
- Ne donner QUE des étapes techniques et précises
- Ne JAMAIS inclure de texte autre que les étapes numérotées`;


interface HFResponse {
  generated_text: string;
}

export const generateChecklist: RequestHandler = async (req, res) => {
  try {
    console.log('🔵 Requête reçue sur /api/checklists/generate');
    const { prompt } = req.body;

    if (!prompt) {
      console.error('❌ Erreur: prompt manquant');
      res.status(400).json({ error: 'prompt requise' });
      return;
    }

    console.log('Génération de checklist pour:', prompt);

    const response = await axios.post(HF_API_URL, 
      {
        inputs: `${systemPrompt}\n\nUtilisateur: J'ai besoin d'une checklist détaillée en français pour : ${prompt}\n\nAssistant: Voici les étapes à suivre :\n`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    console.log('✅ Checklist générée');
    const data = response.data;
    console.log('📄 Réponse brute de HF:', data);

    // Traitement de la réponse
    let generatedText = '';
    if (Array.isArray(data)) {
      generatedText = data[0].generated_text || '';
    } else if (typeof data === 'object') {
      generatedText = data.generated_text || JSON.stringify(data);
    } else {
      generatedText = String(data);
    }

    console.log('📄 Checklist générée:', generatedText);

    // Extreraire les étapes de la checklist
        // Extraction des étapes
        const lines = generatedText
        .split('\n')
        .map(line => line.trim())
        .filter(line => 
          line.length > 0 && 
          !line.toLowerCase().includes('voici') && 
          !line.toLowerCase().includes('checklist') &&
          line.match(/^\d+\./) && // Vérifie que la ligne commence par un numéro
          /^[1-9][0-9]*\.\s*(Créer|Configurer|Ajouter|Implémenter|Définir|Modifier|Tester|Vérifier|Installer|Intégrer)/i.test(line) // Vérifie que la ligne commence par un verbe d'action en français
        );
  
      console.log('📋 Lignes extraites:', lines);

      if (lines.length === 0 || lines.some(line =>  /\b(spotify|playlist|song|music|vampire)\b/i.test(line))) {
        console.error('❌ Aucune étape trouvée');
        throw new Error('La réponse généré n\'est pas une checklist valide');
      }

      const items = lines.map ((text, index) => ({
        id: `step-${index + 1}`,
        text: text.replace(/^\d+\.\s*/, ''), // Supprime le numéro de l'étape
        completed: false

      }));

      console.log('✅ Items formatés:', items);
      res.json({ items });

  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de la génération de la checklist',
      detais: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
}