# `Promise` 对象

## 一、前言
在 `javascript` 中，处理异步编程通常使用回调函数，但是过多的回掉函数会使编程陷入回调地狱。如：
```js
$.ajax({
    url: 'http://xxx/请求一',
    type: 'get',
    success: function(d){
        $.ajax({
            url: 'http://xxx/请求二',
            type: 'get',
            success: function(d){
                /* 略 */
            }
        })
    }
})
```
当第二个请求要在第一个请求成功后才调用，当第三个请求要在第二个请求成功后才调用。这就很容易造成过多的嵌套和回调。而 `Promise` 对象可以避免这个问题。

***

## 二、Promise 对象

### 1. 基本使用方法
```js
var p = new Promise(function(resolve, reject){
    $.ajax({
        url: 'http://xxx/请求一',
        type: 'get',
        success: function(d){
            resolve('success') // 转成功状态
        },
        error: function(){
            reject('error') // 转失败状态
        }
    })
})

p.then(function(result){
    console.log(result) // 成功时执行，输出 "success"
}).catch(function(err){
    console.log(err) // 失败时执行，输出 "error"
})
```
- `Promise` 对象有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。`Promise` 对象的状态不受外界影响。

- `Promise` 对象的状态更改只有两种情况：  
`pending`（进行中）--> `fulfilled`（已成功）  
`pending`（进行中）--> `rejected`（已失败）  
状态更改一次后就不能再更改。

- `Promise` 构造函数接受一个函数参数，并向参数函数传入 `resolve` 和 `reject` 方法，这两个方法分别可以将状态改为已成功和已失败。


***

### 2. `Promise` 对象的 `then` 方法
`then` 方法只有在 `Promise` 对象处于成功状态时才会执行，执行完后返回一个新的 `Promise` 对象。如：
```js
var p = new Promise(function(resolve, reject){
    resolve('成功状态')
})
var p2 =  p.then(function(result){
    console.log(result) // 成功时执行，输出 "成功状态"
})
p2 instanceof Promise // true
```
如果失败状态，则跳过 `then` 方法，直接执行 `catch` 方法。`then` 方法的对传入函数的执行结果封装成 `Promise` 对象，再返回出去。


***


### 3. `Promise` 对象的 `catch` 方法
`catch` 方法只有在 `Promise` 对象处于失败状态时才会执行，用于捕获错误。`catch` 方法返回一个新的 `Promise` 对象。如：
```js
var p = new Promise(function(resolve, reject){
    reject('失败状态')
})
var p2 =  p.then(function(){
    console.log('then') // 没有执行，被跳过了
}).catch(function(err){
    console.log(err) // 输出了 '失败状态'
})
p2 instanceof Promise // true
```
因为新的 `Promise` 对象都是 `pending`（进行中）状态，在后面接 `then` 是会执行的。如：
```js
var p = new Promise(function(resolve, reject){
    reject('失败状态')
})
var p2 =  p.then(function(){
    console.log('then')
}).catch(function(err){
    console.log(err)
}).then(function(){
    console.log('又执行了')
})
// '失败状态'
// '又执行了'
```
不过一般不建议再在 `catch` 方法后面继续调用 `then` 或 `catch` 方法。

在 `Promise` 的链式调用的过程中，若前面出现报错，那么该错误会直接传给后面的第一个 `catch`，中间的 `then` 全部跳过。如：
```js
var p = new Promise(function(resolve, reject){
    reject(1)
})
p.then((r)=>{
    console.log(r)
    a = a + b
}).then(()=>{
    console.log(2)
}).catch((e)=>{
    console.log(3)
    console.log(e)
}).catch((e)=>{
    console.log(4)
    console.log(e)
})
// 1
// 3
//  ReferenceError: a is not defined
//     at p.then (<anonymous>:3:5)
//     at <anonymous>
```


***


### 4. `Promise` 封装
`then`、`catch` 方法会对传入函数的返回结果进行 `Promise` 封装，并返回封装后的 `Promise` 对象：

- 若传入函数的返回结果为 `Promise` 对象（可以是任意状态），则直接返回。如：
```js
var p = new Promise(function(resolve, reject){
    resolve('成功状态')
})
var p2 = new Promise(function(resolve, reject){
    resolve('成功状态 2')
})

p.then(function(result){
    console.log(result) // 成功时执行，输出 "成功状态"
    return new p2 // 返回 Promise
}).then(function(result){
    console.log(result) // 成功时执行，输出 "成功状态 2"
})
```

- 若传入函数的返回结果为 `thenable` 对象（即含有 `then` 方法的对象），则立即执行该 `thenable` 对象的 `then` 方法，再将返回结果进行封装。如：
```js
var p = new Promise(function(resolve, reject){
    resolve('成功状态')
})
p.then(function(result){
    console.log(result) // 成功时执行，输出 "成功状态"
    return {
        then: function(resolve, reject){
            resolve('thenable 对象')
        }
    }// 返回 thenable 对象
}).then(function(result){
    console.log(result) // 成功时执行，输出 "thenable 对象"
})
```

- 若传入函数的返回结果不是 `Promise` 对象，也不是 `thenable` 对象，或者是没有返回值，则直接进行封装：
```js
// 有返回值
var p = new Promise(function(resolve, reject){
    resolve('成功状态')
})
p.then(function(result){
    console.log(result) // 成功时执行，输出 "成功状态"
    return '直接封装'
}).then(function(result){
    console.log(result) // 成功时执行，输出 "直接封装"
})

// 无返回值
var p2 = new Promise(function(resolve, reject){
    resolve()
})
p2.then(function(result){
    console.log(result) // 成功时执行，输出 "undefined"
    return
}).then(function(result){
    console.log(result) // 成功时执行，输出 "undefined"
})
```

将 “直接封装” 字符串直接封装成 `Promise` 对象，相当于：
```js
var p = new Promise(function(resolve){
    resolve('直接封装')
})
```


此外，`Promise.resolve` 和 `Promise.reject` 也可以进行 `Promise` 封装：
```js
var p1 = Promise.resolve('这是成功状态的 Promise')
// 等同于
var p2 = new Promise(function(resolve){
    resolve('这是成功状态的 Promise')
})

var p3 = Promise.reject('这是失败状态的 Promise')
// 等同于
var p4 = new Promise(function(resolve, reject){
    reject('这是失败状态的 Promise')
})
```

***
END