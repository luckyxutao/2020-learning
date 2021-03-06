import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import cors from 'cors';
import path from 'path';
// import { PUBLIC_DIR } from './utils';
import fs, { createWriteStream } from 'fs-extra';
// import multiparty from 'multiparty';
import { TEMP_DIR, mergeChunks, PUBLIC_DIR } from './utils';
// const PUBLIC_DIR = path.resolve(__dirname, 'public');
let app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/upload/:filename', async (req: Request, res: Response) => {
    let { filename } = req.params;
    await mergeChunks(filename);
    res.json({
        success: true
    });
});

app.get('/video-download/:filename', async(req:Request,res:Response)=>{
    let { filename } = req.params;
    const rs = fs.createReadStream(path.resolve(__dirname, `public/${filename}`));
    rs.pipe(res);
    res.setHeader('Content-Type','video/mp4')
    res.setHeader('Accept-Ranges','bytes');
    rs.on('close', function() { 
        res.json({
            finished:true
        })
        console.log("Stream finished."); 
    }); 
});

app.get('/verify/:filename', async (req: Request, _res: Response): Promise<any> => {
    let { filename } = req.params;
    let filePath = path.resolve(PUBLIC_DIR, filename);
    let hasExistFile = await fs.pathExists(filePath);
    if (hasExistFile) {
        return _res.json({
            success: true,
            needUpload: false
        })
    }
    let tempDir = path.resolve(TEMP_DIR, filename);
    let exist = await fs.pathExists(tempDir);
    let uploadList: any[] = [];
    if (exist) {
        uploadList = await fs.readdir(tempDir);
        uploadList = await Promise.all(uploadList.map(async (filename: string) => {
            let stat = await fs.stat(path.resolve(tempDir,filename));
            return {
                filename,
                size : stat.size
            };
        }));
    }
_res.json({
    success: true,
    needUpload: true,
    uploadList
})
});

app.post('/upload/:filename/:chunk_name/:start', async function (req: Request, res: Response, _next: NextFunction) {
    let { filename, chunk_name,start=0 } = req.params;
    let chunk_dir = path.resolve(TEMP_DIR, filename);
    let exist = await fs.pathExists(chunk_dir);
    if (!exist) {
        await fs.mkdirs(chunk_dir);
    }
    let chunkFilePath = path.resolve(chunk_dir, chunk_name);
    // a appped后边断点续传
    let ws = createWriteStream(chunkFilePath, { start:Number(start), flags: 'a' });
    req.pipe(ws);
    req.on('error', () => {
        ws.close();
    });
    req.on('close', () => {
        ws.close();
    });
    req.on('end', () => {
        ws.close();
        res.json({ success: true })
    });
});
// app.post('/upload', function (req: Request, res: Response, next: NextFunction) {
//     let form = new multiparty.Form();
//     form.parse(req,async(err:any,_fields,files)=>{
//         if(err){
//             return next(err);
//         }
//         let filename = _fields.filename[0];
//         let chunk = files.chunk[0];
//         await fs.move(chunk.path,path.resolve(PUBLIC_DIR,filename),{
//             overwrite:true
//         })
//         res.json({
//             success: true
//         })
//     });
// });
app.use(function (_req: Request, _res: Response, next: NextFunction) {
    next(createError(404));
});
app.use(function (error: any, _req: Request, res: Response, _next: NextFunction) {
    res.status(error.status || INTERNAL_SERVER_ERROR);
    res.json({
        success: false,
        error
    });
});

export default app;