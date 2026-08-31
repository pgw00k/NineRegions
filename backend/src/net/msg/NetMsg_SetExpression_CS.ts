// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetExpression

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetExpressionShortcutReq,
  SetExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetExpression
 * REQ = SetExpressionShortcutReq
 * RES = SetExpressionShortcutRsp
 * 注册：reqId=10352、recId=10353
 */
export class NetMsg_SetExpression_CS extends MessageBase<SetExpressionShortcutReq, SetExpressionShortcutRsp> {
  /** 请求消息号：SET_EXPRESSION_SHORTCUT_REQ (10352) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_EXPRESSION_SHORTCUT_REQ;
  /** 响应消息号：SET_EXPRESSION_SHORTCUT_RSP (10353) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_EXPRESSION_SHORTCUT_RSP;

  override Handle(req: SetExpressionShortcutReq): SetExpressionShortcutRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetExpression');
    }
    return resobj
  }
}
