import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface ShortcutOptions extends BasePluginOptions {}

export default class Shortcut {
  constructor (opts: ShortcutOptions);
}
