let path = require('path');
let nodeModules = path.resolve(__dirname, 'node_modules');
let request = '-!inline-loader1!inline-loader2!./style.css';
// 不要pre和normal,只剩下 inlinepost
const noPreAutoLoaders = request.startsWith('-!');
// 不要普通loaders
const noAutoLoaders = noPreAutoLoaders || request.startsWith('!')
// 不要pre post normal,只要inline
const noPrePostAutoLoaders = request.startsWith('!!');
let rules = [{
    test: /\.css$/,
    enforce: 'pre',
    use: ['pre-loader1', 'pre-loader2']
}, {
    test: /\.css$/,
    use: ['normal-loader1', 'normal-loader2']
}, {
    test: /\.css$/,
    enforce: 'post',
    use: ['post-loader1', 'post-loader2']
}];
let resolveLoader = loader => path.resolve(nodeModules, loader);
let inlineLoaders = request.replace(/^-?!+/, '').replace(/!!+/g, '!').split('!');//[inline-loader1,inline-loader2,./style.css];
let resource = inlineLoaders.pop();
//经过 映射，把loader转成绝对路径 

let preLoaders = [], normalLoaders = [], postLoaders = [];
for (let i = 0; i < rules.length; i++) {
    let rule = rules[i];
    if (rule.test.test(resource)) {
        if (rule.enforce === 'pre') {
            preLoaders.push(...rule.use)
        } else if (rule.enforce === 'post') {
            postLoaders.push(...rule.use);
        } else {
            normalLoaders.push(...rule.use);
        }
    }
}
let loaders;
// 不要pre和normal,只剩下 inlinepost
if (noPrePostAutoLoaders) { //不要pre post normal,只要inline
    loaders = [...inlineLoaders];
} else if (noPreAutoLoaders) {
    loaders = [...postLoaders, ...inlineLoaders];
} else if (noAutoLoaders) { // 不要普通loaders
    loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
    loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}

loaders = loaders.map(resolveLoader);



console.log(loaders)