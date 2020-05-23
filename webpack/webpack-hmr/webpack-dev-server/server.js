const MemoryFileSystem = require('memory-fs');
const express = require('express');
const mime = require('mime');
const path = require('path')
class Server {
    constructor(compiler, options = {}) {
        this.compiler = compiler;
        this.options = options;
        this.output = compiler.options.output;
        this.lastHash = null;
        this.sockets = [];
        //创建内存文件系统
        const fs = this.fs = new MemoryFileSystem();
        this.setupCompiler(fs);
        this.setupApp(fs);
    }
    setupApp(fs) {
        const middleware = (req, res, next) => {
            if (req.url === '/favicon.ico') {
                return res.sendStatus(404);
            }
            ///index转为 dist/index.html
            let filename = path.join(this.output.path, req.url.slice(1));
            try {
                let stat = fs.statSync(filename);
                //判断文件是否存在，如果存在直接读出文件发给浏览器
                if (stat.isFile()) {
                    let content = fs.readFileSync(filename);
                    let contentType = mime.getType(filename);
                    res.setHeader('Content-Type', contentType);
                    res.statusCode = res.statusCode || 200;
                    res.send(content);
                } else {
                    next();
                }
            } catch (error) { }
        }
        //express实例
        const app = new express();
        //中间件
        app.use(middleware);
        //socket服务器
        this.server = require('http').createServer(app);
        let io = require('socket.io')(this.server);
        //启动一个websocket服务器，然后等连接来，
        //都存入
        io.on('connection', socket => {
            this.sockets.push(socket);
            if (this.lastHash) {
                socket.emit('hash', this.lastHash);
                socket.emit('ok');
            }
        });
    }

    setupCompiler(fs) {
        this.compiler.outputFileSystem = fs;
        this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
            this._sendStats(stats.hash);
            this.lastHash = stats.hash;
        });
        this.compiler.watch({}, err => {
            console.log('又一次编译成功了');
        });
    }
    _sendStats(newHash) {
        this.sockets.forEach(socket => {
            //先向client发最新的hash
            //每次编译都会产生一个hash值，如果是热更新的话，还会产生二个补丁文件
            //补丁描述了从上次到这次结果，都有哪些chunk发生了变化
            socket.emit('hash', newHash);
            console.log('最新hash', newHash)
            //再向client发送ok
            socket.emit('ok');
        });
    }
    listen(port) {
        this.server.listen(port, () => {
            console.log(`服务器已经在${port}启动`);
        })
    }
}

module.exports = Server;