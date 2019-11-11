export interface EditorOptions {
  /**
   * 是否有编辑权限
   */
  editable: boolean

  /**
   * 是否有评论权限，目前需和 editable 一致
   */
  commentable: boolean

  /**
   * 文件上传插件的配置
   */
  uploadConfig?: {
    origin: string
    server: string
    token: string
    maxFileSize?: number
  }

  /**
   * i18n 配置
   */
  localeConfig?: {
    /**
     * 启用的语言，默认 'zh-CN'
     */
    locale: string
  }
}
