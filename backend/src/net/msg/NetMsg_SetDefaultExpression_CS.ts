// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetDefaultExpression

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetDefaultShortcutReq,
  SetDefaultShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetDefaultExpression
 * REQ = SetDefaultShortcutReq
 * RES = SetDefaultShortcutRsp
 * 注册：reqId=10356、recId=10357
 */
export class NetMsg_SetDefaultExpression_CS extends MessageBase<SetDefaultShortcutReq, SetDefaultShortcutRsp> {
  /** 请求消息号：SET_DEFAULT_SHORTCUT_REQ (10356) */
  reqId: MESSAGE_ID = MESSAGE_ID.SET_DEFAULT_SHORTCUT_REQ;
  /** 响应消息号：SET_DEFAULT_SHORTCUT_RSP (10357) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_DEFAULT_SHORTCUT_RSP;

  override Handle(req: SetDefaultShortcutReq): SetDefaultShortcutRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetDefaultExpression');
    }
    return resobj
  }
}
