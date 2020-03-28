import React from 'react';
const Koa = require('koa');
const KoaRouter = require('koa-router');
import {StaticRouter} from 'react-router-dom';
const serve = require('koa-static');
const path = require('path');
import { renderToString } from 'react-dom/server';
import routes from '../routes';
const app = new Koa();
var router = new KoaRouter();
app.use(serve(path.resolve('.')));

router.get('/*', (ctx,next) => {
    debugger
    const context ={};
    const html = renderToString(
        <StaticRouter context={context} location={ctx.path}>
            {routes}
        </StaticRouter>
    )
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${html}</div>
        <script src="/static/client.js"></script>
    </body>
    </html>`;
    ctx.body = htmlTemplate;
});

app.use(router.routes()).listen(3000);