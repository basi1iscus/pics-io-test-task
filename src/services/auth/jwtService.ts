import jwt from 'jsonwebtoken';
import passportJWT from 'passport-jwt';

import { UserDAL } from '../../database/UserDAL';

const JWT_SECRET = process.env.JWT_SECRET || 'super-puper secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3h';

const jwtOptions = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtStrategy = new passportJWT.Strategy(
  jwtOptions,
  (jwtPayload, done) => {
    new UserDAL()
      .findUserById(jwtPayload.id)
      .catch((error) => done(error, false))
      .then((user) => {
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      });
  }
);

export function generateJWT(payload: { id: string }) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}
