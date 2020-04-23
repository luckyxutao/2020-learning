var instantiateReactComponent = require('./instantiateReactComponent');

var ReactMount = {
    render: function (nextElement, container) {
        console.log(this);
        debugger
        ReactMount._renderNewRootComponent(nextElement, container);
    },
    _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
        debugger
        var componentInstance = instantiateReactComponent(nextElement, false);
        // ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);
        // return componentInstance;
    }
}

module.exports = ReactMount;