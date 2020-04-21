import ReactCurrentOwner from "./ReactCurrentOwner";
import { REACT_ELEMENT_TYPE, TEXT, CLASS_COMPONENT, FUNCTION_COMPONENT } from '../shared/ReactSymbols';
import {flattern} from './util'
const RESEVED_PROOPS = {
    key: true,
    ref: true,
    __self: true,
}
export function createElement(type, config, ...children) {
    delete config.__source;
    delete config.__self;;
    let propName;
    const props = {};
    let key = null;
    let ref = null;
    let self = null;
    let source = null;
    let owner = null;
    if (config !== null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey) {
            key = config.key;
        }
        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        for (propName in config) {
            if (!RESEVED_PROOPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }
    children = flattern(children);
    props.children = children.map(item => {
        if (typeof item === 'object' || typeof item === 'function') {
            return item;// React.createElement('span', { color: 'red' }, 'Hello')
        } else {
            return {$$typeof:TEXT, type: TEXT, content: item };//item = "Hello"
        }
    })
    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    return ReactElement(
        type, key, ref, self, source, owner, props
    )
}
export function ReactElement(type, key, ref, _self, _source, _owner, props) {
    let $$typeof;
    if (typeof type === 'string') {
        $$typeof = REACT_ELEMENT_TYPE;
    } else if (typeof type === 'function' && type.prototype.isReactComponent) {
        $$typeof = CLASS_COMPONENT;
    } else if (typeof type === 'function') {
        $$typeof = FUNCTION_COMPONENT;
    }
    const element = {
        $$typeof,
        type,
        key,
        ref,
        props,
        _owner,
        _source,
        _self
    }
    return element;
}
function hasValidRef(config) {
    return config.ref !== undefined
}

function hasValidKey(config) {
    return config.key !== undefined;
}