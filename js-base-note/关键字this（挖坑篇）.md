# 关键字this（挖坑篇）

- 环境
- 关键字 this


## 一、环境
我们最为熟悉的的环境就是全局环境 window。当你在全局声明一个变量时，你可以通过 window 找到你声明的变量。如：
```js
var a = 'hello world!';
window.a   // "hello world!"
typeof window   // "object"
```
这时候，我们可以发现，其实所谓环境就是对象。它可以只有一个对象，也可以包含多个对象，而环境变量就是这些对象里的属性罢了。如：
```js
var age = 20;
var k = {
    name: 'k',
    fn: function(){
        return { 
            name: this.name,
            age: age
        }
    }
}
k.fn()  // { name: "k", age: 20 }
```
函数 k.fn 所在的环境就是 k 对象和 window 对象。  
总的来说，环境就是函数访问到的作用域。



**************


## 二、关键字 this
this 是一个指针，一般指向其所在函数的执行环境（作用域链）的第二个环境对象（或者说是指向[[scope]]的第一个环境对象）  
- 知识补全：（函数的几种环境）
1. 根据函数的内、外部，可以分为：函数的内部环境、函数的外部环境。
2. 根据函数的创建过程和执行过程，可以将函数环境分为两种：函数的定义环境、函数的执行环境。  
3. 函数的执行环境就是我们通常说的 “上下文”。
4. 更改环境（即更改 this 的指向）的两类方法：<b>显式更改</b> 和 <b>隐式更改</b>。（在箭头函数里，this 的指向无法更改）
5. 执行环境（作用域链）= 函数内部环境 + 定义环境[[scope]]


### 1. 函数的定义环境
函数的定义环境举例：
```js
var a = 'window';
function say(){
    return a
}
say()   // "window"

function shout(){
    var a = 'fn';
    return say();
}
shout()  // "window"
```
我们可以看到无论我们什么时候调用 say 函数，返回结果都是 “window”。  
函数在定义的时候，会将需要访问的环境对象按优先顺序记录到函数的 [[scope]] 属性内，而这个 [[scope]] 就是定义环境。  


### 2. 函数的执行环境
函数的定义环境好理解，但函数的执行环境就稍微复杂了一点。  
函数在执行的过程中，会创建自己的内部环境对象，再与 [[scope]] 所记录的环境对象按优先顺序排列，形成作用域链，这就是执行环境。  


以上面的 shout、say 嵌套函数为例：  
```js
var a = 'window';
function say(){
    var a = 'say';
    return this.a     // 原来的 "return a" 变成 "return this.a"
}
say()   // "window"

function shout(){
    var a = 'fn';
    return say();
}
shout()  // "window"
```
> 分析：    
> say 函数创建时，其 [[scope]] 为 [ 全局环境window ]  
> say 函数被 shout 调用时，say 形成的执行环境（作用域链）为 [ say函数的内部环境 , 全局环境window ]  
> 所以，this 指向全局环境window

再看一个例子：
```js
var a = 'window';
function say(){
    return this.a
}
var k = {
    a: 'k',
    shout: function shout(){
        console.log("shout函数内部的this.a => "+ this.a)
        return say();
    }
}
k.shout()   
// shout函数内部的this.a => k
// "window"
```
通过上面两个例子，我们可以知道，无论 say 被哪一个函数调用，放回结果都是一样的。

### 4. this 指向的深度理解
接下来将会把之前所说的彻底推翻
例1：
```js
var x = 1
function a(){
    var x = 'a'
    function b(){
        var x = 'b'
        return this.x
    }
    return b()
}
a()
```
例2：
```js
var x = 1
var obj = {
    x: 'obj',
    a: function a(){
        var x = 'a'
        function b(){
            var x = 'b'
            return this.x
        }
        return b()
    }
}
obj.a()
```
执行过上面的代码后，发现不对劲了，到底怎么回事？
这个问题的解答，我们将在[关键字this（填坑篇之函数创建）](https://github.com/vlzf/personalNotes/blob/master/js-base-note/%E5%85%B3%E9%94%AE%E5%AD%97this%EF%BC%88%E5%A1%AB%E5%9D%91%E7%AF%87%E4%B9%8B%E5%87%BD%E6%95%B0%E5%88%9B%E5%BB%BA%EF%BC%89.md)解决。

看完补坑篇的人可以回过头来想想，之前挖的坑究竟坑在哪了？哪里是坑？哪里不是坑？如果你分清楚了，就说明你理解的差不多了。



### 4. 函数环境的更改（更改 this 的指向）
- <font size="4">显式更改（call、apply、bind）</font>
```js
var a = 1;
function say(){
    return this.a;
}

var second = {
    a: 2,
}

say.call(second)  // 2
say.apply(second) // 2
say.bind(second)()  // 2
say()     // 1     
```
> 我们可以理解为：  
> call、apply 函数对 say 函数进行深拷贝得到副本，然后，将副本的 [[scope]] 的 this 指向更改为 second 对象，再执行副本函数，返回结果。  
> bind 函数对 say 函数进行深拷贝得到副本，然后，将副本的 [[scope]] 的 this 指向更改为 second 对象更改为 second 对象，最后，返回函数副本。


- <font size="4">隐式更改</font>
```js
var a = 1;
function say(){
    return this.a;
}

var second = {
    a: 2,
    say: say
}
second.say()  // 2
say()         // 1
```
*************************
END

