# micro-framework
微前端-iframe方案测试

# 启动
    # 安装依赖
    pnpm install
    # 启动主应用服务
    pnpm run start:main
    # 启动微应用服务（打开新的终端执行）
    pnpm run start:micro


# 知识点：
+ 浏览器多进程架构：了解浏览器多进程架构设计；
+ 浏览器沙箱隔离：了解浏览器的沙箱隔离设计；
+ 浏览器站点隔离：了解浏览器中 iframe 的沙箱隔离策略；
+ iframe 设计方案：基于浏览器知识，讲解 iframe 设计方案的优缺点；

# 浏览器多进程架构
浏览器是一个多进程（Multi Process）的设计架构：

+ Browser 主进程：主要负责处理网络资源请求、用户的输入输出 UI 事件、地址栏 URL 管理、书签管理、回退与前进按钮、文件访问、Cookie 数据存储等。
+ Renderer 进程：主要负责标签页和 iframe 所在 Web 应用的 UI 渲染和 JavaScript 执行。Renderer 进程由 Browser 主进程派生，每次手动新开标签页时，Browser 进程会创建一个新的 Renderer 进程。

Chrome 浏览器进程包括 Browser 进程、网络进程、数据存储进程、插件进程、Renderer 进程和 GPU 进程等。

# 浏览器沙箱隔离
由于 Web 应用运行在 Renderer 进程中，浏览器为了提升安全性，需要通过常驻的 Browser 主进程对 Renderer 进程进行沙箱隔离设计，从而实现 Web 应用进行隔离和管控

> 温馨提示：从 Chrome 浏览器开发商的角度出发，需要将非浏览器自身开发的 Web 应用设定为三方不可信应用，防止 Web 页面可以通过 Chrome 浏览器进入用户的操作系统执行危险操作。

# 浏览器站点隔离
在 Chrome 浏览器中沙箱隔离以 Renderer 进程为单位，而在旧版的浏览器中会存在多个 Web 应用共享同一个 Renderer 进程的情况，此时浏览器会依靠**同源策略**来限制两个不同源的文档进行交互，帮助隔离恶意文档来减少安全风险。

Chrome 浏览器未启动站点隔离之前，标签页应用和内部的 iframe 应用会处于同一个 Renderer 进程，Web 应用有可能发现安全漏洞并绕过**同源策略**的限制，访问同一个进程中的其他 Web 应用，因此可能产生如下安全风险：

+ 获取跨站点 Web 应用的 Cookie 和 HTML 5 存储数据；
+ 获取跨站点 Web 应用的 HTML、XML 和 JSON 数据；
+ 获取浏览器保存的密码数据；
+ 共享跨站点 Web 应用的授权权限，例如地理位置；
+ 绕过 X-Frame-Options 加载 iframe 应用（例如百度的页面被 iframe 嵌套）；
+ 获取跨站点 Web 应用的 DOM 元素。

> [X-Frame-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options)
> 
> [了解“同网站”和“同源”](https://web.dev/articles/same-site-same-origin?hl=zh-cn)
> 
> 同源：协议（protocol）、主机名（host）和端口（port）相同，则为同源；
> 同站：有效顶级域名（Effective Top-Level-Domain，eTLD）和二级域名相同，则为同站。
> 
> [What is an eTLD + 1?](https://jfhr.me/what-is-an-etld-+-1/)

# 技巧

+ 判断页面是否在iframe中打开
```js
// 如果自己嵌自己会发生什么情况呢？ false
// 是否可以使用 if(window.parent !== window) {} 代替? true
if(window.top !== window) {
    console.log("This window is not the top-level window.");
}
```
+ 判断微应用是否被其他应用进行嵌入
```js
// 判断微应用是否被其他应用进行嵌入，可以使用
const isInOtherIframe = () => location.ancestorOrigins.length > 0
```

# iframe 设计方案的优缺点
优点：
+ 非常简单，使用没有任何心智负担
+ **天然隔离**,web应用隔离的非常完美，无论是js、css、dom都完全隔离开来

缺点：
+ 路由状态丢失，刷新一下，iframe的url状态就丢失了
+ dom割裂严重，弹窗只能在iframe内部展示，无法覆盖全局
+ web应用之间通信非常困难
+ 每次打开白屏时间太长，对于SPA 应用来说无法接受

# FQA
+ 关于同域的解决方案 - 子应用与主应用登录态问题

系统代理？

+ 主应用通过iframe加载子应用，如果子应用里有`location.href`的跳转，会导致主应用的历史堆栈出现问题

主应用Proxy代理拦截iframe中的location，子应用中操作的location实际上操作的是主应用中的location，这样我们可以在拦截到href赋值时阻止赋值，然后在主应用中调用history.replaceState更新浏览器地址

```js
// 获取 iframe 对象
const myFrame = document.getElementById("myFrame");
// 获取 iframe 内部的 window 对象
const frameWindow = myFrame.contentWindow;

// 在主应用中创建一个代理对象，拦截子应用中的location对象
const locationProxy = new Proxy(frameWindow, {
    set(target, prop, value) {
        // 阻止赋值操作
        if (prop === 'href') {
            // 在这里可以添加你的条件逻辑来判断是否阻止赋值
            return true; // 阻止赋值
        }
        // 其他情况下，正常赋值
        target[prop] = value;
        return true;
    }
});

// 在主应用中使用代理对象
// 通过locationProxy来操作子应用中的location对象
locationProxy.href = 'https://example.com'; // 赋值操作会被拦截

// 在主应用中使用history.replaceState更新浏览器地址
history.replaceState({}, '', 'https://example.com'); 
```
> [wujie: 路由同步机制](https://wujie-micro.github.io/doc/guide/#%E8%B7%AF%E7%94%B1%E5%90%8C%E6%AD%A5%E6%9C%BA%E5%88%B6)

> [wujie: 路由同步机制源码](https://github.com/Tencent/wujie/blob/master/packages/wujie-core/src/iframe.ts#L164)

+ 采用了 iframe 作为微前端解决方案，模态框居中问题

使用代理方式解决，比如： wujie的方案:

    天然适配弹窗问题
    
    document.body的appendChild或者insertBefore会代理直接插入到webcomponent，子应用不用做任何改造

> [wujie:iframe 连接机制和 css 沙箱机制](https://wujie-micro.github.io/doc/guide/#iframe-%E8%BF%9E%E6%8E%A5%E6%9C%BA%E5%88%B6%E5%92%8C-css-%E6%B2%99%E7%AE%B1%E6%9C%BA%E5%88%B6)
