import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface FilterViewportOptions extends BasePluginOptions {}

/**
 * 筛选视图插件
 */
export default class FilterViewport {
  constructor (opts: FilterViewportOptions);
}
