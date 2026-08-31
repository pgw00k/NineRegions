// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ArenaBattleComplete

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ArenaBattleComplete,
} from 'mc-local-share';

/**
 * NetMsg_ArenaBattleComplete
 * REQ = {}
 * RES = ArenaBattleComplete
 * 注册：reqId=0、recId=15013
 */
export class NetMsg_ArenaBattleComplete extends MessageBase<{}, ArenaBattleComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：ARENA_BATTLE_COMPLETE (15013) */
  recId: MESSAGE_ID = MESSAGE_ID.ARENA_BATTLE_COMPLETE;

  override Handle(req: {}): ArenaBattleComplete {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ArenaBattleComplete');
    }
    return resobj
  }
}
