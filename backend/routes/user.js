const Router = require('koa-router');
const { db, getAllUsers, findUserById } = require('../db.js');
const { checkAuth } = require('../auth.js');

const router = new Router();

router.get('/list-all', checkAuth, async ctx => {
  try {
    ctx.body = {
      status: 'ok',
      users: await getAllUsers(ctx.state.user.id)
    };
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
    ctx.status = 400;
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

router.get('/:id', checkAuth, async ctx => {
  try {
    const user = await findUserById(ctx.params.id, ctx.state.user.id);
    delete user.email; // Obfuscate user email
    ctx.body = {
      status: 'ok',
      user
    };
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

router.get('/:id/tweets', checkAuth, async ctx => {
  try {
    const tweets = await db.manyOrNone(`
      SELECT t.tweet_id, t.user_id, t.tweet_contents, count(l.user_id) AS likes FROM tweets t
      LEFT JOIN likes l ON l.tweet_id = t.tweet_id
      WHERE t.user_id = $1
      GROUP BY t.tweet_id
      ORDER BY t.tweet_id DESC
    `, ctx.params.id);
    ctx.body = {
      status: 'ok',
      tweets
    };
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

module.exports = router;
