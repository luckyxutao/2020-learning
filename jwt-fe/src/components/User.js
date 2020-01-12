import React, { Component } from 'react';
import { getUser } from '../api';
export default class User extends Component {
    state = {
        user: {}
    }
    componentDidMount() {
        getUser().then(res => {
            if (res && res.code == 0) {
                this.setState({ user: res.data.user });
            }
        });
    }
    render() {
        return (
            <div>
                欢迎 {this.state.user.username}
            </div>
        )
    }
}