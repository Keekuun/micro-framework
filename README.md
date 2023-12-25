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
+ 站点隔离和浏览上下文隔离，可以使微应用在运行时**天然隔离**，适合集成三方应用；
+ **移植性和复用性好**，可以便捷地嵌在不同的主应用中。

缺点：
+ 主应用刷新时， iframe 无法保持 URL 状态（会重新加载 src 对应的初始 URL）； 
+ 主应用和 iframe 处于不同的浏览上下文，无法使 iframe 中的模态框相对于主应用居中； 
+ 主应用和 iframe 微应用的数据状态同步问题：持久化数据和通信。
