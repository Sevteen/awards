import { ConnectionOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/dev.env' });
}

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/../../../../database/migrations/**/*{.ts,.js}'],
  logging: true
  //   cli: {
  //     migrationsDir: 'database/migrations'
  //   }
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

console.log(config);

export default new DataSource(config);
