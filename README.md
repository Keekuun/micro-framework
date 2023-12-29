# micro-framework
**微前端-npm方案测试**
+ `main-app`: `react + vite + ts`主应用
+ `vue-app`: `vue + vite + ts`子应用
+ `react-app`: `react + vite + ts`子应用


# 启动
```bash
    # 安装依赖
    pnpm install
    # build react-app
    cd ./packages/react-app
    pnpm build
    # 回退到根目录
    cd ..
    # build vue-app
    cd ./packages/vue-app
    pnpm build

    # 回退到根目录
    cd ..
    # 启动mai-app
    cd ./packages/main-app
    pnpm dev
```


# 知识点：
+ 模块化：了解什么是模块化、为什么需要模块化；
+ 构建工具：了解为什么需要构建工具；
+ NPM 设计方案：了解 NPM 设计方案的特性；
+ NPM 设计示例：React 和 Vue 微应用的 NPM 聚合示例。

# 模块化
Node.js 的 CommonJS 和 ES Modules。

在浏览器中使用 ES Modules的好处:

+ 不需要构建工具进行打包处理；
+ 天然按需引入，并且不需要考虑模块的加载顺序；
+ 模块化作用域，不需要考虑变量名冲突问题。

# 构建工具
应用的构建需要生成 HTML 文件并打包 JS、CSS 以及图片等静态资源，业务组件的构建更多的是打包成应用需要通过模块化方式引入使用的 JavaScript 库。

诸如：webpack、vite、rollup、esbuild、rspack、swc等

> 从 JavaScript 标准版本的兼容性 可以发现，想要兼容大部分浏览器，需要将 ES6 或更高标准的 ECMAScript 转换成 ES5 标准，而如果要支持 IE9 及以下版本的浏览器，还需要使用 polyfill (例如 core-js) 来扩展浏览器中缺失的 API（例如 ES3 标准中缺失 Array.prototype.forEach）。如果对上图中的 ECMAScript 标准不了解，可以自行搜索和查看 ES2015 ~ ES2022（ES6 ~ ES13）、ESNext 等。

> [手把手教你从rollup、esbuild、vite、swc、webpack、tsc中选择npm包构建工具](https://juejin.cn/post/7302624942046134312?searchId=20231225201104B72FDB6A51268DC5E4CB#heading-15)
> [swc与esbuild-将你的构建提速翻倍](https://juejin.cn/post/7236670763272798266?searchId=20231225201104B72FDB6A51268DC5E4CB)
> [swc: Speedy Web Compiler](https://swc.rs/)

# NPM 设计方案特点
好处：
+ 微应用可以使用不同的技术栈进行开发；
+ 微应用不需要进行静态资源托管，只需要发布到 NPM 仓库即可；
+ 移植性和复用性好，可以便捷地嵌在不同的主应用中；
+ 微应用和主应用共享浏览器的 Renderer 进程、浏览上下文和内存数据。 

注意：
+ 需要处理主应用和各个微应用的全局变量、CSS 样式和存储数据的冲突问题；
+ 微应用的构建需要做额外的配置，构建的不是应用程序而是 JavaScript 库；
+ 由于微应用构建的是库包，因此不需要代码分割和静态资源分离（例如图片资源、CSS 资源需要内联在 JS 中）；
+ 微应用发布后，主应用需要重新安装依赖并重新构建部署。

NPM 设计仅仅适合集成一些小型微应用，如果微应用的资源过大，势必要对微应用的构建进行资源优化处理，例如多入口应用的三方库去重、弱网环境下 chunk 大小分离控制、懒加载、预加载等。

# 技巧

+ [lerna管理多packages](https://lerna.js.org/docs/getting-started)
+ [vite将项目打包为库](https://vitejs.dev/guide/build.html#library-mode)
+ [vite打包输出.d.ts文件](https://juejin.cn/post/7153139817495134238)
```
