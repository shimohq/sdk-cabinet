import assign from 'object-assign'

import CabinetBase from './base'
import './sheet.css'

const STATUS = {
  OFFLINE: 'offline',
  OFFLINE_SAVING: 'offlineSaving',
  OFFLINE_SAVED: 'offlineSaved',
  OFFLINE_SAVE_FAILED: 'offlineSaveFailed',
  ONLINE: 'online',
  ONLINE_SAVING: 'onlineSaving',
  ONLINE_SAVED: 'onlineSaved',
  ONLINE_SAVE_FAILED: 'onlineSaveFailed',
  SERVER_CHANGE_APPLIED: 'serverChangeApplied'
}

class ShimoSheetCabinet extends CabinetBase {
  public editor: ShimoSDK.Sheet.Editor
  public plugins: {
    collaboration?: ShimoSDK.Common.Collaboration
    collaborators?: ShimoSDK.Sheet.Collaborators
    comment?: ShimoSDK.Sheet.Comment
    conditionalFormat?: ShimoSDK.Sheet.ConditionalFormat
    formulaSidebar?: ShimoSDK.Sheet.FormulaSidebar
    historySidebarSkeleton?: ShimoSDK.Sheet.HistorySidebarSkeleton
    pivotTable?: ShimoSDK.Sheet.PivotTable
    print?: ShimoSDK.Sheet.Print
    toolbar?: ShimoSDK.Sheet.Toolbar
    contextMenu?: ShimoSDK.Sheet.SheetContextmenu
    shortcut?: ShimoSDK.Sheet.Shortcut
    chart?: ShimoSDK.Sheet.Chart
    fill?: ShimoSDK.Sheet.Fill
    lock?: ShimoSDK.Sheet.Lock
    filterViewport?: ShimoSDK.Sheet.FilterViewport
    sheetTab?: ShimoSDK.Sheet.SheetTab
    basic?: ShimoSDK.Sheet.BasicPlugins
    dataValidation?: ShimoSDK.Sheet.DataValidation
  }

  private sdkSheet: any
  private sdkCommon: any
  private user: ShimoSDK.User
  private entrypoint: string
  private token: string
  private file: ShimoSDK.File
  private editorOptions: ShimoSDK.Sheet.EditorOptions
  private collaboration: ShimoSDK.Common.Collaboration
  private pluginsReady: boolean
  private afterPluginReady: (() => void)[]
  protected pluginOptions: ShimoSDK.Sheet.Plugins

  constructor (options: {
    element: HTMLElement
    sdkSheet: any
    sdkCommon: any
    user: ShimoSDK.User
    entrypoint: string
    token: string
    file: ShimoSDK.File
    editorOptions: ShimoSDK.Sheet.EditorOptions
    availablePlugins: string[]
  }) {
    super(options.element)
    this.sdkSheet = options.sdkSheet
    this.sdkCommon = options.sdkCommon
    this.user = options.user
    this.entrypoint = options.entrypoint
    this.token = options.token
    this.plugins = {}

    const file = this.file = options.file
    this.editorOptions = assign(
      {
        uploadConfig: {
          origin: file.config.uploadOrigin,
          server: file.config.uploadServer,
          token: file.config.uploadToken,
          maxFileSize: file.config.uploadMaxFileSize
        },
        downloadConfig: {
          entryPoint: this.entrypoint
        }
      },
      options.editorOptions,
      {
        editable: file.permissions.editable,
        commentable: file.permissions.commentable,
        user: file.config.user
      }
    )

    this.availablePlugins = options.availablePlugins
    this.pluginOptions = this.preparePlugins(
      options.editorOptions.plugins,
      { Lock: false },
      this.editorOptions.isMobile ?
        plugin => [
          'ContextMenu',
          'Toolbar',
          'HistorySidebarSkeleton',
          'Print',
          'File',
          'Basic',
          'Shortcut',
          'FormulaSidebar'
        ].indexOf(plugin) === -1 :
        undefined
    )
    this.afterPluginReady = []
  }

  public render (options?: ShimoSDK.Sheet.EditorRenderOptions) {
    const editorElm = this.getElement(undefined, 'div', { id: 'sm-editor', classList: ['sm-editor'] })
    this.element.appendChild(editorElm)

    const editor = this.editor = this.initEditor(this.editorOptions)
    editor.render(assign(
      {
        spreadOptions: {
          allowScrollByPixel: true
        }
      },
      options,
      {
        content: this.file.content,
        container: editorElm
      }
    ))

    this.initPlugins(editor)
    this.pluginsReady = true
    for (const cb of this.afterPluginReady) {
      cb.call(this)
    }

    const referenceNode = document.getElementById('toolbar') && document.getElementById('contextmenu')
    if (referenceNode) {
      this.insertAfter(referenceNode, editorElm)
    }

    editor.on(this.sdkSheet.sheets.Events, (msg) => {
      this.sdkSheet.sheets.utils.confirm({
        title: '表格异常',
        description: '表格出现异常，无法编辑，请刷新后继续使用。<br /><i style="font-size:12px;color:#ccc;">' + msg + '</i>',
        buttons: [
          {
            type: 'button',
            buttonLabel: '确定',
            customClass: 'btn-ok',
            closeAfterClick: true
          }
        ]
      })
    })

    return editor
  }

  public destroy (): void {
    this.editor.destroy()
    for (const k in this.plugins) {
      const plugin = this.plugins[k]
      if (plugin) {
        if (typeof plugin.destroy === 'function') {
          plugin.destroy()
        }
      }
    }
  }

  public initEditor (options: ShimoSDK.Sheet.EditorOptions): ShimoSDK.Sheet.Editor {
    return new this.sdkSheet.Editor(options)
  }

  public initBasicPlugins (editor: ShimoSDK.Sheet.Editor): void {
    const options = assign(
      {
        editor,
        disableHighlightPosition: false,
        disableSplitColumns: this.editorOptions.isMobile,
        disableNumberText: this.editorOptions.isMobile,
        disableZoomScale: this.editorOptions.isMobile,
        disableFullscreen: this.editorOptions.isMobile,
        disableStatusBar: this.editorOptions.isMobile
      },
      this.pluginOptions.Toolbar,
      { editor }
    ) as ShimoSDK.Sheet.BasePluginOptions

    this.plugins.basic = new this.sdkSheet.plugins.BasicPlugins(options)
  }

  public initToolbar (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Toolbar === false || this.editorOptions.isMobile) {
      return
    }

    const options: ShimoSDK.Sheet.ToolbarOptions = assign({}, this.pluginOptions.Toolbar, { editor })

    let container = this.getElement(options.container)
    if (container === null) {
      container = this.getElement(undefined, 'div', { id: 'sm-toolbar' })
      this.element.insertBefore(container, this.element.firstChild)
    }
    container.classList.add('sm-toolbar')
    const toolbar: ShimoSDK.Sheet.Toolbar = new this.sdkSheet.plugins.Toolbar(options)
    toolbar.render({ container })
    this.plugins.toolbar = toolbar
  }

  public initMobileToolbar (editor: ShimoSDK.Sheet.Editor) {
    if (this.editorOptions.isMobile) {
      const options = assign({}, this.pluginOptions.MobileToolbar, { editor }) as ShimoSDK.Sheet.BasePluginOptions

      let container = this.getElement(options.container)
      if (!container) {
        container = this.getElement(undefined, 'div', { id: 'sm-toolbar' })
        this.element.insertBefore(container, this.element.firstChild)
      }
      container.classList.add('sm-toolbar')

      this.plugins.toolbar = new window.shimo.sdk.sheet.plugins.MobileToolbar({ editor, container })
    }
  }

  public initMobileContextmenu (editor: ShimoSDK.Sheet.Editor) {
    if (this.editorOptions.isMobile) {
      this.plugins.contextMenu = new this.sdkSheet.plugins.MobileContextmenu({ editor })
      return
    }
  }

  public initContextMenu (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.ContextMenu === false || this.editorOptions.isMobile) {
      return
    }

    const options: ShimoSDK.Sheet.SheetContextmenuOptions = assign({}, this.pluginOptions.ContextMenu, { editor })
    const contextMenu: ShimoSDK.Sheet.SheetContextmenu = new this.sdkSheet.plugins.ContextMenu(options)
    const container = this.getElement(
      options.container,
      'div',
      {
        id: 'sm-contextmenu',
        classList: ['sm-contextmenu']
      },
      this.element
    )
    contextMenu.render({ container })
    this.plugins.contextMenu = contextMenu
  }

  public initComment (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Comment === false) {
      return
    }

    const container = this.getElement(
      undefined,
      'div',
      { id: 'sm-comment', classList: ['sm-comment'] },
      this.element
    )
    const options: ShimoSDK.Sheet.CommentOptions = assign({
      editor,
      container,
      currentUser: this.user,
      guid: this.file.guid,
      usePollingInsteadOfSocket: {
        interval: 10000
      },
      queryCommentOptions: {
        url: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}&_legacy=1`
      },
      deleteCommentOptions: {
        url: `${this.entrypoint}/files/${this.file.guid}` +
          `/comments/{comment-id}?accessToken=${this.token}&_legacy=1`
      },
      closeCommentOptions: {
        url: `${this.entrypoint}/comments/closeComments?accessToken=${this.token}&_legacy=1`
      },
      createCommentOptions: {
        url: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}&_legacy=1`
      },
      fetchLocaleSync: (locale) => {
        return this.sdkSheet.plugins.CommentLocaleResources[locale]
      }
    }, this.pluginOptions.Comment)

    this.plugins.comment = new this.sdkSheet.plugins.Comment(options)
  }

  public initHistorySidebarSkeleton (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.HistorySidebarSkeleton === false || this.editorOptions.isMobile) {
      return
    }

    const sidebarOptions: { [key: string]: any } = assign({}, this.pluginOptions.HistorySidebarSkeleton)
    const container = this.getElement(sidebarOptions.container, 'div', {
      classList: ['sm-history-sidebar-container']
    })
    this.element.appendChild(container)

    const options: ShimoSDK.Sheet.HistorySidebarSkeletonOptions = {
      editor,
      container,
      guid: this.file.guid,
      currentUserId: `${this.user.id}`,
      history: {
        loadHistoryUrl: `${this.entrypoint}/files/${this.file.guid}/` +
          `histories?accessToken=${this.token}&_legacy=1`,
        revertUrl: `${this.entrypoint}/files/${this.file.guid}/revert?accessToken=${this.token}&_legacy=1`,
        snapshotUrl: `${this.entrypoint}/files/${this.file.guid}/snapshot?accessToken=${this.token}&_legacy=1`,
        loadStepsUrl: `${this.entrypoint}/files/${this.file.guid}/` +
          `changes?from={from}&to={to}&accessToken=${this.token}&_legacy=1`,
        contactUrl: `${this.entrypoint}/users?accessToken=${this.token}&_legacy=1`
      }
    }
    const historySidebarSkeleton: ShimoSDK.Sheet.HistorySidebarSkeleton =
      new this.sdkSheet.plugins.HistorySidebarSkeleton(options)
    this.plugins.historySidebarSkeleton = historySidebarSkeleton

    const externalActions = this.getElement('#sm-external-actions', 'span', {
      id: 'sm-external-actions',
      classList: ['sm-external-actions', 'toolBar--tool']
    })

    const historyBtn = this.getElement(undefined, 'span', {
      classList: ['sm-external-actions-history', 'toolBar-iconBtn', 'indicator', 'tooltip--docker']
    })
    if (!historyBtn.innerText) {
      historyBtn.innerText = '历史'
    }
    historyBtn.setAttribute('data-tooltip', '历史')
    historyBtn.addEventListener('click', () => historySidebarSkeleton.show())
    externalActions.appendChild(historyBtn)

    const attachElm = () => {
      setTimeout(() => {
        if (!this.pluginsReady) {
          return attachElm()
        }

        const toolbar = document.querySelector('.sm-toolbar')
        if (toolbar) {
          const groups = toolbar.querySelectorAll('.toolBar--content .toolBar--group')
          const elm = groups[groups.length - 2]
          elm.insertBefore(externalActions, elm.firstChild)
        }
      }, 50)
    }
    attachElm()
  }

  public initFormulaSidebar (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.FormulaSidebar === false) {
      return
    }

    const container = this.getElement(
      undefined,
      'div',
      { id: 'sm-formula-sidebar' },
      this.element
    )

    const formulaSidebar: ShimoSDK.Sheet.FormulaSidebar =
      new this.sdkSheet.plugins.FormulaSidebar(assign(
        { container },
        this.pluginOptions.FormulaSidebar,
        { editor }
      ))
    this.plugins.formulaSidebar = formulaSidebar

    const btn = this.getElement(undefined, 'span', { id: 'sm-formula-btn', classList: ['sm-formula-btn'] })
    btn.addEventListener('click', () => formulaSidebar.show())
  }

  public initShortcut (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Shortcut === false) {
      return
    }

    const options: ShimoSDK.Sheet.ShortcutOptions = assign(
      {},
      this.pluginOptions.Shortcut,
      { editor }
    )
    this.plugins.shortcut = new this.sdkSheet.plugins.Shortcut(options)
  }

  public initChart (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Chart === false) {
      return
    }

    const options: ShimoSDK.Sheet.ChartOptions = assign(
      {},
      this.pluginOptions.Shortcut,
      { editor }
    )
    this.plugins.chart = new this.sdkSheet.plugins.Chart(options)
  }

  public initFill (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Fill === false) {
      return
    }

    const options: ShimoSDK.Sheet.FillOptions = assign(
      {},
      this.pluginOptions.Fill,
      { editor }
    )
    this.plugins.fill = new this.sdkSheet.plugins.Fill(options)
  }

  public initFilterViewport (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.FilterViewport === false) {
      return
    }

    const options: ShimoSDK.Sheet.FilterViewportOptions = assign(
      {},
      this.pluginOptions.FilterViewport,
      { editor }
    )
    this.plugins.filterViewport = new this.sdkSheet.plugins.FilterViewport(options)
  }

  public initCollaboration (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Collaboration === false) {
      return
    }

    this.plugins.collaborators = editor.collaborators = this.plugins.collaborators = new this.sdkSheet.plugins.Collaborators(assign(
      {},
      this.pluginOptions.Collaborators,
      { editor }
    ))

    const collaborationOptions: ShimoSDK.Common.CollaborationOptions = assign(
      {
        pullUrl: `${this.entrypoint}/files/${this.file.guid}/pull?accessToken=${this.token}`,
        composeUrl: `${this.entrypoint}/files/${this.file.guid}/compose?accessToken=${this.token}`,
        selectUrl: `${this.entrypoint}/files/${this.file.guid}/select?accessToken=${this.token}`,
        collaborators: this.plugins.collaborators,
        offlineEditable: false
      },
      this.pluginOptions.Collaboration,
      {
        editor,
        rev: this.file.head,
        guid: this.file.guid
      }
    )
    const collaboration: ShimoSDK.Common.Collaboration = new this.sdkCommon.Collaboration(collaborationOptions)
    collaboration.start()

    this.plugins.collaboration = this.collaboration = collaboration

    this.afterPluginReady.push(() => {
      if (!this.collaboration) {
        return
      }

      let statusChangeHandler = collaborationOptions.onSaveStatusChange
      if (typeof statusChangeHandler !== 'function') {
        statusChangeHandler = getStatusChangeHandler.call(this)
      }

      this.collaboration.on(
        'saveStatusChange' as ShimoSDK.Common.CollaborationEvents,
        statusChangeHandler!
      )

      function getStatusChangeHandler () {
        const toolbarElm = document.querySelector('.sm-toolbar .tabStrip')
        // tslint:disable-next-line:no-empty
        let changeText = (text: string) => {}
        if (toolbarElm) {
          const statusElm = this.getElement(undefined, 'div', {
            classList: ['menu', 'tabMenu', 'sm-save-status']
          })
          statusElm.textContent = getText(STATUS.ONLINE as ShimoSDK.Common.CollaborationStatus)
          toolbarElm.appendChild(statusElm)

          changeText = (text: string) => {
            statusElm.textContent = text
          }
        }

        const showAlert = this.sdkSheet.sheets.utils.showAlert
        const confirm = this.sdkSheet.sheets.utils.confirm

        return (status: ShimoSDK.Common.CollaborationStatus) => {
          const text = getText(status)
          switch (status) {
            case STATUS.ONLINE_SAVING:
              changeText(text)
              break

            case STATUS.ONLINE_SAVED:
              this.updateEditorOptions()
              changeText(text)
              break

            case STATUS.OFFLINE:
              this.updateEditorOptions({ commentable: false, editable: false })
              changeText(text)

              if (
                this.collaboration.haveUnsavedChange() ||
                !this.editor.isCsQueueEmpty()
              ) {
                confirm({
                  title: '表格已离线',
                  description:
                    '您的网络已经断开，无法继续编写！</br>为了防止数据丢失，请在刷新前手动保存最近的修改。',
                  buttons: [
                    {
                      type: 'button',
                      buttonLabel: '确定',
                      customClass: 'btn-ok',
                      closeAfterClick: true
                    }
                  ]
                })
              } else {
                showAlert({
                  title: '您的网络已经断开，无法继续编写！',
                  type: 'error'
                })
              }

              break

            case STATUS.ONLINE:
              changeText(text)
              this.updateEditorOptions()
              break

            // 在线保存失败
            case STATUS.ONLINE_SAVE_FAILED:
              // 禁用编辑器
              this.updateEditorOptions({ commentable: false, editable: false })
              changeText(text)
              showAlert({ title: '保存失败，请刷新当前页面！', type: 'error' })
              break

            // 离线保存失败
            case STATUS.OFFLINE_SAVE_FAILED:
              changeText(text)
              // 禁用编辑器
              this.updateEditorOptions({ commentable: false, editable: false })
              break
          }
        }

        function getText (status: ShimoSDK.Common.CollaborationStatus) {
          switch (status) {
            case STATUS.ONLINE_SAVING:
              return '保存中...'
            case STATUS.ONLINE_SAVED:
              return '保存成功'
            case STATUS.OFFLINE:
              return '已离线'
            case STATUS.ONLINE:
              return '自动保存已启用'
            case STATUS.ONLINE_SAVE_FAILED:
              return '保存失败'
            case STATUS.OFFLINE_SAVE_FAILED:
              return '离线保存失败'
          }
          return ''
        }
      }
    })
  }

  public initLock (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Lock === false) {
      return
    }

    const options = assign(
      {},
      this.pluginOptions.Lock,
      {
        editor,
        currentUser: {
          id: this.user.id
        }
      }
    ) as ShimoSDK.Sheet.LockOptions

    const plugins = this.pluginOptions
    const lockOptions = plugins.Lock! as ShimoSDK.Sheet.LockOptions
    if (typeof lockOptions.fetchCollaborators === 'function') {
      options.fetchCollaborators = lockOptions.fetchCollaborators
    }

    this.plugins.lock = new this.sdkSheet.plugins.Lock(options)
  }

  public initPrint (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.Print === false) {
      return
    }

    this.plugins.print = new this.sdkSheet.plugins.Print({ editor })
  }

  public initConditionalFormat (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.ConditionalFormat === false) {
      return
    }

    this.plugins.conditionalFormat = new this.sdkSheet.plugins.ConditionalFormat({ editor })
  }

  public initPivotTable (editor: ShimoSDK.Sheet.Editor): void {
    if (this.pluginOptions.PivotTable === false) {
      return
    }

    this.plugins.pivotTable = new this.sdkSheet.plugins.PivotTable({ editor })
  }

  public initMobileSheetTab (editor: ShimoSDK.Sheet.Editor) {
    if (!this.editorOptions.isMobile || this.pluginOptions.MobileSheetTab === false) {
      return
    }

    const options = assign({}, this.pluginOptions.MobileSheetTab) as ShimoSDK.Sheet.BasePluginOptions

    let container = this.getElement(options.container)
    if (!container) {
      container = this.getElement(undefined, 'div', { id: 'sm-mobile-sheet-tab' })
      this.element.append(container)
    }
    container.classList.add('sm-mobile-sheet-tab')

    this.plugins.sheetTab = new this.sdkSheet.plugins.MobileSheetTab({
      editor,
      container: container
    })
  }

  public initDataValidation (editor: ShimoSDK.Sheet.Editor) {
    if (this.pluginOptions.DataValidation === false) {
      return
    }

    this.plugins.dataValidation = new this.sdkSheet.plugins.DataValidation({ editor })
  }

  private updateEditorOptions (options?: {
    commentable: boolean,
    editable: boolean
  }) {
    if (this.editor) {
      this.editor.updateOptions(assign({
        commentable: this.editorOptions.commentable,
        editable: this.editorOptions.editable
      }, options))
    }
  }
}

export default ShimoSheetCabinet
