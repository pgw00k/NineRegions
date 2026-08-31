// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_GetSimpleDataRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiGetSimpleDataResponse,
} from 'mc-local-share';

/**
 * Infi_GetSimpleDataRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiGetSimpleDataResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10127
 */
export class NetMsg_InfiGetSimpleDataRep implements IHandle<PlayerInfoSimple, InfiGetSimpleDataResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_GET_SIMPLE_DATA_REP (10127) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_SIMPLE_DATA_REP;

  Handle(req: PlayerInfoSimple): InfiGetSimpleDataResponse {
    throw new Error('Handle not implemented: Infi_GetSimpleDataRep');
  }
}
