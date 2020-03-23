const pathToRegExp = require('path-to-regexp');
const path = '/user/:city/:id';
const req = '/user/beijing/25';
const req2 = '/user/beijing'




function compilePath(path,options) {
    const keys = [];
    const regexp = pathToRegExp(path,keys,options);
    return {
        regexp,
        keys
    };
}
const result =  compilePath(path,{end:true});
const data = result.regexp.exec(req);
const keys = result.keys;
const objData = {};

// keys.forEach((v,i)=>{
//     objData[v.name] = data[i+1]
// });
// console.log(objData)




/**
 * 
 * @param {实际的}} pathname 
 * @param {*} options 
 */
export default function matchPath(pathname,options={}){
    const { path, exact = false, strict = false, sensitive = false} = options;
    const { regexp, keys } = compilePath(path, {
        end: exact,
        strict,
        sensitive
      });
    const match = regexp.exec(pathname);
    if(!match){
        return null;
    }
    const [url,...values] = match;
    const params = {};
    keys.forEach((v,i)=>{
        params[v.name] = values[i];
    });
    return {
        path,
        url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
        isExact:pathname === url,
        params
    }
}