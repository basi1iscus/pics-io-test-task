import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import mongodb, { ObjectId } from 'mongodb';

import databaseFactory from './DatabaseFactory';

export interface IUser {
  _id: mongodb.BSON.ObjectId;
  email: string;
  password: string;
}

const SALT_LEN = 32;
const KEY_LEN = 64;

const pscrypt = promisify(scrypt);

async function getPasswordHash(
  password: string,
  salt = undefined
): Promise<string> {
  if (!salt) {
    salt = randomBytes(SALT_LEN).toString('hex');
  }
  const hashedPassword = (await pscrypt(password, salt, KEY_LEN)) as Buffer;
  return `${salt}${hashedPassword.toString('hex')}`;
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hashedPasswordForCompare = await getPasswordHash(
    password,
    hashedPassword.slice(0, SALT_LEN * 2)
  );
  return timingSafeEqual(
    Buffer.from(hashedPasswordForCompare),
    Buffer.from(hashedPassword)
  );
}

export class UserDAL {
  collection: mongodb.Collection;

  constructor() {
    this.collection = databaseFactory.database.collection('users');
  }

  async createUser(userData: Partial<IUser>): Promise<Pick<IUser, '_id'>> {
    const hashedPassword = await getPasswordHash(userData.password);
    const user = await this.collection.insertOne({
      ...userData,
      password: hashedPassword,
    });
    return { _id: user.insertedId };
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.collection
      .findOne({ email })
      .then((data) => (data ? ({ ...data } as IUser) : null))
      .catch((error) => {
        throw Error(error.message);
      });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.collection
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })
      .then((data) => (data ? ({ ...data } as IUser) : null))
      .catch((error) => {
        throw Error(error.message);
      });
  }
}
