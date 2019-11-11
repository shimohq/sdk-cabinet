import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'
import { EventEmitter } from 'eventemitter3'
import Events from './events'
export declare const pluginName = 'Toolbar'
/**
 * 工具栏构造参数
 */
export interface ToolbarOptions extends BasePluginOptions {}
/**
 * 工具栏渲染参数
 */
export interface ToolbarRenderOptions {
  container: HTMLElement
  disableMenu?: boolean
}
/**
 * 工具栏
 */
export default class Toolbar extends EventEmitter<Events> {
  constructor (options: ToolbarOptions);
  render (options: ToolbarRenderOptions): void
}
