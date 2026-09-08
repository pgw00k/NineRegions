// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleGetEmojiList

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  QueryExpressionShortcutReq,
  QueryExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_BattleGetEmojiList
 * REQ = QueryExpressionShortcutReq
 * RES = QueryExpressionShortcutRsp
 * 注册：reqId=10374,recId=10375
 */
export class NetMsg_BattleGetEmojiList_CS extends MessageBase<QueryExpressionShortcutReq, QueryExpressionShortcutRsp> {
  /** 请求消息号：QUERY_EXPRESSION_SHORECUT_REQ (10374) */
  reqId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_REQ;
  /** 响应消息号：QUERY_EXPRESSION_SHORECUT_RSP (10375) */
  recId: MESSAGE_ID = MESSAGE_ID.QUERY_EXPRESSION_SHORECUT_RSP;

  override HandleSync(req: QueryExpressionShortcutReq, client?: Client): QueryExpressionShortcutRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_BattleGetEmojiList');
    }
    return resobj
  }
}
