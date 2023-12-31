import ip from "ip";

export default {
  port: {
    main: 3001,
    micro: 3002,
  },
  // 获取本机的 IP 地址
  host: ip.address(),
};