const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { db, findUser } = require('./db.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    done(null, await findUser({ id }));
  } catch (e) {
    done(e);
  }
});

passport.use(new LocalStrategy({
  usernameField: 'handle'
}, async (handle, password, done) => {
  try {
    const user = await db.oneOrNone(`SELECT password FROM users WHERE handle = $1 LIMIT 1`, handle);

    if (!user) done(null, false);

    if (await bcrypt.compare(password, user.password)) {
      done(null, await findUser({ handle }));
    } else {
      done(null, false);
    }
  } catch (e) {
    done(e);
  }
}));

module.exports = passport;
