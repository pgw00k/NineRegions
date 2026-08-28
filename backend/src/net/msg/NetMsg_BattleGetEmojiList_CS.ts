// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_BattleGetEmojiList

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  QueryExpressionShortcutReq,
  QueryExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_BattleGetEmojiList
 * REQ = QueryExpressionShortcutReq
 * RES = QueryExpressionShortcutRsp
 * 注册：reqId=10374、recId=10375
 */
export class NetMsg_BattleGetEmojiList_CS implements IHandle<QueryExpressionShortcutReq, QueryExpressionShortcutRsp> {
  /** 请求消息号：QUERY_EXPRESSION_SHORECUT_REQ (10374) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_REQ;
  /** 响应消息号：QUERY_EXPRESSION_SHORECUT_RSP (10375) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_RSP;

  Handle(req: QueryExpressionShortcutReq): QueryExpressionShortcutRsp {
    throw new Error('Handle not implemented: NetMsg_BattleGetEmojiList');
  }
}
