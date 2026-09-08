// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ClearExpression

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ClearExpressionShortcutReq,
  ClearExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_ClearExpression
 * REQ = ClearExpressionShortcutReq
 * RES = ClearExpressionShortcutRsp
 * 注册：reqId=10354,recId=10355
 */
export class NetMsg_ClearExpression_CS extends MessageBase<ClearExpressionShortcutReq, ClearExpressionShortcutRsp> {
  /** 请求消息号：CLEAR_EXPRESSION_SHORTCUT_REQ (10354) */
  reqId: MESSAGE_ID = MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_REQ;
  /** 响应消息号：CLEAR_EXPRESSION_SHORTCUT_RSP (10355) */
  recId: MESSAGE_ID = MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_RSP;

  override HandleSync(req: ClearExpressionShortcutReq, client?: Client): ClearExpressionShortcutRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_ClearExpression');
    }
    return resobj
  }
}
