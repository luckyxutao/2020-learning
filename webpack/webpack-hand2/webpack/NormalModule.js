// const { Tapable, SyncHook } = require('tapable');
class NormalModule{
    /*
    name : 入口名字
    context 项目根目录
    rawRequest:原始路径 ./title.js
    resource: 绝对路径
    parser:解析器ast
    */
    constructor({ name, context, rawRequest, resource, parser}){
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.parser = parser;
        this.dependencies = [];
        //源码
        this._source = null;
        this._ast = null;
    }
    /*
        1. 根据路径读source
        2. runloaders,找到所有loader(行内,post,pre,auto),进行转换得到js
        3. js转ast
        4. 遍历ast，找到依赖模块(require,import,import())并添加到当前dependencies中
    */
    build(compilation,callback){
        callback()
    }
}

module.exports = NormalModule;