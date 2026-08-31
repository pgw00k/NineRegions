// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_SetHeadInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  SetHeadInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = SetHeadInfoRsp
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10377
 */
export class NetMsg_SetHeadInfo_SN implements IHandle<PlayerInfoSimple, SetHeadInfoRsp> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：SET_HEAD_INFO_RSP (10377) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_INFO_RSP;

  Handle(req: PlayerInfoSimple): SetHeadInfoRsp {
    throw new Error('Handle not implemented: NetMsg_SetHeadInfo_SN');
  }
}
