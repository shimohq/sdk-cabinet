import { EventEmitter } from 'eventemitter3'
import Editor from '../../editor/editor'
import { BasePluginOptions } from '../../editor'

export interface CollaboratorsOptions extends BasePluginOptions {}

export default class Collaborators extends EventEmitter {
  constructor (options: Collaborators);
}
