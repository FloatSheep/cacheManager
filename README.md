[中文（简体）](#中文简体) | English

# cacheManager

A simple persistent store based on the browser Cache API.

The item ~~copied~~ referenced [CrazyCreativeDream/CacheDB][1] and rewrite it with typescript.

## Package size

- `cachemanager.js`: ~4kB & gzip: ~1kB

- `cachemanager.umd.cjs`: ~3kB & gzip: ~1kB

## Usage

### Example

```javascript
const cacheManager = new CacheManager({
  cachePrefix: "myApp",
  cacheNamespace: "userData",
  broadId: "project1",
}); // Configuration(optional)

await cacheManager.init(); // Initialize(required)

await cacheManager.setItem("foo", "bar", "text/plain"); // return true;

await cacheManager.getItem("foo"); // return "bar";

await cacheManager.removeItem("foo"); // return true;
```

If you change mime-types

```javascript
await cacheManager.setItem("foo", 114514, "text/plain"); // return true;

await cacheManager.getItem("foo"); // return "114514";

await cacheManager.setItem("foo", 114514, "text/number"); // return true;

await cacheManager.getItem("foo"); // return 114514;
```

> [!TIP]
> Note that mime-types cannot be converted from one type to another.

For example,

```javascript
await cacheManager.setItem("foo", "{version: 1}", "application/json"); // return true;

await cacheManager.getItem("foo"); // return '{version: 1}';

await cacheManager.setItem("foo", "1", "text/number"); // return true;

await cacheManager.getItem("foo"); // return NaN;
```

Instead,

```javascript
await cacheManager.setItem("foo", { version: 1 }, "text/plain"); // return true;

await cacheManager.getItem("foo"); // return '{version: 1}';
```

Why do these problems arise?

The mime-types item in the parameter will be stored in headers, and the data will be processed according to this parameter when reading (i.e., call response.json(), response.text(), etc.) instead of forcing the type conversion.

cacheManager supports type parameters, but note that type assertions or judgments are required to handle null cases

```javascript
await cacheManager.setItem("foo", "<p>HTML Element</p>", "text/html"); // return true;

const bar = await cacheManager.getItem<string>("foo");
const element = document.getElementById("app");
if (element) {
  element.innerHTML = bar!.split('"').filter(e => e !== "")[0];
}
```

When cacheManager does not fetch data, null is returned.

```javascript
await cacheManager.getItem("foo"); // return null
```

### Service Worker

Web Worker can be used in two ways.

#### Using in Service Worker with `importScripts`

> [!WARNING]
> In this method, you can only use the umd module because Service Worker does not support ES6 named imports.
>
> Note that, using this method to import JavaScript scripts, you need to ensure that the MIME type is text/javascript, otherwise Service Worker will refuse to import.

```javascript
importScripts(
  "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"
);

// use it

const CacheManager = self.cacheManager.CacheManager;

self.addEventListener("fetch", async (event) => {
  const cacheManager = new CacheManager({});
  await cacheManager.init();
  await cacheManager.setItem("AppBlack", "Gold");
  console.log(await cacheManager.getItem("AppBlack"));
});
```

#### Using in Service Worker with `import`

> [!WARNING]
> This method relies on vite(rollover), webpack, or other build tools and it is not part of the Service Worker standard.

First, install the package.

```bash
npm install @floatsheep/cachemanager
```

Then, import it.

```javascript
import { CacheManager } from "@floatsheep/cachemanager";
```

### Using in WebScript(inline script and external script)

```html
<script module>
  import { CacheManager } from "https://unpkg.com/@floatsheep/cachemanager"; // Using default
</script>
```

If dynamic import is used

```html
<script>
(async() => {
  const { CacheManager } = await import("https://unpkg.com/@floatsheep/cachemanager");
})()
</script>
```

# 中文（简体）

一个基于浏览器 Cache API 的简单存储

这个项目~~抄袭~~参考了 [CrazyCreativeDream/CacheDB][1]，并使用 TypeScript 重写。

## 包体积

- `cachemanager.js`: ~4kB & gzip: ~1kB

- `cachemanager.umd.cjs`: ~3kB & gzip: ~1kB

## 使用方法

### 例子

```javascript
const cacheManager = new CacheManager({
  cachePrefix: "myApp",
  cacheNamespace: "userData",
  broadId: "project1",
}); // 配置(可选)

await cacheManager.init(); // 初始化(必须，否则报错)

await cacheManager.setItem("foo", "bar", "text/plain"); // 返回 true

await cacheManager.getItem("foo"); // 返回 "bar"

await cacheManager.removeItem("foo"); // 返回 true
```

如果更改 mime-types 参数

```javascript
await cacheManager.setItem("foo", 114514, "text/plain"); // 返回 true

await cacheManager.getItem("foo"); // 返回 "114514"

await cacheManager.setItem("foo", 114514, "text/number"); // 返回 true

await cacheManager.getItem("foo"); // 返回 114514
```

> [!TIP]
> 需要注意的是，mime-types 参数不能将一个类型强制转换为另一个类型

例如,

```javascript
await cacheManager.setItem("foo", "{version: 1}", "application/json"); // return true;

await cacheManager.getItem("foo"); // 返回 '{version: 1}';

await cacheManager.setItem("foo", "1", "text/number"); // 返回 true;

await cacheManager.getItem("foo"); // 返回 NaN;
```

相反,

```javascript
await cacheManager.setItem("foo", { version: 1 }, "text/plain"); // 返回 true;

await cacheManager.getItem("foo"); // 返回 '{version: 1}';
```

为什么会出现这些问题？

mime-types 参数将储存在 header 中，并且根据此参数来处理数据（即调用 response.json()、response.text()等），而不是强制类型转换。

cacheManager 支持类型参数，但要注意的是，需要使用类型断言或判断来处理 null 的情况

```javascript
await cacheManager.setItem("foo", "<p>HTML Element</p>", "text/html"); // 返回 true;

const bar = await cacheManager.getItem<string>("foo");
const element = document.getElementById("app");
if (element) {
  element.innerHTML = bar!.split('"').filter(e => e !== "")[0];
}
```

当 cacheManager 没有获取到数据时，会返回 null

```javascript
await cacheManager.getItem("foo"); // 返回 null
```

### Service Worker

Web Worker 有两种方法使用

#### 在 Service Worker 中以 `importScripts` 使用

> [!WARNING]
> 在这种方法中，你只能使用 umd 模块，因为 Service Worker 不支持 ES6 具名导入
>
> 需要注意的是，使用此方法导入 JavaScript 脚本时，需要保证 MIME 类型为 text/javascript，否则 Service Worker 将会拒绝导入

```javascript
importScripts(
  "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"
); // 使用 umd（即通用模块规范）

// 使用

const CacheManager = self.cacheManager.CacheManager;

self.addEventListener("fetch", async (event) => {
  const cacheManager = new CacheManager({});
  await cacheManager.init();
  await cacheManager.setItem("AppBlack", "Gold");
  console.log(await cacheManager.getItem("AppBlack"));
});
```

#### 在 Service Worker 中以 `import` 使用

> [!WARNING]
> 这种方法需要依赖 vite(rollup)、webpack 等构建工具，并且它不是 Service Worker 规范的一部分

首先安装依赖

```bash
npm install @floatsheep/cachemanager
```

然后导入

```javascript
import { CacheManager } from "@floatsheep/cachemanager";
```

### 在 WebScript 中使用

```html
<script module>
  import { CacheManager } from "https://unpkg.com/@floatsheep/cachemanager"; // 使用默认版
</script>
```

如果使用动态导入

```html
<script>
(async() => {
  const { CacheManager } = await import("https://unpkg.com/@floatsheep/cachemanager");
})()
</script>
```

[1]: https://github.com/CrazyCreativeDream/CacheDB
