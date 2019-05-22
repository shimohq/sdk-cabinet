import EditActions from "./editActions";
import Comment from "../plugins/comment";

export interface EditorOptions {
    id: number;
    readOnly?: boolean;
}

interface ModulesToolbarOptions {
    parent?: HTMLElement;
}

export interface EditorRenderOptions {
    id: number;
    readOnly?: boolean;
    scrollingContainer?: HTMLElement;
    modules?: {
        toolbar?: boolean | ModulesToolbarOptions;
    }
    localeConfig?: {
        fetchLocaleSync?: string;
        locale?: string;
    }
 }

 declare enum Events {
    PLUGIN_LOADED = "PLUGIN_LOADED",
    CHANGE = "CHANGE",
    SELECTION = "SELECTION",
    CONTAINER_SCROLL = "CONTAINER_SCROLL",
    READY = "ready"
 }

export default class Editor {
    public editorActions: EditActions;
    public events: Events;
    comment: Comment;
    constructor(options: EditorOptions);
    render(element: Element, options: EditorRenderOptions): void;
    updateOptions(options: EditorOptions): void;
    getContent(): Promise<string>;
    setContent(content: string): void;
    applyChange(content: string): void;
    getLocale(): string;
    destroy(): void;
    on(type: string, handler: (...args: any[]) => void): any;
}