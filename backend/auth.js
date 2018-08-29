const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { db, findUserById, findUserByHandle } = require('./db.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
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
      done(null, await findUserByHandle(handle));
    } else {
      done(null, false);
    }
  } catch (e) {
    done(e);
  }
}));

/// Checks that a user is authenticated when applied as a middleware.
const checkAuth = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  } else {
    ctx.body = {
      status: 'unathenticated',
      message: 'You\'re not signed in. Please refresh the page.'
    };
  }
};

module.exports = { passport, checkAuth };
