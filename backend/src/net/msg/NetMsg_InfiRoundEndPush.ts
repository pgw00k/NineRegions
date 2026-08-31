// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_RoundEnd

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiRoundEndPush,
} from 'mc-local-share';

/**
 * Infi_RoundEnd
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiRoundEndPush
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15021
 */
export class NetMsg_InfiRoundEndPush implements IHandle<PlayerInfoSimple, InfiRoundEndPush> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：PUSH_INFI_ROUND_END (15021) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.PUSH_INFI_ROUND_END;

  Handle(req: PlayerInfoSimple): InfiRoundEndPush {
    throw new Error('Handle not implemented: Infi_RoundEnd');
  }
}
