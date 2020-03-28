import React from 'react';
import { StaticRouter, matchPath,Route } from 'react-router-dom';
import {renderRoutes,matchRoutes} from 'react-router-config'//渲染路由
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import routes from '../routes';
import { getServerStore } from '../store';
export default async function (reqPath) {
    const context = {
        name: 'xutao'
    };
    let store = getServerStore();
    let matchedRoutes= matchRoutes(routes,reqPath);
    let promises = [];
    matchedRoutes.forEach(item=>{
        if(item.route.getInitialProps){
            promises.push(item.route.getInitialProps(store));
        }
    });
    await Promise.all(promises);
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter context={context} location={reqPath}>{renderRoutes(routes)}</StaticRouter>
        </Provider>
    );
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
        <script>window.__GLOBAL_INIT_STATE = ${JSON.stringify(store.getState())}</script>
        <script src="/static/client.js"></script>
    </body>
    </html>`;
    return htmlTemplate;
}