# `Vue` 构造函数

在 `Vue` 的依赖包中的 `src/core/instance/index.js` 中：
```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```
这里声明了一个 `Vue` 构造器，`initMixin`、`stateMixin`、`eventsMixin`、`lifecycleMixin`、`renderMixin` 等函数都是给 `Vue` 构造器添加方法。
- `initMixin` 添加了实例方法 `_init` 用于初始化实例。
- `stateMixin` 添加了实例方法 `$set`、`$delete`、`$watch`。
- `eventsMixin` 添加了实例方法 `$on`、`$once`、`$off`、`$emit`，用于事件操作。
- `lifecycleMixin` 添加了实例方法 `_update`、`$forceUpdate`、`$destroy`，用于实例的生命周期的管理。
- `renderMixin` 添加了实例方法 `$nextTick`、`_render`，用于渲染。

最后，将 `Vue` 构造器暴露出去。除此之外，它还通过由其它文件引用 `Vue` 构造器来对其进行扩展。

***

[next -> Vue的实例化流程](./Vue的实例化流程.md)