import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export declare const pluginName = 'HistorySidebarSkeleton'
export declare enum HistoryTabType {
  History = 'history',
  Discord = 'discord',
  Version = 'version'
}
export interface HistorySidebarSkeletonOptions extends BasePluginOptions {
  /**
   * 历史列表渲染的容器元素
   */
  container?: HTMLElement

  /**
   * 文件 GUID，由内部模块处理，外部不需要配置
   */
  guid?: string

  /**
   * 当前用户 ID，由内部模块处理，外部不需要配置
   */
  currentUserId?: string

  /**
   * 历史相关的 API 地址，一般由内部模块处理，外部不需要配置
   */
  history?: {
    loadHistoryUrl: string
    revertUrl: string
    snapshotUrl: string
    loadStepsUrl: string

    /**
     * 联系人列表 API
     */
    contactUrl: string
  }

  /**
   * 版本相关的 API 地址，一般由内部模块处理，外部不需要配置
   */
  version?: {
    loadHistoryUrl: string
    loadVersionListUrl: string
    revertVersionUrl: string
    deleteVersionUrl: string
    updateVersionUrl: string
    snapshotUrl: string
    loadStepsUrl: string

    /**
     * 是否能编辑版本条目
     */
    canManageVersionItem: boolean
  }
}

export default class HistorySidebarSkeleton {
  constructor (options: HistorySidebarSkeletonOptions);
  render (container: HTMLElement): void
  show (): void
  hide (): void
}
