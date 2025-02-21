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
        model: 'gpt2',  // Vous pouvez choisir un modèle plus approprié
        inputs: `Générer une checklist pour: ${description}\n`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        }
      });

      // Traitement de la réponse pour extraire les étapes
      const steps = response.generated_text
        .split('\n')
        .filter((step: string) => step.trim().length > 0);

      return steps;
    } catch (error) {
      console.error('Erreur lors de la génération de la checklist:', error);
      throw error;
    }
  }
}

export default new AIService(); 