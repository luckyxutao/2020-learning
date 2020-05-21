let loaderUtils = require("loader-utils");
function loader(source) {

}
//https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L339
loader.pitch = function (remainingRequest, previousRequest, data) {
  //C:\webpack-analysis2\loaders\less-loader.js!C:\webpack-analysis2\src\index.less
  console.log('previousRequest', previousRequest);//之前的路径
  //console.log('currentRequest', currentRequest);//当前的路径
  console.log('remainingRequest', remainingRequest);//剩下的路径
  console.log('data', data);
  // !! noPrePostAutoLoaders 不要前后置和普通loader
  //__webpack_require__(/*! !../loaders/less-loader.js!./index.less */ "./loaders/less-loader.js!./src/index.less");
  //让下一个行内css-loader处理css ,并返回js脚本
  let style = `
    var style = document.createElement("style");
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!" + remainingRequest)});
    document.head.appendChild(style);
 `;
  return style;
}
module.exports = loader;