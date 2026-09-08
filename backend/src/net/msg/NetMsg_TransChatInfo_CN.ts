// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_TransChatInfo_CN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TransChatInfoRpt,
} from 'mc-local-share';

/**
 * NetMsg_TransChatInfo_CN
 * REQ = TransChatInfoRpt
 * RES = {}
 * 注册：reqId=15029,recId=0
 */
export class NetMsg_TransChatInfo_CN extends MessageBase<TransChatInfoRpt, {}> {
  /** 请求消息号：TRANS_CHAT_INFO_RPT (15029) */
  reqId: MESSAGE_ID = MESSAGE_ID.TRANS_CHAT_INFO_RPT;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override HandleSync(req: TransChatInfoRpt, client?: Client): {} {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_TransChatInfo_CN');
    }
    return resobj
  }
}
