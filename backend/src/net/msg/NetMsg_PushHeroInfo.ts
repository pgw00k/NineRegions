// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: PushHeroInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  PushHeroSimpleInfo,
} from 'mc-local-share';

/**
 * PushHeroInfo
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = PushHeroSimpleInfo
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15023
 */
export class NetMsg_PushHeroInfo implements IHandle<PlayerInfoSimple, PushHeroSimpleInfo> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_HERO_INFO (15023) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_HERO_INFO;

  Handle(req: PlayerInfoSimple): PushHeroSimpleInfo {
    throw new Error('Handle not implemented: PushHeroInfo');
  }
}
