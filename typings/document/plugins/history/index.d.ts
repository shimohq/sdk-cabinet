import { BasePluginOptions } from '../../editor'

export interface HistoryOptions extends BasePluginOptions {
  guid: string
  height?: string
  service?: {
    fetch?: string;
    revert?: string;
    user?: string;
  },
  container?: HTMLElement
}

export default class History {
  constructor (options: HistoryOptions);
  public render (container: HTMLElement): void
  public update (): void
  public show (): void
  public hide (): void
  public destroy (): void
}
