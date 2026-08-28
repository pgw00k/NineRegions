// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_TransChatInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  TransChatInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_TransChatInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = TransChatInfoNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15030
 */
export class NetMsg_TransChatInfo_SN implements IHandle<PlayerInfoSimple, TransChatInfoNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：TRANS_CHAT_INFO_NTF (15030) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TRANS_CHAT_INFO_NTF;

  Handle(req: PlayerInfoSimple): TransChatInfoNtf {
    throw new Error('Handle not implemented: NetMsg_TransChatInfo_SN');
  }
}
