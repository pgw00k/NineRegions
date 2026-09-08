// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_TransChatInfo_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  TransChatInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_TransChatInfo_SN
 * REQ = {}
 * RES = TransChatInfoNtf
 * 注册：reqId=0,recId=15030
 */
export class NetMsg_TransChatInfo_SN extends MessageBase<{}, TransChatInfoNtf> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：TRANS_CHAT_INFO_NTF (15030) */
  recId: MESSAGE_ID = MESSAGE_ID.TRANS_CHAT_INFO_NTF;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): TransChatInfoNtf {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_TransChatInfo_SN');
    }
    return resobj
  }
}
