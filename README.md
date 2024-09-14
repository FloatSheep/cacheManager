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

cacheManager.init(); // Initialize(required)

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

### WebWorker

Web Worker can be used in two ways.

#### Using in WebWorker with `importScripts`

```javascript
importScripts("https://unpkg.com/@floatsheep/cachemanager"); // Using default
```

or

```javascript
importScripts(
  "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"
); // Using umd
```

#### Using in WebWorker with `import`

> [!WARNING]
> This method relies on vite(rollover), webpack, or other build tools and it is not part of the WebWorker standard.

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

or

```html
<script module>
  import { CacheManager } from "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"; // Using umd
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

cacheManager.init(); // 初始化(必须，否则报错)

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

### WebWorker

Web Worker 有两种方法使用

#### 在 WebWorker 中以 `importScripts` 使用

```javascript
importScripts("https://unpkg.com/@floatsheep/cachemanager"); // 使用默认版
```

or

```javascript
importScripts(
  "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"
); // 使用 umd（即通用模块规范）
```

如果你的项目没有特殊兼容需求，可以使用默认版本，否则请使用 umd 以获取更好的兼容性

#### 在 WebWorker 中以 `import` 使用

> [!WARNING]
> 这种方法需要依赖 vite(rollup)、webpack 等构建工具，并且它不是 WebWorker 规范的一部分

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

or

```html
<script module>
  import { CacheManager } from "https://unpkg.com/@floatsheep/cachemanager@latest/dist/cachemanager.umd.cjs"; // 使用 umd（即通用模块规范）
</script>
```


[1]: https://github.com/CrazyCreativeDream/CacheDB
