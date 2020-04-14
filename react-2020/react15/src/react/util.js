import { addEvent } from './event';

export function onlyOne(obj) {
    return Array.isArray(obj) ? obj[0] : obj;
}


export function setProps(dom,props){
    for(let key in props){
        if(props.hasOwnProperty(key)){
            if(!['key','children'].includes(key)){
                setProp(dom,key,props[key]);
            }
        }
    }
}

function setProp(dom,key,value){
    if(/^on/.test(key)){
        addEvent(dom,key,value);
    } else if(key === 'style'){
        for(let styleName in value){
            if(value.hasOwnProperty(styleName)){
                dom.style[styleName] = value[styleName];
            }
        }
    } else {
        dom.setAttribute(key,value);
    }
}