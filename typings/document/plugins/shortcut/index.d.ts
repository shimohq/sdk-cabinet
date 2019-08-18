import { BasePluginOptions } from '../../editor'
import DemoScreen from '../demoScreen'
import History from '../history'
import TableOfContent from '../tableOfContent'

export interface ShortcutOptions extends BasePluginOptions {
  plugins: {
    demoScreen?: DemoScreen,
    revision?: any,
    history?: History,
    tableOfContent?: TableOfContent
  }
}

export default class Shortcut {
  constructor (options: ShortcutOptions);
  render ()
  destroy ()
}
