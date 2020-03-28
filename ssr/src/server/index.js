import React from 'react';
const Koa = require('koa');
import {renderToString} from 'react-dom/server';
import Home from '../containers/Home';
const app = new Koa();

app.use(async ctx => {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${renderToString(<Home/>)}</div>
    </body>
    </html>`;
    ctx.body = htmlTemplate;
});

app.listen(3000);