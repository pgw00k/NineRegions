// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChatInfo_CN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChatInfoRpt,
} from 'mc-local-share';

/**
 * NetMsg_ChatInfo_CN
 * REQ = ChatInfoRpt
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=15027、recId=-1
 */
export class NetMsg_ChatInfo_CN implements IHandle<ChatInfoRpt, {}> {
  /** 请求消息号：CHAT_INFO_RPT (15027) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAT_INFO_RPT;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: ChatInfoRpt): {} {
    throw new Error('Handle not implemented: NetMsg_ChatInfo_CN');
  }
}
