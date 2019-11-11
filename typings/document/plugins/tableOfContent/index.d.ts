import { BasePluginOptions } from '../../editor'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
  UPDATE = 'UPDATE'
}

export interface TableOfContentOptions extends BasePluginOptions {
  container?: HTMLElement
}

export default class TableOfContent extends EventEmitter<Events> {
  constructor (options: TableOfContentOptions);
  render (container?: HTMLElement): void
  show (): void
  hide (): void
  destroy (): void
}
