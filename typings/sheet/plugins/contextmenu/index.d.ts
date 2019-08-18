import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface SheetContextmenuOptions extends BasePluginOptions {
}
interface SheetContextmenuRenderOptions {
  container?: Element
}
export default class SheetContextmenu {
  constructor (opts: SheetContextmenuOptions);
  render (config: SheetContextmenuRenderOptions): void
}
export {}
