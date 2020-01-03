import print from './print';
import('./a').then(res=>{
    print(res.default(2,3));
})