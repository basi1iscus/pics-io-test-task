import { EventsService } from '../services/events/EventsService';

import express, { Request, Response } from 'express';
import { validationError } from '../services/helpers/errorHandler';
import { body } from 'express-validator';

const router = express.Router();

const postValidationFlow = [
  body('payload').notEmpty(),
  body('possibleDestinations').isArray(),
  body('possibleDestinations.*.*').isBoolean(),
  body('strategy').optional().isString(),
];

router.post('/', postValidationFlow, async (req: Request, res: Response) => {
  if (validationError(req, res)) return;

  const { payload, possibleDestinations, strategy } = req.body;

  const result = await new EventsService().handleEvent(
    payload,
    possibleDestinations,
    strategy
  );
  res.json(result);
});

export default router;
