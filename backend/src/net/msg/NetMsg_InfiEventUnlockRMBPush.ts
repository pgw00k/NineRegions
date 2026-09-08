// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: InfiEventUnlockRMBPush

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiUnlockEventRep,
} from 'mc-local-share';

/**
 * InfiEventUnlockRMBPush
 * REQ = {}
 * RES = InfiUnlockEventRep
 * 注册：reqId=0,recId=15050
 */
export class NetMsg_InfiEventUnlockRMBPush extends MessageBase<{}, InfiUnlockEventRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_RMB_UNLOCK_EVENT_PUSH (15050) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_RMB_UNLOCK_EVENT_PUSH;

  override HandleSync(req: {}, client?: Client): InfiUnlockEventRep {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: InfiEventUnlockRMBPush');
    }
    return resobj
  }
}
