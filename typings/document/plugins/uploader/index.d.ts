import Editor from '../../editor'
import { EventEmitter } from 'eventemitter3'

declare enum Events {
  START = 'START',
  CANCEL = 'CANCEL',
  SENDING = 'SENDING',
  PROCESS = 'PROCESS',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL'
}

export interface UploaderOptions {
  editor: Editor
  container: Element | string
  type?: string
  url?: string
  tokenUrl?: string
  accessToken?: string
  paramName?: string
  params?: object
}

export default class Uploader extends EventEmitter<Events> {
  constructor (options: UploaderOptions);
  destroy (): void
}
