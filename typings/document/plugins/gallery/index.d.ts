import { BasePluginOptions } from '../../editor'

export interface GalleryOptions extends BasePluginOptions {
  /**
   * 生成下载链接
   * @param url 原始链接
   */
  genDownloadUrl?: (url: string) => string
}

export default class Gallery {
  constructor (options: GalleryOptions);
  public render (): void
  public destroy (): void
}
