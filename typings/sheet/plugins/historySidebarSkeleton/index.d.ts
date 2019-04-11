import Editor from '../../editor';
export declare const pluginName = "HistorySidebarSkeleton";
export declare enum HistoryTabType {
    History = "history",
    Discord = "discord",
    Version = "version"
}
export interface HistorySidebarSkeletonOptions {
    editor: Editor
    container: HTMLElement
    guid: string
    currentUserId: string
    history?: {
        loadHistoryUrl: string
        revertUrl: string
        snapshotUrl: string
        loadStepsUrl: string
        contactUrl: string
    }
    version?: {
        loadHistoryUrl: string
        loadVersionListUrl: string
        revertVersionUrl: string
        deleteVersionUrl: string
        updateVersionUrl: string
        snapshotUrl: string
        loadStepsUrl: string
        canManageVersionItem: boolean
    }
}
export default class HistorySidebarSkeleton {
    constructor(options: HistorySidebarSkeletonOptions);
    render(container: HTMLElement): void;
    show(): void;
    hide(): void;
}
export {};
