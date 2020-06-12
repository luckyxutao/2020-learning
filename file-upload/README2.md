<!-- ### 主题结构
* server
    * nodejs+express
* client
    * create-react-app + antd
* hash计算放在了serviceWorker里 -->

### Blob 对象
Blob（Binary Large Object）对象代表了一段二进制数据。其它操作二进制数据的接口都是建立在此对象的基础之上。生产Blob对象的方法：1.使用Blob 构造函数，2.对已有的Blob对象slice方法切割成小部分，应用场景有：大文件的断点续传。

### 前端切割文件
* 每个10M
```js
const SIZE = 1024 * 1024 * 10; //10M
function createChunks(file: File): Part[] {
    let current = 0;
    let partList: Part[] = [];
    while (current < file.size) {
        let chunk = file.slice(current, current + SIZE);
        partList.push({
            chunk, size: chunk.size
        })
        current += SIZE;
    }
    return partList;
}
```
### 计算hash
通过worker，可以将部分运算转移给浏览器原生，从而减轻js 线程本身的压力
* 发消息，通过serviceworker计算hash
    ```js
        function calculateHash(partList: Part[]) {
            return new Promise((resolve, reject) => {
                let worker = new Worker('/hash.js');
                worker.postMessage({ partList });
                worker.onmessage = (event) => {
                    let { percent: _a, hash } = event.data;
                    setHashPercent(_a);
                    if (hash) {
                        console.log('hash计算完成')
                        resolve(hash);
                    }
                };
            });
        }
    ```
* hash.js接收消息，处理hash
    ```js
    self.importScripts('https://cdn.bootcss.com/spark-md5/3.0.0/spark-md5.js');
    self.onmessage = async (event) => {
        let { partList } = event.data;
        const spark = new self.SparkMD5.ArrayBuffer();
        // let percent = 0;
        // let perSize = 100 / partList.length;
        let len = partList.length;
        let count=0;
        let buffers = await Promise.all(partList.map(({ chunk, size }) => {
            return new Promise((resolve)=>{
                const reader = new FileReader();
                reader.readAsArrayBuffer(chunk);
                reader.onload = function (event) {
                    count++;
                    self.postMessage({ percent: (count/len).toFixed(2) })
                    resolve(event.target.result);
                }
            });
        }));
        // let buffers = await Promise.all(partList.map(({ chunk, size }) => {
        //     debugger
        //     return chunk.ArrayBuffer;
        // }));
        buffers.forEach(buffer => {
            spark.append(buffer);
        });
        self.postMessage({ percent: 1, hash: spark.end() });
        self.close();
    }
    ```