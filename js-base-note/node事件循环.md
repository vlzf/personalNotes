# node 事件循环

node 环境下的事件循环与 web 环境下的是不一样的。

***

## 一、6 个阶段：
- `timers` ：执行 `setTimeout()` 和 `setInterval()` 中到期的 `callback`。
- `pending callbacks` ：上一轮循环中有少数的 `I/O callback` 会被延迟到这一轮的这一阶段执行。
- `idle, prepare` ：仅内部使用。
- `poll` ：执行 `I/O callback` ，在适当的条件下会阻塞在这个阶段。
- `check` ：执行 `setImmediate` 的 `callback` 。
- `close callbacks` ：执行 `close` 事件的 `callback`。

每个阶段都有属于自己的队列。除此之外的队列还有 `NextTick Queue` 和 `Microtask Queue`。

***

## 二、阶段的优先顺序
每一次循环都会按一定的顺序处理每个阶段：  
`timers` -> `pending callbacks` -> `idle, prepare` -> `poll` -> `check` -> `close callbacks`

```text
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

***

## 三、阶段对任务的处理
每个阶段的任务处理顺序：  
1. 清空当前阶段的队列中`该循环开始时已有`的任务。清空过程中，如果又在该队列生成新的任务，则，新任务将推迟到`下一循环`执行。
2. 清空 `NextTick Queue` 中的任务。清空过程中，如果又在该队列生成新的任务，则，新任务将在`当前循环`执行。
3. 清空 `Microtask Queue` 中的任务。清空过程中，如果又在该队列生成新的任务，则，新任务将在`当前循环`执行。

> 这与 web 事件循环有什么不一样呢？  
web 事件循环是每执行完宏任务队列里的一个任务，就把当前的微任务队列中的所有任务清空。  
node 事件循环则是每个阶段先清空当前阶段的所有任务，再清空 `NextTick Queue` 的微任务，最后清空 `Microtask Queue` 的微任务。

以下为例：
```js
setTimeout(()=>{
    console.log('setTimeout-1')
    Promise.resolve().then(()=>{
        console.log('Promise-1')
    })
}, 0)

setTimeout(()=>{
    console.log('setTimeout-2')
    Promise.resolve().then(()=>{
        console.log('Promise-2')
    })
}, 0)

Promise.resolve().then(()=>{
    console.log('Promise-3')
})
```
- 在 web 环境中，结果为：
```text
Promise-3
setTimeout-1
Promise-1
setTimeout-2
Promise-2
```
> 在 web 环境中，每一次循环都会从任务队列中取出一个任务到执行栈中执行。  
微任务队列（`Microtask Queue`）优先于宏任务队列（`Macrotask Queue`）。  
每执行完成一个宏和所有微任务后都会进入下一次循环。  

`Macrotask Queue` 与 `Microtask Queue` 的变化为：   

| Cycle | 执行栈 (stack) | 微任务队列 (Microtask Queue) | 宏任务队列 (Macrotask Queue) |
|---|---|---|---|
| 1 | script（代码整体） | Promise-3 | setTimeout-1、setTimeout-2 |
| 1 | Promise-3 |  | setTimeout-1、setTimeout-2 |
| 2 | setTimeout-1 | Promise-1 | setTimeout-2 |
| 2 | Promise-1 |  | setTimeout-2 |
| 3 | setTimeout-2 | Promise-2 |  |
| 3 | Promise-2 |  |  |
| | | |  |

- 在 node 环境中，结果为：
```text
Promise-3
setTimeout-1
setTimeout-2
Promise-1
Promise-2
```
> node 环境中，在整体代码执行完毕后，`event loop` 被初始化，开始监听任务队列，进入事件循环。例子中的定时器主要在 `timers` 阶段执行，主要涉及任务队列有`当前阶段的任务队列（Timers Queue）`、`Microtask Queue`。因为例子中没有 `process.nextTick()`，所以 `NextTick Queue` 略过不讲。

| Cycle | 执行栈 (stack) | 当前阶段的任务队列 (Timers Queue) | 微任务队列 (Microtask Queue) |
|---|---|---|---|
| 1 | script（代码整体） | setTimeout-1、setTimeout-2 | Promise-3 |
| 1 | Promise-3 | setTimeout-1、setTimeout-2 |  | 
| 2 | setTimeout-1 | setTimeout-2 | Promise-1 |
| 2 | setTimeout-2 |  | Promise-1、Promise-2 |
| 2 | Promise-1 |  | Promise-2 |
| 2 | Promise-2 |  |  |

***

例 1：
```js
setImmediate(()=>{
    console.log('setImmediate-1')

    Promise.resolve().then(()=>{
        console.log('Promise-1')
    }).then(()=>{
        console.log('Promise-3')
    })

    process.nextTick(()=>{
        console.log('nextTick-1')
    })
}, 0)

setImmediate(()=>{
    console.log('setImmediate-2')

    Promise.resolve().then(()=>{
        console.log('Promise-2')
    }).then(()=>{
        console.log('Promise-4')
    })

    process.nextTick(()=>{
        console.log('nextTick-2')
    })
}, 0)


setTimeout(()=>{
    console.log('setTimeout-1')
},0)

setTimeout(()=>{
    console.log('setTimeout-2')
},0)
```
node 输出：
```text
setTimeout-1
setTimeout-2
setImmediate-1
setImmediate-2
nextTick-1
nextTick-2
Promise-1
Promise-2
Promise-3
Promise-4
```
这里主要涉及到了循环中的两个阶段：`timers`、`setImmediate`  
任务队列变化：  
| Cycle | stack | Timers Queue | SetImmediate Queue | NextTick Queue | Microtask Queue |
|---|---|---|---|---|---|
| 1 | script（代码整体） | setTimeout-1、setTimeout-2 | setImmediate-1、setImmediate-2 |  |
| 2 | setTimeout-1 | setTimeout-2 | setImmediate-1、setImmediate-2 |  |
| 2 | setTimeout-2 |  | setImmediate-1、setImmediate-2 |  |
| 2 | setImmediate-1 |  | setImmediate-2 | nextTick-1 | Promise-1 |
| 2 | setImmediate-2 |  |  | nextTick-1、nextTick-2 | Promise-1、Promise-2 |
| 2 | nextTick-1 |  |  | nextTick-2 | Promise-1、Promise-2 |
| 2 | nextTick-2 |  |  |  | Promise-1、Promise-2 |
| 2 | Promise-1 |  |  |  | Promise-2、Promise-3 |
| 2 | Promise-2 |  |  |  | Promise-3、Promise-4 |
| 2 | Promise-3 |  |  |  | Promise-4 |
| 2 | Promise-4 |  |  |  |  |


***

例 2：
```js
setTimeout(()=>{
    console.log('setTimeout-1')

    Promise.resolve().then(()=>{
        console.log('Promise-1')
    })
    
    setImmediate(()=>{
        console.log('setImmediate-1')
        setImmediate(()=>{
            console.log('setImmediate-2')
        })
    })
    
    setTimeout(()=>{
        console.log('setTimeout-2')
    })
}, 0)
```
node 输出可能会出现不同的结果。  
结果一：
```text
setTimeout-1
Promise-1
setImmediate-1
setTimeout-2
setImmediate-2
```
结果二：
```text
setTimeout-1
Promise-1
setTimeout-2
setImmediate-1
setImmediate-2
```
> 按照流程来说，结果二是正确的。那么，结果一是怎么来的？可能是机器误差造成的。  
结果一的执行过程可能为：（猜测）  
第一次循环设置了 `setTimeout-1`；  
第二次循环执行 `setTimeout-1`，设置并执行 `Promise-1`，设置 `setImmediate-1`，设置 `setTimeout-2`；  
第三次循环由于机器误差，`setImmediate-1` 任务进入了队列，但 `setTimeout-2` 任务没有。因此只执行了 `setImmediate-1`，又设置了 `setImmediate-2`。  
第四次循环 `setTimeout-2` 任务进入了队列，`setTimeout-2` 任务被执行，输出 "setTimeout-2"。  
由于机器误差的问题，我也不敢说 `setImmediate-2` 任务是什么时候执行的，反正是最后执行的。

这个猜想对不对呢？因为 `setTimeout` 定时器的最小延迟是 10ms，不可能为 0ms。这猜想还真有可能是对的。

那么，我们就拖延一下第二次循环的执行时间，让其他任务有时间加进队列：
```js
setTimeout(()=>{
    console.log('setTimeout-1')

    Promise.resolve().then(()=>{
        console.log('Promise-1')
    })
    
    setImmediate(()=>{
        console.log('setImmediate-1')
        setImmediate(()=>{
            console.log('setImmediate-2')
        })
    })
    
    setTimeout(()=>{
        console.log('setTimeout-2')
    })
    let now = Date.now()
    while(Date.now() - now < 3000) {}
}, 0)
```
这里，我们让第二次循环时间延长 3s，node 输出结果为：
```text
setTimeout-1
Promise-1
setTimeout-2
setImmediate-1
setImmediate-2
```
无论控制台执行多少次，输出结果都与结果二相同，猜想很有可能正确。

***


参考：  
> https://cnodejs.org/topic/5a9108d78d6e16e56bb80882  
  https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/  
  https://blog.csdn.net/hkh_1012/article/details/53453138

***
  
END