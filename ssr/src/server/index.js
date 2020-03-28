const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve = require('koa-static');
const path = require('path');
import render from './render';
const app = new Koa();
var router = new KoaRouter();
app.use(serve(path.resolve('.')));

router.get('/*', async(ctx, next) => {
    ctx.body = await render(ctx.path);
});

app.use(router.routes()).listen(3000);