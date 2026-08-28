// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_EnterRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiEnterResponse,
} from 'mc-local-share';

/**
 * Infi_EnterRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiEnterResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10081
 */
export class NetMsg_InfiEnterRep implements IHandle<PlayerInfoSimple, InfiEnterResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_ENTER_REP (10081) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_ENTER_REP;

  Handle(req: PlayerInfoSimple): InfiEnterResponse {
    throw new Error('Handle not implemented: Infi_EnterRep');
  }
}
