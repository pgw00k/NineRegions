// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_PushLadderComplete

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  PushLadderComplete,
} from 'mc-local-share';

/**
 * NetMsg_PushLadderComplete
 * REQ = {}
 * RES = PushLadderComplete
 * 注册：reqId=0、recId=15004
 */
export class NetMsg_PushLadderComplete extends MessageBase<{}, PushLadderComplete> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_LADDERCOMPLETE (15004) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_LADDERCOMPLETE;

  override Handle(req: {}): PushLadderComplete {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_PushLadderComplete');
    }
    return resobj
  }
}
