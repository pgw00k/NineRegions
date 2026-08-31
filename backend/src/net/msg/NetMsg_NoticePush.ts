// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Notice_Push

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  TipsNotice,
} from 'mc-local-share';

/**
 * Notice_Push
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = TipsNotice
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10273
 */
export class NetMsg_NoticePush implements IHandle<PlayerInfoSimple, TipsNotice> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：TIPS_NOTICE (10273) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.TIPS_NOTICE;

  Handle(req: PlayerInfoSimple): TipsNotice {
    throw new Error('Handle not implemented: Notice_Push');
  }
}
