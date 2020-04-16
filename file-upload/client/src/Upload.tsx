import React, { ChangeEvent, useState, useEffect } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { request } from './utils';
function Upload() {
    let [currentFile, setCurrentFile] = useState<File>();
    let [objectURL, setObjectURL] = useState('');
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
    async function handleUpload() {
        if (!currentFile) {
            return message.error('尚未选择文件')
        }
        const formData = new FormData();
        if (allowUpload(currentFile)) {
            formData.append('chunk', currentFile);
            formData.append('filename', currentFile.name);
        }
        const result = await request({
            url: '/upload',
            method: 'POST',
            data: formData,
            headers: {}
        });
        console.log('result', result);
        message.info('上传成功');

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