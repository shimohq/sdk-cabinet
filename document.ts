import CabinetBase from "./base";

export default class ShimoDocumentCabinet extends CabinetBase {
    private sdkCommon: any;
    private sdkDocument: any;
    private user: ShimoSDK.User;
    private editorOptions: ShimoSDK.Sheet.EditorOptions;
    private file: ShimoSDK.File;
    private entrypoint: string;
    private token: string;
    private plugins: string[];

    constructor(options: {
        rootDom: HTMLElement;
        sdkDocument: any;
        sdkCommon: any;
        user: ShimoSDK.User;
        entrypoint: string;
        token: string;
        file: ShimoSDK.File;
        editorOptions: ShimoSDK.Sheet.EditorOptions;
        plugins: string[];
    }) {
        super(options.rootDom);
        this.sdkCommon = options.sdkCommon;
        this.sdkDocument = options.sdkDocument;
        this.user = options.user;
        this.editorOptions = options.editorOptions,
        this.file = options.file;
        this.entrypoint = options.entrypoint;
        this.token = options.token;
        this.plugins = this.sortPlugins(options.plugins);
    }

    public render() {
        const editor = this.initEditor();
        let localeConfig;
        if (this.editorOptions.localeConfig) {
            localeConfig = this.editorOptions.localeConfig;
        }
        if (typeof this.editorOptions.editable === "undefined") {
            this.editorOptions.editable = true;
        }
        editor.render(this.getDom("editor"), {
            readOnly: !this.editorOptions.editable,
            id: this.user.id,
            localeConfig,
        });
        editor.setContent(this.file.content);
        for (const plugin of this.plugins) {
            this[`init${plugin}`](editor);
        }

        return editor;
    }

    public initEditor(): ShimoSDK.Document.Editor {
        const options: ShimoSDK.Document.EditorOptions = {
            id: this.user.id,
            readOnly: !this.editorOptions.editable,
        };
        return new this.sdkDocument.Editor(options);
    }

    public initGallery(editor: ShimoSDK.Document.Editor): void {
        const options: ShimoSDK.Document.GalleryOptions = {
            editor,
            downloadServer: this.editorOptions.downloadConfig.origin,
        };
        const gallery: ShimoSDK.Document.Gallery = new this.sdkDocument.plugins.Gallery(options);
        gallery.render();
    }

    public initHistory(editor: ShimoSDK.Document.Editor, height: string): void {
        const options: ShimoSDK.Document.HistoryOptions = {
            editor,
            guid: this.file.guid,
            height,
            service: {
                fetch: `${this.entrypoint}/files/${this.file.guid}/` +
                    `histories?accessToken=${this.token}`,
                revert: `${this.entrypoint}/files/${this.file.guid}/revert?accessToken=${this.token}`,
                user: `${this.entrypoint}/users?accessToken=${this.token}`,
            },
        };

        const history: ShimoSDK.Document.History = new this.sdkDocument.plugins.History(options);
        const clickDom = this.getDom("external-actions").appendChild(this.getDom("external-actions-history"));
        if (!this.getDom("external-actions-history").innerText) {
            this.getDom("external-actions-history").innerText = "历史";
        }

        clickDom.addEventListener("click", () => {
            history.show();
        });
    }

    public initTableOfContent(editor: ShimoSDK.Document.Editor): void {
        const options: ShimoSDK.Document.TableOfContentOptions  = {
            editor,
        };

        const tableOfContent: ShimoSDK.Document.TableOfContent = new this.sdkDocument.plugins.TableOfContent(options);
        tableOfContent.render();
    }

    public initCollaboration(editor: ShimoSDK.Document.Editor): void {
        const options: ShimoSDK.Document.CollaboratorsOptions = {
            editor,
            user: this.user,
            service: {
                user: `${this.entrypoint}/users?accessToken=${this.token}`,
            },
            avatarTrack: true,
            cursorTrack: true,
        };

        const collaborators: ShimoSDK.Document.Collaborator
            = new this.sdkDocument.plugins.Collaborator(options);
        const collaborationOptions: ShimoSDK.Common.CollaborationOptions = {
            editor,
            rev: this.file.head,
            guid: this.file.guid,
            pullUrl: `${this.entrypoint}/files/${this.file.guid}/pull?accessToken=${this.token}`,
            composeUrl: `${this.entrypoint}/files/${this.file.guid}/compose?accessToken=${this.token}`,
            selectUrl: `${this.entrypoint}/files/${this.file.guid}/select?accessToken=${this.token}`,
            collaborators,
            offlineEditable: false,
        };
        const collaboration: ShimoSDK.Common.Collaboration = new this.sdkCommon.Collaboration(collaborationOptions);
        collaboration.start();
        collaborators.render(collaboration);
    }

    public initComment(editor: ShimoSDK.Document.Editor): void {
        const options: ShimoSDK.Document.CommentOptions = {
            editor,
            user: this.user,
            service: {
                fetch: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}`,
                create: `${this.entrypoint}/files/${this.file.guid}/comments?accessToken=${this.token}`,
                delete: `${this.entrypoint}/files/${this.file.guid}/comments/{commentGuid}?accessToken=${this.token}`,
                close: `${this.entrypoint}/files/${this.file.guid}/` +
                    `comments/close/{selectionGuid}?accessToken=${this.token}`,
            },
            mentionable: false,
        };

        const comment: ShimoSDK.Document.Comment = new this.sdkDocument.plugins.Comment(options);
        comment.render();
        comment.show();
    }

    public initDemoScreen(editor: ShimoSDK.Document.Editor): ShimoSDK.Document.DemoScreen {
        const options: ShimoSDK.Document.DemoScreenOptions = { editor };

        const demoScreen: ShimoSDK.Document.DemoScreen = new this.sdkDocument.plugins.DemoScreen(options);
        return demoScreen;
    }

    public initUploader(editor: ShimoSDK.Document.Editor): ShimoSDK.Document.Uploader {
        const options: ShimoSDK.Document.UploaderOptions = {
            editor,
            container: "#editor",
            url: this.editorOptions.uploadConfig.origin,
            tokenUrl: this.editorOptions.uploadConfig.token,
        };

        const uploader: ShimoSDK.Document.Uploader = new this.sdkDocument.plugins.Uploader(options);
        return uploader;
    }

    public initShortcut(editor: ShimoSDK.Document.Editor): void {
        const options: ShimoSDK.Document.ShortcutOptions = {
            editor,
            plugins: {
                demoScreen: null,
                revision: null,
                history: null,
                tableOfContent: null,
            },
        };

        const shortcut: ShimoSDK.Document.Shortcut = new this.sdkDocument.plugins.Shortcut(options);
        shortcut.render();
    }

    private sortPlugins(plugins: string[]) {
        const sortedPlugins = ["Collaboration",
            "Comment",
            "History",
            "Uploader",
            "Gallery",
            "TableOfContent",
            "Shortcut",
        ];
        const commingPlugins = new Set(plugins);
        const selectedPlugins: string[] = [];

        for (const sortedPlugin of sortedPlugins) {
            if (commingPlugins.has(sortedPlugin)) {
                selectedPlugins.push(sortedPlugin);
            }
        }

        return selectedPlugins;
    }
}
