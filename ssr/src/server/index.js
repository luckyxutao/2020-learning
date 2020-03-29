const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve = require('koa-static');
var proxy = require('koa-proxy');
const path = require('path');
import render from './render';
const app = new Koa();
var router = new KoaRouter();
app.use(serve(path.resolve('.')));
app.use(proxy({
    jar: true,
    map: function(path) {
        return path.replace(/^\/proxy/,'');
    },
    host:  'https://xxxx', // proxy alicdn.com...
    match: /^\/proxy\//        // ...just the /static folder
}))
router.get('/*', async(ctx, next) => {
    const __SERVER__ = typeof window === 'undefined';
    if (__SERVER__) {
        global.__nextCtx__ = ctx;
    }
    ctx.body = await render(ctx.path);
});

app.use(router.routes()).listen(3000);