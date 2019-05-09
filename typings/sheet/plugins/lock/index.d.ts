import Editor from "../../editor";

interface PermissionConfig {
    read: boolean;
    edit: boolean;
    comment: boolean;
    lock: boolean;
    manage: boolean;
}

interface Collaborator {
    id: number;
    email?: number;
    avatar?: string;
    name: string;
    namePinyin?: string;
    permission: PermissionConfig;
    displayRole?: string | undefined;
}

export interface LockOptions {
    editor: Editor;
    currentUser: {
        id: number
    };
    permission: PermissionConfig;
    fetchCollaborators: string;
}
export default class Lock {
    constructor(opts: LockOptions);
}
