import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checklistsRoutes from "./routes/checklistRoutes";


dotenv.config();


const app = express();
const port = process.env.PORT || 5000;

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:3000', // URL de votre frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Test routes 
app.get('/', (req, res) => {
  res.send('App is working');
});

app.use('/api/checklists', checklistsRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

