const path = require('path');
const express = require('express');
const mime = require('mime')
const webpack = require('webpack');

const config = require('./webpack.config');
//全局只有一个，整个编译任务
const compiler = webpack(config);

class Server {
    constructor(compiler){
        this.compiler = compiler;
        let sockets = [];
        let lastHash;//每个编译完后都会产生一个stats,hash表示 一次编译结果
        compiler.hooks.done.tap('webpack',(stats)=>{
            lastHash = stats.hash;
            //每次编译完，向客户端发消息
            sockets.forEach(socket=>{
                //先向client发最新的hash
                //每次编译都会产生一个hash值，如果是热更新的话，还会产生二个补丁文件
                //补丁描述了从上次到这次结果，都有哪些chunk发生了变化
                socket.emit('hash',stats.hash);
                console.log('最新hash',stats.hash)
                //再向client发送ok
                socket.emit('ok');
            });
        });
        let app = new express();
        //以监控模式启动一次webpack编译，编译成功后执行回调
        compiler.watch({},err=>{
            console.log('又一次编译成功了');
        });
        const MemoryFileSystem = require('memory-fs')
        //设置webpack的compiler的outputFileSystem
        //webpack再生成文件不往硬盘生成了，
        const fs = new MemoryFileSystem();
        compiler.outputFileSystem = fs;
        function middleware(req,res,next){
            if(req.url === '/favicon.ico'){
                return res.sendStatus(404);
            }
            ///index转为 dist/index.html
            let filename = path.join(config.output.path,req.url.slice(1));
            try {
                let stat = fs.statSync(filename);
                //判断文件是否存在，如果存在直接读出文件发给浏览器
                if(stat.isFile()){
                    let content = fs.readFileSync(filename);
                    let contentType = mime.getType(filename);
                    res.setHeader('Content-Type',contentType);
                    res.statusCode = res.statusCode || 200;
                    res.send(content);
                } else {
                    next();
                }
            } catch (error) {
                
            }

        }
        app.use(middleware);
        this.server = require('http').createServer(app);
        let io = require('socket.io')(this.server);
        //启动一个websocket服务器，然后等连接来，
        //都存入
        io.on('connection',socket=>{
            sockets.push(socket);
            if(lastHash){
                socket.emit('hash',lastHash);
                socket.emit('ok');
            }
        });
    }
    listen(port){
        this.server.listen(port,()=>{
            console.log(`服务器已经在${port}启动`);
            
        })
    }

}

let server = new Server(compiler);
server.listen(8000);