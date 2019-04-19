# 石墨 SDK 简易开发模块 


## 简介
本模块旨在方便用户二次开发石墨 SDK

### 概要
本模块提供 typescript 和可以直接运行在浏览器的 js 文件

用户可以根据自身需要进行二次开发

## 必要条件
该模块仅简化开发流程，仍然需要 SDK 前端以及后端组件

## 用法

### 石墨表格

#### 通过引入 js 文件进行
```html
<div id="container"></div>
<script>
    // prepare 等待后端请求返回之后的函数
    window.shimo.prepare().then(function() {
        var cabinet = new ShimoCabinet.default(options)
        window.sheetEditor = cabinet.renderSheet()
    })
</script>
```

#### 通过 typescript 方式开发
我们提供了完整的 type 来提升开发体验

```js
import * from "@shimo/sdk_cabinet";

const shimoCabinet = new ShimoCabinet(options);
shimoCabinet.renderSheet();
```

