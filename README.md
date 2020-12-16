# 石墨 SDK 简易开发模块

## 简介

用于石墨 SDK 接入的 All-in-One 模块。

接入示例：[sdk-cabinet-example](https://github.com/shimohq/sdk-cabinet-example)。

## 使用说明

### 安装

通过 [npm](https://www.npmjs.com/) 安装：

```
npm install shimo-sdk-cabinet
```

通过 [yarn](https://yarnpkg.com/) 安装：

```
yarn add shimo-sdk-cabinet
```

安装后，本模块提供以下可用资源：

```
.
├── dist
│   ├── cabinet.min.js
│   ├── cabinet.min.js.map
│   ├── document-pro.min.js
│   ├── document-pro.min.js.map
│   ├── document.min.js
│   ├── document.min.js.map
│   ├── sheet.min.js
│   ├── sheet.min.js.map
│   ├── slide.min.js
│   └── slide.min.js.map
└── vendor
```

`dist`：为已预先处理的 JS 文件，可以在项目中直接使用。

`vendor`：为已预先处理的石墨 JS SDK 文件，本模块初始化编辑器依赖于此目录下的 JS SDK 文件。

`dist/cabinet.min.js`：仅包含简易开发模块基础逻辑，需配合引入 `vendor` 目录下的 `JS SDK` 一起使用。适用于有定制需求，希望自定义使用部分插件功能的场景。

`dist/document.min.js`、`dist/document-pro.min.js`、`dist/sheet.min.js` 和 `dist/slide.min.js` 等等为**包含对应套件的 JS SDK 文件**的模块文件，**不需要额外引入 JS SDK 文件**。适用于无定制需求，希望全部使用石墨编辑器所有功能的场景。

- document：新文档
- document-pro：专业文档
- sheet：表格
- slide：幻灯片

**本模块仅提供统一的代码包，不代表实际可用的套件。**

### 用法 (以新文档为例)

#### 开始之前

- 请参考[鉴权认证文档](https://platform.shimo.im/docs/api-be-authentication)了解[如何申请 Access Token](https://platform.shimo.im/docs/api-be-authentication/#%E4%BD%BF%E7%94%A8-client-credentials-%E8%8E%B7%E5%8F%96-access-token)
- 请参考[创建文档](https://platform.shimo.im/docs/api-be-file/#%E5%88%9B%E5%BB%BA%E6%96%87%E6%A1%A3)一节了解如何获取文档 GUID
- Access Token (下称 `<SHIMO_ACCESS_TOKEN>`) 和 GUID  (下称 `<SHIMO_FILE_GUID>`) 均需要由你获取后提供给前端页面

#### 全局引入

```html
<body>
  <div id="editor"></div>

  <script src="/path/to/shimo-sdk-cabinet/dist/document.min.js"></script>
  <script>
    const cabinet = new window.ShimoCabinet({
      fileGuid: '<SHIMO_FILE_GUID>',
      entrypoint: '<SHIMO_ENTRYPOINT_URL>',
      token: '<SHIMO_ACCESS_TOKEN>',

      container: document.getElementById('editor')
    })
    cabinet.render().then(() => {
      console.log('Editor is ready!')
    })
  </script>
</body>
```

#### React / Vue 等方式

以 React 为例：

`shimo-sdk-cabinet/dist` 下的文件为已经过打包处理、兼容 `ES5` 的代码，包含

- `cabinet.min.js` 不包含任何套件的初始化工具，仅在需定制插件时使用
- `document.min.js` 文档
- `document-pro.min.js` 专业文档
- `sheet.min.js` 表格
- `slide.min.js` 幻灯片

```js
import React from "react"
import ReactDOM from "react-dom"

// 仅加载文档套件
import ShimoCabinet from 'shimo-sdk-cabinet/dist/document.min.js'

class Editor extends React.Component {
  componentDidMount () {
    const elm = ReactDOM.findDOMNode(this)
    const cabinet = new ShimoCabinet({
      fileGuid: this.props.fileGuid,
      entrypoint: this.props.entrypointURL,
      token: this.props.accessToken,

      container: elm
    })
    cabinet.render().then(() => {
      console.log('Editor is ready!')
    })
  }

  render () {
    return (
      <div class="editor" fileGuid="..." entrypointURL="..." accessToken="...">
      </div>
    )
  }
}

ReactDOM.render(<Editor />, document.getElementById('app'))
```

如有定制需求，比如希望自定义使用部分插件 (一般建议采用上述方式自动处理配置) ：

```js
import React from "react"
import ReactDOM from "react-dom"

// ES5 兼容的格式
import ShimoCabinet from 'shimo-sdk-cabinet/dist/cabinet.min.js'
// TypeScript 可用原始文件
// import ShimoCabinet from 'shimo-sdk-cabinet'

// 加载石墨 JS SDK 资源，需要用 script-loader 等方式加载，不能再次使用 webpack 或其他工具重新处理
require('shimo-sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.common.min.js')
require('shimo-sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.document.editor.min.js')
// 假设只启用上传插件
require('shimo-sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.document.plugins.uploader.min.js')

class Editor extends React.Component {
  componentDidMount () {
    const elm = ReactDOM.findDOMNode(this)
    const cabinet = new ShimoCabinet({
      fileGuid: this.props.fileGuid,
      entrypoint: this.props.entrypointURL,
      token: this.props.accessToken,

      container: elm,

      editorOptions: {
        plugins: {
          // 以默认选项启用工具栏插件
          Uploader: {
            // 自定义选项
          },

          // 停用其他插件
          Collaborator: false,
          Collaboration: false,
          Comment: false,
          DemoScreen: false,
          Gallery: false,
          History: false,
          Shortcut: false,
          TableOfContent: false
        }
      }
    })
    cabinet.render().then(() => {
      console.log('Editor is ready!')

      // 访问插件，如启动文档演示模式
      cabinet.document.plugins.demoScreen.show()
    })
  }

  render () {
    return (
      <div class="editor" fileGuid="..." entrypointURL="..." accessToken="...">
      </div>
    )
  }
}

ReactDOM.render(<Editor />, document.getElementById('app'))
```

#### ShimoCabinet 參数

| 名称               | 类型      | 默认值  | 描述             |
| ------------------ | --------- | ------- | ---------------- |
| container | HTMLElement | 必选 | 石墨表格渲染所需的根 DOM |
| entrypoint | string | 必选 | 石墨 SDK 后端入口地址 |
| token | string | 必选 | 石墨 SDK 后端鉴权 access token |
| fileGuid | string | 必选 | 石墨文件的 GUID |
| editorOptions | object | 可选 | 编辑器基本配置 |
| externals | object | 可选 | 石墨 JS SDK 文件的远程地址，用于优化加载性能 |
| externalLoader | function | 可选 ｜ 自定义 JS SDK 加载器 |

##### 新文档 (`document`) 配置

| 名称               | 类型      | 默认值  | 描述             |
| ------------------ | --------- | ------- | ---------------- |
| plugins | object | 可选 | 插件配置，设为 `true` 时使用默认配置，设为 `false` 为关闭，空配置 `{}` 等同于 `true` |
| plugins.Collaborator | object<br>boolean | 可选 | 协作者插件，详见 [`d.ts` 文件](typings/document/plugins/collaborator/index.d.ts) |
| plugins.Collaboration | object<br>boolean | 可选 | 协作插件，详见 [`d.ts` 文件](typings/common/collaboration/index.d.ts) |
| plugins.Comment | object<br>boolean | 可选 | 划词评论插件，详见 [`d.ts` 文件](typings/document/plugins/comment/index.d.ts) |
| plugins.DemoScreen | object<br>boolean | 可选 | 演示模式插件，详见 [`d.ts` 文件](typings/document/plugins/demoScreen/index.d.ts) |
| plugins.Gallery | object<br>boolean | 可选 | 相册插件，详见 [`d.ts` 文件](typings/document/plugins/gallery/index.d.ts) |
| plugins.History | object<br>boolean | 可选 | 历史插件，详见 [`d.ts` 文件](typings/document/plugins/history/index.d.ts) |
| plugins.Shortcut | object<br>boolean | 可选 | 快捷键插件，详见 [`d.ts` 文件](typings/document/plugins/shortcut/index.d.ts) |
| plugins.TableOfContent | object<br>boolean | 可选 | 目录插件，详见 [`d.ts` 文件](typings/document/plugins/tableOfContent/index.d.ts) |
| plugins.Toolbar | object<br>boolean | 可选 | 工具栏插件，详见 [`d.ts` 文件](typings/document/plugins/toolbar/index.d.ts) |
| plugins.Uploader | object<br>boolean | 可选 | 文件上传器插件，详见 [`d.ts` 文件](typings/document/plugins/uploader/index.d.ts) |

默认初始化的插件：
- 协作者
- 协作
- 划词评论
- 演示模式
- 相册
- 历史
- 快捷键
- 目录
- 工具栏
- 文件上传器

##### 专业文档 (`document-pro`) 配置

专业文档暂没有定制化配置。

##### 表格 (`sheet`) 配置

| 名称               | 类型      | 默认值  | 描述             |
| ------------------ | --------- | ------- | ---------------- |
| plugins | object | 可选 | 插件配置，设为 `true` 时使用默认配置，设为 `false` 为关闭，空配置 `{}` 等同于 `true` |
| plugins.Chart | object<br>boolean | 可选 | 图表插件，详见 [`d.ts` 文件](typings/sheet/plugins/chart/index.d.ts) |
| plugins.Collaborator | object<br>boolean | 可选 | 协作者插件，详见 [`d.ts` 文件](typings/sheet/plugins/collaborator/index.d.ts) |
| plugins.Collaboration | object<br>boolean | 可选 | 协作插件，详见 [`d.ts` 文件](typings/common/collaboration/index.d.ts) |
| plugins.Comment | object<br>boolean | 可选 | 划词评论插件，详见 [`d.ts` 文件](typings/sheet/plugins/comment/index.d.ts) |
| plugins.ContextMenu | object<br>boolean | 可选 | 上下文菜单插件，详见 [`d.ts` 文件](typings/sheet/plugins/contextmenu/index.d.ts) |
| plugins.Fill | object<br>boolean | 可选 | 下拉填充插件，详见 [`d.ts` 文件](typings/sheet/plugins/fill/index.d.ts) |
| plugins.FilterViewport | object<br>boolean | 可选 | 筛选插件，详见 [`d.ts` 文件](typings/sheet/plugins/filterViewport/index.d.ts) |
| plugins.FormulaSidebar | object<br>boolean | 可选 | 公式插件，详见 [`d.ts` 文件](typings/sheet/plugins/formulaSidebar/index.d.ts) |
| plugins.HistorySidebarSkeleton | object<br>boolean | 可选 | 历史插件，详见 [`d.ts` 文件](typings/sheet/plugins/historySidebarSkeleton/index.d.ts) |
| plugins.Lock | object<br>boolean | 可选 | 锁定插件，详见 [`d.ts` 文件](typings/sheet/plugins/lock/index.d.ts) |
| plugins.Shortcut | object<br>boolean | 可选 | 快捷键插件，详见 [`d.ts` 文件](typings/sheet/plugins/shortcut/index.d.ts) |
| plugins.Toolbar | object<br>boolean | 可选 | 工具栏插件，详见 [`d.ts` 文件](typings/sheet/plugins/toolbar/index.d.ts) |
| plugins.Print | object<br>boolean | 可选 | 打印插件，详见 [`d.ts` 文件](typings/sheet/plugins/print/index.d.ts) |

默认不初始化的插件：
- 锁定。需要额外的定制化配置。

移动端不可用的插件：
- 上下文
- 下拉填充
- 打印
- 公式
- 工具栏
- 历史
- 快捷键

##### 幻灯片 (`slide`) 配置

幻灯片暂没有定制化配置。

##### externals 和 externalLoader

由于打包后的文件较大，如 `dist/sheet.min.js`，且文档数据接口请求也是在 JS 加载完后进行，会影响整体性能。

因此提供 `externals` 来缓解此问题。**此模式仅支持文档 (document) 和表格 (sheet) 。**

```js
import ShimoCabinet from 'shimo-sdk-cabinet/dist/cabinet.min.js'

const cabinet = new ShimoCabinet({
  ...options,
  externals: {
    common: {
      common: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.common.min.js',
      collaboration: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'
    },
    sheet: {
      editor: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.editor.min.js',
      basicPlugins: '/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.plugins.basicPlugins.min.js',
      chart: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.plugins.chart.min.js',
      ...
    }
  }
})
cabinet.render()
```

注意 `import ShimoCabinet from 'shimo-sdk-cabinet/dist/cabinet.min.js'` 引入的是 `cabinet.min.js`，此文件不包含 `vendor/` 下的 JS SDK 文件，因此体积很小。

下面例子定义了 `common` 和 `sheet` JS SDK 的地址：

```js
externals: {
  common: {
    common: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.common.min.js',
    collaboration: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.common.collaboration.min.js'
  },
  sheet: {
    editor: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.editor.min.js',
    basicPlugins: '/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.plugins.basicPlugins.min.js',
    chart: 'https://cdn.com/static/sdk-cabinet/vendor/shimo-jssdk/shimo.sdk.sheet.plugins.chart.min.js',
    ...
  }
}
```

`common` 属于必须加载的组件，其他组件则按需选择，key 为 `shimo.sdk.<套件名>.<组件名>.min.js` 或 `shimo.sdk.<套件名>.plugins.<组件名>.min.js` 中的组件名。

同时提供一个方法：`cabinet.preload()`，此方法在调用的时候，会同步执行：

- 通过 Ajax 请求指定 fileGuid 文档的数据和配置
- 通过 `<script src="...">` 的方式加载 `externals`

`render()` 内部也会调用 `preload()`，`preload()` 会根据内部缓存结果是否再次进行请求。

这么做的好处：

- `cabinet.min.js` 更新时，其他没有更新的 JS SDK 组件可有效利用 CDN 缓存，减少用户下载量
- Ajax 请求和 `script` 请求和并行加载

#### 事件

`ShimoCabinet` 借助 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter) 提供了事件订阅功能：

```js
cabinet('error', errorHandler)
```

目前支持的事件：

- `error`：任何在运行中，无法正常抛出的错误都会用此事件抛出
- `readyState`：状态变更时会触发事件，可用事件列表在 `ShimoCabinet.ReadyState` 中可查

#### 移动端适配

 - 移动端目前尽量保证浏览效果，编辑功能和桌面端有差距
 - 目前仅支持
    - 文档
    - 表格

```js
const cabinet = new ShimoCabinet({
  editorOptions: {
    isMobile: true
  }
})
cabinet.render()
```

文档需要在 `body` 添加 `in-mobile` class。

### 补充说明

#### Webpack 配置

由于石墨 JS SDK 已经使用 Webpack 预处理过，因此需要在 Webpack 用 `script-loader` 处理石墨 JS SDK 文件：

```js
{
  test: /shimo-sdk-cabinet\/vendor\/shimo-jssdk\/.+\.js/i,
  use: 'script-loader'
}
```

**直接引入套件完整包 (如 `shimo-sdk-cabinet/dist/document.min.js`) 时不需要使用 `script-loader` 处理。**

#### 文件大小

由于套件完整包尺寸都较大，不建议在单个页面同时加载多个套件。
