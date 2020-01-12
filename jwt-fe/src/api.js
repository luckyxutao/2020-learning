import axios from 'axios';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();
axios.interceptors.request.use(config => {
    if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(res => {
    if (res.data.code != 0) {
        return Promise.reject(res);
    }
    return res;
}, error => {
    if (error.response.status == 401) {
        history.push('/');
    }
    return Promise.reject(error.response.data);
});

export function login(data) {
    return axios({
        url: 'http://localhost:3000/login',
        method: 'post',
        data
    }).then(response => {
        let data = response.data;
        localStorage.setItem('token', data.data.token);
        return data;
    })
}
export function getUser(data) {
    return axios({
        url: 'http://localhost:3000/user',
        method: 'get'
    }).then(response => {
        return response.data;
    })
}