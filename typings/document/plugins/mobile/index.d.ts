import { BasePluginOptions } from '../../editor'
import Comment from '../comment/'

export interface MobileOptions extends BasePluginOptions{
  // 容器
  container?: HTMLElement
  // 编辑器容器
  editorWrap: HTMLElement
  // 是否可评论
  commentable?:	boolean

  // 评论插件实例
  comment?: Comment

  // 是否支持上传
  upload?: boolean

  // 是否启用工具栏
  toolbar?: boolean
}

export default class Mobile {
  constructor (options: MobileOptions)
}
