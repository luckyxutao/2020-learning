## loader的加载

### 定义loader所放的目录
```javascript
    resolveLoader:{
        // alias:{
        //     'babel-loader':path.resolve(__dirname,'./loaders/babel-loader.js')
        // },
        modules:[path.resolve(__dirname,'./loaders'),'node_modules']
    },

```
### inline normal pre post
eslint 代码风格检查，一般用于前置

### loader加载顺序
normalLoader

pitchLoader
```javascript
// pit111
// pit2222
// pit333
// loader333
// loader222
// loader111

//当loader2的pitch有返回值后
// pit111
// pit2222
// loader111
```