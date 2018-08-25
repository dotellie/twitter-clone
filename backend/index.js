const Koa = require('koa');
const { db, initDB } = require('./db.js');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello, World';
});

(async () => {
  try {
    await initDB();
    console.log('Database initialized');
  } catch (e) {
    console.error('Database initialization failed! Exiting...');
    console.error(e);
    process.exit(1);
  }
  app.listen(3000);
  console.log('Application listening on port 3000...');
})();
