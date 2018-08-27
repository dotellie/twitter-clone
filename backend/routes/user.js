const Router = require('koa-router');
const { db, getAllUsers, findUserById } = require('../db.js');
const { checkAuth } = require('../auth.js');

const router = new Router();

router.get('/list-all', async ctx => {
  try {
    ctx.body = await getAllUsers();
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

router.post('/:id/follow', checkAuth, async ctx => {
  if (ctx.state.user.id.toString() === ctx.params.id.toString()) {
    ctx.body = {
      status: 'error',
      message: 'You can\'t follow yourself.'
    };
    ctx.body = 400;
    return;
  }

  try {
    await db.none(
      `INSERT INTO user_follows (user_id, following_id) VALUES ($1, $2)`,
      [ctx.state.user.id, ctx.params.id]
    );
    ctx.body = {
      status: 'ok'
    };
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

router.post('/:id/unfollow', checkAuth, async ctx => {
  try {
    await db.none(
      `DELETE FROM user_follows WHERE user_id = $1 AND following_id = $2`,
      [ctx.state.user.id, ctx.params.id]
    );
    ctx.body = {
      status: 'ok'
    };
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

router.get('/:id', async ctx => {
  try {
    const user = await findUserById(ctx.params.id);
    delete user.email; // Obfuscate user email
    ctx.body = user;
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

module.exports = router;
