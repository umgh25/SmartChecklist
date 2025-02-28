import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');
  }

  async generateChecklist(description: string): Promise<string[]> {
    try {
      const response = await this.hf.textGeneration({
        model: 'mistral-7b-instinct', // modèle plus adapté
        inputs: `Générer une checklist pour: ${description}\n`,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        }
      });

      //Diviser la checklist en éléments distincts
      const steps = response.generated_text
        .split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0);

      return steps;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la checklist:', error);
      return [];
    }
  }
}

export default new AIService(); 