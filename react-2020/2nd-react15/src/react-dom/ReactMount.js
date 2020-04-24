var instantiateReactComponent = require('./instantiateReactComponent');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdates = require('./ReactUpdates')
var ReactMount = {
    render: function (nextElement, container) {
        ReactMount._renderNewRootComponent(nextElement, container);
    },
    _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
        var componentInstance = instantiateReactComponent(nextElement, false);
        this.mountComponentIntoNode(componentInstance,container,null,false);
        // ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);
        // return componentInstance;
    },
    mountComponentIntoNode: function (wrapperInstance, container, transaction, shouldReuseMarkup, context) {
        var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
        var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, null, context);
        container.appendChild(markup.node)
        // var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context);
        // wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
        // ReactMount._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
    }
}

module.exports = ReactMount;