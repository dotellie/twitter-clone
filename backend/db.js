const fs = require('fs');
const pgp = require('pg-promise')();

const CONNECTION_RETY_ATTEMPTS = 5;

const db = pgp({
  host: 'twitter-clone-db',
  port: 5432,
  database: 'twitter-clone',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

const dbInitQuery = fs.readFileSync('./sql/db-structure.sql', 'utf8');

module.exports = {
  db,
  initDB: async () => {
    let success = false;

    for (let i = 0; i < CONNECTION_RETY_ATTEMPTS; i++) {
      try {
        await db.multi(dbInitQuery);
        success = true;
        break;
      } catch (e) {
        await new Promise(resolve => {
          setTimeout(resolve, 1000);
        });
      }
    }

    if (!success) {
      throw new Error("Couldn't initialize database");
    }
  }
};
