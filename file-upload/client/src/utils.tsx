
interface AjaxOptions {
    method: string,
    url: string,
    headers?: any,
    baseURL?:string,
    data: any
}
export function request(options: AjaxOptions):Promise<any> {
    let defaultOptions = {
        method: 'GET',
        baseURL: 'http://localhost:8000',
        headers: {},
        data: {}
    }

    options = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    }


    return new Promise(function (resolve, reject) {
        // 创建xhr对象
        let xhr = new XMLHttpRequest();
        // open
        xhr.open(options.method, options.baseURL + options.url);
        // 设置headers
        Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key]);
        });
        xhr.responseType = 'json';
        //监听state变化
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.response);
                }
            }
        }
        //发送语法
        xhr.send(options.data);
    });



}