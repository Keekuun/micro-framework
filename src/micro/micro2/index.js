// MDN: https://developer.mozilla.org/zh-CN/docs/Web/Web_Components
// MDN: https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements
class MicroApp2Element extends HTMLElement {
  constructor() {
    super();
  }

  // [生命周期回调函数] 当 custom element 自定义标签首次被插入文档 DOM 时，被调用
  // 类似于 React 中的  componentDidMount 周期函数
  // 类似于 Vue 中的 mounted 周期函数
  connectedCallback() {
    console.log(`[micro-app-2]: 执行 connectedCallback 生命周期回调函数`);
    // 挂载应用
    // 相对动态 Script，组件内部可以自动进行 mount 操作，不需要对外提供手动调用的 mount 函数，从而防止不必要的全局属性冲突
    this.mount();
  }

  // [生命周期回调函数] 当 custom element 从文档 DOM 中删除时，被调用
  // 类似于 React 中的  componentWillUnmount 周期函数
  // 类似于 Vue 中的 destroyed 周期函数
  disconnectedCallback() {
    console.log(
        `[micro-app-2]: 执行 disconnectedCallback 生命周期回调函数`
    );
    // 卸载处理
    this.unmount();
  }

  mount() {
    const $micro = document.createElement("h1");
    $micro.textContent = "微应用2";
    // 将微应用的内容挂载到当前自定义元素下
    this.appendChild($micro);

    this.getData()
  }

  unmount() {

  }

  getData() {
    // 新增 fetch 请求，用于请求 micro1.js 所在的服务
    // 需要注意 micro1.js 动态加载在主应用 localhost:4000 下，因此请求是跨域的
    // fetch("http://localhost:3002/cors", {
    fetch("https://jeek123.com:4002/cors", {
      method: "post",
      credentials: "include"
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
  }
}

// MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define
// 创建自定义元素，可以在浏览器中使用 <micro-app-2> 自定义标签
window.customElements.define("micro-app-2", MicroApp2Element);
