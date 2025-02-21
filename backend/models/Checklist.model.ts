import mongoose, { Schema, Document} from "mongoose";

export interface IChecklist extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  steps: Array<{
    text: string;
    isCompleted: boolean;
    order: number;
  }>;
  status: 'draft' | 'final';
  shareLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistShema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  steps: [{
    text: { type: String, required: true },
    isCompleted: { type: Boolean, required: true },
    order: { type: Number, required: true }
  }],
  status: { type: String, enum: ['draft', 'final'], default: 'draft' },
  shareLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChecklist>('Checklist', ChecklistShema);