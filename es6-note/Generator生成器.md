# `Generator` 生成器

## 一、前言
`javascript` 的异步编程经常都令人头疼。实现异步编程最常见的办法有：回调函数、事件监听、`Promise` 对象、`Generator` 函数、`async` 函数等。这里主要讲 `Generator` 生成器函数。

***

## 二、`Generator` 函数

### 1. 声明方式
`Generator` 函数是 `ES6` 的语法。它声明起来非常简单，如下：
```js
function* fn(){}
function*fn(){}
function *fn(){}
function * fn(){}
```
由于 `ES6` 并没有规范 * 这个星号要写在具体哪个位置，以上四种写法都没问题。

***

### 2. 调用方式
对于一般的函数来说，函数一旦调用就会马上执行到结束。而 `Generator` 函数的调用只会生成一个迭代器，并不马上执行。如：
- 一般的函数
```js
function foo(){
    var a = 1, b = 2, c = a + b
    console.log(c)
    return c
}
var x = foo() // 3
```

- `Generator` 函数
```js
function* bar(){
    var a = 1, b = 2, c = a + b
    console.log(c)
    return c
}
var x = bar() // bar {<suspended>}
x.next()
// 3
// {value: 3, done: true}
```
用 `Generator` 函数生成器生成迭代器 `x` 后，要使用迭代器的 `next` 方法才可以执行 `Generator` 函数内部的命令。

***

### 3. yield 关键字
`yield` 是 `Generator` 函数内部的关键字，只能用在 `Generator` 函数内，否则会报错：
```js
function* fn1(){
    yield
} 
fn1() // OK 不会报错

function fn2(){
    yield
}
fn2() // 报错：yield is not defined
```

`yield` 是 `Generator` 函数的停止标识，可以让 `Generator` 函数停止执行：
```js
function* bar(){
    console.log(1)
    yield
    console.log(2)
    yield
    console.log(3)
    yield
    return 4
}
var x = bar() // bar {<suspended>}
x.next() 
// 1
// {value: undefined, done: false}
x.next() 
// 2
// {value: undefined, done: false}
x.next() 
// 3
// {value: undefined, done: false}
x.next() 
// {value: 4, done: true}
```
`Generator` 函数停止运行后要调用迭代器的 `next` 方法方可恢复，当函数执行完毕，`done` 属性会变成 `true`。

可输入输出的 yield：
- `yield` 会把它后面的短语的结果作为 `next` 方法返回的数据的 `value` 属性值，如：
```js
function* bar(){
    var a = 1, b = 2
    yield a
    yield b
}
var x = bar()
x.next() // {value: 1, done: false}
x.next() // {value: 2, done: false}
x.next() // {value: undefined, done: true}
```

- `next` 方法可以传入一个参数，该参数值会被赋予当前开始执行位置的 yield 语句，如：
```js
function* bar(){
    var a = 1, b = 0
    b = (yield a) + 1
    console.log(b)
    return b
}
var x = bar()
x.next()  // {value: 1, done: false}
x.next(3) 
// 4
// {value: 4, done: true}
```
当 `yield` 表达式在另一个语句中，要使用括号；`yield` 表达式的输入值由 `next` 方法的传入参数决定，默认为 `undefined`。

***

### 4. `next` 方法
`next` 方法可以让 `Generator` 函数开始执行，遇到下一个 `yield` 或 `return` 语句时停止，并返回一个固定格式的对象 {`value`: any, `done`: `Boolean`}。属性 `value` 是当前 `yield` 或 `return` 语句的返回值，属性 `done` 表示函数是否执行完毕（`false` 未执行完毕，`true` 执行完毕）。  

`next` 方法还可以传入一个参数，并将该参数作为当前开始执行位置的 `yield` 语句的值。因此，`Generator` 函数的第一个 `next` 方法不接收任何参数。

如：
```js
function* bar(){
    var a = 1, b = 0
    b = (yield a) + 1
    console.log(b)
    return b
}
var x = bar()
x.next()  // {value: 1, done: false}
x.next(3) 
// 4
// {value: 4, done: true}
```

***

### 5. `yield*` 表达式
想要在 `Generator` 函数内调用另一个 `Generator` 函数，必须要使用 `yield*` 表达式。否则，无法调用：
```js
function* foo(){
    yield 1
    yield* bar()
    yield 2
}
function* bar(){
    yield 3
    yield 4
}

var x = foo()
x.next() // {value: 1, done: false}
x.next() // {value: 3, done: false}
x.next() // {value: 4, done: false}
x.next() // {value: 2, done: false}
x.next() // {value: undefined, done: true}
```

此外，`yield*` 还能这么用：
```js
function* foo(){
    yield 1
    yield* [3, 4]
    yield 2
}
var x = foo()
x.next() // {value: 1, done: false}
x.next() // {value: 3, done: false}
x.next() // {value: 4, done: false}
x.next() // {value: 2, done: false}
x.next() // {value: undefined, done: true}
```
```js
function* foo(){
    yield 1
    yield* '34'
    yield 2
}
var x = foo()
x.next() // {value: 1, done: false}
x.next() // {value: "3", done: false}
x.next() // {value: "4", done: false}
x.next() // {value: 2, done: false}
x.next() // {value: undefined, done: true}
```

***

### 6. `for...of` 循环
`for...of` 循环也是 `ES6` 的语法。它可以遍历具有 `Iterator` 接口的对象。而 `Generator` 函数生成的迭代器具有 `Iterator` 接口。因此，我们可以用 `for...of` 循环遍历 `yield`。如：
```js
function* foo(){
    yield 1
    yield* bar()
    yield 2
    return 5
}
function* bar(){
    yield 3
    yield 4
    return 6
}

var x = foo()
for(var value of x){
    console.log(value)
}
// 1
// 3
// 4
// 2
```
`return` 语句返回值不在 `for...of` 循环内。

***

### 7. `throw` 方法
迭代器有一个 throw 方法，可以在函数体外抛出错误，然后在 `Generator` 函数体内捕获。如：
```js
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e)
  }
}

var i = g()
i.next() // {value: undefined, done: false}

try {
  i.throw('a') // 内部捕获 a ,  {value: undefined, done: true}
  i.throw('b')
} catch (e) {
  console.log('外部捕获', e)
}
// 外部捕获 b
```

***


### 8. `return` 方法
迭代器还有一个 `return` 方法，可以提前结束 `Generator` 函数。
```js
function* gen() {
    yield 1
    yield 2
    yield 3
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```
如果 `Generator` 函数有 `finally` 函数块，则推迟到 `finally` 函数块结束之后再结束 `Generator` 函数。
```js
function* gen() {
    try {
        yield 1
    }
    finally {
        yield 2
    }
    yield 3
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return(4) // { value: 2, done: false }
g.next()        // { value: 4, done: true }
```

***


### 9. 异步迭代生成器
Generator 函数主要是被用来异步编程同步化。如：
```js
function* a(){
    var a = 0
    a = yield b()
    console.log(a)
}
function b(){/* 异步函数省略 */}

var x = a()
x.next()
```
理念很简单，如上，函数 `a` 内部指令执行到一半，把控制权交给异步函数 `b`，函数 `b` 执行完毕后再把控制权交还给函数 `a`。而控制权的交换由 `yield` 表达式实现。如：
```js
function* a(){
    var x = 1, y = 2, z = 0
    z = yield b(x, y)
    console.log(z)
}
function b(param1, param2){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(param1 + param2)
        }, 2000)
    })
}

var x = a()
x.next().value.then(function(r){
    x.next(r)
})
// 3
```
上面的过程就是，函数 `a` 调用了函数 `b`，通过 `yield` 和 `nxet` 拿到函数 `b` 返回的 `Promise`，在 `then` 内得到所需的数据，再通过 `next` 将该数据传回函数 `a` 的 `yield` 表达式。

看到这里，好像这异步处理与直接用 `Promise` 相比显得更复杂了。为什么？因为我们要在外部调用 next 方法。但是，如果我们把 `next` 的连续调用按一定的规则交给一个函数，那就简单多了。如：
```js
function run(generator){
  var x = generator()
  var r = x.next()
  run2(x, r)
}
function run2(d, result) {
  var done = result.done
  if(result.value instanceof Promise) {
    result.value.then((r)=>{
      result = d.next(r)
      if(!done) return run2(d, result)
    }).catch(function (e){
        throw e
    })
  } else {
    result = d.next(result.value)
    if(!done) return run2(d, result)
  }
}


function add(a, b){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve(a + b)
        }, 2000)
    })
}

run(function* (){
    var a = 1, b = 2, c
    c = yield add(a, b)
    console.log(c)
})
// 两秒后输出 3
```
现在我们封装了一个用于连续调用 next 方法的 `run` 函数。以后，所有的 Generator 函数就可以都用 `run` 函数去启动。

*** 
END

