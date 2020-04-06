
let t = require('babel-types');
// const code = "import {Button,Alert} from 'antd'";
module.exports = function(){
    let importPlugin = {
        visitor: {
            ImportDeclaration(path) {
                console.log('myplugins')
                let { node } = path;
                let source = node.source.value;
                let specifiers = node.specifiers;
                if (!t.isImportDefaultSpecifier(specifiers[0])) {
                    specifiers = specifiers.map((v, i) => {
                        return t.importDeclaration(
                            [t.importDefaultSpecifier(v.local)],
                            t.stringLiteral(`${source}/lib/${v.local.name.toLowerCase()}`)
                        )
                    })
                    path.replaceWithMultiple(specifiers);
                }
            }
        }
    };
    return importPlugin;
}

// const ast = babel.transform(code, {
//     plugins: [importPlugin]
// });
// const newCode = ast.code;
// console.log(newCode)