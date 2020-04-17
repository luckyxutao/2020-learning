import React, { ChangeEvent, useState, useEffect } from 'react';
import { Row, Col, Input, Button, message, Progress, Table } from 'antd';
import { request } from './utils';

const SIZE = 1024 * 1024 * 10; //10M

interface Part {
    chunk: Blob,
    filename?: string,
    chunkName?: string,
    size: number,
    xhr?: XMLHttpRequest,
    percent?: number,
    loaded?: number //已经下载了多少
}
interface Uploaded {
    filename: string,
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
                setHashPercent(_a);
                if (hash) {
                    console.log('hash计算完成')
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
            item.loaded = 0;
            item.percent=0;
        });
        setPartList(partials);
        try {
            await uploadParts(partials, filename);
        } catch (error) {
            console.log(error);
        }

        // message.info('上传成功');

    }

    async function verify(filename: string) {
        return request({
            url: `/verify/${filename}`
        })
    }

    async function uploadParts(partList: Part[], filename: string) {
        let { needUpload, uploadList } = await verify(filename);
        if (!needUpload) {
            return message.success('秒传成功')
        }
        await Promise.all(createRequests(partList, uploadList, filename));
        await request({
            url: `/upload/${filename}`
        });
    }
    function createRequests(partList: Part[], uploadList: Uploaded[], filename: string) {
        var realUploadList = partList.filter((part: Part) => {
            let uploadFile = uploadList.find(item => {
                return item.filename === part.chunkName;
            });
            //服务器上没此chunk，则需要上传
            if (!uploadFile) {
                return true;
            }
            //服务器上的chunksize小于chunkSize，也需要重新上传
            if (uploadFile.size < part.chunk.size) {
                part.loaded = uploadFile.size;
                part.percent = part.loaded/part.chunk.size;
                return true;
            }
            return false;
        });
        return realUploadList.map((part: Part) => {
            return request({
                url: `/upload/${filename}/${part.chunkName}/${part.loaded}`,
                method: "POST",
                setXHR: (xhr: XMLHttpRequest) => {
                    part.xhr = xhr;
                },
                onProgress: function (event: ProgressEvent) {
                    part.percent = Number((Number((part.loaded || 0) + event.loaded) / part.chunk.size * 100).toFixed(2));
                    setPartList([...partList]);
                },
                headers: {
                    'Content-type': 'application/octet-stream'//请求格式
                },
                data: part.chunk //请求休
            })
        })
    }

    function handleResume() {
        uploadParts(partList, filename);
    }

    function handlePause() {
        partList.forEach((part: Part) => {
            part.xhr && part.xhr.abort();
        });
    }
    const columns = [
        {
            title: '切片名称',
            dataIndex: 'chunkName',
            key: 'chunkName',
            width: '30%'
        },
        {
            title: '切片进度',
            dataIndex: 'percent',
            key: 'percent',
            width: '70%',
            render: (value: number) => {
                return <Progress percent={value} />
            }
        },
    ];
    let uploadProgress = (
        <div style={{ marginTop: 20 }}>
            <Row>
                <Col span={4}>
                    哈希计算:
                </Col>
                <Col span={20}>
                    <Progress percent={hashPercent * 100} />
                </Col>
            </Row>
            <Table
                style={{ marginTop: 10 }}
                columns={columns}
                dataSource={partList}
                rowKey={(row: Part) => row.chunkName!}
            />
            {/* <Row>
                <Col span={4}>
                    总体进度:
                </Col>
                <Col span={20}>
                    <Progress percent={totalPercent} />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={partList}
                rowKey={(row: Part) => row.chunk_name!}
            /> */}
        </div>
    );
    return (
        <>
            <Row>
                <Col>
                    <Input type="file" style={{ width: 300 }} onChange={handleChange} />
                </Col>
                <Col style={{ marginLeft: 10 }}>
                    <Button type="primary" onClick={handleUpload}>上传</Button>
                    <Button type="primary" onClick={handlePause} style={{ marginLeft: 10 }}>暂停</Button>
                    <Button type="primary" onClick={handleResume} style={{ marginLeft: 10 }}>恢复</Button>
                </Col>
                {/* <Col span={12}>
                    {
                        objectURL && objectURL ? <video src={objectURL} style={{ width: 300 }} /> : null
                    }
                </Col> */}
            </Row>
            {
                uploadProgress
            }
        </>
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