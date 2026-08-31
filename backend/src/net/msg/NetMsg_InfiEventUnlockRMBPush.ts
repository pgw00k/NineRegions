// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: InfiEventUnlockRMBPush

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiUnlockEventRep,
} from 'mc-local-share';

/**
 * InfiEventUnlockRMBPush
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiUnlockEventRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15050
 */
export class NetMsg_InfiEventUnlockRMBPush implements IHandle<PlayerInfoSimple, InfiUnlockEventRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_RMB_UNLOCK_EVENT_PUSH (15050) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_RMB_UNLOCK_EVENT_PUSH;

  Handle(req: PlayerInfoSimple): InfiUnlockEventRep {
    throw new Error('Handle not implemented: InfiEventUnlockRMBPush');
  }
}
