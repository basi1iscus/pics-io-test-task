import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';
import { UserDAL } from './UserDAL';

const mongoUri = process.env.MONGO_URI;
const databaseName = process.env.DATABASE_NAME;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

class DatabaseFactory {
  client: MongoClient;
  database: Db | null = null;

  async connect() {
    const client = new MongoClient(mongoUri);
    try {
      this.client = await client.connect();
      this.database = this.client.db(databaseName);
      if ((await this.database.collection('users').countDocuments()) === 0) {
        new UserDAL().createUser({
          email: adminEmail,
          password: adminPassword,
        });
      }
    } catch (error) {
      console.error(`Could not connect to MongoDB db ${mongoUri}`, error);
      if (client) {
        client.close();
      }
      process.exit(1);
    }
  }
}

export default new DatabaseFactory();
