import Editor from '../../editor';
export interface SheetContextmenuOptions {
    editor: Editor;
}
interface SheetContextmenuRenderOptions {
    container?: Element;
}
export default class SheetContextmenu {
    constructor(opts: SheetContextmenuOptions);
    render(config: SheetContextmenuRenderOptions): void;
}
export {};
