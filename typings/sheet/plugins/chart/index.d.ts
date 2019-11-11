import Editor from '../../editor'
import { BasePluginOptions } from '../../editor'

export interface ChartOptions extends BasePluginOptions {}

export declare const chartPluginName = 'Chart'
export default class Chart {
  constructor (options: ChartOptions);
}
export {}
