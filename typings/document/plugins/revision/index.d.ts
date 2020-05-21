import { BasePluginOptions } from '../../editor'
import { IUser, IFile } from '../../../global'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  ERROR = 'ERROR',
  CLOSE_GROUP = 'CLOSE_GROUP',
  CREATED = 'CREATED',
  CLOSE = 'CLOSE'
}

export interface RevisionOptions extends BasePluginOptions{
  /**
   * 目标文档 GUID
   */
  guid: string

  /**
   * 当前用户信息
   */
  authorInfo: {
    user: IUser
  }

  /**
   * 版本列表为空时显示的信息
   */
  tips?: string[]

  /**
   * 用户实例，由内部模块处理，外部不需要配置
   */
  user: IUser

  /**
   * 内部 API 地址，一般由内部模块处理，外部不需要配置
   */
  service?: {
    length?: string
    fetch?: string
    fetchTitle?: string
    postRename?: string
    revert?: string
    generate?: string
    delete?: string
    fetchContent?: string
  }

  /**
   * 如需要自定义按钮时，可关闭内建的按钮
   */
  disableDefaultButtons: boolean
}

export default class Revision extends EventEmitter<Events> {
  constructor (options: RevisionOptions);
  render (container?: HTMLElement): void
  update (): void
  show (): void
  hide (): void
  destroy (): void
  save (msg?: string): void
}
