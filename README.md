# micro-framework
微前端-动态 Script 方案

# 启动
```bash
pnpm install

pnpm start:main
pnpm start:micro
```
# 知识点：
动态加载`script`方案实现的原理

主应用在html渲染之后，通过以下步骤实现：
+ `fetch`微应用列表数据，**动态**进行微应用的获取和路由创建处理。
+ 路由切换显示不同的微应用，切换的过程需要**动态加载和执行**对应的js和css资源。
+ 微应用需对外暴露`mount`和`unmount`全局函数，方便主应用进行加载和卸载处理。

# 技巧

+ 静态资源预加载
```js
// 判断是否支持预加载
function isSupportPrefetch() {
    const link = document.createElement("link");
    const relList = link?.relList;
    return relList && relList.supports && relList.supports("prefetch");
}

// 预请求资源，注意此种情况下不会执行 JS
function prefetchStatic(href, as) {
    // prefetch 浏览器支持检测
    if (!this.isSupportPrefetch()) {
        return;
    }
    const $link = document.createElement("link");
    $link.rel = "prefetch";
    $link.as = as;
    $link.href = href;
    document.head.appendChild($link);
} 
```

+ 

# 方案的优缺点
动态 Script 的方案相对于 NPM 方案而言，具备如下优势：
+ 主应用在线上运行时可以**动态增加、删除和更新**（升级或回滚）需要上架的微应用
+ 微应用可以进行构建时性能优化，包括**代码分割和静态资源分离**处理
+ 不需要额外对微应用进行库构建配置去适配 NPM 包的模块化加载方式

当然，动态 Script 方案和 NPM 包方案一样，会存在如下问题：

+ 主应用和各个微应用的**全局变量**会产生属性冲突
+ 主应用和各个微应用的 **CSS 样式**会产生**冲突**

# FAQ
+ 在微应用切换的执行逻辑中，为什么需要删除 CSS 样文件？那为什么不删除 JS 文件呢？删除 JS 文件会有什么副作用吗？假设删除` micro1.js`，那么还能获取` window.micro1_mount` 吗？如果能够获取，浏览器为什么不在删除 JS 的同时进行内存释放处理呢？如果释放，会有什么副作用呢？

删除css是为了避免不同的微应用之间css冲突

不删除js是因为不同的微应用命名空间不同，并且都是挂载到window，就算删除了js,window对象上仍然存在对应的微应用方法，仍然可以获取对应的方法。

如果直接删除了js脚本的话，那么在微应用切换的时候，每次都需要重新加载js文件，如果`js bundle`体积很大，加载时间就很久，那么体验是极差的。

+ 如果去除`micro1.js` 和 `micro2.js` 的立即执行匿名函数，在微应用切换时，会发生什么情况呢？
IIFE 执行的匿名函数可以起到隔绝全局作用域的功能，如果去掉了，很可能产生命名冲突，从而造成程序崩溃。
