/**
 * 单元格样式声明对象
 */
export interface CellStyleDeclaration {
  bold?: boolean | null
  italic?: boolean | null
  underline?: boolean | null
  strike?: boolean | null
  background?: string | null
  color?: string | null
  wrap?: 'text-wrap' | 'text-no-wrap' | 'text-linebreak-overflow' | null
  align?: 'left' | 'center' | 'right' | null
  vertical?: 'top' | 'middle' | 'bottom' | null
  backgroundImage?: string | null
}
