// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_PushStateChange

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiStateChangePush,
} from 'mc-local-share';

/**
 * Infi_PushStateChange
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiStateChangePush
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15015
 */
export class NetMsg_InfiPushStateChange implements IHandle<PlayerInfoSimple, InfiStateChangePush> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_STATE_CHANGE_PUSH (15015) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_STATE_CHANGE_PUSH;

  Handle(req: PlayerInfoSimple): InfiStateChangePush {
    throw new Error('Handle not implemented: Infi_PushStateChange');
  }
}
