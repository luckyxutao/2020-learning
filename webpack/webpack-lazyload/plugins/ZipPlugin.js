const JSZip = require('jszip')
class DonePlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        //准备向
        // assets有source方法
        compiler.hooks.emit.tapAsync('EmitPlugin',(compilation,callback)=>{
            var zip = new JSZip();
            for(let filename in compilation.assets){
                if(compilation.assets.hasOwnProperty(filename)){
                    zip.file(filename,compilation.assets[filename].source());
                }
            }
            zip.generateAsync({type:'nodebuffer'}).then(content=>{
                //把数据挂到assets上自动会写入文件
                //相当于是个接口
                compilation.assets[this.options.name] = 
                {
                    source(){
                        return content;
                    },
                    size(){
                        return content.length;
                    }
                };
                callback(null,compilation);
            });
        });
    }
}
/**
 * 找到合适的钩子
 * 知道钩子函数的参数和数据结果，加工
 * 
 * 
 */
module.exports = DonePlugin;