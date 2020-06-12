
let memo = {count:1}
function Counter(){
    let m = memo.count;
    function click(){
        setTimeout(()=>{
            console.log(m)
        },2000);
    }
    click();
}
Counter();
memo.count++;