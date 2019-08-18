import { BasePluginOptions } from '../../editor'
import { IUser } from '../../../global'
import { EventEmitter } from 'eventemitter3'
import Collaboration from '../../../common/collaboration'

declare enum Events {
    SHOW = 'SHOW',
    HIDE = 'HIDE',
    UPDATE = 'UPDATE'
}

export interface CollaboratorOptions extends BasePluginOptions {
  /**
   * 用户实例，由内部模块处理，外部不需要配置
   */
  user: IUser

  /**
   * 内部 API 地址，一般由内部模块处理，外部不需要配置
   */
  service: {
    /**
     * 获取用户 API，一般由内部模块处理，外部不需要配置
     */
    user: string;
  }

  /**
   * 是否显示左侧协作者头像追踪
   */
  avatarTrack: boolean

  /**
   * 是否显示协作者光标位置追踪
   */
  cursorTrack: boolean
}

export default class Collaborator extends EventEmitter<Events> {
  constructor (options: CollaboratorOptions);
  render (collab: Collaboration): void
  show (): void
  hide (): void
  destroy (): void
}
