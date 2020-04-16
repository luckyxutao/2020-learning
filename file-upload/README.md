* npm run jest
###
File->多个Blob=>读取Blob=>转成ArrayBuffer=>spark计算哈希值


### 临时目录
'/var/folders/b8/_lp952nd27v0zbgvzj71m0w80000gn/T/S0i5AeQq7acM8wcxzqG-Almh.jpeg'
### CROSS-ENV
https://segmentfault.com/a/1190000005811347
### TS
Definite assignment assertions（明确的赋值断言）

这是 TS 的一个新的语法（在属性名后加一个感叹号），告诉 TS 一个类的属性将来一定会被赋值。除了用在类属性上，这个新语法也可以被用于变量声明中。看个示例：
* 可选 参数
    headers?: any,
* 函数返回值
export function request(options: AjaxOptions):Promise<any> {
* 小写可以忽略未使用变量检查
app.use(function (_req: Request, _res: Response, next: NextFunction) {
    next(createError(404));
});
### 文件上传
* 第二种

```javascript
const reader = new FileReader();
reader.addEventListener('load',()=>{
    setObjectURL(reader.result);
});
reader.readAsDataURL(currentFile);
```

* 第一种
window.URL.createObjectURL(currentFile);
URL.revokeObjectURL(objectURL);

### FormData
https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
FormData 接口提供了一种表示表单数据的键值对的构造方式，经过它的数据可以使用 XMLHttpRequest.send() 方法送出，本接口和此方法都相当简单直接。如果送出时的编码类型被设为 "multipart/form-data"，它会使用和表单一样的格式。
类似于
```html
<form>
   <input type="file" name="chunk" />
   <span name="filename"></span>
</form>
```