import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import logger from './LoggerFactory';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: 'NOT FOUND' });
};

export const serverError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  res.status(500);
  res.json({ error: 'Internal server error' });
};

export const validationError = (req: Request, res: Response) => {
  const validateErrors = validationResult(req);
  if (!validateErrors.isEmpty()) {
    res.status(422);
    res.json({ errors: validateErrors.array() });
    return true;
  }
  return false;
};
