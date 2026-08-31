// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetHeadPicRsp

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  SetHeadPicRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadPicRsp
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = SetHeadPicRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10345
 */
export class NetMsg_SetHeadPicRsp implements IHandle<PlayerInfoSimple, SetHeadPicRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：SET_HEAD_PIC_RSP (10345) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_PIC_RSP;

  Handle(req: PlayerInfoSimple): SetHeadPicRsp {
    throw new Error('Handle not implemented: NetMsg_SetHeadPicRsp');
  }
}
