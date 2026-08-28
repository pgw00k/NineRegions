// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetDefaultExpression

import { IHandle } from '../IHandle';
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
export class NetMsg_SetDefaultExpression_CS implements IHandle<SetDefaultShortcutReq, SetDefaultShortcutRsp> {
  /** 请求消息号：SET_DEFAULT_SHORTCUT_REQ (10356) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SET_DEFAULT_SHORTCUT_REQ;
  /** 响应消息号：SET_DEFAULT_SHORTCUT_RSP (10357) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_DEFAULT_SHORTCUT_RSP;

  Handle(req: SetDefaultShortcutReq): SetDefaultShortcutRsp {
    throw new Error('Handle not implemented: NetMsg_SetDefaultExpression');
  }
}
