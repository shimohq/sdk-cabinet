import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface FillOptions extends BasePluginOptions {}

export declare const fillPluginName = 'Fill'
export default class Fill {
  constructor (options: FillOptions);
}
export {}
