import Editor from "../../editor";

export interface HistoryOptions {
    editor: Editor;
    guid: string;
    height: string;
    service?: {
        fetch?: string;
        revert?: string;
        user?: string;
    }
}

export interface HistoryRenderOptions {
    container: HTMLElement;
}

export default class History {
    constructor(options: HistoryOptions);
    public render(HistoryRenderOptions): void;
    public update(): void;
    public show(): void;
    public hide(): void;
    public destroy(): void;
}