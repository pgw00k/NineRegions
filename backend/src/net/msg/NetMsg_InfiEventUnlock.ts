// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: InfiEventUnlock

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiUnlockEventReq,
  InfiUnlockEventRep,
} from 'mc-local-share';

/**
 * InfiEventUnlock
 * REQ = InfiUnlockEventReq
 * RES = InfiUnlockEventRep
 * 注册：reqId=10128,recId=10129
 */
export class NetMsg_InfiEventUnlock extends MessageBase<InfiUnlockEventReq, InfiUnlockEventRep> {
  /** 请求消息号：INFI_UNLOCK_EVENT_REQ (10128) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_EVENT_REQ;
  /** 响应消息号：INFI_UNLOCK_EVENT_REP (10129) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_UNLOCK_EVENT_REP;

  override HandleSync(req: InfiUnlockEventReq, client?: Client, uid?: string, token?: string,exData?:any): InfiUnlockEventRep {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: InfiEventUnlock');
    }
    return resobj
  }
}
