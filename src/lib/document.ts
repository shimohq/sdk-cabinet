import get from 'lodash.get'
import assign from 'object-assign'

import CabinetBase, { emitter } from './base'
import './document.css'
import { events, ReadyState } from './constants'

const historyContainerTemplate = `
  <div class="sm-history-sidebar">
    <div class="sm-history-container">
      <div class="sm-history-head">
        <b>历史</b>
        <a style="float: right;" class="sm-history-close-btn" href="javascript:void(0);">关闭</a>
      </div>
      <div class="sm-history-content" id="sm-history-content"></div>
    </div>
  </div>
`

const revisionContainerTemplate = `
  <div class="sm-revision-container ql-sidebar-revision ql-sidebar" style="top: 46px; height: calc(100vh - 46px); display: none; z-index: 9;">
    <div class="sm-sidebar">
      <div class="sm-sidebar-title">
        <div class="title-text">版本</div>
        <div class="icon-close"><svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.6 15.6"><path d="M9.2 7.8l6.4-6.4L14.2 0 7.8 6.4 1.4 0 0 1.4l6.4 6.4L0 14.2l1.4 1.4 6.4-6.4 6.4 6.4 1.4-1.4z" fill="#a5a5a5"></path></svg></div>
      </div>
      <div class="sm-sidebar-body"></div>
    </div>
  </div>
`

export default class ShimoDocumentCabinet extends CabinetBase {
  public editor: ShimoSDK.Document.Editor
  public plugins: {
    demoScreen?: ShimoSDK.Document.DemoScreen
    collaboration?: ShimoSDK.Common.Collaboration
    collaborator?: ShimoSDK.Document.Collaborator
    comment?: ShimoSDK.Document.Comment
    gallery?: ShimoSDK.Document.Gallery
    history?: ShimoSDK.Document.History
    tableOfContent?: ShimoSDK.Document.TableOfContent
    uploader?: ShimoSDK.Document.Uploader
    shortcut?: ShimoSDK.Document.Shortcut
    revision?: ShimoSDK.Document.Revision
    mobile?: ShimoSDK.Document.Mobile
  }
  public getPlugin: (name: string) => Promise<any>

  private sdkCommon: any
  private sdkDocument: any
  private user: ShimoSDK.User
  private editorOptions: ShimoSDK.Document.EditorOptions
  private file: ShimoSDK.File
  private entrypoint: string
  private token: string
  private _commentShowCount: number
  private onError: (error: any) => void
  private async?: boolean
  protected pluginOptions: ShimoSDK.Document.Plugins
  protected emitter: emitter

  constructor (options: {
    element: HTMLElement
    sdkDocument: any
    sdkCommon: any
    user: ShimoSDK.User
    entrypoint: string
    token: string
    file: ShimoSDK.File
    editorOptions: ShimoSDK.Document.EditorOptions
    availablePlugins: string[]
    onError?: (error: any) => void
    getPlugin: (name: string) => Promise<any>
    async?: boolean
    emitter?: emitter
  }) {
    super(options.element)
    this.sdkCommon = options.sdkCommon
    this.sdkDocument = options.sdkDocument
    this.user = options.user
    this.editorOptions = Object.assign({}, options.editorOptions, {
      editable: options.file.permissions?.editable,
      readable: options.file.permissions?.readable,
      commentable: options.file.permissions?.commentable
    })
    this.plugins = {}
    this.file = options.file
    this.entrypoint = options.entrypoint
    this.token = options.token
    this.availablePlugins = options.availablePlugins
    this.pluginOptions = this.preparePlugins(
      options.editorOptions.plugins,
      {
        Revision: false
      },
      plugin => plugin !== 'Mobile'
    )
    this._commentShowCount = 0
    this.getPlugin = options.getPlugin
    this.async = options.async

    if (typeof options.onError === 'function') {
      this.onError = options.onError
    } else {
      this.onError = err => { throw err }
    }

    if (typeof options.emitter === 'function') {
      this.emitter = options.emitter
    }
  }

  public async render () {
    const editor = this.initEditor()
    let localeConfig: {
      fetchLocaleSync?: string;
      locale?: string;
    } = {}
    if (this.editorOptions.localeConfig) {
      localeConfig = this.editorOptions.localeConfig
    }

    const editorScroller = this.getElement(undefined, 'div', { id: 'sm-editor-scroller' })
    this.element.appendChild(editorScroller)
    editorScroller.classList.add('sm-editor-scroller')

    const toolbarOptions = this.getToolbarOptions()

    if (typeof toolbarOptions === 'object') {
      editorScroller.addEventListener('scroll', () => {
        if (editorScroller.scrollTop === 0) {
          toolbarOptions.parent.classList.remove('active')
        } else {
          toolbarOptions.parent.classList.add('active')
        }
      })
    }

    const editorElm = this.getElement(undefined, 'div', { id: 'sm-editor' })
    editorElm.classList.add('sm-editor')

    editor.render(
      editorScroller.appendChild(editorElm),
      {
        readOnly: !this.editorOptions.editable,
        id: this.user.id,
        localeConfig,
        modules: {
          toolbar: toolbarOptions
        },
        scrollingContainer: editorScroller
      }
    )
    editor.setContent(this.file.content)
    this.emitter('error', 'holyshit')
    this.emitter('readyState', 'yeah')
    this.emitter(events.readyState, { [events.readyState]: ReadyState.editorReady })

    const p = Promise
      .all(this.availablePlugins.map(p => this.initPlugin(editor, p)))
      .then(() => this.initCollaboration(editor))
      .catch(err => this.onError(err))
      .then(() => {
        this.emitter(events.readyState, { [events.readyState]: ReadyState.pluginReady })
        this.emitter(events.readyState, { [events.readyState]: ReadyState.allReady })
      })
      .catch(err => this.onError(err))
    if (!this.async) {
      await p
    }

    if (this.editorOptions.isMobile) {
      document.body.classList.add('in-mobile')
      editorElm.classList.add('in-mobile')
      editorScroller.classList.add('in-mobile')
      this.initMobile(editor, editorElm)
    }

    this.editor = editor

    return editor
  }

  private async initPlugin (editor: ShimoSDK.Document.Editor, plugin: string) {
    if (plugin in this.pluginOptions === false) {
      return
    }

    if (plugin !== 'Collaboration' && plugin !== 'Toolbar') {
      await this.getPlugin(plugin)
    }

    const method = `init${plugin}`
    if (typeof this[method] === 'function') {
      if (plugin !== 'Collaboration') {
        this[method](editor)
      }
    }
  }

  public destroy (): void {
    const destroy = () => {
      this.editor.destroy()
      for (const k in this.plugins) {
        if (this.plugins[k] && typeof this.plugins[k].destroy === 'function') {
          this.plugins[k].destroy()
        }
      }
    }

    if (this.editor.isReady) {
      destroy()
    } else {
      this.editor.on('ready', destroy)
    }
  }

  public initEditor (): ShimoSDK.Document.Editor {
    const options: ShimoSDK.Document.EditorOptions = {
      id: this.user.id,
      readOnly: !this.editorOptions.editable,
      editable: this.editorOptions.editable,
      commentable: this.editorOptions.commentable
    }
    return new this.sdkDocument.Editor(options)
  }

  public initMobile (editor: ShimoSDK.Document.Editor, editorElm: HTMLElement): void {
    if (this.editorOptions.isMobile) {
      const options = assign(
        {
          commentable: this.editorOptions.commentable
        },
        this.pluginOptions.Mobile,
        {
          editor,
          editorWrap: editorElm,
          comment: this.plugins.comment,
          toolbar: true
        }
      ) as ShimoSDK.Document.MobileOptions
      this.plugins.mobile = new this.sdkDocument.plugins.Mobile(options)
    }
  }

  public initGallery (editor: ShimoSDK.Document.Editor): void {
    if (this.pluginOptions.Gallery === false) {
      return
    }

    const options: ShimoSDK.Document.GalleryOptions = assign(
      {},
      this.pluginOptions.Gallery,
      {
        editor
      }
    )
    const gallery: ShimoSDK.Document.Gallery = new this.sdkDocument.plugins.Gallery(options)
    this.plugins.gallery = gallery
    gallery.render()
  }

  public initHistory (editor: ShimoSDK.Document.Editor): void {
    if (this.pluginOptions.History === false || this.editorOptions.isMobile) {
      return
    }

    const options = assign(
      {},
      this.pluginOptions.History,
      {
        editor,
        guid: this.file.guid,
        service: {
          fetch: `${this.entrypoint}/files/${this.file.guid}/` +
                    `histories?accessToken=${this.token}`,
          revert: `${this.entrypoint}/files/${this.file.guid}/revert?accessToken=${this.token}`,
          user: `${this.entrypoint}/users?accessToken=${this.token}`
        }
      }
    ) as ShimoSDK.Document.HistoryOptions

    const history: ShimoSDK.Document.History = new this.sdkDocument.plugins.History(options)
    this.plugins.history = history

    let historyContainer = this.getElement(get(this.pluginOptions, 'History.container'))
    if (!historyContainer) {
      this.element.insertAdjacentHTML('afterend', historyContainerTemplate)
      historyContainer = document.querySelector('.sm-history-container') as HTMLElement
    }

    const historyElement = this.getElement(undefined, 'div', { id: 'sm-history' })
    historyContainer.appendChild(historyElement)
    history.render(historyElement)

    const historyButton = this.getElement('#ql-history', 'button', { id: 'ql-history', type: 'button' })
    historyButton.classList.add('ql-history')

    if (!historyButton.textContent && !historyButton.dataset.label) {
      historyButton.dataset.label = '历史'
    }

    const toolbarGroup = document.querySelector('.ql-toolbar-default')!.querySelectorAll('.ql-formats')
    const toolbarContainer = toolbarGroup[toolbarGroup.length - 1]
    if (toolbarContainer) {
      toolbarContainer.appendChild(historyButton)
    }

    historyButton.addEventListener('click', () => {
      historyContainer!.style.display = 'block'
      history.show()
      editor.comment.hide()
    })

    document.querySelector('.sm-history-close-btn')!.addEventListener('click', () => {
      historyContainer!.style.display = 'none'
      editor.comment.show()
    })
  }

  public initTableOfContent (editor: ShimoSDK.Document.Editor): void {
    if (this.pluginOptions.TableOfContent === false || this.editorOptions.isMobile) {
      return
    }

    const options: ShimoSDK.Document.TableOfContentOptions = assign(
      {},
      this.pluginOptions.TableOfContent,
      {
        editor
      }
    )

    const tableOfContent: ShimoSDK.Document.TableOfContent = new this.sdkDocument.plugins.TableOfContent(options)
    this.plugins.tableOfContent = tableOfContent

    if (options.container instanceof HTMLElement) {
      options.container.classList.add('table-of-content')
    }
    tableOfContent.render(options.container)
  }

  public initCollaboration (editor: ShimoSDK.Document.Editor): void {
    let collaborators: ShimoSDK.Document.Collaborator | undefined

    if (this.pluginOptions.Collaborator !== false) {
      const collaboratorOptions: ShimoSDK.Document.CollaboratorOptions = assign(
        {
          service: {
            user: `${this.entrypoint}/users?accessToken=${this.token}`
          },
          avatarTrack: false,
          cursorTrack: false
        },
        this.pluginOptions.Collaborator,
        {
          editor,
          user: this.user
        }
      )
      collaborators = new this.sdkDocument.plugins.Collaborator(collaboratorOptions)
      this.plugins.collaborator = collaborators
    }

    if (this.pluginOptions.Collaboration === false) {
      return
    }

    const collaborationOptions: ShimoSDK.Common.CollaborationOptions = assign(
      {
        pullUrl: `${this.entrypoint}/files/${this.file.guid}/pull?accessToken=${this.token}`,
        composeUrl: `${this.entrypoint}/files/${this.file.guid}/compose?accessToken=${this.token}`,
        selectUrl: `${this.entrypoint}/files/${this.file.guid}/select?accessToken=${this.token}`,
        offlineEditable: false
      },
      this.pluginOptions.Collaboration,
      {
        editor,
        type: 'richdoc',
        rev: this.file.head,
        guid: this.file.guid,
        collaborators
      }
    )
    const collaboration: ShimoSDK.Common.Collaboration = new this.sdkCommon.Collaboration(collaborationOptions)
    this.plugins.collaboration = collaboration

    if (typeof collaborationOptions.onSaveStatusChange === 'function') {
      collaboration.on('saveStatusChange' as ShimoSDK.Common.CollaborationEvents, collaborationOptions.onSaveStatusChange)
    }

    collaboration.start()
    if (collaborators) {
      collaborators.render(collaboration)
    }
  }

  public initComment (editor: ShimoSDK.Document.Editor): void {
    if (this.pluginOptions === false) {
      return
    }

    const options: ShimoSDK.Document.CommentOptions = assign(
      {
        service: {
          fetch: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}`,
          create: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}`,
          delete: `${this.entrypoint}/files/${this.file.guid}/comments/{commentGuid}?accessToken=${this.token}`,
          close: `${this.entrypoint}/files/${this.file.guid}/` +
            `comments/close/{selectionGuid}?accessToken=${this.token}`
        },
        mentionable: false
      },
      this.pluginOptions.Comment,
      {
        editor,
        user: this.user,
        unreadEnable: false
      }
    )

    if (this.editorOptions.isMobile) {
      options.hasPanel = false
      options.hasGenerator = false
    }

    const comment: ShimoSDK.Document.Comment = new this.sdkDocument.plugins.Comment(options)
    this.plugins.comment = editor.comment = comment
    comment.render()
    comment.show()
  }

  public initDemoScreen (editor: ShimoSDK.Document.Editor) {
    if (this.pluginOptions.DemoScreen === false || this.editorOptions.isMobile) {
      return
    }

    const options: ShimoSDK.Document.DemoScreenOptions = { editor }

    const demoScreen: ShimoSDK.Document.DemoScreen = new this.sdkDocument.plugins.DemoScreen(options)
    this.plugins.demoScreen = demoScreen
  }

  public initUploader (editor: ShimoSDK.Document.Editor) {
    if (this.pluginOptions.Uploader === false) {
      return
    }

    const uploadConfig: { [key: string]: any } = assign({}, this.pluginOptions.Uploader)

    const options: ShimoSDK.Document.UploaderOptions = {
      editor,
      container: '#sm-editor',
      url: uploadConfig.origin,
      accessToken: uploadConfig.token,
      type: uploadConfig.server
    }

    const uploader = new this.sdkDocument.plugins.Uploader(options)
    this.plugins.uploader = uploader
  }

  public initShortcut (editor: ShimoSDK.Document.Editor): void {
    if (this.pluginOptions.Shortcut === false || this.editorOptions.isMobile) {
      return
    }

    const options: ShimoSDK.Document.ShortcutOptions = {
      editor,
      plugins: {
        demoScreen: undefined,
        revision: undefined,
        history: undefined,
        tableOfContent: undefined
      }
    }

    const shortcut: ShimoSDK.Document.Shortcut = new this.sdkDocument.plugins.Shortcut(options)
    this.plugins.shortcut = shortcut
    shortcut.render()
  }

  public initRevision (editor: ShimoSDK.Document.Editor): void {
    if (this.editorOptions.isMobile) {
      return
    }

    const pluginOptions = this.pluginOptions.Revision
    if (
      pluginOptions !== true &&
      /* tslint:disable-next-line:strict-type-predicates */
      (typeof pluginOptions !== 'object' || pluginOptions == null)
    ) {
      return
    }

    const options = assign(
      {
        service: {
          length: `${this.entrypoint}/files/${this.file.guid}/revisions?accessToken=${this.token}`,
          fetch: `${this.entrypoint}/files/${this.file.guid}/revisions?accessToken=${this.token}`,
          fetchTitle: `${this.entrypoint}/files/${this.file.guid}/histories/{historyId}/title?accessToken=${this.token}`,
          postRename: `${this.entrypoint}/files/${this.file.guid}/revisions/{id}?accessToken=${this.token}`,
          revert: `${this.entrypoint}/files/${this.file.guid}/revert?accessToken=${this.token}`,
          generate: `${this.entrypoint}/files/${this.file.guid}/revisions?accessToken=${this.token}`,
          delete: `${this.entrypoint}/files/${this.file.guid}/revisions/{id}?accessToken=${this.token}`,
          fetchContent: `${this.entrypoint}/files/${this.file.guid}/histories/{id}?accessToken=${this.token}`
        }
      },
      pluginOptions,
      {
        editor
      }
    ) as ShimoSDK.Document.RevisionOptions

    const revision: ShimoSDK.Document.Revision = new this.sdkDocument.plugins.Revision(options)
    this.plugins.revision = revision

    this.element.insertAdjacentHTML('afterend', revisionContainerTemplate)
    const container = document.querySelector('.sm-revision-container') as HTMLElement
    container.querySelector('.icon-close')!.addEventListener('click', () => {
      container.style.display = 'none'
      this.setCommentShowStatus(true)
    })

    if (!options.disableDefaultButtons) {
      const parent = document.querySelector('.ql-toolbar-default')
      if (parent) {
        const buttonGroups = document.createElement('span')
        buttonGroups.className = 'ql-formats ql-revision'
        const html = `
        <button type="button" class="ql-revision" data-label="版本"></button>
        <span class="ql-dropdown-menu ql-revision-menu">
          <button type="button" class="ql-create-revision" data-label="新建"></button>
          <button type="button" class="ql-view-revision" data-label="查看"></button>
        </span>
      `
        buttonGroups.insertAdjacentHTML('afterbegin', html)

        parent.appendChild(buttonGroups)

        const toggleButtons = show => {
          const elm = buttonGroups.querySelector('.ql-revision')
          if (elm) {
            const method = show ? 'add' : 'remove'
            elm.classList[method]('ql-expanded')
            if (elm.nextElementSibling) {
              elm.nextElementSibling.classList[method]('ql-expanded')
            }
          }
        }

        buttonGroups.querySelector('button.ql-revision')!.addEventListener('click', function () {
          toggleButtons(!(this as HTMLElement).classList.contains('ql-expanded'))
        })

        const showRev = document.querySelector('.ql-view-revision') as HTMLElement
        showRev.addEventListener('click', () => {
          const renderContainer = container.querySelector('.sm-sidebar-body') as HTMLElement
          if (renderContainer.innerHTML === '') {
            revision.render(renderContainer)
          }
          container.style.display = 'block'
          this.setCommentShowStatus(false)
          toggleButtons(false)
        })

        const saveRev = document.querySelector('.ql-create-revision') as HTMLElement
        saveRev.addEventListener('click', () => {
          revision.save('版本保存成功')
          toggleButtons(false)
        })
      }
    }

    revision.render()
  }

  private setCommentShowStatus (show: boolean) {
    if (!this.plugins.comment) {
      return
    }

    this._commentShowCount += show ? -1 : 1
    if (this._commentShowCount < 0) {
      this._commentShowCount = 0
    }

    if (this._commentShowCount > 0) {
      this.plugins.comment.hide()
    } else {
      this.plugins.comment.show()
    }
  }

  private getToolbarOptions () {
    let container: HTMLElement | null

    if (!this.pluginOptions.Toolbar) {
      return false
    }

    container = this.getElement((this.pluginOptions.Toolbar as ShimoSDK.Document.ToolbarOptions).container)

    if (!container) {
      container = this.getElement(undefined, 'div', { id: 'sm-toolbar' })
      this.element.insertBefore(container, this.element.firstChild)
    }

    container.classList.add('sm-toolbar')

    return { parent: container }
  }
}
