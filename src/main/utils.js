// 隔离类
class MicroAppSandbox {
  // 沙箱配置信息
  options = null;
  // iframe 实例
  iframe = null;
  // iframe 的 Window 实例
  iframeWindow = null;
  // 是否执行过 JS
  exec = false;

  constructor(options) {
    this.options = options;
    // 创建 iframe 时浏览器会创建新的全局执行上下文，用于隔离主应用的全局执行上下文
    this.iframe = this.createIframe();
    this.iframeWindow = this.iframe.contentWindow;
  }

  createIframe() {
    const {rootElm, id, url} = this.options;
    const iframe = window.document.createElement("iframe");
    // 创建一个空白的 iframe
    const attrs = {
      src: "about:blank",
      "app-id": id,
      "app-src": url,
      style: "border:none;width:100%;height:100%;",
    };
    Object.keys(attrs).forEach((name) => {
      iframe.setAttribute(name, attrs[name]);
    });
    rootElm?.appendChild(iframe);
    return iframe;
  }

  // 激活
  active() {
    this.iframe.style.display = "block";
    // 如果已经通过 Script 加载并执行过 JS，则无需重新加载处理
    if (this.exec) return;
    this.exec = true;
    const scriptElement = this.iframeWindow.document.createElement('script');
    scriptElement.textContent = this.options.scriptText;
    this.iframeWindow.document.head.appendChild(scriptElement);
  }

  // 失活
  // INFO: JS 加载以后无法通过移除 Script 标签去除执行状态
  // INFO: 因此这里不是指代失活 JS，如果是真正想要失活 JS，需要销毁 iframe 后重新加载 Script
  inactive() {
    this.iframe.style.display = "none";
  }

  // 销毁沙箱
  destroy() {
    this.options = null;
    this.exec = false;
    if (this.iframe) {
      this.iframe.parentNode?.removeChild(this.iframe);
    }
    this.iframe = null;
  }
}

// 微应用管理
class MicroApp {
  // 缓存微应用的脚本文本（这里假设只有一个执行脚本）
  scriptText = "";
  // 隔离实例
  sandbox = null;
  // 微应用挂载的根节点
  rootElm = null;

  constructor(rootElm, app) {
    this.rootElm = rootElm;
    this.app = app;
  }

  // 获取 JS 文本（微应用服务需要支持跨域请求获取 JS 文件）
  async fetchScript(src) {
    try {
      const res = await window.fetch(src);
      return await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  // 激活
  async active() {
    // 缓存资源处理
    if (!this.scriptText) {
      this.scriptText = await this.fetchScript(this.app.script);
    }

    // 如果没有创建沙箱，则实时创建
    // 需要注意只给激活的微应用创建 iframe 沙箱，因为创建 iframe 会产生内存损耗
    if (!this.sandbox) {
      this.sandbox = new MicroAppSandbox({
        rootElm: this.rootElm,
        scriptText: this.scriptText,
        url: this.app.script,
        id: this.app.id,
      });
    }

    this.sandbox.active();
  }

  // 失活
  inactive() {
    this.sandbox?.inactive();
  }
}

// 微前端管理
class MicroApps {
  // 微应用实例映射表
  appsMap = new Map();
  // 微应用挂载的根节点信息
  rootElm = null;

  constructor(rootElm, apps) {
    this.rootElm = rootElm;
    this.setAppMaps(apps);
  }

  setAppMaps(apps) {
    apps.forEach((app) => {
      this.appsMap.set(app.id, new MicroApp(this.rootElm, app));
    });
  }

  // TODO: prefetch 微应用
  prefetchApps() {
  }

  // 激活微应用
  activeApp(id) {
    const app = this.appsMap.get(id);
    app?.active();
  }

  // 失活微应用
  inactiveApp(id) {
    const app = this.appsMap.get(id);
    app?.inactive();
  }
}

// 主应用管理
export default class MainApp {
  microApps = [];
  microAppsManager = null;

  constructor() {
    this.init();
  }

  async init() {
    this.microApps = await this.fetchMicroApps();
    this.createNav();
    this.navClickListener();
    this.hashChangeListener();
    // 创建微前端管理实例
    this.microAppsManager = new MicroApps(
      document.getElementById("micro-app-slot"),
      this.microApps
    );
  }

  // 从主应用服务器获请求微应用列表信息
  async fetchMicroApps() {
    try {
      const res = await window.fetch("/micro-apps", {
        method: "post",
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }

  // 根据微应用列表创建主导航
  createNav(microApps) {
    const fragment = new DocumentFragment();
    this.microApps?.forEach((microApp, index) => {
      // TODO: APP 数据规范检测 (例如是否有 script）
      const button = document.createElement("button");
      button.textContent = microApp.name;
      button.id = microApp.id;
      button.classList.add(`btn`)
      button.classList.add(`btn-${index + 1}`)
      fragment.appendChild(button);
    });
    nav.appendChild(fragment);
  }

  // 导航点击的监听事件
  navClickListener() {
    const nav = document.getElementById("nav");
    nav.addEventListener("click", (e) => {
      // 并不是只有 button 可以触发导航变更，例如 a 标签也可以，因此这里不直接处理微应用切换，只是改变 Hash 地址
      // 不会触发刷新，类似于框架的 Hash 路由
      window.location.hash = e?.target?.id;
    });
  }

  // hash 路由变化的监听事件
  hashChangeListener() {
    // 监听 Hash 路由的变化，切换微应用（这里设定一个时刻只能切换一个微应用）
    window.addEventListener("hashchange", () => {
      this.microApps?.forEach(async ({id}) => {
        id === window.location.hash.replace("#", "")
          ? this.microAppsManager.activeApp(id)
          : this.microAppsManager.inactiveApp(id);
      });
    });
  }
}