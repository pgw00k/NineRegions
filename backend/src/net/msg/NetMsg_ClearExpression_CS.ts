// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ClearExpression

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ClearExpressionShortcutReq,
  ClearExpressionShortcutRsp,
} from 'mc-local-share';

/**
 * NetMsg_ClearExpression
 * REQ = ClearExpressionShortcutReq
 * RES = ClearExpressionShortcutRsp
 * 注册：reqId=10354、recId=10355
 */
export class NetMsg_ClearExpression_CS implements IHandle<ClearExpressionShortcutReq, ClearExpressionShortcutRsp> {
  /** 请求消息号：CLEAR_EXPRESSION_SHORTCUT_REQ (10354) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_REQ;
  /** 响应消息号：CLEAR_EXPRESSION_SHORTCUT_RSP (10355) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CLEAR_EXPRESSION_SHORTCUT_RSP;

  Handle(req: ClearExpressionShortcutReq): ClearExpressionShortcutRsp {
    throw new Error('Handle not implemented: NetMsg_ClearExpression');
  }
}
