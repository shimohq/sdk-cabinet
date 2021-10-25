import isObject from 'lodash.isobject'
import forIn from 'lodash.forin'
import axios from 'axios'

export type emitter = (event: string, ...args: any[]) => void

export default class CabinetBase {
  public plugins: { [key: string]: any }
  protected element: HTMLElement
  protected availablePlugins: string[]
  protected pluginOptions: ShimoSDK.Document.Plugins | ShimoSDK.Sheet.Plugins
  protected emitter: emitter
  protected entrypoint: string

  constructor (element: HTMLElement) {
    this.element = element
    this.availablePlugins = []
    this.plugins = {}

    // tslint:disable-next-line no-empty
    this.emitter = (event: string, ...args: any[]) => {}
  }

  /**
   * Get element
   * @param element If element is a HTMLElement, return it directly; if it's a string, get it from DOM
   * @param tag If element is omitted, and tag presented, create an new HTMLElement for the specified tag, then return it
   * @param attrs Element's attributes
   * @param parentElement created element will be attached to it
   */
  protected getElement (
    element: HTMLElement | string | undefined,
    tag: string,
    attrs?: {
      classList?: string[]
      [key: string]: any
    },
    parentElmenent?: HTMLElement
  ): HTMLElement
  protected getElement (
    element: HTMLElement | string | undefined,
    tag?: string,
    attrs?: {
      classList?: string[]
      [key: string]: any
    },
    parentElmenent?: HTMLElement
  ): HTMLElement | null
  protected getElement (
    element: HTMLElement | string | undefined,
    tag?: string,
    attrs?: {
      classList?: string[]
      [key: string]: any
    },
    parentElement?: HTMLElement
  ) {
    if (typeof element === 'string') {
      const elm = document.querySelector(element)
      if (elm instanceof HTMLElement) {
        element = elm
      }
    }

    const elmentExists = element instanceof HTMLElement

    if (!elmentExists) {
      if (!tag) {
        return null
      }
      element = document.createElement(tag)
    }

    if (attrs) {
      const elm = element as HTMLElement
      forIn(attrs, (value: any, key: string) => {
        if (key === 'classList') {
          elm.classList.add(...value)
          return
        }
        elm.setAttribute(key, value)
      })
    }

    if (!elmentExists && parentElement instanceof HTMLElement) {
      parentElement.appendChild(element as HTMLElement)
    }

    return element as HTMLElement
  }

  protected insertAfter (referenceNode: HTMLElement, newNode: HTMLElement) {
    referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling)
  }

  /**
   * 过滤未启用的插件
   */
  protected preparePlugins<T> (plugins?: T, defaultOptions?: T, filter?: (name: string) => boolean): T {
    if (!isObject(plugins)) {
      plugins = this.availablePlugins.reduce((result, plugin) => {
        if (typeof filter === 'function' && !filter(plugin)) {
          return result
        }
        result[plugin] = defaultOptions && defaultOptions[plugin] != null ? defaultOptions[plugin] : true
        return result
      }, {}) as T
    }

    const result = {} as T

    for (const plugin of this.availablePlugins) {
      if (typeof filter === 'function' && !filter(plugin)) {
        continue
      }

      const p = plugins[plugin]

      if (p === false) {
        continue
      }

      if (typeof p === 'object' && p != null) {
        result[plugin] = p
      } else {
        if (p == null && defaultOptions && defaultOptions[plugin] != null) {
          result[plugin] = defaultOptions[plugin]
        } else {
          result[plugin] = {}
        }
      }
    }

    return result
  }

  /**
   * 初始化所有启用的插件
   */
  protected initPlugins (editor: ShimoSDK.Sheet.Editor | ShimoSDK.Document.Editor) {
    for (const name of Object.keys(this.pluginOptions)) {
      const method = `init${name}`
      if (typeof this[method] === 'function') {
        this[method](editor)
      }
    }
  }

  protected async log (level: 'info' | 'warn' | 'error', data: { event: string, [key: string]: any }) {
    if (!this.entrypoint) {
      return
    }

    try {
      await axios.post(`${this.entrypoint}/log`, {
        level,
        data
      })
    } catch (e) {
      console.error('Log to server error', e, level, data)
    }
  }

  protected promptIfHasUnsavedChanges (collaboration: ShimoSDK.Common.Collaboration) {
    window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
      if (collaboration.haveUnsavedChange()) {
        e.preventDefault()
        e.returnValue = ''
      }
    })
  }
}
