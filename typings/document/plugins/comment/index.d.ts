import { BasePluginOptions } from '../../editor'
import { IUser, IFile } from '../../../global'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  ERROR = 'ERROR',
  CLOSE_GROUP = 'CLOSE_GROUP',
  CREATED = 'CREATED',
  CLOSE = 'CLOSE'
}

export interface CommentOptions extends BasePluginOptions{
  /**
   * 更新评论的间隔，单位毫秒，默认 10000
   */
  updateDuration?: number

  /**
   * 设置评论空间的 CSS 层级
   */
  zIndex?: number

  /**
   * 用户实例，由内部模块处理，外部不需要配置
   */
  user: IUser

  /**
   * 内部 API 地址，一般由内部模块处理，外部不需要配置
   */
  service?: {
    fetch?: string;
    create?: string;
    delete?: string;
    close?: string;
  }

  /**
   * 是否开启 @ 功能，默认 true
   */
  mentionable?: boolean

  /**
   * @ 功能配置参数
   */
  mention?: {
    /**
     * API 地址，一般由内部模块处理，外部不需要配置
     */
    service: {
      /**
       * 最近联系人 API
       */
      recentContacts: string;

      /**
       * 最近使用文件，暂无实际效果
       */
      recentFiles: string;

      /**
       * 搜索 API，暂无实际效果
       */
      searchApi: string;
    },

    /**
     * 文件实例，由内部模块处理，外部不需要配置
     */
    file: IFile
  }
}

export default class Comment extends EventEmitter<Events> {
  constructor (options: CommentOptions);
  render (container?: HTMLElement): void
  update (): void
  show (): void
  hide (): void
  destroy (): void
}
