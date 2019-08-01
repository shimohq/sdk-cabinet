import Editor from '../../editor'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  SHOW = 'SHOW',
  HIDE = 'HIDE'
}

export interface DemoScreenOptions {
  editor: Editor
}

export default class DemoScreen extends EventEmitter<Events> {
  constructor (options: DemoScreenOptions);
  show (): void
  hide (): void
  destroy (): void
}
