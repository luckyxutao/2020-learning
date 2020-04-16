
import path from 'path';
import fs, { } from 'fs-extra';
const DEFAULT_SIZE = 1024*1024 * 10;//10M
export const PUBLIC_DIR = path.resolve(__dirname, 'public');
export const TEMP_DIR = path.resolve(__dirname, 'temp');

const pipeStream = (dstFilePath: string, filePath: string, index: number, size: number = DEFAULT_SIZE) => {
    return new Promise((resolve) => {
        var readStream = fs.createReadStream(filePath);
        readStream.on('end', () => {
            fs.unlink(filePath);
            resolve();
        });
        readStream.pipe(fs.createWriteStream(dstFilePath, {
            start: index * size
        }));
    });
}

export const mergeChunks = async (filename: string, size: number = DEFAULT_SIZE) => {
    const dstFilePath = path.resolve(PUBLIC_DIR, filename);
    const chunksDir = path.resolve(TEMP_DIR, filename);
    const chunkFiles = await fs.readdir(chunksDir);
    chunkFiles.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
    Promise.all(chunkFiles.map((chunkName, index) => {
        return pipeStream(dstFilePath, path.resolve(chunksDir, chunkName), index, size);
    })).then(_res=>{
        fs.rmdir(chunksDir);
    })
}

export const splitChunks = async (filename: string, size: number = DEFAULT_SIZE) => {
    const filePath = path.resolve(__dirname, filename);
    const chunksDir = path.resolve(TEMP_DIR, filename);
    let stat = await fs.stat(filePath);
    await fs.mkdirp(chunksDir);
    let current = 0, i = 0;
    while (current <= stat.size) {
        var ws = fs.createWriteStream(path.resolve(chunksDir, `${filename}-${i}`), {
            start: 0
        });
        let readStream = fs.createReadStream(filePath, {
            start: i * DEFAULT_SIZE,
            end: current + DEFAULT_SIZE - 1
        });
        readStream.pipe(ws);
        i++;
        current += size;
    }

}

// mergeChunks('aed50a0acf222fdc6015e13070f583ba.mp4');
// splitChunks('tom.jpg');