
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
        
        //源码
        this._source = null;
        this._ast = null;
    }
}

module.exports = NormalModule;