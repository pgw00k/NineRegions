// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_UseSharedDeck_NT

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  UseSharedDeckNt,
} from 'mc-local-share';

/**
 * NetMsg_UseSharedDeck_NT
 * REQ = UseSharedDeckNt
 * RES = {}（recvProto 缺失，回退）
 * 说明：RES 使用 {} 作为占位。（未声明 recvProto）
 * 注册：reqId=15043、recId=-1
 */
export class NetMsg_UseSharedDeck_NT implements IHandle<UseSharedDeckNt, {}> {
  /** 请求消息号：USE_SHAREDDECK_NT (15043) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.USE_SHAREDDECK_NT;
  /** 响应消息号：-1 */
  readonly recId: number = -1;

  Handle(req: UseSharedDeckNt): {} {
    throw new Error('Handle not implemented: NetMsg_UseSharedDeck_NT');
  }
}
