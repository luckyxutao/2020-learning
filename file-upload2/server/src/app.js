const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaLogger = require("koa-logger");                 // 日志中间件
const cors = require('@koa/cors');

// const path = require('path');
// const static = require('koa-static');
// const staticPath = './static'
// app.use(static(path.join(__dirname, staticPath)))
// app.use(serve(path.join(__dirname + 'public')));
const app = new Koa();
const port = process.env.PORT || 8000;
const router = new KoaRouter();
const logger = KoaLogger();
app.use(logger);
app.use(cors());


router.get('/test', async (ctx, next) => {
    ctx.body = {
        a: 3,
        b: 2
    }
});
app.use(router.routes()).listen(port);