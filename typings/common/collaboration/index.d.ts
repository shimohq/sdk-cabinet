import { EventEmitter } from 'eventemitter3';
import Editor from '../../sheet/editor/editor';
import { User } from '../..';
import Events from './events';
import Collaborators from '../../sheet/plugins/collaborators';

export interface CollaborationOptions {
    rev: number;
    guid: string;
    pullurl: string;
    composeUrl: string;
    selectUrl: string;
    editor: Editor;
    collaborators?: Collaborators;
    offlineEditable?: boolean;
}

export default class Collaboration extends EventEmitter<Events> {
    public guid: string;
    constructor(options: CollaborationOptions);
    start(): void;
    destroy(): void;
    getCollaborators(): User[];
}