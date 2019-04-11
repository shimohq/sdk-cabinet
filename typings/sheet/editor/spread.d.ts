import Editor from './editor';
import Sheet from './sheet';
/**
 * 工作簿
 */
export default class Spread {
    getActiveSheet(): Sheet;
    getSheetByIndex(index: string): Sheet;
    getSheets(): Sheet[];
    getSheetIndex(id: string): number;
    getSheet(id: string): Sheet | undefined;
    setActiveSheet(id: string): void;
    copySheet(id: string): Promise<void>;
    appendSheet(): void;
    removeSheet(id: string): void;
    renameSheet(id: string, name: string): Promise<void>;
}
export {};
