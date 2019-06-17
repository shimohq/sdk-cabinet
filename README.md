# 石墨 SDK 简易开发模块 


## 简介
本模块旨在方便用户二次开发石墨 SDK

### 概要
本模块提供 typescript 和可以直接运行在浏览器的 js 文件

用户可以根据自身需要进行二次开发

该模块仅简化开发流程，仍然需要 SDK 前端以及后端组件

简易开发模块完全开源，可供参考和学习，如有建议或问题可在项目 issue 提出

## 用法

### 快速开始

#### 通过引入 js 文件进行
```html
<div id="container"></div>
<script>
    // prepare 等待后端请求返回之后的函数
    window.shimo.prepare().then(function() {
        var cabinet = new ShimoCabinet.default(options)
        window.sheetEditor = cabinet.renderSheet() // 渲染表格

        cabinet.destroySheet() // 销毁

        // 或者

        window.documentEditor = cabinet.renderDocument() // 渲染文档

        cabinet.destroyDocument() // 销毁

    })
</script>
```

ps: 容器 id 请勿使用 sm-editor toolbar-wrapper ql-history history-sidebar history-content history-container

#### 通过 typescript 方式开发
我们提供了完整的 type 来提升开发体验

```js
import * from "@shimo/sdk_cabinet";

const shimoCabinet = new ShimoCabinet(options);
shimoCabinet.renderSheet(); // 渲染表格

// 或者

shimoCabinet.renderDocument(); // 渲染文档
```

完整示例在 [example 目录 ](https://github.com/shimohq/sdk-cabinet/tree/develop/example)

### **参数**

| 名称               | 类型      | 默认值  | 描述             |
| ------------------ | --------- | ------- | ---------------- |
| options.rootDom | HTMLElement | 必选 | 石墨表格渲染所需的根 DOM |
| options.sdkSheet | object | 无 | 石墨表格 SDK 组件 |
| options.sdkDocument | object | 无 | 石墨文档 SDK 组件 |
| options.sdkCommon | object | 必选 | 石墨公共通信组件 |
| options.user | object | 必选 | 用户信息 |
| options.user.avatar | string | 必选 | 用户头像地址 |
| options.user.id | number | 必选 | 用户 ID |
| options.user.name | string | 必选 | 用户名 |
| options.entrypoint | string | 必选 | 石墨 SDK 后端入口地址 |
| options.token | string | 必选 | 石墨 SDK 后端鉴权 token |
| options.file | object | 必选 | 文件信息 |
| options.file.guid | string | 必选 | 石墨文件系统唯一标识信息 |
| options.file.head | number | 必选 | 石墨文件系统文件当前版本信息 |
| options.file.content | string | 必选 | 石墨文件系统文件内容 |
| options.editorOptions | object | 必选 | 编辑器基本配置 |
| options.editorOptions.editable | boolean | true | 设置是否可以编辑 |
| options.editorOptions.commentable | boolean | true | 设置是否可以评论 |
| options.editorOptions.disableRenderOptimization | boolean | true | 设置是否禁用表格渲染优化 |
| options.editorOptions.localeConfig | object | 可选 | 国际化相关 |
| options.editorOptions.localeConfig.fetchLocaleSync | string | 必选 | 获取翻译的路径 |
| options.editorOptions.localeConfig.locale | string | zh-CN | 设置当前语言 |
| options.editorOptions.uploadConfig | object | 可选 | 上传配置 |
| options.editorOptions.uploadConfig.origin | string | 必选 | 上传服务的地址 |
| options.editorOptions.uploadConfig.server |	string | 必选 |	存储服务类型, 公有云：'oss', 私有云：'aws' |
| options.editorOptions.uploadConfig.token | string	| 必选	| 上传服务鉴权秘钥 |
| options.editorOptions.downloadConfig | Object |	可选 |	下载图片配置 |
| options.editorOptions.downloadConfig.origin | string | 必选 | 下载服务的地址 |
| options.plugins | string[] | [] | 开启插件列表 |

## 资源获取

### 官方打包文件下载（内含 SDK 静态资源）
[Release下载](https://github.com/shimohq/sdk-cabinet/releases/latest)

### 源代码打包（不含 SDK 静态资源）
```shell
npm run build
cp ./dist/index.min.js your/workspace
```

## 友好提示

### 相关参数获取方式
 * sdkCommon: 引入石墨通用通信 SDK 静态资源之后，会暴露为 window.shimo.sdk.common，需要在 sdkDocument 或者 sdkSheet 之前引入
 * sdkDocument: 引入石墨文档 SDK 静态资源之后，会暴露为 window.shimo.sdk.document
 * sdkSheet: 引入石墨表格 SDK 静态资源之后，会暴露为 window.shimo.sdk.sheet
 * entrypoint: 石墨 SDK 后端总入口
 * user: 石墨 SDK 后端服务返回
 * token: 石墨 SDK 后端服务返回
 * file: 石墨 SDK 后端服务返回
 * uploadConfig: 石墨 SDK 上传服务相关配置，和石墨 SDK 后端服务有区别


 ### 测试数据
 空白表格的 content :
 ```"q:p!g@T7$5:4!5k#4:3!i# 0 1 2["B:工作表1","C*0","G:MODOC"]"```

 空白文档的 content :
 ```"[[10, "\n", "line:\"init\""]]"```