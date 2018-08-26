const fs = require('fs');
const crypto = require('crypto');
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
  },
  findUser: async params => {
    const query = (key, value) => {
      if (!params[key]) return;
      return db.one(`SELECT * FROM users WHERE ${key} = $1 LIMIT 1`, value);
    };

    let fetched;
    try {
      fetched = await query('user_id', params.id) || await query('handle', params.handle);
    } catch (e) {
      throw e;
    }

    if (!fetched) return false;

    const avatarHash = crypto.createHash('md5').update(fetched['email']).digest('hex');
    return {
      id: fetched['user_id'],
      name: fetched['full_name'],
      handle: fetched['handle'],
      email: fetched['email'],
      avatarUrl: `//www.gravatar.com/avatar/${avatarHash}`
    };
  }
};
