import 'promise-polyfill/src/polyfill'
import assign from 'object-assign'
import get from 'lodash.get'
import fetch from 'unfetch'

import ShimoDocumentCabinet from './document'
import ShimoSheetCabinet from './sheet'
import ShimoSlideCabinet from './slide'
import ShimoDocumentProCabinet from './document-pro'
import assert from '../util/assert'

/* tslint:disable:strict-type-predicates */
// 设置全局命名空间
if (window.shimo == null) {
  window.shimo = {}
}
if (window.shimo.sdk == null) {
  window.shimo.sdk = {}
}
/* tslint:enable */

class ShimoCabinet {
  static globals: { [key: string]: any }

  private fileGuid: string
  private container: HTMLElement
  private entrypoint: string
  private token: string
  private user: ShimoSDK.User
  private file: ShimoSDK.File
  private editorOptions: ShimoSDK.Document.EditorOptions | ShimoSDK.Sheet.EditorOptions
  private shimoSheetCabinet?: ShimoSheetCabinet
  private shimoDocumentCabinet?: ShimoDocumentCabinet
  private shimoSlideCabinet?: ShimoSlideCabinet
  private shimoDocumentProCabinet?: ShimoDocumentProCabinet

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
    container: HTMLElement

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
    onSaveStatusChange: () => {}
  }) {
    const element = options.rootDom || options.container
    this.fileGuid = options.fileGuid
    this.entrypoint = typeof options.entrypoint === 'string' ? options.entrypoint : 'https://platform.shimo.im/entry'
    this.token = options.token
    this.editorOptions = assign({}, options.editorOptions)

    /* tslint:disable:strict-type-predicates */
    assert(typeof this.token === 'string' && this.token.trim().length > 0, `"token" invalid: ${this.token}`)
    assert(typeof this.fileGuid === 'string' && this.fileGuid.trim().length > 0, `"fileGuid" invalid: ${this.fileGuid}`)
    assert(typeof this.entrypoint === 'string' && this.entrypoint.trim().length > 0, `"token" invalid: ${this.entrypoint}`)
    assert(element instanceof HTMLElement, `"container" requires an HTMLElement, but saw: ${element}`)
    /* tslint:enable */

    this.container = element
  }

  async render (renderOptions?: any): Promise<ShimoDocumentCabinet | ShimoSheetCabinet> {
    assert(document.body, 'You cannot render editor before <body>')
    await this.fetchOptions()
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
    const res = await fetch(`${this.entrypoint}/files/${this.fileGuid}?withConfig=true`, {
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${this.token}`
      }
    })
    const text = await res.text()
    assert(res.status === 200, `Failed to get file: ${text}`)
    const file = JSON.parse(text)
    assert(file && file.config != null, `Invalid file: ${file}`)
    this.user = file.config.user
    this.file = file
  }

  private renderSheet () {
    const sdkSheet = this.getSDK('sheet')
    const availablePlugins = sdkSheet.plugins == null ? [] : Object.keys(sdkSheet.plugins).reduce((plugins, key: string) => {
      if (typeof sdkSheet.plugins[key] === 'function') {
        plugins.push(key)
      }
      return plugins
    }, [] as string[])

    const shimoSheetCabinet = new ShimoSheetCabinet({
      element: this.container,
      sdkSheet,
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: this.editorOptions as ShimoSDK.Sheet.EditorOptions,
      availablePlugins
    })

    this.shimoSheetCabinet = shimoSheetCabinet

    return shimoSheetCabinet.render()
  }

  private destroySheet () {
    if (!this.shimoSheetCabinet) {
      throw new Error('shimoSheetCabinet is not rendered')
    }
    this.shimoSheetCabinet.destroy()
    this.shimoSheetCabinet = undefined
  }

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

    const _availablePlugins: Set<string> = sdkDocument.plugins == null ?
      new Set() :
      Object.keys(sdkDocument.plugins).reduce((plugins, key: string) => {
        if (typeof sdkDocument.plugins[key] === 'function') {
          plugins.add(key)
        }
        return plugins
      }, new Set()) as Set<string>
    _availablePlugins.add('Toolbar')

    if (this.getSDK('common').Collaboration) {
      _availablePlugins.add('Collaboration')
    }

    const availablePlugins = Array.from(_availablePlugins)

    const shimoDocumentCabinet = new ShimoDocumentCabinet({
      element: this.container,
      sdkDocument,
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: Object.assign(this.editorOptions, {
        id: this.user.id
      }) as ShimoSDK.Document.EditorOptions,
      availablePlugins
    })

    this.shimoDocumentCabinet = shimoDocumentCabinet
    return shimoDocumentCabinet.render()
  }

  private destroyDocument () {
    if (!this.shimoDocumentCabinet) {
      throw new Error('shimoDocumentCabinet is not rendered')
    }
    this.shimoDocumentCabinet.destroy()
    this.shimoDocumentCabinet = undefined
  }

  private renderSlide () {
    const cabinet = this.shimoSlideCabinet = new ShimoSlideCabinet({
      element: this.container,
      sdkSlide: this.getSDK('slide'),
      sdkCommon: this.getSDK('common'),
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file
    })

    return cabinet.render()
  }

  private destroySlide () {
    if (!this.shimoSlideCabinet) {
      throw new Error('ShideSlideCabinet is not rendered')
    }
    this.shimoSlideCabinet.destroy()
    this.shimoSlideCabinet = undefined
  }

  private renderDocumentPro () {
    const cabinet = new ShimoDocumentProCabinet({
      element: this.container,
      sdkDocumentPro: this.getSDK('documentPro'),
      user: this.user,
      file: this.file
    })
    this.shimoDocumentProCabinet = cabinet
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
  ShimoSheetCabinet
}
