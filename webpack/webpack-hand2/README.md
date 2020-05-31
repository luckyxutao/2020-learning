
### 编译
生成所有modules及main

### seal(生成chunk)
* 根据modules和名字划分chunk
* 生成assets
    * 根据chunk数组template生成资源
    * 产物 files['main.js'], assets:{'main.js':source}

### emit(compiler)
*  根据files和assets来生成物理文件