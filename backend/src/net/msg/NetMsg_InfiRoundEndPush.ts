// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_RoundEnd

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiRoundEndPush,
} from 'mc-local-share';

/**
 * Infi_RoundEnd
 * REQ = {}
 * RES = InfiRoundEndPush
 * 注册：reqId=0,recId=15021
 */
export class NetMsg_InfiRoundEndPush extends MessageBase<{}, InfiRoundEndPush> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：PUSH_INFI_ROUND_END (15021) */
  recId: MESSAGE_ID = MESSAGE_ID.PUSH_INFI_ROUND_END;

  override HandleSync(req: {}, client?: Client): InfiRoundEndPush {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_RoundEnd');
    }
    return resobj
  }
}
