
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: { encrypt: true }
};

let pool;

async function getDb() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

module.exports = { getDb, sql };
