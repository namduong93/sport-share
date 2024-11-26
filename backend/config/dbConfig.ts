// Later can make a .env file and use the dotenv package to load
// into process.env
export const dbConfig = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  // host is the name as in the docker compose

  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME || 'capstone_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'ab',
};
