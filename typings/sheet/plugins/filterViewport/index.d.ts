import Editor from "../../editor";

export interface FilterViewportOptions {
    editor: Editor;
}
/**
 * 筛选视图插件
 */
export default class FilterViewport {
    constructor(opts: FilterViewportOptions);
}
export {};
