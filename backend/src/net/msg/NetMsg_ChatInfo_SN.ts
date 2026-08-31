// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChatInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ChatInfoNtf,
} from 'mc-local-share';

/**
 * NetMsg_ChatInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ChatInfoNtf
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15028
 */
export class NetMsg_ChatInfo_SN implements IHandle<PlayerInfoSimple, ChatInfoNtf> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：CHAT_INFO_NTF (15028) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_NTF;

  Handle(req: PlayerInfoSimple): ChatInfoNtf {
    throw new Error('Handle not implemented: NetMsg_ChatInfo_SN');
  }
}
