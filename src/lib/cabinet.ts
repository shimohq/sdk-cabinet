import 'promise-polyfill/src/polyfill'
import assign from 'object-assign'
import get from 'lodash.get'
import fetch from 'unfetch'
import forIn from 'lodash.forin'
import { TinyEmitter } from 'tiny-emitter'

import ShimoDocumentCabinet from './document'
import ShimoSheetCabinet from './sheet'
import ShimoSlideCabinet from './slide'
import ShimoDocumentProCabinet from './document-pro'
import assert from '../util/assert'
import { sheetPluginList, sheetPluginListReverse, loadedResources, documentPluginList, documentPluginListReverse, ReadyState } from './constants'

/* tslint:disable:strict-type-predicates */
// 设置全局命名空间
if (window.shimo == null) {
  window.shimo = {}
}
if (window.shimo.sdk == null) {
  window.shimo.sdk = {}
}
if (window.__RUNTIME_ENV__ == null) {
  window.__RUNTIME_ENV__ = {}
}
/* tslint:enable */

/**
 * 石墨 JS SDK 文件的远程地址，用于异步加载，加速编辑器初始化流程使用
 */
interface ExternalResource {
  common: {
    common: string
    collaboration?: string
  }

  document?: {
    editor: string
    collaborator?: string
    comment?: string
    'demo-screen'?: string
    gallery?: string
    history?: string
    mention?: string
    mobile?: string
    revision?: string
    'table-of-content'?: string
    uploader?: string
  }

  sheet?: {
    editor: string
    basicPlugins?: string
    chart?: string
    collaboration?: string
    collaborators?: string
    comment?: string
    conditionalFormat?: string
    dataValidation?: string
    fill?: string
    filterViewport?: string
    form?: string
    formulaSidebar?: string
    historySidebar?: string
    lock?: string
    mobileContextmenu?: string
    mobileToolbar?: string
    pivotTable?: string
    print?: string
    shortcut?: string
    toolbar?: string
  },

  slide?: {
    editor: string
  },

  'document-pro'?: {
    editor: string
    style: string
  }
}

/**
 * 石墨 JS SDK 文件的加载器，默认会使用 <script src="..."> 加载，如有特殊需要，可自行实现加载逻辑。
 * 需要注意的是，当加载器调用完毕时，需确保 JS 文件已被解析执行完毕。
 */
type ExternalLoader = (src: string) => Promise<void>

class ShimoCabinet extends TinyEmitter {
  static globals: { [key: string]: any }
  static ReadyState = ReadyState

  private fileGuid: string
  private _container: HTMLElement | string
  private entrypoint: string
  private token: string
  private user: ShimoSDK.User
  private file: ShimoSDK.File
  private editorOptions: ShimoSDK.Document.EditorOptions | ShimoSDK.Sheet.EditorOptions
  private sheet?: ShimoSheetCabinet
  private document?: ShimoDocumentCabinet
  private slide?: ShimoSlideCabinet
  private externals?: ExternalResource
  private externalLoader: ExternalLoader

  constructor (options: {
    /**
     * 石墨 API 服务器的地址，默认为云 SDK 地址，https://platform.shimo.im/entry
     */
    entrypoint?: string
    /**
     * 访问石墨 API 的 Access Token
     */
    token: string
    /**
     * 石墨提供的文档 GUID
     */
    fileGuid: string

    /**
     * 石墨编辑器的容器元素
     */
    container: HTMLElement | string

    /**
     * 石墨编辑器的容器元素
     * @deprecated 请使用 container
     */
    rootDom?: HTMLElement

    /**
     * 石墨编辑器的初始化参数
     */
    editorOptions?: ShimoSDK.Document.EditorOptions | ShimoSDK.Sheet.EditorOptions
    fetchCollaborators: string
    onSaveStatusChange: () => {},

    /**
     * 石墨 JS SDK 文件的远程地址，用于异步加载，加速编辑器初始化流程使用
     */
    externals?: ExternalResource,

    /**
     * 石墨 JS SDK 文件的加载器，默认会使用 <script async> 加载，如有特殊需要，可自行实现加载逻辑。
     * 需要注意的是，当加载器调用完毕时，需确保 JS 文件已被解析执行完毕。
     */
    externalLoader?: ExternalLoader
  }) {
    super()

    this._container = options.rootDom || options.container
    this.fileGuid = options.fileGuid
    this.entrypoint = typeof options.entrypoint === 'string' ? options.entrypoint : 'https://platform.shimo.im/entry'
    this.token = options.token
    this.editorOptions = assign({}, options.editorOptions)
    this.externals = options.externals

    /* tslint:disable:strict-type-predicates */
    assert(typeof this.token === 'string' && this.token.trim().length > 0, `"token" invalid: ${this.token}`)
    assert(typeof this.fileGuid === 'string' && this.fileGuid.trim().length > 0, `"fileGuid" invalid: ${this.fileGuid}`)
    assert(typeof this.entrypoint === 'string' && this.entrypoint.trim().length > 0, `"token" invalid: ${this.entrypoint}`)
    /* tslint:enable */

    if (typeof options.externalLoader !== 'function') {
      this.externalLoader = async (src: string) => {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.onload = () => resolve(src)
          script.onerror = reject
          script.src = src
          document.head.appendChild(script)
        })
      }
    } else {
      this.externalLoader = options.externalLoader
    }

    setTimeout(() => this.emit('debug', {
      msg: 'cabinet inited',
      entrypoint: this.entrypoint,
      editorOptions: this.editorOptions,
      externals: this.externals
    }))
  }

  get container () {
    if (typeof this._container === 'string') {
      const elm = document.querySelector(this._container)
      if (elm instanceof HTMLElement) {
        this._container = elm
      }
    }

    if (this._container instanceof HTMLElement) {
      return this._container
    }

    throw new Error(`container must be in DOM: ${this._container}`)
  }

  // 仅加载 file 数据和 common、editor 组件
  async preload () {
    const self = this
    const tasks: Promise<any>[] = []

    if (!this.file || !this.file.config) {
      tasks.push(this.fetchOptions().then(res => {
        this.emit('debug', {
          msg: 'file loaded',
          file: this.file
        })
        return res
      }))
    }

    if (this.externals) {
      let _tasks: Promise<any>[] = []
      let p: Promise<any> = Promise.resolve()

      forIn(this.externals.common, (v: string, sub) => {
        const key = `common.${sub}`
        this.emit('debug', {
          msg: 'loading module',
          module: key,
          cached: !!loadedResources[key]
        })
        if (!loadedResources[key]) {
          _tasks.push(load(key, v))
        }
      })

      if (_tasks.length > 0) {
        p = Promise.all(_tasks)
        _tasks = []
      }

      p = p.then(() => {
        let p: Promise<any> = Promise.resolve()

        forIn(this.externals, (v, main) => {
          if (main === 'common') {
            return
          }

          const editorKey = `${main}.editor`
          this.emit('debug', {
            msg: 'loading module',
            module: editorKey,
            cached: !!loadedResources[editorKey]
          })
          if (!loadedResources[editorKey]) {
            p = load(editorKey, v['editor'])
          }
        })

        return p
      })

      tasks.push(p)
    }

    await Promise.all(tasks)

    async function load (key: string, src: string) {
      return self.externalLoader(src)
        .then(() => {
          loadedResources[key] = true
        })
        .catch(err => {
          throw new Error(`failed to load ${key}: ${err.message}`)
        })
    }
  }

  async render (renderOptions?: any): Promise<ShimoDocumentCabinet | ShimoSheetCabinet> {
    assert(document.body, 'You cannot render editor before <body>')
    await this.preload()
    const type = this.getRenderType(this.file.type)
    return this[`render${type}`](renderOptions)
  }

  destroy () {
    const type = this.getRenderType(this.file.type)
    this[`destroy${type}`]()
  }

  private getRenderType (type: string) {
    const [main, sub] = type.split('/')

    switch (main) {
      case 'document':
        return sub === 'richdoc' ? 'Document' : 'DocumentPro'
      case 'sheet':
        return 'Sheet'
      case 'slide':
        return 'Slide'
    }

    throw new Error(`Unknown file type: ${type}`)
  }

  private async fetchOptions () {
    if (this.file && this.file.config) {
      return
    }

    const res = await fetch(`${this.entrypoint}/files/${this.fileGuid}?withConfig=true&contentUrl=true`, {
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${this.token}`
      }
    })
    const text = await res.text()
    assert(res.status === 200, `Failed to get file: ${text}`)
    const file: ShimoSDK.File = JSON.parse(text)
    assert(file && file.config != null, `Invalid file: ${file}`)

    if (typeof file.contentUrl === 'string' && !file.content) {
      const res = await fetch(file.contentUrl)
      file.content = await res.text()

      let rawHead = ''
      for (const [k, v] of res.headers.entries()) {
        if (/x-[a-z]+-meta-head/i.test(k)) {
          rawHead = v
          break
        }
      }
      const head = parseInt(rawHead, 10)
      assert(!isNaN(head), `invalid file head: ${rawHead}`)
      file.head = head
    }

    this.user = file.config.user
    this.file = file
  }

  private preparePlugins (type: string): {
    availablePlugins: string[],
    getPlugin: (name: string) => Promise<any>
    asyncMode: boolean
  } {
    let availablePlugins: string[] = []
    let getPlugin = async (name: string) => sdk.plugins[name]
    const sdk = this.getSDK(type)
    let asyncMode = false

    if (this.externals && this.externals[type]) {
      const item = {}
      forIn(this.externals[type], (v, k) => {
        item[k.toLowerCase()] = v
      })

      if (type === 'sheet' || type === 'document') {
        const pluginList = {}
        forIn(type === 'sheet' ? sheetPluginList : documentPluginList, (v, k) => {
          pluginList[k.toLowerCase()] = v
        })

        const pluginListR = {}
        forIn(type === 'sheet' ? sheetPluginListReverse : documentPluginListReverse, (v, k) => {
          pluginListR[k] = v.toLowerCase()
        })

        asyncMode = true

        availablePlugins = Object.keys(item).reduce((plugins, key: string) => {
          if (pluginList[key]) {
            plugins.push(pluginList[key])
          }
          return plugins
        }, [] as string[])

        getPlugin = async (name: string) => {
          const pn = pluginListR[name]
          const key = `${type}.${pn}`

          this.emit('debug', {
            msg: 'loading module',
            module: key,
            cached: !!loadedResources[key],
            inExternal: !!item[pn]
          })

          if (!loadedResources[key] && item[pn]) {
            await this.externalLoader(item[pn])
            loadedResources[key] = true
          }

          if (sdk.plugins[name]) {
            return sdk.plugins[name]
          }

          throw new Error(`Plugin ${name} is not defined in externals.`)
        }

        return { availablePlugins, getPlugin, asyncMode }
      } else {
        throw new Error(`External resource mode is not supported for: ${type}`)
      }
    }

    return {
      availablePlugins: sdk.plugins == null ? [] : Object.keys(sdk.plugins).reduce((plugins, key: string) => {
        if (typeof sdk.plugins[key] === 'function') {
          plugins.push(key)
        }
        return plugins
      }, [] as string[]),
      getPlugin,
      asyncMode
    }
  }

  // @ts-ignore
  private renderSheet () {
    const sdkSheet = this.getSDK('sheet')
    const { availablePlugins, getPlugin, asyncMode } = this.preparePlugins('sheet')

    const _availablePlugins: Set<string> = new Set(availablePlugins)

    if (this.getSDK('common').Collaboration) {
      _availablePlugins.add('Collaboration')
    }

    const shimoSheetCabinet = new ShimoSheetCabinet({
      element: this.container,
      sdkSheet,
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: this.editorOptions as ShimoSDK.Sheet.EditorOptions,
      availablePlugins: Array.from(_availablePlugins),
      getPlugin,
      onError: err => this.emit('error', err),
      async: asyncMode,
      emitter: (event: string, ...args: any[]) => this.emit(event, ...args)
    })

    this.sheet = shimoSheetCabinet

    return shimoSheetCabinet.render()
  }

  // @ts-ignore
  private destroySheet () {
    if (!this.sheet) {
      throw new Error('shimoSheetCabinet is not rendered')
    }
    this.sheet.destroy()
    this.sheet = undefined
  }

  // @ts-ignore
  private renderDocument () {
    this.editorOptions.plugins = Object.assign(
      {
        Uploader: {
          origin: `${this.file.config.uploadOrigin}`.replace(/\/+$/g, '') + '/upload2',
          server: this.file.config.uploadServer,
          token: this.file.config.uploadToken
        }
      },
      this.editorOptions.plugins
    ) as ShimoSDK.Document.Plugins

    const sdkDocument = this.getSDK('document')

    const { availablePlugins, getPlugin, asyncMode } = this.preparePlugins('document')

    const _availablePlugins: Set<string> = new Set(availablePlugins)
    _availablePlugins.add('Toolbar')

    if (this.getSDK('common').Collaboration) {
      _availablePlugins.add('Collaboration')
    }

    const shimoDocumentCabinet = new ShimoDocumentCabinet({
      element: this.container,
      sdkDocument,
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: assign(this.editorOptions, {
        id: this.user.id
      }) as ShimoSDK.Document.EditorOptions,
      availablePlugins: Array.from(_availablePlugins),
      getPlugin,
      onError: err => this.emit('error', err),
      async: asyncMode,
      emitter: (event: string, ...args: any[]) => this.emit(event, ...args)
    })

    this.document = shimoDocumentCabinet
    return shimoDocumentCabinet.render()
  }

  // @ts-ignore
  private destroyDocument () {
    if (!this.document) {
      throw new Error('shimoDocumentCabinet is not rendered')
    }
    this.document.destroy()
    this.document = undefined
  }

  // @ts-ignore
  private async renderSlide () {
    const cabinet = this.slide = new ShimoSlideCabinet({
      element: this.container,
      sdkSlide: this.getSDK('slide'),
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      emitter: (event: string, ...args: any[]) => this.emit(event, ...args)
    })

    return cabinet.render()
  }

  // @ts-ignore
  private destroySlide () {
    if (!this.slide) {
      throw new Error('ShideSlideCabinet is not rendered')
    }
    this.slide.destroy()
    this.slide = undefined
  }

  // @ts-ignore
  private renderDocumentPro () {
    const cabinet = new ShimoDocumentProCabinet({
      element: this.container,
      sdkDocumentPro: this.getSDK('documentPro'),
      user: this.user,
      file: this.file,
      emitter: (event: string, ...args: any[]) => this.emit(event, ...args)
    })
    return cabinet.render()
  }

  /**
   * Get SDK module from global namespace
   */
  private getSDK (module: string) {
    let sdk: any = ShimoCabinet.globals[module]

    if (!sdk) {
      if (module === 'documentPro') {
        sdk = window.shimo[module] || window['renderApp']
      } else {
        sdk = get(window.shimo, `sdk.${module}`)
      }
    }

    assert(sdk, `Cannot find "${module}", did you forget to import it?`)
    return sdk
  }
}

ShimoCabinet.globals = {}

export default ShimoCabinet

export {
  ShimoDocumentCabinet,
  ShimoSheetCabinet,
  ExternalResource,
  ExternalLoader as scriptLoader,
  ReadyState
}
