import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TESTS = 'tests',
}

export const NODE_ENV = process.env.NODE_ENV || NodeEnv.PRODUCTION;
export const PORT = parseInt(process.env.PORT || '3000', 10);

const databaseConnectionString =
  new URL(
    process.env.DATABASE_CONNECTION ||
    'postgres://accounts:secret@accounts_db:5432/accounts'
  );
export const DATABASE_NAME = databaseConnectionString.pathname.substring(1);
export const DATABASE_USER = databaseConnectionString.username;
export const DATABASE_PASSWORD = databaseConnectionString.password;
export const DATABASE_HOST = databaseConnectionString.hostname;
export const DATABASE_PORT = parseInt(databaseConnectionString.port, 10);

export const DATABASE_CONNECTION_LIMIT_PER_INSTANCE =
  parseInt(process.env.DATABASE_CONNECTION_LIMIT_PER_INSTANCE || '75', 10);
