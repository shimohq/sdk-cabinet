import Editor from '../../editor'

export interface GalleryOptions {
  editor: Editor
  downloadServer: string
}

export default class Gallery {
  constructor (options: GalleryOptions);
  public render (): void
  public destroy (): void
}
