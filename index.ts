import ShimoDocumentCabinet from './document'
import ShimoSheetCabinet from './sheet'

export default class ShimoCabinet {
  private sdkSheet: any
  private sdkCommon: any
  private sdkDocument: any
  private rootDom: HTMLElement
  private user: ShimoSDK.User
  private entrypoint: string
  private token: string
  private file: ShimoSDK.File
  private editorOptions: ShimoSDK.Sheet.EditorOptions
  private plugins: string[]
  private fetchCollaborators: string
  private shimoSheetCabinet: ShimoSheetCabinet
  private shimoDocumentCabinet: ShimoDocumentCabinet
  private onSaveStatusChange: (status: ShimoSDK.Common.CollaborationStatus) => {}

  constructor (options: {
    rootDom: HTMLElement;
    sdkSheet?: any;
    sdkCommon: any;
    sdkDocument?: any;
    user: ShimoSDK.User;
    entrypoint: string;
    token: string;
    file: ShimoSDK.File;
    editorOptions: ShimoSDK.Sheet.EditorOptions;
    fetchCollaborators: string;
    plugins: string[];
    onSaveStatusChange: () => {};
  }) {
    this.rootDom = options.rootDom
    this.sdkSheet = options.sdkSheet
    this.sdkCommon = options.sdkCommon
    this.sdkDocument = options.sdkDocument
    this.user = options.user
    this.entrypoint = options.entrypoint
    this.token = options.token
    this.file = options.file
    this.editorOptions = options.editorOptions
    this.plugins = options.plugins
    this.fetchCollaborators = options.fetchCollaborators
    this.onSaveStatusChange = options.onSaveStatusChange
  }

  public renderSheet () {
    const shimoSheetCabinet = new ShimoSheetCabinet({
      rootDom: this.rootDom,
      sdkSheet: this.sdkSheet,
      sdkCommon: this.sdkCommon,
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: this.editorOptions,
      plugins: this.plugins,
      fetchCollaborators: this.fetchCollaborators,
      onSaveStatusChange: this.onSaveStatusChange
    })

    this.shimoSheetCabinet = shimoSheetCabinet

    return shimoSheetCabinet.render()
  }

  public destroySheet () {
    if (!this.shimoSheetCabinet) {
      throw new Error('shimoSheetCabinet needs render')
    }
    this.shimoSheetCabinet.destroy()
  }

  public renderDocument () {
    const shimoDocumentCabinet = new ShimoDocumentCabinet({
      rootDom: this.rootDom,
      sdkDocument: this.sdkDocument,
      sdkCommon: this.sdkCommon,
      user: this.user,
      entrypoint: this.entrypoint,
      token: this.token,
      file: this.file,
      editorOptions: this.editorOptions,
      plugins: this.plugins,
      onSaveStatusChange: this.onSaveStatusChange
    })

    this.shimoDocumentCabinet = shimoDocumentCabinet

    return shimoDocumentCabinet.render()
  }

  public destroyDocument () {
    if (!this.shimoDocumentCabinet) {
      throw new Error('shimoDocumentCabinet needs render')
    }
    this.shimoDocumentCabinet.destroy()
  }

}
export {
    ShimoDocumentCabinet,
    ShimoSheetCabinet
}
