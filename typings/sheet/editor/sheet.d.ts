import { Direction } from './types/direction';
import { CellStyleDeclaration } from './types/style';
import Spread from './spread';
/**
 * 工作表
 */
export default class Sheet {
    getRowCount(): number;
    getColumnCount(): number;
    setActiveCell(row: number, column: number): void;
    addRows(index: number, count: number, direction: Direction.Up | Direction.Down): void;
    addColumns(index: number, count: number, direction: Direction.Left | Direction.Right): void;
    removeRows(start: number, removeCount: number): void;
    removeColumns(start: number, removeCount: number): void;
    search(substr: string): any[];
    setValue(row: number, column: number, value: any): void;
    getValue(row: number, column: number): any;
    setStyle(row: number, column: number, style: CellStyleDeclaration): void;
    getStyle(row: number, column: number): CellStyleDeclaration;
}
