import { ReadyState, events } from './constants'
import CabinetBase, { emitter } from './base'

class ShimoDocumentProCabinet extends CabinetBase {
  public editor: ShimoSDK.DocumentPro.Editor
  private sdkSlide: any
  private user: ShimoSDK.User
  private file: ShimoSDK.File

  constructor (options: {
    element: HTMLElement
    sdkDocumentPro: any
    user: ShimoSDK.User
    file: ShimoSDK.File
    emitter?: emitter
  }) {
    super(options.element)
    this.sdkSlide = options.sdkDocumentPro
    this.user = options.user
    this.file = options.file

    if (typeof options.emitter === 'function') {
      this.emitter = options.emitter
    }
  }

  public async render () {
    this.initEditor()
    this.emitter('readyState', { [events.readyState]: ReadyState.allReady })
    return
  }

  public destroy (): void {
    throw new Error('Destroying document pro is not supported by now')
  }

  public initEditor (): ShimoSDK.DocumentPro.Editor {
    /* tslint:disable-next-line:strict-type-predicates */
    if (window.shimo == null) {
      window.shimo = {}
    }
    window.shimo.file = this.file
    window.shimo.user = this.user

    Object.keys(this.file.config).forEach(key => {
      window.shimo[key] = this.file.config[key]
    })

    const editor = this.sdkSlide({ container: this.element })
    this.emitter(events.readyState, { [events.readyState]: ReadyState.editorReady })
    return editor
  }
}

export default ShimoDocumentProCabinet
