class DonePlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.emit.tapAsync('EmitPlugin',(compilation,callback)=>{
            console.log('等 三秒');
            
            setTimeout(()=>{
                
                callback();
            },3000)
        });
    }
}

module.exports = DonePlugin;