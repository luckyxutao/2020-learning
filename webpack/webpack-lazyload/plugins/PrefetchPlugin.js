const HtmlWebpackPlugin = require('html-webpack-plugin');
class DonePlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        //准备向
        // assets有source方法
        compiler.hooks.compilation.tap('EmitPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('prefetchCOm', (data, cb) => {
                let chunks = compilation.chunks;
                let tags = [];
                chunks.forEach(chunk => {
                    let prefetchChunkIds = chunk.getChildIdsByOrders().prefetch;
                    if (prefetchChunkIds) {
                        prefetchChunkIds.forEach(prefetchChunkId => {
                            let dstChunk = chunks.filter(v => v.id == prefetchChunkId)[0]
                            dstChunk.files.forEach(file => {
                                tags.push({
                                    tagName: 'link',
                                    voidTag: false,
                                    attributes: {
                                        rel: 'preload',
                                        href: file,
                                        as: 'script'
                                    }
                                });
                            });
                        });
                    }
                });
                data.headTags.push(...tags);
                cb(null, data)
            });
        });
    }
}
/**
 * 获取compilation
 * 知道钩子函数的参数和数据结果，加工
 * htmlWebpackPluginAlterAssetTags
 * 如何拿到chunk名称
 */
module.exports = DonePlugin;