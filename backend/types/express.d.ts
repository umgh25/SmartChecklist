import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // autres propriétés utilisateur si nécessaire
      };
    }
  }
} 