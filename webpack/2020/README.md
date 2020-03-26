### webpack优化方面
1. 大小
2. 速度
3. 模块拆分

### include exclude 常用于loader
* 首先，不配置这两个属性你引入的模块还是会被打包。
* 但是，很多第三方模块是不需要再被处理的，比如jQuery,不需要再被babel处理，因为jQuery已经是es5，浏览器直接可以识别。这个时候，你不设置exclude，jQuery就会被处理，这样就增加了打包时间。
* 所以，设置好exclude和include可以优化打包时间。

### webpackBundle-analyzer
a.js //jQuery
b.js //jQuery
### 费时分析
speed-measure-webpack-plugin
### 第三方库处理
dll
splitChunks
external
### 多入口情况，第三方模块进行抽离 splitChunks
* dllplugin不要和splitChunks共同使用
* async只有通过import().then引用才会抽离、
* all(initial) 动态引入或静态都会抽离 * async异步的
* 第三方库不要同业务逻辑放一起，第三方库抽离后可以缓存304
* 在生产环境下
*  chunks: 'async', //异步代码分割,多入口共同通过import().then引了相同文件则会抽取文件
```javascript
    splitChunks: {
      chunks: 'async', //异步代码分割,多入口共同通过import().then引了相同文件则会抽取文件
      minSize: 30000, //超过30k
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6, //最多5个请求
      maxInitialRequests: 4, //首屏最多4个请求
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,//最长名字大小
      cacheGroups: { //缓存组
        // react:{
        //     test : /[\\/]node_modules[\\/]\/react|react-dom/,
        //     priority:1
        // },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }

```

#### 多entry
* index.html需要 a.js
* login.html 需要b.js
```javascript
        entry:{
            "a" : './src/export.a.js',
            "b" : './src/export.b.js'
        },
        output:{
            filename : '[name].bundle.js',
            path : path.resolve(__dirname,'dist'),
            chunkFilename:'[name].min.js'
        },
//////
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            chunks:['a'],
            filename:'index.html'
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            chunks:['b'],
            filename:'login.html'
        }),
```

### 动态加载-代码分割

```javascript
button.addEventListener('click',()=>{
    // 动态导入 类比路由的懒加载 import
    // 默认会产生代码分割
    // 使用jsonp异步加载 ./calc
    // 魔术字符串修改分割文件name
    import(/* wepbackChunkName:'video' */'./calc').then(res=>{
        console.log(res.add(23,32))
    })
});
//修改异步chunk名字，chunkFilename:'[name].min.js'
// 0.min.js
// 8.bundle.js

```
### dllPlugin动态链接库(打包速度)
* 把react react-dom打到一个单独库
    * manifest.json
        * react: 打包后的文件
        * react-dom: 打包后的文件
* webpack.dll.js
    *   "dll": "webpack --config ./webpack.dll.js "
    * 本地使用了import React语法
        * 先去manifest.json里找，找到后会加载对应的库的名字，可能会引用某个模块，会去dll.js文件中查找
        * DLLReferencePlugin index知道优先去mainifest.json里找模块


### scope-hoisting
* 每个模块都是个函数，会导致内存过大
* 预先计算
* 减少作用域深度
* d.js
```javascript
// d.js
let a = 1;
let b = 2;
let c = 3;
let d = a + b + c;

export default d;

// index.js
import d from './d';
console.log(d)
```
### Tree-shaking&& scope-hoisting
* tree-shaking 默认只支持 es6语法， 静态导入
* 生产环境默认支持,dev环境不支持
* 不支持require等
```javascript
if(){
    Require(‘..aaaa.js’)
}
```
* package.json里sideEffects默认是true,即使没使用test变量，但是import testjs后仍然会打包
* sideEffects改为false的话，可以以package.json里配置 sideEffects
    * tree-shaking会把未引用到的带有副作用的文件删除
    * import './index.css';也被排除了，将css允许副作用或改成require('./index.css)能解决了
        ```javascript
            "sideEffects":[
                "**/*.css"
            ],
        ```
sideEffects
`index.js`
```javascript
import { minus} from './calc';
import test from './test';
console.log(minus(20,5))

```

`test.js`
```javascript
function test(){
    return 'hello'
}
console.log('llloooootesttest') //副作用effects
test();

export default test;
```


### 热更新

### noparse

### reslve(alias)

### happypack