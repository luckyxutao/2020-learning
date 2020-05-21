### REM方案
* rem
    * 每个窗口分十份,1unit = 10/1
    * 占一半时 = 5rem
* 缺点，每次要计算

### vw
```javascript
        let docEl = document.documentElement;
        function setUnit(){
            docEl.style.fontSize = docEl.clientWidth/10 + 'px';
            docEl.style.fontSize = '10vw'
        }
        setUnit();
        window.addEventListener('resize',setUnit)
```