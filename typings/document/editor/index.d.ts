import EditActions from './editActions'
import Comment from '../plugins/comment'
import * as BaseEditor from '../../common/editor'
import { CollaborationOptions } from '../../common/collaboration'
import { GalleryOptions } from '../plugins/gallery'
import { CollaboratorOptions } from '../plugins/collaborator'
import { CommentOptions } from '../plugins/comment'
import { TableOfContentOptions } from '../plugins/tableOfContent'
import { ToolbarOptions } from '../plugins/toolbar'
import { UploaderOptions } from '../plugins/uploader'
import { RevisionOptions } from '../plugins/revision'
import { MobileOptions } from '../plugins/mobile'

export interface EditorOptions extends BaseEditor.EditorOptions {
  // 用户 ID
  id: number

  // 是否启用只读模式
  readOnly?: boolean

  // 文档滚动区
  scrollingContainer?: HTMLElement | null

  // 工具栏
  modules?: {
    // 是否启用工具栏
    toolbar?: boolean | { [key: string]: any }

    // 工具栏父容器
    parent?: HTMLElement | null
  }

  /**
   * 插件初始化参数
   *
   * 比如以下配置同时启用，Collaborator 和 Gallery 插件，Collaborator 使用默认配置，Gallery 使用自定义配置：
   * plugins: {
   *   Collaborator: true,
   *   Gallery: {
   *     genDownloadUrl: url => wrapDownloadUrl(url)
   *   }
   * }
   */
  plugins?: Plugins

  // 是否启用移动端布局
  isMobile?: boolean
}

interface ModulesToolbarOptions {
  parent?: HTMLElement
}

/**
 * 文档启用的插件。
 * - true 为使用默认参数
 * - false 为禁用
 * - object 类型为自定义参数列表，会和默认参数合并
 */
export interface Plugins {
  Collaboration?: boolean | CollaborationOptions
  Collaborator?: boolean | CollaboratorOptions
  Comment?: boolean | CommentOptions
  DemoScreen?: boolean | BasePluginOptions
  Gallery?: boolean | GalleryOptions
  History?: boolean | BasePluginOptions

  /**
   * 是否启用版本插件，该插件不属于默认提供功能，默认为 false，需显式声明为 true 或传入配置才生效
   */
  Revision?: boolean | RevisionOptions
  Shortcut?: boolean | BasePluginOptions
  TableOfContent?: boolean | TableOfContentOptions
  Toolbar?: boolean | ToolbarOptions
  Uploader?: boolean | UploaderOptions
  Mobile?: boolean | MobileOptions
}

export interface EditorRenderOptions {
  id: number
  readOnly?: boolean
  scrollingContainer?: HTMLElement
  modules?: {
    toolbar?: boolean | ModulesToolbarOptions;
  }
  localeConfig?: {
    fetchLocaleSync?: string;
    locale?: string;
  }
}

declare enum Events {
  PLUGIN_LOADED = 'PLUGIN_LOADED',
  CHANGE = 'CHANGE',
  SELECTION = 'SELECTION',
  CONTAINER_SCROLL = 'CONTAINER_SCROLL',
  READY = 'ready'
}

export default class Editor {
  public editorActions: EditActions
  public events: Events
  public isReady: boolean
  comment: Comment
  constructor (options: EditorOptions);
  render (element: Element, options: EditorRenderOptions): void
  updateOptions (options: EditorOptions): void
  getContent (): Promise<string>
  setContent (content: string): void
  applyChange (content: string): void
  getLocale (): string
  destroy (): void
  on (type: string, handler: (...args: any[]) => void): any
}

export interface BasePluginOptions {
  editor: Editor
  container?: HTMLElement | string
}
