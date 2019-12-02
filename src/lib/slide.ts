import CabinetBase from './base'

class ShimoSlideCabinet extends CabinetBase {
  public editor: ShimoSDK.Slide.Editor
  private sdkSlide: any
  private sdkCommon: any
  private user: ShimoSDK.User
  private entrypoint: string
  private token: string
  private file: ShimoSDK.File
  private editorOptions: ShimoSDK.Slide.EditorOptions

  constructor (options: {
    element: HTMLElement
    sdkSlide: any
    sdkCommon: any
    user: ShimoSDK.User
    entrypoint: string
    token: string
    file: ShimoSDK.File
  }) {
    super(options.element)
    this.sdkSlide = options.sdkSlide
    this.sdkCommon = options.sdkCommon
    this.user = options.user
    this.entrypoint = options.entrypoint
    this.token = options.token

    const file = this.file = options.file
    this.editorOptions = {
      uploadConfig: {
        origin: file.config.uploadOrigin,
        server: file.config.uploadServer,
        token: file.config.uploadToken,
        maxFileSize: file.config.uploadMaxFileSize
      },
      editable: file.permissions.editable,
      commentable: file.permissions.commentable
    }
  }

  public async render () {
    const editor = this.editor = this.initEditor()

    const options = {
      editable: this.editorOptions.editable,
      public: false,
      withPlayButton: true,
      uploader: {
        url: this.editorOptions.uploadConfig!.origin + '/upload2',
        accessToken: this.token,
        params: {
          server: this.editorOptions.uploadConfig!.server,
          type: 'images'
        }
      }
    }

    editor.layouts = new this.sdkSlide.plugins.Layouts({ editor }) as ShimoSDK.Slide.Layouts
    await editor.layouts.render(this.element, options).then(() => new this.sdkSlide.plugins.Player({ editor }))

    editor.collaborators = new this.sdkSlide.plugins.Collaborators({
      editor,
      currentUserId: this.user.id
    })

    // 初始化协作
    const urlPrefix = this.entrypoint + '/files/' + this.file.guid
    const urlSuffix = '?accessToken=' + this.token
    const collaboration = new this.sdkCommon.Collaboration({
      editor,
      rev: this.file.head,
      guid: this.file.guid,
      storage: { set () { return undefined } },
      currentUserId: this.user.id,
      pullUrl: urlPrefix + '/pull' + urlSuffix,
      composeUrl: urlPrefix + '/compose' + urlSuffix,
      selectUrl: urlPrefix + '/select' + urlSuffix
    })
    collaboration.start()

    return editor
  }

  public destroy (): void {
    if (!this.editor) {
      return
    }

    ['collaboration', 'layouts'].forEach(k => {
      const item = this.editor[k]
      if (item && typeof item.destroy === 'function') {
        item.destroy()
      }
    })

    this.editor.destroy()
  }

  public initEditor (): ShimoSDK.Slide.Editor {
    return new this.sdkSlide.Editor({ file: this.file.content })
  }
}

export default ShimoSlideCabinet
