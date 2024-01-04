# micro-framework

微前端-web components cookie 方案测试

# 启动

```bash
pnpm install

pnpm start
```

# 知识点：


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

