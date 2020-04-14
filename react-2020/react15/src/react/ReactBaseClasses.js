const emptyObject = {};
class Component{
    constructor(props,context){
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
    }
}
Component.prototype.isReactComponent = {};

class PureComponent extends Component{

}
PureComponent.prototype.isPureComponent = true;

export{
    PureComponent,
    Component
};