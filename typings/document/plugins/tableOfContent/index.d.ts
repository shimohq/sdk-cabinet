import Editor from '../../editor'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
  UPDATE = 'UPDATE'
}

export interface TableOfContentOptions {
  editor: Editor
}

export default class TableOfContent extends EventEmitter<Events> {
  constructor (options: TableOfContentOptions);
  render (container?: HTMLElement): void
  show (): void
  hide (): void
  destroy (): void
}
