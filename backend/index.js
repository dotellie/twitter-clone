const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const cors = require('@koa/cors');
const { db, initDB } = require('./db.js');
const { passport } = require('./auth.js');

const accounts = require('./routes/account.js');
const tweet = require('./routes/tweet.js');
const user = require('./routes/user.js');

const app = new Koa();
app.proxy = true;

app.use(cors());

app.keys = ['aSecretKeyThatShouldBeReplaced'];
app.use(session({}, app));

app.use(passport.initialize());
app.use(passport.session());

const router = new Router({
  prefix: '/api'
});

router.get('/', async ctx => {
  ctx.body = 'Welcome to the Twitter clone API!';
});

router.use('/account', accounts.routes());
router.use('/tweet', tweet.routes());
router.use('/user', user.routes());

app.use(router.routes());
app.use(router.allowedMethods());

(async () => {
  try {
    await initDB();
    console.log('Database initialized');
  } catch (e) {
    console.error('Database initialization failed! Exiting...');
    console.error(e);
    process.exit(1);
  }
  app.context.db = db;
  app.listen(3000);
  console.log('Application listening on port 3000...');
})();
