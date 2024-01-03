// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";

import config from "./config.js";

const app = express();
const {port, host} = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(express.static(path.join("src", "micro"), {
  etag: true,
  lastModified: true,
}));

app.post("/cors", function (req, res) {
  console.log("micro cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("micro-app", true);
  res.json({
    hello: "true",
  });
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);