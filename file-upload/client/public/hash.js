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