import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import checklistRoutes from './routes/checklist.routes';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/error.handler';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Configuration de la connexion MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartchecklist';

mongoose.connect(mongoUri)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error: Error) => console.error('Erreur de connexion MongoDB:', error));

// Routes
app.use('/api/checklists', checklistRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;