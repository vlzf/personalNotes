# `async` 函数

## 一、前言
`async` 函数是 ES7 的语法、`Generator` 函数的高级版，是可以用来处理异步编程的一类函数，与 `Generator` 函数一样可以将异步编程同步化。不同之处是它会返回一个 `Promise` 对象，并且内置执行器。如：
```js
async function foo(){
    console.log(1)
    return 2
}
var a = foo()
// 1
a instanceof Promise
// true
```
可以看到，`async` 函数因为内置执行器，所以不需要使用 `next` 方法启动。

***

## 二、关键字 `await`
`Generator` 函数有 `yield`，`async` 函数有 `await`。`await` 的用法与 `yield` 基本相同，都是用来停止命令执行的。不过，由于 `async` 函数因为内置执行器，等到异步指令执行完成后，被停止的命令会自动开始执行。如：
```js
function out(number){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log(number)
            resolve(number)
        }, 2000)
    })
}

async function foo(){
    await out(1)
    await out(2)
    var r = await out(3)
    return r + 1
}
var a = foo().then(function(r){
    console.log(r)
})
// 1
// 2
// 3
// 4
```
看过我的 [`Generator` 生成器](./Generator生成器.md) 的人是不是觉得 `async` 函数就像 `Generator` 函数自带了一个已经封装好了的执行器一样呢！

- 若 `await` 表达式后面的值是一个 `Promise` 对象，则这个表达式返回 `Promise` 的 `resolve` 或 `reject` 出来的值。

- 若 `await` 表达式后面的值是一个 `thenable` 对象，则先执行 `then` 方法，再返回 `then` 方法的 `resolve` 值。如：
```js
async function foo(){
    var r = await {
        then: function(resolve){
            resolve(5)
        }
    }
    console.log(r)
}
foo() // 5
```

- 若 `await` 表达式后面的值非 `Promise` 对象、非 `thenable` 对象，则直接返回。如：
```js
async function foo(){
    var r = await 5
    console.log(r)
}
foo() // 5
```

***

## 三、尾语
看懂了 [`Generator` 函数](./Generator生成器.md) 后，`async` 函数会更容易理解。

***
END
