import React from 'react';
import { StaticRouter, matchPath,Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import routes from '../routes';
import { getServerStore } from '../store';
export default async function (reqPath) {
    const context = {
        name: 'xutao'
    };
    let store = getServerStore();
    let matchRoutes = routes.filter(route=>{
        return matchPath(reqPath,route);
    });
    let promises = [];
    matchRoutes.forEach(route=>{
        if(route.getInitialProps){
            promises.push(route.getInitialProps(store));
        }
    });
    await Promise.all(promises);
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter context={context} location={reqPath}>
                {
                    routes.map(route=>{
                        return <Route {...route} />
                    })
                }
            </StaticRouter>
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
        <script src="/static/client.js"></script>
    </body>
    </html>`;
    return htmlTemplate;
}