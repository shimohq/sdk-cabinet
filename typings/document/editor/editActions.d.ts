export default class EditActions {
  constructor (editor: any);
  setUndo (): void
  setRedo (): void
  setFormatPainter (value?: string | boolean): void
  setClean (): void
  setHeader (value?: string | boolean): void
  setFont (value?: string | boolean): void
  setSize (value?: string | boolean): void
  setBold (value?: boolean): void
  setItalic (value?: boolean): void
  setUnderline (value?: boolean): void
  setStrike (value?: boolean): void
  setColor (value?: string | boolean): void
  setBackground (value?: string | boolean): void
  setOrdered (value?: string | boolean): void
  setBullet (value?: string | boolean): void
  resetOrder (value: string): void
  setTask (value?: boolean | string): void
  setIndent (value?: string): void
  setAlign (value?: string | boolean): void
  setLinespace (value?: number | boolean): void
}
