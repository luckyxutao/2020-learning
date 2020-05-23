
const webpack = require('webpack');
const Server = require('./server');
const config = require('../webpack.config');
//全局只有一个，整个编译任务
// const compiler = webpack(config);

function startDevServer(config, options) {
  let compiler = webpack(config);
  let server = new Server(compiler, options);
  server.listen(options.port, options.host, (err) => {
    console.log(`devserver已成功在${options.port}启动`)
  });
}

startDevServer(config, {
  port: 8000
})