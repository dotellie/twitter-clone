const Router = require('koa-router');
const bodyparser = require('koa-body');
const bcrypt = require('bcrypt');
const { db } = require('../db.js');
const { passport, checkAuth } = require('../auth.js');

const router = new Router();

const checkUnique = async (field, value) => !(await db.one(
  `SELECT EXISTS(SELECT 1 FROM users WHERE ${field} = $1)`, value)
).exists;

router.post('/register', bodyparser(), async ctx => {
  const { name, handle, email, password } = ctx.request.body;

  if (!name || !handle || !email || !password) {
    ctx.body = {
      status: 'error',
      missingFields: ['name', 'handle', 'email', 'password'].filter(v => !ctx.request.body[v])
    };
    ctx.status = 400;
    return;
  }

  const handleUnique = await checkUnique('handle', handle);
  const emailUnique = await checkUnique('email', email);

  if (!handleUnique || !emailUnique) {
    ctx.body = {
      status: 'error',
      notUnique: [handleUnique || 'handle', emailUnique || 'email'].filter(v => v !== true)
    };
    ctx.status = 409;
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.none(`INSERT INTO users(full_name, handle, email, password) VALUES($1, $2, $3, $4)`, [
      name,
      handle,
      email,
      hash
    ]);
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unknown error occured'
    };
    ctx.status = 500;
    return;
  }

  ctx.body = {
    status: 'ok'
  };
});

router.post('/login', bodyparser(), async ctx => {
  // There might be a better way to handle this, but this is what I found worked.
  await new Promise(resolve => {
    passport.authenticate('local', async (err, user) => {
      if (err || user === false) {
        ctx.body = {
          status: 'error',
          message: 'The login credentials couldn\'t be verified. ' +
            'Please check your handle and password'
        };
        ctx.status = 401;
      } else {
        await ctx.login(user);
        ctx.body = {
          status: 'ok',
          user
        };
      }
      resolve();
    })(ctx);
  });
});

router.post('/logout', checkAuth, async ctx => {
  ctx.logout();
  ctx.body = {
    status: 'ok'
  };
});

router.post('/update-info', bodyparser(), checkAuth, async ctx => {
  try {
    const { currentPassword, newPassword, newHandle } = ctx.request.body;

    const hasNewHandle = newHandle && newHandle !== ctx.state.user.handle;
    if (!newPassword && !hasNewHandle) {
      ctx.body = {
        status: 'error',
        message: 'No new data supplied'
      };
      ctx.status = 400;
      return;
    }

    const { password: currentHash } = await db.one(
      `SELECT password FROM users WHERE user_id = $1`,
      ctx.state.user.id
    );

    if (!currentPassword || !await bcrypt.compare(currentPassword, currentHash)) {
      ctx.body = {
        status: 'error',
        invalidFields: ['currentPassword']
      };
      ctx.status = 401;
      return;
    }

    const toUpdate = {};

    if (newHandle && newHandle !== ctx.state.user.handle) {
      const handleUnique = await checkUnique('handle', newHandle);
      if (!handleUnique) {
        ctx.body = {
          status: 'error',
          notUnique: ['handle']
        };
        ctx.status = 409;
        return;
      }

      toUpdate.handle = newHandle;
    }

    if (newPassword) {
      const hash = await bcrypt.hash(newPassword, 10);
      toUpdate.password = hash;
    }

    if (Object.keys(toUpdate).length > 0) {
      await db.none(`UPDATE users SET ${
        Object.keys(toUpdate).map(key => `${key} = $<${key}>`).join(', ')
      } WHERE user_id = $<id>`, { id: ctx.state.user.id, ...toUpdate });
      ctx.logout();
      ctx.body = {
        status: 'ok'
      };
    } else {
      throw new Error('No fields set'); // This should never actually occur in practice
    }
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unknown error occured'
    };
    ctx.status = 500;
  }
});

module.exports = router;
