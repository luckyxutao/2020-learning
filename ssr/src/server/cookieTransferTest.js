const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve = require('koa-static');
var proxy = require('koa-proxy');
const app = new Koa();
var router = new KoaRouter();

router.get('/cross/1', async(ctx, next) => {
    console.log(ctx.cookies.get('aaa'));
    ctx.body = {
        a : 1,
        b:2
    }
});

app.use(router.routes()).listen(3001);
