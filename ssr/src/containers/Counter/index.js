import React,{ Component} from 'react';

export default class Home3 extends Component{
    state = {
        number:0
    }
    render(){
        return (
            <div>
                <p>{this.state.number}</p>
                <button onClick={()=>{
                    this.setState({
                        number : this.state.number+1
                    })
                }}>加加加</button>
            </div>
        )
    }
}