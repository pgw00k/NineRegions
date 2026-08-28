// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_GetStaticDataRep

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  InfiGetStaticDataRep,
} from 'mc-local-share';

/**
 * Infi_GetStaticDataRep
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = InfiGetStaticDataRep
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10117
 */
export class NetMsg_InfiGetStaticDataRep implements IHandle<PlayerInfoSimple, InfiGetStaticDataRep> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：INFI_GET_STATICDATA_REP (10117) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STATICDATA_REP;

  Handle(req: PlayerInfoSimple): InfiGetStaticDataRep {
    throw new Error('Handle not implemented: Infi_GetStaticDataRep');
  }
}
