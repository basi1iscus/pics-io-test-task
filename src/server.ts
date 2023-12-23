import express from 'express';
import 'express-async-errors';
import passport from 'passport';
import eventsController from './controllers/eventsController';
import authController from './controllers/authController';
import { notFound, serverError } from './services/helpers/errorHandler';
import { jwtStrategy } from './services/auth/jwtService';
import { addRequestToLog } from './services/requestLogger/requestLogger';

function createServer() {
  const app = express();

  const middleware = [
    express.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
    express.json({ limit: '50mb' }),
  ];

  passport.initialize();
  passport.use('jwt', jwtStrategy);

  middleware.forEach((item) => app.use(item));
  app.use(addRequestToLog);

  app.use('/api/v1/auth', authController);
  app.use(
    '/api/v1/events',
    passport.authenticate('jwt', { session: false }),
    eventsController
  );

  app.use(notFound);
  app.use(serverError);

  return app;
}

export default createServer;
