import React, { ChangeEvent, useState, useEffect } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { request } from './utils';

const SIZE = 1024 * 1024 * 10; //10M

interface Part {
    chunk: Blob,
    filename?: string,
    chunkName?: string,
    size: number
}

function Upload() {
    let [currentFile, setCurrentFile] = useState<File>();
    let [objectURL, setObjectURL] = useState('');
    let [hashPercent, setHashPercent] = useState(0);
    let [partList, setPartList] = useState<Part[]>([]);
    let [filename, setFileName] = useState('');
    useEffect(() => {
        if (currentFile) {
            let objectURL = window.URL.createObjectURL(currentFile);
            setObjectURL(objectURL);
            return () => {
                URL.revokeObjectURL(objectURL)
            };
        }
    }, [currentFile]);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        let file: File = event.target.files![0];
        console.log(file);
        setCurrentFile(file);
    }

    function calculateHash(partList: Part[]) {
        return new Promise((resolve, reject) => {
            let worker = new Worker('/hash.js');
            worker.postMessage({ partList });
            worker.onmessage = (event) => {
                let { percent: _a, hash } = event.data;
                if (hash) {
                    resolve(hash);
                }
            };
        });
    }
    //851a368cefebf1f35e7fb9bacdc74581
    async function handleUpload() {
        if (!currentFile) {
            return message.error('尚未选择文件')
        }
        let partials: Part[] = createChunks(currentFile);
        //通过webworker子进程计算哈希
        let fileHasn = await calculateHash(partials);
        let lastDotIndex = currentFile.name.lastIndexOf('.');
        let extName = currentFile.name.slice(lastDotIndex);
        let filename = `${fileHasn}${extName}`;
        setFileName(filename);
        partials.forEach((item, index) => {
            item.filename = filename;
            item.chunkName = `${filename}-${index}`;
        });
        setPartList(partials);
        await uploadParts(partList, filename);
        message.info('上传成功');

    }
    async function uploadParts(partList: Part[], filename: string) {
        await Promise.all(createRequests(partList));
        await request({
            url : `/upload/${filename}`
        });
    }
    function createRequests(partList: Part[]) {
        return partList.map((part: Part) => {
            return request({
                url: `/upload/${filename}/${part.chunkName}`,
                method: "POST",
                headers: {
                    'Content-type': 'application/octet-stream'//请求格式
                },
                data: part.chunk //请求休
            })
        })
    }
    return (
        <Row>
            <Col span={12}>
                <Input type="file" style={{ width: 300 }} onChange={handleChange} />
                <Button type="primary" onClick={handleUpload}>上传</Button>
            </Col>
            <Col span={12}>
                {
                    objectURL && objectURL ? <img src={objectURL} style={{ width: 300 }} /> : null
                }
            </Col>
        </Row>
    )
}



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
function allowUpload(file: File) {
    let f = file.type; //image/jpeg
    let validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (!validFileTypes.includes(f)) {
        message.error('不支持此类文件上传')
        return false;
    }
    //1024Byte=1k 1024k=1M  1024M=1G
    const isLessThan2G = file.size < 1024 * 1024 * 1024 * 2
    if (!isLessThan2G) {
        message.error('文件不能大到2G')
        return false;
    }
    return true;
}
export default Upload;