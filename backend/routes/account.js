const Router = require('koa-router');
const bodyparser = require('koa-body');
const bcrypt = require('bcrypt');
const { db } = require('../db.js');

const router = new Router();

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

  const checkUnique = async (field, value) => !(await db.one(
    `SELECT EXISTS(SELECT 1 FROM users WHERE ${field} = $1)`, value)
  ).exists;

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

module.exports = router;
