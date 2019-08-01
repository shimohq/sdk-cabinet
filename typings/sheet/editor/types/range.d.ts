/**
 * 范围类型枚举
 */
export declare enum RangeType {
  /**
   * 选中单元格范围
   */
  CellRange = 'CellRange',
  /**
   * 选中多行
   */
  MultipleRows = 'MultipleRows',
  /**
   * 选中多列
   */
  MultipleColumns = 'MultipleColumns',
  /**
   * 选中整个工作表
   */
  AllCells = 'AllCells'
}
/**
 * 选中一片单元格
 */
export interface CellRange {
  /**
   * 类型标识
   */
  type: RangeType.CellRange
  /**
   * 左上方单元格所在行号
   */
  row: number
  /**
   * 左上方单元格所在列号
   */
  column: number
  /**
   * 范围包含的行数
   */
  rowCount: number
  /**
   * 范围包含的列数
   */
  columnCount: number
}
/**
 * 选中多行
 */
export interface MultipleRows {
  /**
   * 类型标识
   */
  type: RangeType.MultipleRows
  /**
   * 开始的行号
   */
  start: number
  /**
   * 范围包含的行数
   */
  count: number
}
/**
 * 选中多列
 */
export interface MultipleColumns {
  /**
   * 类型标识
   */
  type: RangeType.MultipleColumns
  /**
   * 开始列号
   */
  start: number
  /**
   * 范围包含的列数
   */
  count: number
}
/**
 * 选中整个工作表
 */
export interface AllCells {
  /**
   * 类型标识
   */
  type: RangeType.AllCells
}
/**
 * 选中范围
 */
export declare type Range = CellRange | MultipleRows | MultipleColumns | AllCells
