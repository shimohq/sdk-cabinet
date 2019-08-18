import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface LayoutsOptions extends BasePluginOptions {}

export class Layouts {
  constructor (options: LayoutsOptions)

  render (container: HTMLElement, options: {
    editable: boolean

    /**
     * 是否公开
     */
    public?: boolean

    /**
     * 是否在 toolbar 显示播放 button
     */
    publwithPlayButton?: boolean

    uploader: {
      container?: HTMLElement | string
      url: string
      accessToken: string
      params: {
        server: string
        type: string
      }
    }
  }): Promise<void>
}
