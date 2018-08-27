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

const convertUser = user => {
  if (!user) return false;

  const avatarHash = crypto.createHash('md5').update(user['email']).digest('hex');
  return {
    id: user['user_id'],
    name: user['full_name'],
    handle: user['handle'],
    email: user['email'],
    avatarUrl: `//www.gravatar.com/avatar/${avatarHash}`
  };
};

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
  findUserById: async id => {
    let fetched;
    try {
      fetched = await db.one(`SELECT * FROM users WHERE user_id = $1`, id);
    } catch (e) {
      throw e;
    }
    return convertUser(fetched);
  },
  findUserByHandle: async handle => {
    let fetched;
    try {
      fetched = await db.one(`SELECT * FROM users WHERE handle = $1`, handle);
    } catch (e) {
      throw e;
    }
    return convertUser(fetched);
  },
  getAllUsers: async () => {
    try {
      return (await db.manyOrNone(`SELECT * FROM users`)).map(convertUser);
    } catch (e) {
      throw e;
    }
  }
};
