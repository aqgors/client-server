const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  out: './drizzle',
  schema: './src/adapters/postgres/schemas', // вся папка зі схемами
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: process.env.PG_DATABASE_URL,
  },
});
