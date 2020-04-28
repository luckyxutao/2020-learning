var instantiateReactComponent = require('./instantiateReactComponent');
var ReactReconciler = require('./ReactReconciler');
var ReactUpdates = require('./ReactUpdates');
var DOMLazyTree = require('./dom/DOMLazyTree')

/**
 * Batched mount.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled(true);
    transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
    ReactUpdates.ReactReconcileTransaction.release(transaction);
}

/**
 * Mounts this component and inserts it into the DOM.
 *
 * @param {ReactComponent} componentInstance The instance to mount.
 * @param {DOMElement} container DOM element to mount into.
 * @param {ReactReconcileTransaction} transaction
 * @param {boolean} shouldReuseMarkup If true, do not insert markup
 */
function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
    // var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
    // );
    var markup = ReactReconciler.mountComponent(wrapperInstance, transaction, null, null, context);
    // wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
    ReactMount._mountImageIntoNode(markup, container, wrapperInstance, false, transaction);
  }

var ReactMount = {
    render: function (nextElement, container) {
        ReactMount._renderNewRootComponent(nextElement, container);
    },
    _renderNewRootComponent: function (nextElement, container, shouldReuseMarkup, context) {
        var componentInstance = instantiateReactComponent(nextElement, false);
        ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);
    },
    _mountImageIntoNode: function (markup, container, instance, shouldReuseMarkup, transaction) {
        while (container.lastChild) {
            container.removeChild(container.lastChild);
        }
        DOMLazyTree.insertTreeBefore(container, markup, null);
    }
}

module.exports = ReactMount;