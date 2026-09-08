// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_UnloadExpressionShortcut

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  UnloadExpressionShortcutReq,
  UnloadExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_UnloadExpressionShortcut
 * REQ = UnloadExpressionShortcutReq
 * RES = UnloadExpressionShortcutRsp
 * 注册：reqId=10358,recId=10359
 */
export class NetMsg_UnloadExpressionShortcut_CS extends MessageBase<UnloadExpressionShortcutReq, UnloadExpressionShortcutRsp> {
  /** 请求消息号：UNLOAD_EXPRESSION_SHORTCUT_REQ (10358) */
  reqId: MESSAGE_ID = MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_REQ;
  /** 响应消息号：UNLOAD_EXPRESSION_SHORTCUT_RSP (10359) */
  recId: MESSAGE_ID = MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_RSP;

  override HandleSync(req: UnloadExpressionShortcutReq, client?: Client): UnloadExpressionShortcutRsp {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_UnloadExpressionShortcut');
    }
    return resobj
  }
}
