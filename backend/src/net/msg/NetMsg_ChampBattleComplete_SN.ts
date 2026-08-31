// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampBattleComplete_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ChampBattleComplete,
} from 'mc-local-share';

/**
 * NetMsg_ChampBattleComplete_SN
 * REQ = {}
 * RES = ChampBattleComplete
 * 注册：reqId=0、recId=15046
 */
export class NetMsg_ChampBattleComplete_SN extends MessageBase<{}, ChampBattleComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：CHAMP_BATTLE_COMPLETE (15046) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_BATTLE_COMPLETE;

  override Handle(req: {}): ChampBattleComplete {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChampBattleComplete_SN');
    }
    return resobj
  }
}
