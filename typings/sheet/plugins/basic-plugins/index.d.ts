import { BasePluginOptions } from '../../editor'

interface MobileToolbarOptions extends BasePluginOptions{
  // 高亮选中项
  disableHighlightPosition: boolean
  disableSplitColumns: boolean
  disableNumberText: boolean
  disableZoomScale: boolean
  disableFullscreen: boolean
  disableStatusBar: boolean
}

export default class BasicPlugins {
  constructor (options: MobileToolbarOptions)
}
