// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: InfiEventUnlock

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiUnlockEventReq,
  InfiUnlockEventRep,
} from 'mc-local-share';

/**
 * InfiEventUnlock
 * REQ = InfiUnlockEventReq
 * RES = InfiUnlockEventRep
 * 注册：reqId=10128、recId=10129
 */
export class NetMsg_InfiEventUnlock implements IHandle<InfiUnlockEventReq, InfiUnlockEventRep> {
  /** 请求消息号：INFI_UNLOCK_EVENT_REQ (10128) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_EVENT_REQ;
  /** 响应消息号：INFI_UNLOCK_EVENT_REP (10129) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_EVENT_REP;

  Handle(req: InfiUnlockEventReq): InfiUnlockEventRep {
    throw new Error('Handle not implemented: InfiEventUnlock');
  }
}
