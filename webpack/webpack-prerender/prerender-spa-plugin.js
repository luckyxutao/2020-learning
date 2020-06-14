const path = require("path");
const Prerenderer = require("@prerenderer/prerenderer");
const PuppeteerRenderer = require("@prerenderer/renderer-puppeteer");
class PrerenderSPAPlugin {
  constructor(options) {
    this._options = options;
    this._options.renderer = new PuppeteerRenderer({ headless: true });
  }
  apply(compiler) {
    let _this = this;
    const compilerFS = compiler.outputFileSystem;
    const afterEmit = (compilation, done) => {
      const PrerendererInstance = new Prerenderer(_this._options);
      PrerendererInstance.initialize()
        .then(() => {
          return PrerendererInstance.renderRoutes(_this._options.routes || []);
        })
        .then(renderedRoutes => {
          let promises = renderedRoutes.map(rendered => {
            return new Promise(function(resolve) {
              rendered.outputPath = path.join(
                _this._options.staticDir,
                rendered.route,
                "index.html"
              );
              let dir = path.dirname(rendered.outputPath);
              compilerFS.mkdirp(dir, (err, made) => {
                compilerFS.writeFile(
                  rendered.outputPath,
                  rendered.html,
                  err => {
                    resolve();
                  }
                );
              });
            });
          });
          return Promise.all(promises);
        })
        .then(() => {
          PrerendererInstance.destroy();
          done();
        });
    };
    compiler.hooks.afterEmit.tapAsync("PrerenderSPAPlugin", afterEmit);
  }
}
module.exports = PrerenderSPAPlugin;