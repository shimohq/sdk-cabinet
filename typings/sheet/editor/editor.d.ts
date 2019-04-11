import { EventEmitter } from 'eventemitter3';
import Events from './events';
import ToolbarEvents from '../plugins/toolbar/events';
import Spread from './spread';
type AllEvents = Events | ToolbarEvents;

/**
 * 编辑器构造参数
 */
export interface EditorOptions {
    editable?: boolean
    commentable?: boolean
    disableRenderOptimization?: boolean
    localeConfig?: {
        fetchLocaleSync: string
        locale: string
    }
    uploadConfig?: {
        origin: string
        server: string
        token: string
    }
    downloadConfig?: {
        origin?: string
    }
}
/*
* 表格编辑器渲染参数
*/
export interface EditorRenderOptions {
   content: string;
   container: HTMLElement;
   activeSheetId?: string;
}

/**
 * 表格编辑器
 */
export default class Editor extends EventEmitter<AllEvents> {
    constructor(options?: EditorOptions);
    spread: Spread;
    isRendered: boolean;
    render(options: EditorRenderOptions): void;
    setContent(content: string): void;
    getContent(): Promise<string>;
    destroy(): void;
    destory(): void;
    getLocale(): string;
    undo(): Promise<void>;
    redo(): Promise<void>;
}