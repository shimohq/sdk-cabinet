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
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no">
    <script crossorigin src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
    <script crossorigin src="https://cdn.staticfile.org/es6-promise/4.1.1/es6-promise.min.js"></script>
    <script src="<your_path>/shimo.sdk.common.collaboration.min.js"></script>
    <script src="<your_path>/shimo.sdk.sheet.editor.min.js"></script>
    <!-- 此处省略引入 SDK 文件 -->
    <script src="<your_path/shimo.sdk.cabinet.min.js>"></script>
</head>
<body>
    <div id="container"></div>
</body>
<script>
    window.shimo = {
      token: '<your token>',
      uploadToken: '<your uploadToken>',
      uploadOrigin: '<your uploadOrigin>',
      uploadServer: '<chose upload server like oss or aws>',
      uploadMaxFileSize: 10,
      entrypoint: '<shimo entrypoint url>',
      user: {"id":1,"email":null,"name":"fghpdf","avatar":"https://assets-cdn.shimo.im/static/unmd5/default-avatar-moke.png","namePinyin":null,"status":0,"gender":null,"lastNotificationId":null,"clientUserId":"1","createdAt":"2019-04-12T08:07:42.000Z","updatedAt":"2019-04-12T08:07:42.000Z"},
      prepare: function () {
        return axios.get(window.shimo.entrypoint + '/files/<file guid>', {
          headers: {
            authorization: 'bearer ' + window.shimo.token
          }
        }).then(function (res) {
          window.shimo.file = res.data
        })
      }
    }
    // prepare 等待后端请求返回之后的函数
    window.shimo.prepare().then(function() {
        function getQueryValue(keyword) {
            var queryString = window.location.search;
            if (!queryString) return null;
            var groups = queryString.substr(1).split("&");
            for (var i = 0, l = groups.length; i < l; i++) {
                var item = groups[i].split("=");
                if (item[0] === keyword) {
                return item[1];
                }
            }
            return null;
        }

        var cabinet = new ShimoCabinet.default({
            rootDom: document.getElementById("container"),
            sdkSheet: window.shimo.sdk.sheet,
            sdkCommon: window.shimo.sdk.common,
            user: window.shimo.user,
            entrypoint: window.shimo.entrypoint,
            token: window.shimo.token,
            file: window.shimo.file,
            editorOptions: {
                uploadConfig: {
                origin: window.shimo.uploadOrigin,
                server: window.shimo.uploadServer,
                token: window.shimo.uploadToken,
                maxFileSize: window.shimo.uploadMaxFileSize
                },
                localeConfig: {
                    fetchLocaleSync: function fetchLocaleSync(locale) {
                        return window.shimo.sdk.sheet.EditorLocaleResources[locale];
                    },
                    locale: getQueryValue("locale")
                }
            },
            plugins: ["Toolbar",
                "ContextMenu",
                "Shortcut",
                "Fill",
                "HistorySidebarSkeleton",
                "FormulaSidebar",
                "FilterViewport",
                "Chart",
                "Comment",
                "Collaboration"]
        })
        window.sheetEditor = cabinet.renderSheet()
    })
</script>
</html>
```

需要注意的是，用户需要自行实现对保存状态的管理，以及如何在页面上展示

示例代码如下：
```js
 ShimoCabinet.ShimoSheetCabinet.onSaveStatusChange = function onSaveStatusChange(status) {
    switch (status) {
    case STATUS.ONLINE_SAVING:
        changeStatusText("正在保存...");
        break;
    case STATUS.ONLINE_SAVED:
        enableEditor();
        changeStatusText("保存成功");
        break;
    case STATUS.OFFLINE:
        disableEditor();
        changeStatusText("网络断开，无法继续编辑", "error");
        showAlert({
        title: "您的网络已经断开，无法继续编写!",
        type: "error"
        });
        break;
    case STATUS.ONLINE:
        editorDisabled &&
        !editorErrored &&
        showAlert({ title: "您的网络已恢复，可以继续编写!" });
        enableEditor();
        changeStatusText("表格将自动保存");
        break;
    // 在线保存失败
    case STATUS.ONLINE_SAVE_FAILED:
        // 禁用编辑器
        disableEditor();
        changeStatusText("保存失败", "error");
        showAlert({ title: "保存失败，请刷新当前页面!", type: "error" });
        editorErrored = true;
        break;
    // 离线保存失败
    case STATUS.OFFLINE_SAVE_FAILED:
        // 禁用编辑器
        disableEditor();
        break;
    }
}
```

#### 通过 typescript 方式开发
我们提供了完整的 type 来提升开发体验

```js
import * from "@shimo/sdk_cabinet";

ShimoCabinet.ShimoSheetCabinet.onSaveStatusChange = () => {} // 自行实现的函数

const shimoCabinet = new ShimoCabinet(options);
shimoCabinet.renderSheet();
```

