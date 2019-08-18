import { EventEmitter } from 'eventemitter3'
import SheetEditor from '../../sheet/editor/editor'
import * as SheetCollaborators from '../../sheet/plugins/collaborators'
import * as DocumentCollaborator from '../../document/plugins/collaborator'
import DocumentEditor from '../../document/editor'
import { IUser } from '../../global'

export enum Status {
  OFFLINE = 'offline',
  OFFLINE_SAVING = 'offlineSaving',
  OFFLINE_SAVED = 'offlineSaved',
  OFFLINE_SAVE_FAILED = 'offlineSaveFailed',
  ONLINE = 'online',
  ONLINE_SAVING = 'onlineSaving',
  ONLINE_SAVED = 'onlineSaved',
  ONLINE_SAVE_FAILED = 'onlineSaveFailed',
  SERVER_CHANGE_APPLIED = 'serverChangeApplied'
}

export enum Events {
  error = 'error',
  saveStatusChange = 'saveStatusChange',
  broadcast = 'broadcast',
  enter = 'enter',
  leave = 'leave'
}

export interface CollaborationOptions {
  /**
   * 内容类型，由内部模块处理，外部不需要配置
   */
  type?: string

  /**
   * 版本号，由内部模块处理，外部不需要配置
   */
  rev: number

  /**
   * 文件 GUID，由内部模块处理，外部不需要配置
   */
  guid: string

  /**
   * Pull API，由内部模块处理，外部不需要配置
   */
  pullUrl: string

  /**
   * Compose API，由内部模块处理，外部不需要配置
   */
  composeUrl: string

  /**
   * Select API，由内部模块处理，外部不需要配置
   */
  selectUrl: string

  /**
   * Editor 实例，由内部模块处理，外部不需要配置
   */
  editor: SheetEditor | DocumentEditor

  /**
   * 协作者实例，一般由内部模块处理，外部不需要配置
   */
  collaborators?: SheetCollaborators.default | DocumentCollaborator.default

  /**
   * 离线编辑开关，目前无任何效果
   */
  offlineEditable?: boolean

  /**
   * 用于自定义保存状态的显示，如「正在保存」、「保存成功」的切换
   */
  onSaveStatusChange?: (status: ShimoSDK.Common.CollaborationStatus) => void
}

export default class Collaboration extends EventEmitter<Events> {
  public guid: string
  constructor (options: CollaborationOptions);
  start (): void
  destroy (): void
  getCollaborators (): IUser[]
}
