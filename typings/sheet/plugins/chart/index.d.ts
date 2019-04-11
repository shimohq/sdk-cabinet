import Editor from "../../editor";

export interface ChartOptions {
    editor: Editor;
}
export declare const chartPluginName = "Chart";
export default class Chart {
    constructor(options: ChartOptions);
}
export {};
