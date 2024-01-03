// main-server.js
import express from "express";
import path from "path";
import morgan from "morgan";
import livereload from "livereload"
import connectLivereload from "connect-livereload"

import config from "./config.js";

const staticDir = path.join("src", "main")
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(staticDir);

const app = express();
const { port, host } = config;
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// 打印请求日志
app.use(morgan("dev"));

app.use(connectLivereload());
app.use(express.static(staticDir));


app.post("/micro-apps", function (req, res) {
  console.log("main cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("main-app", true);

  // 这里可以是管理后台新增菜单后存储到数据库的数据
  // 从而可以通过管理后台动态配置微应用的菜单
  res.json([
    {
      name: "micro1",
      id: "micro1",
      // 这里暂时以一个入口文件为示例
      script: `http://${host}:${port.micro}/micro1/index.js`,
      style: `http://${host}:${port.micro}/micro1/index.css`,
      // // 挂载到 window 上的启动函数 window.micro1_mount
      // mount: "micro1_mount",
      // 挂载到 window 上的启动函数 window.micro1_unmount
      // unmount: "micro1_unmount",
      // 自定义元素名称
      customElement: 'micro-app-1',
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      script: `http://${host}:${port.micro}/micro2/index.js`,
      style: `http://${host}:${port.micro}/micro2/index.css`,
      // mount: "micro2_mount",
      // unmount: "micro2_unmount",
      // 自定义元素名称
      customElement: 'micro-app-2',
      prefetch: true,
    },
  ]);
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
