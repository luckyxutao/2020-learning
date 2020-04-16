import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import cors from 'cors';
import path from 'path';
// import { PUBLIC_DIR } from './utils';
import fs from 'fs-extra';
import multiparty from 'multiparty';
const PUBLIC_DIR = path.resolve(__dirname,'public');
let app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'public')));
app.post('/upload', function (req: Request, res: Response, next: NextFunction) {
    let form = new multiparty.Form();
    form.parse(req,async(err:any,_fields,files)=>{
        if(err){
            return next(err);
        }
        let filename = _fields.filename[0];
        let chunk = files.chunk[0];
        await fs.move(chunk.path,path.resolve(PUBLIC_DIR,filename),{
            overwrite:true
        })
        res.json({
            success: true
        })
    });
});
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