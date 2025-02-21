import { Request, Response } from 'express';
import Checklist, { IChecklist } from '../models/Checklist.model';
import AIService from '../services/ai.service';

export const createChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id; // À implémenter avec l'authentification

    // Générer les étapes avec l'IA
    const generatedSteps = await AIService.generateChecklist(description);
    
    const steps = generatedSteps.map((text, index) => ({
      text,
      isCompleted: false,
      order: index + 1
    }));

    const checklist = new Checklist({
      userId,
      title,
      description,
      steps
    });

    await checklist.save();
    res.status(201).json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la checklist" });
  }
};

export const getChecklists = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const checklists = await Checklist.find({ userId });
    res.json(checklists);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des checklists" });
  }
};

export const updateChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const checklist = await Checklist.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!checklist) {
      res.status(404).json({ message: "Checklist non trouvée" });
      return;
    }

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la checklist" });
  }
};

export const deleteChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const checklist = await Checklist.findOneAndDelete({ _id: id, userId });
    if (!checklist) {
      res.status(404).json({ message: "Checklist non trouvée" });
      return;
    }
    
    res.status(200).json({ message: "Checklist supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

export const shareChecklist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const shareLink = `${process.env.APP_URL}/checklist/share/${id}`;
    
    const checklist = await Checklist.findByIdAndUpdate(
      id,
      { shareLink },
      { new: true }
    );
    
    res.json({ shareLink });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du partage" });
  }
}; 