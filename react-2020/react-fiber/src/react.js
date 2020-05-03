
import { ELEMENT_TEXT } from './constant'

function createElement(type, config, ...children) {
    delete config.__self;
    delete config.__source;
    delete config.__owner;
    return {
        type,
        props: {
            ...config,
            children: children.map(child => {
                return typeof child === 'object' ? child : {
                    type: ELEMENT_TEXT,
                    props: {
                        text: child,
                        children: []
                    }
                }
            })
        }
    };
}

export default {
    createElement 
}