import * as BaseEditor from '../common/editor'

export interface EditorOptions extends BaseEditor.EditorOptions {
}

/**
 * 文档启用的插件。
 * - true 为使用默认参数
 * - false 为禁用
 * - object 类型为自定义参数列表，会和默认参数合并
 */
export interface Plugins {
}

export class Editor {
  comment: Comment
  constructor (options: EditorOptions)
  /**
   * 渲染幻灯片单页内容
   */
  render (container: HTMLElement, options: {
    editable: boolean
    scope?: 'slides' | 'layouts'
    scalable?: boolean
    reactive?: boolean
    placeholder?: boolean
    canvas?: {
      withPadding?: boolean
      fitContainer?: boolean
      minRatio?: number
      maxRatio?: number
    }
  }): Promise<void>
  getContent (): Promise<string>
  getLocale (): string
  destroy (): void
  collaborators: ShimoSDK.Common.Collaboration
}

export interface BasePluginOptions {
  editor: Editor
  container?: HTMLElement | string
}
