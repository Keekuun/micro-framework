// 微应用工具类
class UtilsManager {
  constructor() {
  }

  // API 接口管理
  getMicroApps() {
    return window
      .fetch("/micro-apps", {
        method: "post",
      })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
  }

  isSupportPrefetch() {
    const link = document.createElement("link");
    const relList = link?.relList;
    return relList && relList.supports && relList.supports("prefetch");
  }

  // 预请求资源，注意此种情况下不会执行 JS
  prefetchStatic(href, as) {
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

  // 请求 & 执行 JS
  loadScript({script, id}) {
    console.log('[loadScript]', {script, id})
    return new Promise((resolve, reject) => {
      const $script = document.createElement("script");
      $script.src = script;
      $script.setAttribute("micro-script", id);
      $script.onload = resolve;
      $script.onerror = reject;
      document.body.appendChild($script);
    });
  }

  loadStyle({style, id}) {
    console.log('[loadStyle]', {style, id})
    return new Promise((resolve, reject) => {
      const $style = document.createElement("link");
      $style.href = style;
      $style.setAttribute("micro-style", id);
      $style.rel = "stylesheet";
      $style.onload = resolve;
      $style.onerror = reject;
      document.body.appendChild($style);
    });
  }

  // 为什么需要删除 CSS 样式？不删除会有什么后果吗？
  // 为什么没有删除 JS 文件的逻辑呢？
  removeStyle({id}) {
    const $style = document.querySelector(`[micro-style=${id}]`);
    $style && $style?.parentNode?.removeChild($style);
  }

  hasLoadScript({id}) {
    const $script = document.querySelector(`[micro-script=${id}]`);
    return !!$script;
  }

  hasLoadStyle({id}) {
    const $style = document.querySelector(`[micro-style=${id}]`);
    return !!$style;
  }
}

// 微应用管理
export default class MicroAppManager extends UtilsManager {
  microApps = [];

  constructor() {
    super();
    this.init();
    console.log('[MicroAppManager init]')
  }

  async init() {
    // 1.获取微应用列表
    await this.processMicroApps();
    // 2.导航跳转事件代理
    this.navClickListener();
    // 3.监听hash变化，切换不同的微应用
    this.hashChangeListener();
  }

  async refresh() {
    const hash = window.location.hash
    const micro = this.microApps.find(d => hash.includes(d.id))
    micro && await this.installMicro(micro)
  }

  processMicroApps() {
    this.getMicroApps().then((res) => {
      this.microApps = res;
      this.prefetchMicroAppStatic();
      this.createMicroAppNav();
      this.refresh()
    });
  }

  prefetchMicroAppStatic() {
    const prefetchMicroApps = this.microApps?.filter(
      (microApp) => microApp.prefetch
    );
    prefetchMicroApps?.forEach((microApp) => {
      microApp.script && this.prefetchStatic(microApp.script, "script");
      microApp.style && this.prefetchStatic(microApp.style, "style");
    });
  }

  createMicroAppNav(microApps) {
    const fragment = new DocumentFragment();
    this.microApps?.forEach((microApp, index) => {
      // TODO: APP 数据规范检测 (例如是否有 script、mount、unmount 等）
      const button = document.createElement("button");
      button.textContent = microApp.name;
      button.id = microApp.id;
      button.classList.add(`btn`)
      button.classList.add(`btn-${index + 1}`)
      fragment.appendChild(button);
    });
    nav.appendChild(fragment);
  }

  navClickListener() {
    const nav = document.getElementById("nav");
    nav.addEventListener("click", (e) => {
      // 并不是只有 button 可以触发导航变更，例如 a 标签也可以，因此这里不直接处理微应用切换，只是改变 Hash 地址
      // 不会触发刷新，类似于框架的 Hash 路由
      window.location.hash = e?.target?.id;
    });
  }

  hashChangeListener() {
    // 监听 Hash 路由的变化，切换微应用
    // 这里设定一个时刻只能切换一个微应用
    window.addEventListener("hashchange", () => {
      this.microApps?.forEach(async (microApp) => {
        // 匹配需要激活的微应用
        if (microApp.id === window.location.hash.replace("#", "")) {
          console.time(`fetch microapp [${microApp.name}] static`);
          await this.installMicro(microApp)
          console.timeEnd(`fetch microapp [${microApp.name}] static`);
          // 如果存在卸载 API 则进行应用卸载处理
        } else {
          this.uninstallMicro(microApp)
        }
      });
    });
  }

  uninstallMicro(microApp) {
    this.removeStyle(microApp);
    window?.[microApp.unmount]?.();
  }
  async installMicro(microApp) {
    // 加载 CSS 样式
    microApp?.style &&
    !this.hasLoadStyle(microApp) &&
    (await this.loadStyle(microApp));
    // 加载 Script 标签
    microApp?.script &&
    !this.hasLoadScript(microApp) &&
    (await this.loadScript(microApp));
    window?.[microApp.mount]?.("#micro-app-slot");
  }
}