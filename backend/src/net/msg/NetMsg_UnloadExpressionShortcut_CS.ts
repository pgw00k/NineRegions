// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_UnloadExpressionShortcut

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  UnloadExpressionShortcutReq,
  UnloadExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_UnloadExpressionShortcut
 * REQ = UnloadExpressionShortcutReq
 * RES = UnloadExpressionShortcutRsp
 * 注册：reqId=10358、recId=10359
 */
export class NetMsg_UnloadExpressionShortcut_CS implements IHandle<UnloadExpressionShortcutReq, UnloadExpressionShortcutRsp> {
  /** 请求消息号：UNLOAD_EXPRESSION_SHORTCUT_REQ (10358) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_REQ;
  /** 响应消息号：UNLOAD_EXPRESSION_SHORTCUT_RSP (10359) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.UNLOAD_EXPRESSION_SHORTCUT_RSP;

  Handle(req: UnloadExpressionShortcutReq): UnloadExpressionShortcutRsp {
    throw new Error('Handle not implemented: NetMsg_UnloadExpressionShortcut');
  }
}
