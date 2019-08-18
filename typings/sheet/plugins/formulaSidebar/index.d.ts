import { EventEmitter } from 'eventemitter3'
import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export declare enum Events {
  FORMULA_SIDEBAR_SHOW = 'formula_sidebar_show',
  FORMULA_SIDEBAR_HIDE = 'formula_sidebar_hide'
}

export interface FormulaSidebarOptions extends BasePluginOptions {}

export default class FormulaSidebar extends EventEmitter {
  constructor (options: FormulaSidebarOptions);
  render (container: HTMLElement): void
  show: () => void
  hide: ({ silent }?: any) => void
}
