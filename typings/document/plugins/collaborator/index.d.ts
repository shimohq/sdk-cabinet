import Editor from '../../editor'
import { IUser } from '../../../global'
import { EventEmitter } from 'eventemitter3'
import Collaboration from '../../../common/collaboration'

declare enum Events {
    SHOW = 'SHOW',
    HIDE = 'HIDE',
    UPDATE = 'UPDATE'
}

export interface CollaboratorOptions {
  editor: Editor
  user: IUser
  service: {
    user: string;
  }
  avatarTrack: boolean
  cursorTrack: boolean
}

export default class Collaborator extends EventEmitter<Events> {
  constructor (options: CollaboratorOptions);
  render (collab: Collaboration): void
  show (): void
  hide (): void
  destroy (): void
}
