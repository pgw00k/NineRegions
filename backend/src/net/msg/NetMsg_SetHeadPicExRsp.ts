// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicExRsp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  SetHeadPicExRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicExRsp
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = SetHeadPicExRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10347
 */
export class NetMsg_SetHeadPicExRsp implements IHandle<PlayerInfoSimple, SetHeadPicExRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：SET_HEAD_PIC_EX_RSP (10347) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_EX_RSP;

  Handle(req: PlayerInfoSimple): SetHeadPicExRsp {
    throw new Error('Handle not implemented: NetMsg_SetHeadPicExRsp');
  }
}
