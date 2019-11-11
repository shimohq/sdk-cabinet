import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

interface PermissionConfig {
  /**
   * 是否允许读
   */
  read: boolean

  /**
   * 是否允许修改
   */
  edit: boolean

  /**
   * 是否允许评论
   */
  comment: boolean

  /**
   * 是否允许操作工作表锁和范围锁
   * 启用后，将允许用户创建锁，以及编辑、删除自己创建的锁，
   * 但不允许修改、删除他人创建的锁（除非具备管理者权限）
   */
  lock: boolean

  /**
   * 是否具备文件管理者权限
   * - 默认允许读、修改、评论
   * - 允许编辑、删除其他用户创建的锁 (*存在例外)
   * - 不会被锁
   *   - 创建新锁时，无法将管理者锁定为「只读」或「不可见」权限
   *   - 已有的锁不对当前用户生效 (*存在例外)
   * (*): 如果已有的锁对该用户计算为「不可见」权限时，则依然生效（内容不可见，锁不可编辑、不可删除）
   */
  manage: boolean
}

interface Collaborator {
  /**
   * 石墨系统中的协作者用户 ID
   */
  id: number
  email?: number
  avatar?: string
  name: string
  namePinyin?: string
  permission: PermissionConfig

  /**
   * 对当前文件的角色
   * 可以是任意文本，如`管理员`，`所有者`, `创建者`等，用于锁定对话框中用户身份展示，不用于权限判断
   */
  displayRole?: string | undefined
}

export type FetchCollaboratorsCallback = () => Promise<Collaborator[]>

export interface LockOptions extends BasePluginOptions {
  currentUser: {
    id: number
  }
  permission: PermissionConfig

  /**
   * 获取文件协作者列表的 API 地址或异步方法
   */
  fetchCollaborators?: string | FetchCollaboratorsCallback
}
export default class Lock {
  constructor (opts: LockOptions);
}
