import React, { Component } from 'react';
import { login } from '../api';
export default class Login extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        let username = this.username.value;
        let password = this.password.value;
        login({ username, password }).then(data => {
            if (data.code == 0) {
                this.props.history.push('/user');
            }
        });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                用户名<input required ref={ref => this.username = ref} />
                密码<input required ref={ref => this.password = ref} />
                <input type="submit" />
            </form>
        )
    }
}