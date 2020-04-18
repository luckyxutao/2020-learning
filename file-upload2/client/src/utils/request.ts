
interface ajaxOptions {
    url: string,
    method?: string,
    headers?: any,
    baseURL?: String,
    data?: any
}

export function request(options: ajaxOptions): Promise<any> {
    let defaultOptions = {
        method: 'GET',
        headers: {},
        baseURL: 'http://localhost:8000'
    }

    options = {
        ...defaultOptions, ...options, headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    return new Promise((resolve, reject) => {
        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open(options.method!, `${options.baseURL}${options.url}`);
        //设置headers
        Object.keys(options.headers).forEach(header => {
            xhr.setRequestHeader(header, options.headers[header]);
        });
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(xhr.response);
            }
        }
        xhr.send(options.method === 'GET' ? null : options.data);
    });

}