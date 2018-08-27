const Router = require('koa-router');
const bodyparser = require('koa-body');
const { db } = require('../db.js');
const { checkAuth } = require('../auth.js');

const router = new Router();

router.post('/insert', checkAuth, bodyparser(), async ctx => {
  const { contents } = ctx.request.body;

  if (!contents) {
    ctx.body = {
      status: 'error',
      message: 'You can\'t tweet an empty tweet'
    };
    ctx.status = 400;
    return;
  }

  try {
    await db.none(
      `INSERT INTO tweets (user_id, tweet_contents) VALUES ($1, $2)`,
      [ctx.state.user.id, contents]
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

router.del('/:id', checkAuth, bodyparser(), async ctx => {
  try {
    const { rowCount } = await db.result(
      `DELETE FROM tweets WHERE user_id = $1 AND tweet_id = $2`,
      [ctx.state.user.id, ctx.params.id]
    );

    if (rowCount > 0) {
      ctx.body = {
        status: 'ok'
      };
    } else {
      ctx.body = {
        status: 'error',
        message: 'That tweet couldn\'t be found'
      };
      ctx.status = 404;
    }
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

router.get('/list-all', checkAuth, async ctx => {
  try {
    const tweets = await db.manyOrNone(`
      SELECT * FROM tweets
      WHERE user_id = ANY (
        SELECT following_id FROM user_follows WHERE user_id = $1
      )
      OR user_id = $1
      ORDER BY tweet_id DESC
    `, ctx.state.user.id);
    ctx.body = tweets;
  } catch (e) {
    ctx.body = {
      status: 'error',
      message: 'An unkown error occured'
    };
    ctx.status = 500;
  }
});

module.exports = router;
