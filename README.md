# micro-framework

微前端-web components cookie 方案测试

# 启动

```bash
pnpm install

pnpm start
```

# 配置

> [nginx: download](https://nginx.org/en/download.html)
> 
> [mkcert: download](https://github.com/FiloSottile/mkcert)

+ 1.host 配置：
```
192.168.31.111 jeek.com
192.168.31.111 jeek.demo.com
```

+ 2.nginx配置代理：
```nginx configuration
http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
#         listen       80;
#         server_name  localhost;

        # 设置主应用的代理端口为 4001
        listen       4001;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
#             root   html;
#             index  index.html index.htm;

           proxy_pass http://192.168.31.111:3001;
        }
    }
}
```

+ 3.mkcert生成证书：----> 配置本地https

执行以下操作，生成本地 CA 证书：
```bash
# 进入mkcert-v1.4.4-windows-amd64.exe所在目录
# mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1
mkcert-v1.4.4-windows-amd64.exe jeek123.com 192.168.31.111 localhost 127.0.0.1 ::1
```
将生成的`.pem`文件拷贝到nginx文件夹下。

+ 4.nginx 配置本地https
```nginx configuration
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    # server {
    #     # 设置主应用的代理端口为 4001
    #     listen       4001;
    #     server_name  localhost;

    #     #charset koi8-r;

    #     #access_log  logs/host.access.log  main;

    #     location / {
    #         # root   html;
    #         # index  index.html index.htm;
    #         # 代理到主应用的地址
    #         proxy_pass 'http://30.120.112.54:4000';
    #     }

    #     #error_page  404              /404.html;

    #     # redirect server error pages to the static page /50x.html
    #     #
    #     error_page   500 502 503 504  /50x.html;
    #     location = /50x.html {
    #         root   html;
    #     }

    #     # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #     #
    #     #location ~ .php$ {
    #     #    proxy_pass   http://127.0.0.1;
    #     #}

    #     # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #     #
    #     #location ~ .php$ {
    #     #    root           html;
    #     #    fastcgi_pass   127.0.0.1:9000;
    #     #    fastcgi_index  index.php;
    #     #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #     #    include        fastcgi_params;
    #     #}

    #     # deny access to .htaccess files, if Apache's document root
    #     # concurs with nginx's one
    #     #
    #     #location ~ /.ht {
    #     #    deny  all;
    #     #}
    # }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # HTTPS server
    # 使用 HTTPS 协议，代理到主应用
    server {
       listen       4001 ssl;
       server_name  localhost;

       ssl_certificate     ../micro.com+4.pem;
       ssl_certificate_key ../micro.com+4-key.pem;
       
       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
        #    root   html;
        #    index  index.html index.htm;
        proxy_pass 'http://30.120.112.54:4000';
       }
    }

    # HTTPS server
    # 使用 HTTPS 协议，代理到微应用
    server {
       listen       3001 ssl;
       server_name  localhost;
       
       ssl_certificate      ../micro.com+4.pem;
       ssl_certificate_key  ../micro.com+4-key.pem;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
        #    root   html;
        #    index  index.html index.htm;
        proxy_pass 'http://192.168.31.111:3001';
       }
    }
    include servers/*;
}

```

> 上述操作均在 windows 环境

# windows nginx操作
```bash
# 检测nginx配置
nginx -t

# 启动nginx
start nginx

# 停止nginx
nginx -s stop

# 重启Nginx
nginx -s reload

# 重新打开日志文件
nginx -s reopen

# 查看Nginx版本
nginx -v
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

