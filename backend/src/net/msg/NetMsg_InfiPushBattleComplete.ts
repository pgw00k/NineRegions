// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_PushBattleComplete

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiBattleComplete,
} from 'mc-local-share';

/**
 * Infi_PushBattleComplete
 * REQ = {}
 * RES = InfiBattleComplete
 * 注册：reqId=0、recId=10096
 */
export class NetMsg_InfiPushBattleComplete extends MessageBase<{}, InfiBattleComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_BATTLE_COMPLETE (10096) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_BATTLE_COMPLETE;

  override Handle(req: {}): InfiBattleComplete {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_PushBattleComplete');
    }
    return resobj
  }
}
