// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GetBattleResult

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
} from 'mc-local-share';

/**
 * GetBattleResult
 * REQ = {}
 * RES = {}
 * 注册：reqId=0、recId=0
 */
export class NetMsg_GetBattleResult extends MessageBase<{}, {}> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: {}): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GetBattleResult');
    }
    return resobj
  }
}
