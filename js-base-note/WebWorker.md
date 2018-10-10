# Web Worker

## 一、什么是 Web Worker
Web Worker 是运行在浏览器后台的 js，独立于其它脚本，不会影响页面的性能。js 是单线程的，而 Web Worker 可以在浏览器中创建一个子线程来专门运行指定的 js 脚本。

js 线程与 UI 渲染线程是互斥的。当一个页面的脚本存在大量运算时，会导致页面卡顿。但是，如果将这大量运算放在 Web Worker 里运行，就可以避免这个问题。

***

## 二、Web Worker 用法
Web Worker 需要在 web 环境下才能用，并且必须同源。
- index.html 文件
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
<script>
  var worker = new Worker('webWorker.js') // 参数是Web Worker文件的路径，必须同源
  worker.postMessage(2000)

  console.log(new Date() + '"：index.html begin')		
  worker.onmessage = function(evt){      			
    console.log(evt.data)
  }
  
  setTimeout(()=>{
    var begin = new Date()
    while(new Date() - begin < 1500){ }// 阻塞循环
    console.log(new Date() + "：index.html end")    
  }, 500)
</script>
</body>
</html>
```
Worker 实例可以通过 postMessage 传递信息，通过实例方法 onmessage 或者 addEventListener('onmessage', callback) 来监听 web worker 传回来的信息。

- webWorker.js （web worker 文件）
```js
this.onmessage = function(evt){
  var millSeconds = evt.data
  console.log(new Date() + '：webWorker begin')
  wait(millSeconds)
  // 返回数据给调用者
  postMessage("from worker's message.")
}

function wait(millSeconds){ // 阻塞函数
  var begin = new Date()
  while(new Date() - begin < millSeconds){ }// 阻塞循环
  console.log(new Date() + '：webWorker end')
}
```
由于 web worker 位于外部文件中，它们无法访问下例 JavaScript 对象：
- window 对象
- document 对象
- parent 对象

所以 web worker 文件的 this 并不指向 window，而是指向 web worker 自己。

> 在 index.html 的脚本里，通过 postMessage 向 web worker 传递信息，0.5s 后执行阻塞循环，阻塞 1.5s。  
web worker 监听到消息后调用了阻塞函数 wait，阻塞 2s。  
总阻塞时间 3.5s，等待 0.5s，执行总消耗 4s。  
但因为 web worker 是在子线程执行的不影响主线程，所以，实际执行总消耗时间 2s。

输出结果：
```text
Sat Oct 06 2018 20:49:45 GMT+0800 (中国标准时间)"：index.html begin
Sat Oct 06 2018 20:49:45 GMT+0800 (中国标准时间)：webWorker begin
Sat Oct 06 2018 20:49:47 GMT+0800 (中国标准时间)：index.html end
Sat Oct 06 2018 20:49:47 GMT+0800 (中国标准时间)：webWorker end
from worker's message.
```

***

## 三、终止 Web Worker
terminate()方法可以终止 Web Worker。被终止的Worker对象不能被重启或重用，我们只能新建另一个Worker实例来执行新的任务。

***

END





