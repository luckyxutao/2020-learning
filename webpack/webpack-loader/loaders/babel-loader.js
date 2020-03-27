const babel = require('@babel/core');
// this.request = loader1!loader2!loader3!index.css
function loader(source,sourceMap){
    console.log('执行自己的loader')
    const options = {
        presets : ["@babel/preset-env"],
        inputSourceMap : sourceMap,
        sourceMaps: true, //告诉webpack要sourcemap
        filename : this.request.split('!').pop()
    }
    let {code,map,ast} = babel.transform(source,options);
    // code 转译后的代码 map sourcemap ast 抽象语法树
    return this.callback(null,code,map,ast)
    //
}

module.exports = loader;