import Editor from "../../editor";
import { IUser, IFile } from "../../../global";
import { EventEmitter } from "eventemitter3";

declare enum Events {
    ERROR = "ERROR",
    CLOSE_GROUP = "CLOSE_GROUP",
    CREATED = "CREATED",
    CLOSE = "CLOSE"
}

export interface CommentOptions {
    editor: Editor;
    updateDuration?: number;
    zIndex?: number;
    user: IUser;
    service?: {
        fetch?: string;
        create?: string;
        delete?: string;
        close?: string;
    };
    mentionable?: boolean;
    mention?: {
        service: {
            recentContacts: string;
            recentFiles: string;
            searchApi: string;
        },
        user: IUser,
        file: IFile
    }
}

export default class Comment extends EventEmitter<Events> {
    constructor(options: CommentOptions);
    render(container?: HTMLElement): void;
    update(): void;
    show(): void;
    hide(): void;
    destroy(): void;
}