import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Connexion à MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connecté avec succès !");
    // Lancer le serveur seulement après la connexion réussie
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err);
    process.exit(1); // Arrêter l'application en cas d'échec de connexion
  });

// Route de test
app.get("/", (req, res) => {
  res.send("API SmartChecklist en cours de développement 🚀");
});
