# micro-framework

微前端-iframe blank 隔离方案

# 启动

```bash
pnpm install

pnpm start
```

# 知识点：
+ MPA模式JS可以做到天然隔离，但是SPA模式下为了避免全局js命名冲突问题，我们需要对js进行隔离
+ V8在运行时隔离方面，主要包括了Isolate隔离和Context隔离。

 - Isolate在安全上用于物理空间的隔离，可以防止跨站攻击，有自己的堆内存和垃圾回收器等资源，不同的Isolate之间的内存和资源相互隔离，他们之间无法共享数据，是非常安全可靠的隔离。
 - Context隔离是指在同一个Isolate实例中，可以创建不同的Context, 这些Context有自己的全局变量、函数和对象等，默认情况下不同的Context对应的Javascript全局上下文无法访问其他全局上下文。

但是，浏览器目前没有相应的web api来直接创建新的Isolate或Context,无法直接实现V8隔离，但是可以借助一下方式来实现JS隔离运行：
 
 - 使用WebAssembly进行隔离，WebAssembly会被限制运行在一个安全的沙箱执行环境中。
 - 使用Web Worker进行隔离，每个Worker有自己独立的Isolate实例。
 - 创建iframe进行Isolate或者Context（同一个Renderer进程）隔离。

# iframe隔离阶段一

1.阶段一：主应用加载空白的iframe应用`<iframe src="about:blank"></iframe>`,生成新的微应用执行环境 
+ 解决全局执行上下文隔离问题
+ 解决加载 iframe 的白屏体验问题

使用该隔离方案不仅可以解决动态 Script 方案无法解决的全局执行上下文隔离问题（包括 CSS 隔离），还可以通过空闲时间预获取微应用的静态资源来加速 iframe 内容的渲染，从而解决原生 iframe 产生的白屏体验问题。

**问题：使用 about:blank 会导致 history 无法正常工作**

> 将 iframe 设置成 src=about:blank 会产生一些限制，例如在 Vue 中使用 Vue-Router 时底层框架源码会用到 history.pushState 或者 history.replaceState，此时会因为 about:blank 而导致 iframe 无法正常运行
> 
> SPA 应用的路由，在 Vue 或者 React 框架中，路由可以分为 hash 模式或者 history 模式，hash 模式本质使用 window.location.hash 进行处理，而 history 模式本质使用 history.pushState 或者 history.replaceState 进行处理。如果使用路由模式在空白的 iframe 中运行，会使得框架出错。
