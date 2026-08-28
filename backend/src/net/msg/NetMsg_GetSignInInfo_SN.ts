// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_GetSignInInfo_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  GetSignInInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_GetSignInInfo_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = GetSignInInfoResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=10203
 */
export class NetMsg_GetSignInInfo_SN implements IHandle<PlayerInfoSimple, GetSignInInfoResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：GET_SIGNIN_INFO_REP (10203) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_SIGNIN_INFO_REP;

  Handle(req: PlayerInfoSimple): GetSignInInfoResponse {
    throw new Error('Handle not implemented: NetMsg_GetSignInInfo_SN');
  }
}
