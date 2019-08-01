import Editor from '../../editor'

export interface FillOptions {
  editor: Editor
}
export declare const fillPluginName = 'Fill'
export default class Fill {
  constructor (options: FillOptions);
}
export {}
