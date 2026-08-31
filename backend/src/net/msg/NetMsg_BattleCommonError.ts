// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_BattleCommonError

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  BattleCommonError,
} from 'mc-local-share';

/**
 * NetMsg_BattleCommonError
 * REQ = {}
 * RES = BattleCommonError
 * 注册：reqId=0、recId=25013
 */
export class NetMsg_BattleCommonError extends MessageBase<{}, BattleCommonError> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：BATTLE_COMMONERROR_REP (25013) */
  recId: MESSAGE_ID = MESSAGE_ID.BATTLE_COMMONERROR_REP;

  override Handle(req: {}): BattleCommonError {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_BattleCommonError');
    }
    return resobj
  }
}
