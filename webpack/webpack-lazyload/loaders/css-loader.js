const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');
const loaderUtils = require('loader-utils')
function createPlugin(options) {
    return function (css) {
        let { urlItems, importItems } = options;
        css.walkAtRules(/^import$/, function (rule) {
            let values = Tokenizer.parseValues(rule.params);//s
            let url = values.nodes[0].nodes[0].value;
            importItems.push({
                url
            })
        });
        //遍历每个css规则
        css.walkDecls(function (decl) {
            let values = Tokenizer.parseValues(decl.value);//solid 75px red
            values.nodes.forEach(value => {
                value.nodes.forEach(item => {
                    if (item.type === 'url') {
                        let oldUrl = item.url;
                        item.url = `_CSS_URL_${urlItems.length}_`
                        urlItems.push(oldUrl);
                    }
                })
            });
            decl.value = Tokenizer.stringifyValues(values);
        });
    }
}
function loader(inputSource) {
    let doneCallback = this.async();
    let options = {
        urlItems: [],
        importItems: []
    };

    let pipeline = postcss([createPlugin(options)]);

    pipeline.process(inputSource).then(result => {
        let importJS = options.importItems.map(imp => {
            return `require(${loaderUtils.stringifyRequest(this,imp.url)})`;
        }).join('\n');
        let cssString = JSON.stringify(result.css);
        cssString = cssString.replace(/@import\s+(["']).+\1;?/g, '');
        cssString = cssString.replace(/_CSS_URL_(\d+)_/g, function (matched, g1) {
            return '"+' +`require(${loaderUtils.stringifyRequest(this,options.urlItems[g1])}).default`+'+"';
        });
        doneCallback(null,`
            ${importJS}
            module.exports =  ${cssString}
        `);
    });
}

module.exports = loader;


