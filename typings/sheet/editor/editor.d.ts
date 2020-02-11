import { EventEmitter } from 'eventemitter3'
import Events from './events'
import ToolbarEvents from '../plugins/toolbar/events'
import { LockOptions } from '../plugins/lock'
import { CommentOptions } from '../plugins/comment'
import Spread from './spread'
import * as BaseEditor from '../../common/editor'
import { CollaborationOptions } from '../../common/collaboration'

type AllEvents = Events | ToolbarEvents

/**
 * 编辑器构造参数
 */
export interface EditorOptions extends BaseEditor.EditorOptions {
  // 设置表格是否只读，默认 true
  editable: boolean

  // 是否允许单元格评论，默认 true
  commentable: boolean

  // 是否禁用表格渲染优化，默认 true
  disableRenderOptimization?: boolean

  /**
   * 插件初始化参数
   *
   * 比如以下配置同时启用，FilterViewport 和 Lock 插件，FilterViewport 使用默认配置，Lock 使用自定义配置：
   * plugins: {
   *   FilterViewport: true,
   *   Lock: {
   *     read: true,
   *     edit: false
   *   }
   * }
   */
  plugins?: Plugins
}
/*
* 表格编辑器渲染参数
*/
export interface EditorRenderOptions {
  content: string
  container: HTMLElement
  activeSheetId?: string
}

export interface BasePluginOptions {
  editor: Editor
  container?: HTMLElement
}

/**
 * 表格启用的插件。
 * - true 为使用默认参数
 * - false 为禁用
 * - object 类型为自定义参数列表，会和默认参数合并
 */
export interface Plugins {
  Chart?: boolean | BasePluginOptions
  Collaboration?: boolean | CollaborationOptions
  Collaborator?: boolean | BasePluginOptions
  Comment?: boolean | CommentOptions
  ContextMenu?: boolean | BasePluginOptions
  Fill?: boolean | BasePluginOptions
  FilterViewport?: boolean | BasePluginOptions
  FormulaSidebar?: boolean | BasePluginOptions
  HistorySidebarSkeleton?: boolean | BasePluginOptions
  Lock?: boolean | LockOptions
  Shortcut?: boolean | BasePluginOptions
  Toolbar?: boolean | BasePluginOptions
}

/**
 * 表格编辑器
 */
export default class Editor extends EventEmitter<AllEvents> {
  constructor (options?: EditorOptions);
  spread: Spread
  isRendered: boolean
  render (options: EditorRenderOptions): void
  setContent (content: string): void
  getContent (): Promise<string>
  destroy (): void
  destory (): void
  getLocale (): string
  undo (): Promise<void>
  redo (): Promise<void>
  updateOptions: (options: {
    commentable: boolean,
    editable: boolean
  }) => void
}
