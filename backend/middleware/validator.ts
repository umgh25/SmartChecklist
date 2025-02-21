import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateChecklist = [
  body('title').notEmpty().trim().isLength({ min: 3 }),
  body('description').notEmpty().trim(),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];