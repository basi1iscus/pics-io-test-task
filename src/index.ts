import dotenv from 'dotenv';

import createServer from './server';
import databaseFactory from './database/DatabaseFactory';

dotenv.config();

databaseFactory
  .connect()
  .then(() => {
    console.log(`DB connected`);
  })
  .then(() => {
    const server = createServer();
    const port = Number.parseInt(process.env.PORT || '3000');
    server.listen(port, () => {
      console.log(`Server listening at ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
