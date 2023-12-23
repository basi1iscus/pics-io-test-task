import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/auth/AuthService';
import { validationError } from '../services/helpers/errorHandler';

const router = express.Router();

const postLoginValidationFlow = [
  body('email').isEmail(),
  body('password').notEmpty(),
];

router.post(
  '/login',
  postLoginValidationFlow,
  async (req: Request, res: Response) => {
    if (validationError(req, res)) return;

    const { email, password } = req.body;

    try {
      const result = await new AuthService().login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
      return;
    }
  }
);

export default router;
