require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db"
};

module.exports = env;

