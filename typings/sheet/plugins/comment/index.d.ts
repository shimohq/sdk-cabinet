import { CommentModel } from './comment_model'
import { CommentList } from './comment_list'
import Editor from '../../editor'
import { IUser } from '../../../global'

export interface CommentOptions {
  editor: Editor
  guid: string
  container: HTMLElement
  currentUser: IUser
  currentFileId?: number
  mentionUrl?: string
  usePollingInsteadOfSocket?: {
    interval: number
  }
  queryCommentOptions: {
    url: string
    method?: string
  }
  deleteCommentOptions: {
    url: string
    method?: string
  }
  closeCommentOptions: {
    url: string
    method?: string
  }
  createCommentOptions: {
    url: string
    method?: string
  }
  fetchLocaleSync?: Function
}
/**
 * 评论数据层: CommentModel
 * 评论列表显示层: CommentList
 */
export default class Comment {
  constructor (opt: CommentOptions);
  commentModel?: CommentModel
  init (): void
  initList (): CommentList
}
export {}
