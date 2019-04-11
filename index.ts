"use strict";

import { File, User } from "./typings";
import Collaboration, { CollaborationOptions } from "./typings/common/collaboration";
import Editor, { EditorOptions } from "./typings/sheet/editor";
import { ChartOptions } from "./typings/sheet/plugins/chart";
import { CollaboratorsOptions } from "./typings/sheet/plugins/collaborators";
import Comment, { CommentOptions } from "./typings/sheet/plugins/comment";
import SheetContextmenu, { SheetContextmenuOptions } from "./typings/sheet/plugins/contextmenu";
import { FillOptions } from "./typings/sheet/plugins/fill";
import { FilterViewportOptions } from "./typings/sheet/plugins/filterViewport";
import FormulaSidebar, { FormulaSidebarOptions } from "./typings/sheet/plugins/formulaSidebar";
import HistorySidebarSkeleton, { HistorySidebarSkeletonOptions } from "./typings/sheet/plugins/historySidebarSkeleton";
import { ShortcutOptions } from "./typings/sheet/plugins/shortcut";
import Toolbar, { ToolbarOptions } from "./typings/sheet/plugins/toolbar";

declare global {
// tslint:disable-next-line: interface-name
    interface Window {
        shimo: {
            editor: Editor;
        };
    }
}

export default class Shimo {
    private sdkSheet: any;
    private sdkCommon: any;
    private rootDom: HTMLElement;
    private user: User;
    private entrypoint: string;
    private token: string;
    private file: File;
    private editorOptions: EditorOptions;
    private plugins: string[];

    constructor(options: {
        sdkSheet: any;
        sdkCommon: any;
        user: User;
        entrypoint: string;
        token: string;
        file: File;
        editorOptions: EditorOptions;
        plugins: string[];
    }) {
        this.sdkSheet = options.sdkSheet;
        this.sdkCommon = options.sdkCommon;
        this.user = options.user;
        this.entrypoint = options.entrypoint;
        this.token = options.token;
        this.file = options.file;
        this.editorOptions = options.editorOptions;
        this.plugins =  this.sortPlugins(options.plugins);
    }

    public render(): void {
        const editor = this.initEditor(this.editorOptions);
        for (const plugin of this.plugins) {
            if (plugin !== "Editor") {
                this[`init${plugin}`](editor);
            }
            editor.render({
                content: this.file.content,
                container: this.getDom("sm-editor"),
            });
        }

        window.shimo = { editor };
    }

    public initEditor(options: EditorOptions): Editor {
        return new this.sdkSheet.Editor(options);
    }

    public initToolbar(editor: Editor): void {
        const toolbarOptions: ToolbarOptions = { editor };
        const toolbar: Toolbar = new this.sdkSheet.plugins.Toolbar(toolbarOptions);
        toolbar.render({
            container: this.getDom("sm-toolbar"),
        });
    }

    public initContextMenu(editor: Editor): void {
        const contextMenuOptions: SheetContextmenuOptions = { editor };
        const contextMenu: SheetContextmenu = new this.sdkSheet.plugins.ContextMenu(contextMenuOptions);
        contextMenu.render({
            container: this.getDom("sm-contextmenu"),
        });
    }

    public initComment(editor: Editor): void {
        const commentOptions: CommentOptions = {
            editor,
            container: this.getDom("sm-comment"),
            currentUser: this.user,
            guid: this.file.guid,
            usePollingInsteadOfSocket: {
                interval: 1000,
            },
            queryCommentOptions: {
                url: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}&_legacy=1`,
            },
            deleteCommentOptions: {
                url: `${this.entrypoint}/files/${this.file.guid}
                    /comments/{comment-id}?accessToken=${this.token}&_legacy=1`,
            },
            closeCommentOptions: {
                url: `${this.entrypoint}/comments/closeComments?accessToken=${this.token}&_legacy=1`,
            },
            createCommentOptions: {
                url: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}&_legacy=1`,
            },
            fetchLocaleSync: (locale) => {
                // 插件默认会将翻译资源打包在代码中，放在 window.shimo.sdk.sheet.plugins.CommentLocaleResources，也可以自己提供翻译资源
                return this.sdkSheet.plugins.CommentLocaleResources[locale];
            },
        };
        const comment: Comment = new this.sdkSheet.plugins.Comment(commentOptions);
        comment.init();
    }

    public initHistorySidebarSkeleton(editor: Editor): void {
        const historySidebarSkeletonOptions: HistorySidebarSkeletonOptions = {
            editor,
            container: this.getDom("sm-sidebar-container"),
            guid: this.file.guid,
            currentUserId: `${this.user.id}`,
            history: {
                loadHistoryUrl: `${this.entrypoint}/files/${this.file.guid}/
                    histories?accessToken=${this.token}&_legacy=1`,
                revertUrl: `${this.entrypoint}/files/${this.file.guid}/revert?accessToken=${this.token}&_legacy=1`,
                snapshotUrl: `${this.entrypoint}/files/${this.file.guid}/snapshot?accessToken=${this.token}&_legacy=1`,
                loadStepsUrl: `${this.entrypoint}/files/${this.file.guid}/
                    changes?from={from}&to={to}&accessToken=${this.token}&_legacy=1`,
                contactUrl: `${this.entrypoint}/users?accessToken=${this.token}&_legacy=1`,
            },
        };
        const historySidebarSkeleton: HistorySidebarSkeleton =
            new this.sdkSheet.plugins.HistorySidebarSkeleton(historySidebarSkeletonOptions);
        const clickDom = this.getDom("sm-click-history");
        clickDom.addEventListener("click", () => {
            historySidebarSkeleton.show();
        });
    }

    public initFormulaSidebar(editor: Editor): void {
        const formulaSidebarOptions: FormulaSidebarOptions = {
            editor,
            container: this.getDom("sm-sidebar-container"),
        };
        const formulaSidebar: FormulaSidebar = new this.sdkSheet.plugins.FormulaSidebar(formulaSidebarOptions);
        const clickDom = this.getDom("sm-click-formula");
        clickDom.addEventListener("click", () => {
            formulaSidebar.show();
        });
    }

    public initShortcut(editor: Editor): void {
        const shortcutOptions: ShortcutOptions = { editor };
        new this.sdkSheet.plugins.Shortcut(shortcutOptions);
    }

    public initChart(editor: Editor): void {
        const chartOptions: ChartOptions = { editor };
        new this.sdkSheet.plugins.Chart(chartOptions);
    }

    public initFill(editor: Editor): void {
        const fillOptions: FillOptions = { editor };
        new this.sdkSheet.plugins.Fill(fillOptions);
    }

    public initFilterViewport(editor: Editor): void {
        const filterViewportOptions: FilterViewportOptions = { editor };
        new this.sdkSheet.plugins.FilterViewport(filterViewportOptions);
    }

    public initCollaboration(editor: Editor): void {
        const collaboratorsOptions: CollaboratorsOptions = { editor };
        const collaborators = new this.sdkSheet.plugins.Collaborators(collaboratorsOptions);

        const collaborationOptions: CollaborationOptions = {
            editor,
            rev: this.file.head,
            guid: this.file.guid,
            pullurl: `${this.entrypoint}/files/${this.file.guid}/pull?accessToken=${this.token}`,
            composeUrl: `${this.entrypoint}/files/${this.file.guid}/compose?accessToken=${this.token}`,
            selectUrl: `${this.entrypoint}/files/${this.file.guid}/select?accessToken=${this.token}`,
            collaborators,
            offlineEditable: false,
        };
        const collaboration: Collaboration = new this.sdkCommon.Collaboration(collaborationOptions);
        collaboration.start();
    }

    public getDom(domId: string) {
        let sdkDom = document.getElementById(domId);
        if (!sdkDom) {
            sdkDom = document.createElement("div");
            sdkDom.setAttribute("id", domId);
            this.rootDom.appendChild(sdkDom);
        }
        return sdkDom;
    }

    public sortPlugins(plugins: string[]) {
        const sortedPlugins = ["Toolbar",
        "ContextMenu",
        "Shortcut",
        "Comment",
        "Editor",
        "Collaboration",
        "HistorySidebarSkeleton",
        "FormulaSidebar",
        "Shortcut",
        "Chart",
        "Fill",
        "FilterViewport"];
        const commingPlugins = new Set(plugins);
        const selectedPlugins: string[] = [];

        for (const sortedPlugin of sortedPlugins) {
            if (commingPlugins.has(sortedPlugin) || sortedPlugin === "Editor") {
                selectedPlugins.push(sortedPlugin);
            }
        }

        return selectedPlugins;
    }
}
