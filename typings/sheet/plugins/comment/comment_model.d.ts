import { EventEmitter } from 'eventemitter3'
import Sheet from '../../editor/sheet'
import { IUser } from '../../../global'

/**
 * 评论数据层处理插件。
 */
export declare class CommentModel extends EventEmitter {
  constructor ();
  query (): Promise<any>
  start ({ sheet, row, col }: {
    sheet: Sheet;
    row: number;
    col: number;
  }): Promise<any>
  create ({ comment, row, col, user }: {
    comment: {
      selection_guid?: string;
      selectionGuid?: string;
      comment_guid: string;
      commentGuid: string;
      content: string;
      created_at: string;
      createdAt: string;
      selection_title: string;
      selectionTitle: string;
      userId: number;
      user_id: number;
    };
    row: number;
    col: number;
    user: IUser;
  }): Promise<any>
  delete (commentId: string): Promise<any>
  close ({ sheet, row, col }: {
    row: number;
    col: number;
    sheet: Sheet;
  }): Promise<any>
  cancel ({ sheet, row, col }: {
    sheet: Sheet;
    row: number;
    col: number;
  }): void
}
export { }
