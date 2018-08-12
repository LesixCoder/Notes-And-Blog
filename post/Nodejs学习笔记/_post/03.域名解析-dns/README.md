## 域名解析

- `dns.lookup()`

比如我们要查询域名 www.qq.com 对应的 ip，可以通过 `dns.lookup()`。

```js
var dns = require('dns');

dns.lookup('www.qq.com', function(err, address, family) {
  if (err) throw err;
  console.log('例子A: ' + address);
});
```

输出如下：

```shell
例子A: 182.254.50.164
```

我们知道，同一个域名，可能对应多个不同的 ip。那么，如何获取一个域名对应的多个 ip 呢？可以这样。

```js
var dns = require('dns');
var options = { all: true };

dns.lookup('www.baidu.com', options, function(err, address, family) {
  if (err) throw err;
  console.log('例子B: ' + address);
});
```

## 域名解析

- `dns.resolve4()`

上文的例子，也可以通过 `dns.resolve4()` 来实现。

```js
var dns = require('dns');

dns.resolve4('id.qq.com', function(err, address) {
  if (err) throw err;
  console.log(JSON.stringify(address));
});
```

输出如下：

```shell
["121.51.8.34"]
```

如果要获取 IPv6 的地址，接口也差不多。

## dns.lookup() 跟 dns.resolve4() 的区别

从上面的例子来看，两个方法都可以查询域名的 ip 列表。那么，它们的区别在什么地方呢？

可能最大的差异就在于，当配置了本地 Host 时，是否会对查询结果产生影响。

- `dns.lookup()`：有影响。
- `dns.resolve4()`：没有影响。

举例，在 hosts 文件里配置了如下规则。

> 127.0.0.1 www.qq.com

运行如下对比示例子，就可以看到区别。

```js
var dns = require('dns');

dns.lookup('www.qq.com', function(err, address, family) {
  if (err) throw err;
  console.log('配置host后，dns.lokup =>' + address);
});

dns.resolve4('www.qq.com', function(err, address, family) {
  if (err) throw err;
  console.log('配置host后，dns.resolve4 =>' + address);
});
```

输出如下

```shell
配置host后，dns.resolve4 => 182.254.34.74
配置host后，dns.lokup => 127.0.0.1
```

## 其他接口

对 DNS 有了解的同学，应该对 A 记录、NS 记录、CNAME 等不陌生，同样可以通过相应的 API 进行查询，感兴趣的可以自行尝试下。

## 相关链接

官方文档：https://nodejs.org/api/dns.html#dns_dns_resolve4_hostname_callback
