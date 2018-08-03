# jsonp 请求原理及封装方法

## 一、前言
### 什么是 jsonp ？
jsonp 是一种跨域请求手段。众所周知，我们的浏览器为了保护用户隐式，采用了同源政策。  
所谓同源，即：同协议、同域名（并且同为ip地址，或同为DNS地址）、同端口号。  
非同源的请求是会被拦截的，而导致无法跨域。而 jsonp 则是一种可绕过同源政策的请求方法。

***

## 二、jsonp 的实现原理
如下：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title></title>
</head>
<body>
    <script>
    // 该标签内容有前端设置
        window.jsonp1 = function(data){
            alert(data.mes)
        }
    </script>
    <script src="这里写请求用的 url"> 
    // 该标签内容由后台返回
        jsonp1({mes: 'Hello World!'}) // 发请求的时候要高数后台回调函数是 jsonp1
    </script>
</body>
</html>
```
jsonp 的请求就是利用 script 标签的 src 属性可跨域发请求获取脚本的原理实现跨域的。  
以上为例，实现的思路就是：
1. 前端先设置好一个函数：jsonp1
2. 然后利用 script 标签的 src 属性发请求
3. 拿到后台动态创建的脚本：jsonp1({mes: 'Hello World!'})
4. 因为是 script 标签代表 js 文件，拿到脚本后会调用函数：jsonp1({mes: 'Hello World!'})，从而拿到数据
5. 需要注意的是 jsonp 是通过 src 属性发请求的，所以，只能发 get 请求。


***

## 三、jsonp 请求方法封装

### jsonp.js 文件（前端文件）
```js
var jsonp = (function(){ // 这里我们使用闭包
    /**
     * 1. 首先定义一个计数器 count，记录 jsonp 的请求次数
     */
    var count = 0

    /**
     * 2. 每一个 jsonp 请求都要单独占用一个 script 标签。
     *    因此，我们需要动态创建 script 标签为发 jsonp 请求服务。
     * 3. 为什么每一个 jsonp 请求都要单独占用一个 script 标签？
     *    因为，请求是异步的，如果该 jsonp 请求的结果还没拿到，那么它占用的 script 标签的 src 属性就不能更改，否则会请求失败。
     *    所以，多个 jsonp 请求不得占用同一个 script 标签。
     * 4. 又因为 jsonp 请求都要单独占用一个 script 标签，一旦请求结束，该 script 标签就没用了。
     *    所以，没用处的 script 标签要懂得在自己加载完成、执行完内容后，将自己删除。
     *    动态创建 script 标签的方法函数如下：
     */ 
    function createScript(url){ 
        var script = document.createElement('script')
        script.src = url
        script.onload = function(){
            script.parentNode.removeChild(script)
        }
        document.getElementsByTagName('head')[0].appendChild(script)
        return script // 返回该标签，方便之后的操作
    }


    /**
     * 5. 现在我们开始将函数暴露出去
     *    这个函数接受一个请求 url ，一些传参组成的对象 opt，一个自定义回调函数 callback（不是全局回调函数，因为它不能暴露到全局）
     */
    return function(url, opt, callback){
        /**
         * 6. 创建全局回调函数。
         *    我们需要动态创建一个全局的回调函数供 jsonp 请求的回来的脚本使用。
         * 7. 该全局回调函数跟 script 标签的道理一样也是一次性的、被独占用的。
         *    因此，当该全局回调函数执行完后要把自己删除，
         * 8. 计数器 count++ 和 while(window[fn]) 循环保证该全局函数是唯一的，不要被下一个 jsonp 请求覆盖。
         */  
        count++
        var fn = 'jsonp' + count // 变量 fn 存储了为全局回调函数的函数名
        while(window[fn]){
            count++
            fn = 'jsonp' + count
        }
        window[fn] = function(data){
            callback(data)  // 由全局回调函数去触发自定义回调函数
            try{ // 删除全局回调函数自己
                delete window[fn]
            }catch(e) {
                window[fn] = undefined
            }
        }


        /**
         * 9. 因为是 jsonp 是 get 请求，我们要把传参拼接到 url 上
         * 10.jsonp 请求，后台默认接受传参 callback 为全局回调函数的函数名（有些要自己设置），所以，把刚才创建的全局回调函数的函数名（存在 fn 内的名称）传给后台
         */
        var strUrl = ''
        for(var key in opt){ // for 循环拼接参数
            strUrl += '&' + key + '=' + opt[key]
        }
        strUrl += '&callback=' +  fn // 把刚才创建的全局回调函数的函数名（存在 fn 内的名称）传给后台
        strUrl = strUrl.slice(1)  
        strUrl = url + '?' + strUrl // 拼接完毕
        

        /**
         * 11. 这时可以创建 script 标签了
         */
        var script = createScript(strUrl)


        /**
         * 12. 请求超时处理。
         *     由于，全局回调函数在执行后才会删除自己，它又要在 jsonp 的 script 标签加载完成后才能执行。
         *     而该 script 标签也要在它加载完成后才能删除自己。
         *     所以，一旦请求超时即失败，就必须手动删除对应的 script 标签和全局回调函数。
         *     如下，设定一分钟后请求超时：
         */
        setTimeout(function(){
            if(window.fn){
                try{
                    delete window[fn]
                }catch(e) {
                    window[fn] = undefined
                }
                script.parentNode.removeChild(script)
            }
        }, 60000)
    }
})()


jsonp('http://localhost:8080/api/jsonp', { 
    name: 'vlzf', 
    time: new Date() 
}, function(d){
    console.log(d)
})
```

### server.js 文件（ node 后台文件）
```js
const express = require('express')
const app = express()

app.listen(8080, function(){
  console.log('server start')
})

app.get('/api/jsonp', function(req,res){
  var { 
    name,
    time
  } = req.query

  var content = `${name}，您的 jsonp 请求成功！！时间：${time}`

  res.jsonp({ // 请求成功
    code: true,
    mes: content
  })
})
```
会使用 node 和 npm 的人跳过以下步骤：  
安装 npm，下载 node  
在 server.js 所在的目录下打开终端，输入:  
npm init  
npm install --save express   
node server.js  
后台就可以启动了。


***
END