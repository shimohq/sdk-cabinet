import CabinetBase from "./base";

const historyContainerTemplate = `
    <div class="history-sidebar">
        <div class="history-container">
            <div class="history-head">
                <b>历史</b>
                <a style="float: right;" class="history-close-btn" href="javascript:void(0);">关闭</a>
            </div>
            <div class="history-content" id="history-content"></div>
        </div>
    </div>
`;

const historyCSSClassTemplate = `
    .history-siderbar = {
        height: calc(100% - 45px);
    }

    .history-container {
        position: fixed;
        display: none;
        top: 100px;
        right: 10px;
        width: 340px;
        height: 100%;
        padding: 20px;
        border: 1px solid #d9d9d9;
        background: #f9f9f9;
    }

    .history-close-btn {
        text-decoration:none;
        font-size: 12px;
        color: #555;
    }
`;

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
        onSaveStatusChange: (status: ShimoSDK.Common.CollaborationStatus) => {}
    }) {
        super(options.rootDom, options.onSaveStatusChange);
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

        const toolbarContainer = this.getDom("toolbar-wrapper");

        editor.render(this.getDom("sm-editor"), {
            readOnly: !this.editorOptions.editable,
            id: this.user.id,
            localeConfig,
            modules: {
                toolbar: { parent: toolbarContainer },
            },
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

        if (!document.querySelector("history-sidebar")) {
            const style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = historyCSSClassTemplate;
            document.getElementsByTagName("head")[0].appendChild(style);

            this.rootDom.insertAdjacentHTML("afterend", historyContainerTemplate);
        }

        const history: ShimoSDK.Document.History = new this.sdkDocument.plugins.History(options);
        const historyShowContainer = this.getDom("history-content");
        history.render(historyShowContainer);

        const clickDom = this.getDom("ql-history", null, "button");
        clickDom.setAttribute("type", "button");
        clickDom.classList.add("ql-history");

        if (!this.getDom("ql-history").innerText) {
            this.getDom("ql-history").innerText = "历史";
        }

        const toolbarGroup = document.getElementsByClassName("ql-toolbar-default")[0]
            .getElementsByClassName("ql-formats");
        const toolbarContainer = toolbarGroup[toolbarGroup.length - 1];
        if (toolbarContainer) {
            toolbarContainer.appendChild(clickDom);
        }

        const historyContainer: HTMLElement = document.querySelector(".history-container");

        clickDom.addEventListener("click", () => {
            historyContainer.style.display = "block";
            editor.comment.hide();
        });

        document.querySelector(".history-close-btn").addEventListener("click", () => {
            historyContainer.style.display = "none";
            editor.comment.show();
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
            type: "richdoc",
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
        collaboration.on("saveStatusChange" as ShimoSDK.Common.CollaborationEvents, this.onSaveStatusChange);
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
        editor.comment = comment;
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
            container: "#sm-editor",
            url: this.editorOptions.uploadConfig.origin,
            accessToken: this.editorOptions.uploadConfig.token,
            type: this.editorOptions.uploadConfig.server,
        };

        const uploader: ShimoSDK.Document.Uploader = new this.sdkDocument.plugins.Uploader(options);
        uploader.on("FAIL" as ShimoSDK.Document.UploaderEvents, this.onFail);
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

    private onFail() {
        window.alert("操作失败");
    }
}
