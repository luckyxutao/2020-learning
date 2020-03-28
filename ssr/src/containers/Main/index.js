import React from 'react';
import { renderRoutes} from 'react-router-config'
export default class Main extends React.Component {
    render(){
        return <div>Mainmain{renderRoutes(this.props.route.routes)}</div>;
    }
}