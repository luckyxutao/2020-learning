var ReactElement = require('./ReactElement');

var ReactBaseClasses = require('./ReactBaseClasses');
var createElement = ReactElement.createElement;
var cloneElement = ReactElement.cloneElement;

const React = {
    createElement: createElement,
    cloneElement: cloneElement,
    Component: ReactBaseClasses.Component,
    PureComponent: ReactBaseClasses.PureComponent,
};
export default React;