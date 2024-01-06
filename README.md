# micro-framework

微前端-web components 方案

# 启动

```bash
pnpm install

pnpm start
```

# 配置
+ 1.host 配置：
```
192.168.31.111 micro.com
192.168.31.111 micro.demo.com
```

+ 2.nginx配置：
```nginx
 
```

# 知识点：

Web Components 可以理解为浏览器的原生组件，它通过组件化的方式封装微应用，从而实现应用自治。

方案实现的原理和动态加载`script`相似：

+ 通过请求获取后端的微应用列表数据，动态进行微应用的预获取和导航创建处理
+ 根据导航进行微应用的切换，切换的过程会动态加载并执行 JS 和 CSS
+ JS 执行后会在主应用中添加微应用对应的自定义元素，从而实现微应用的加载
+ 如果已经加载微应用对应的 JS 和 CSS，再次切换只需要对自定义元素进行显示和隐藏操作
+ 微应用自定义元素会根据内部的生命周期函数在被添加和删除 DOM 时进行加载和卸载处理

> 温馨提示：需要注意 [Web Components 存在浏览器兼容性问题](https://caniuse.com/?search=Web%20Components)
> ，可以通过 [Polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) 进行浏览器兼容性处理（IE
> 只能兼容到 11 版本）。

# Web Components知识

```bash
pnpm run "/^start:.*/"
```

+ custom element实现：

```js
// Create a class for the element
class MyCustomElement extends HTMLElement {
    static observedAttributes = ["color", "size"];

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        console.log("Custom element added to page.");
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }
}

customElements.define("my-custom-element", MyCustomElement);

```

+ custom element注册：

```js
  customElements.define("my-custom-element", MyCustomElement);
```

+ custom element使用：
```html
<my-custom-element>
  <!-- content of the element -->
</my-custom-element>
```
> [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)

# 方案的优缺点

对比动态 Script 的方案可以发现 Web Components 的优势如下所示：

+ 复用性：不需要对外抛出加载和卸载的全局 API，可复用能力更强
+ 标准化：W3C 的标准，未来能力会得到持续升级（说不定支持了 JS 上下文隔离）
+ 插拔性：可以非常便捷的进行移植和组件替换

当然使用 Web Components 也会存在一些劣势，例如：

+ 兼容性差：对于 IE 浏览器不兼容，需要通过 Polyfill 的方式进行处理
+ 学习难度增加：相对于传统的 Web 开发，需要掌握新的概念和技术
