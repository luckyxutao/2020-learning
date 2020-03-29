import axios from 'axios';
let axiosCreator;
export default function createAxios() {
    if (!axiosCreator) {
        const isServer = typeof window === 'undefined';
        const config = {
            baseURL: isServer ? 'https://xxxx' : '/proxy'
        };
        if (isServer) {
            config['headers'] = {
                cookie: __nextCtx__ && __nextCtx__.request.header.cookie || ''
            }
        }
        axiosCreator = axios.create(config);
    }
    return axiosCreator;
}