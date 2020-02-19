import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export default class Print {
  constructor (opts: BasePluginOptions)

  printOptions: {
    showPrintDialog: () => void
  }
}
