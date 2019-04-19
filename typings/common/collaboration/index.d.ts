import { EventEmitter } from 'eventemitter3';
import * as SheetEditor from '../../sheet/editor/editor';
import * as SheetCollaborators from '../../sheet/plugins/collaborators';
import * as DocumentCollaborator from '../../document/plugins/collaborator';
import * as DocumentEditor from '../../document/editor';
import { IUser } from '../../global';

export enum Status {
    OFFLINE = "offline",
    OFFLINE_SAVING = "offlineSaving",
    OFFLINE_SAVED = "offlineSaved",
    OFFLINE_SAVE_FAILED = "offlineSaveFailed",
    ONLINE = "online",
    ONLINE_SAVING = "onlineSaving",
    ONLINE_SAVED = "onlineSaved",
    ONLINE_SAVE_FAILED = "onlineSaveFailed",
    SERVER_CHANGE_APPLIED = "serverChangeApplied"
}

export enum Events {
    error = "error",
    saveStatusChange = "saveStatusChange",
    broadcast = "broadcast",
    enter = "enter",
    leave = "leave"
}

export interface CollaborationOptions {
    type?: string;
    rev: number;
    guid: string;
    pullUrl: string;
    composeUrl: string;
    selectUrl: string;
    editor: SheetEditor.default | DocumentEditor.default;
    collaborators?: SheetCollaborators.default | DocumentCollaborator.default;
    offlineEditable?: boolean;
}

export default class Collaboration extends EventEmitter<Events> {
    public guid: string;
    constructor(options: CollaborationOptions);
    start(): void;
    destroy(): void;
    getCollaborators(): IUser[];
}