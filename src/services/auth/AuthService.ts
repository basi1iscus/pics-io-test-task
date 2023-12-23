import logger from '../helpers/LoggerFactory';
import { UserDAL, comparePassword } from '../../database/UserDAL';
import { generateJWT } from './jwtService';

export class AuthService {
  userDAL: UserDAL;
  constructor() {
    this.userDAL = new UserDAL();
  }

  async login(email: string, password: string) {
    const user = await this.userDAL.findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      logger.error('Invalid credentials');
      throw new Error('Invalid credentials');
    }

    return { token: generateJWT({ id: user._id.toString() }) };
  }
}
