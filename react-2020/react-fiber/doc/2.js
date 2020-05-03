let root = {
    key: 'A1',
    children: [{
        key: 'B1',
        children: [{
            key: 'C1'
        }, {
            key: 'C2'
        }]
    },{
        key : 'B2'
    }]
};

function work(vdom) {
    let res = [];
    doWork(vdom,res);
    console.log(res)
}
function doWork(node,res) {
    let queue = [node];
    while(queue.length){
        let cur = queue.pop();
        res.push(cur.key);
        if(cur.children){
            cur.children.forEach(v=>{
                queue.unshift(v);
            });
        }
    }
}
function doWorkDFS(node,res) {
    if(!node){
        return;
    }
    res.push(node.key)
    if(node.children){
        for(let i =0;i<node.children.length;i++){
            doWork(node.children[i],res);
        }
    }
}
work(root);