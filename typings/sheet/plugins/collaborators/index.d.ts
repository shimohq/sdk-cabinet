import { EventEmitter } from 'eventemitter3';
import Editor from '../../editor/editor';

export interface CollaboratorsOptions {
    editor: Editor;
}

export default class Collaborators extends EventEmitter {
    constructor(options: Collaborators);
}