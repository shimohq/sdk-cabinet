import * as BaseEditor from '../common/editor'

// export interface EditorOptions extends BaseEditor.EditorOptions {
//   user: ShimoSDK.User
//   file: ShimoSDK.File
//   permissions?: {
//     commentable?: boolean
//     copyable?: boolean
//     editable?: boolean
//     watermark?: boolean
//     exportable?: boolean
//   }
// }

// export interface EditorRenderOptions {
//   /**
//    * 设置文档是否可编辑
//    */
//   editable?: boolean
// }

// declare enum Events {
//   CHANGE = 'change',
//   ERROR_INVALID_CHANGE = 'error-invalid-change',
//   ERROR_INVALID_CONTENT = 'error-invalid-content',
//   REMOVE_END_TRACK = 'remove-end-track',
//   USER_SELECT = 'userSelect'
// }

// export class Editor {
//   constructor (options: EditorOptions)

//   public Events: Events

//   render (element: Element, options: EditorRenderOptions): void
//   getContent (): Promise<string>
//   setContent (content: string): void
//   /**
//    * 使编辑器变为可写
//    */
//   enable (): void
//   /**
//    * 禁用编辑器可写
//    */
//   disable (): void
// }

// declare function renderDocumentPro (options: { container: HTMLElement }): Editor

declare namespace DocumentPro {
  enum Events {
    CHANGE = 'change',
    ERROR_INVALID_CHANGE = 'error-invalid-change',
    ERROR_INVALID_CONTENT = 'error-invalid-content',
    REMOVE_END_TRACK = 'remove-end-track',
    USER_SELECT = 'userSelect'
  }

  interface EditorOptions extends BaseEditor.EditorOptions {
    user: ShimoSDK.User
    file: ShimoSDK.File
    permissions?: {
      commentable?: boolean
      copyable?: boolean
      editable?: boolean
      watermark?: boolean
      exportable?: boolean
    }
  }

  interface EditorRenderOptions {
    /**
     * 设置文档是否可编辑
     */
    editable?: boolean
  }

  class Editor {
    constructor (options: EditorOptions)

    public Events: Events

    render (element: Element, options: EditorRenderOptions): void
    getContent (): Promise<string>
    setContent (content: string): void
    /**
     * 使编辑器变为可写
     */
    enable (): void
    /**
     * 禁用编辑器可写
     */
    disable (): void
  }

  type renderDocumentPro = (options: { container: HTMLElement }) => Editor
}

export = DocumentPro
