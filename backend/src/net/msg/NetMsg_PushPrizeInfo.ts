// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_PushPrizeInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushPrizeInfo,
} from 'mc-local-share';

/**
 * NetMsg_PushPrizeInfo
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushPrizeInfo
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15041
 */
export class NetMsg_PushPrizeInfo implements IHandle<PlayerInfoSimple, PushPrizeInfo> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_PRIZE_INFO (15041) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_PRIZE_INFO;

  Handle(req: PlayerInfoSimple): PushPrizeInfo {
    throw new Error('Handle not implemented: NetMsg_PushPrizeInfo');
  }
}
