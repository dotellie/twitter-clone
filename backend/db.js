const fs = require('fs');
const crypto = require('crypto');
const pgp = require('pg-promise')();

const CONNECTION_RETRY_ATTEMPTS = 5;

const db = pgp({
  host: 'twitter-clone-db',
  port: 5432,
  database: 'twitter-clone',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

const dbInitQuery = fs.readFileSync('./sql/db-structure.sql', 'utf8');

/// Converts a raw database user result to a result to be returned through the API.
const convertUser = user => {
  if (!user) return false;

  const avatarHash = crypto.createHash('md5').update(user['email']).digest('hex');
  return {
    id: user['user_id'],
    name: user['full_name'],
    handle: user['handle'],
    email: user['email'],
    following: Boolean(user['following']),
    avatarUrl: `//www.gravatar.com/avatar/${avatarHash}`
  };
};

module.exports = {
  /// The main database instance.
  db,
  /// Initializes the database if tabels aren't already present.
  initDB: async () => {
    let success = false;

    for (let i = 0; i < CONNECTION_RETRY_ATTEMPTS; i++) {
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
  /// Finds a user by their ID. Supply `checkFollowId` to check if the current user is following the
  /// found user.
  findUserById: async (id, checkFollowId) => {
    let fetched;
    try {
      if (typeof checkFollowId !== 'undefined') {
        fetched = await db.one(`
          SELECT u.*, f AS following FROM users u
          LEFT JOIN user_follows f ON f.user_id = $1 AND f.following_id = $2
          WHERE u.user_id = $2
        `, [checkFollowId, id]);
      } else {
        fetched = await db.one(`SELECT * FROM users WHERE user_id = $1`, id);
      }
    } catch (e) {
      throw e;
    }
    return convertUser(fetched);
  },
  /// Finds a user by their handle.
  findUserByHandle: async handle => {
    let fetched;
    try {
      fetched = await db.one(`SELECT * FROM users WHERE handle = $1`, handle);
    } catch (e) {
      throw e;
    }
    return convertUser(fetched);
  },
  /// Queries all users. Supply `checkFollowId` to check if the current user is following the
  /// found users.
  getAllUsers: async checkFollowId => {
    try {
      return (await db.manyOrNone(`
        SELECT u.*, f AS following FROM users u
        LEFT JOIN user_follows f ON f.user_id = $1 AND f.following_id = u.user_id
      `, checkFollowId)).map(convertUser);
    } catch (e) {
      throw e;
    }
  }
};
