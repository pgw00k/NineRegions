// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ChampGetInfo_CS

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  ChampGetInfoRequest,
  ChampGetInfoResponse,
} from 'mc-local-share';

/**
 * NetMsg_ChampGetInfo_CS
 * REQ = ChampGetInfoRequest
 * RES = ChampGetInfoResponse
 * 注册：reqId=10400、recId=10401
 */
export class NetMsg_ChampGetInfo_CS implements IHandle<ChampGetInfoRequest, ChampGetInfoResponse> {
  /** 请求消息号：CHAMP_GET_INFO_REQ (10400) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_INFO_REQ;
  /** 响应消息号：CHAMP_GET_INFO_REP (10401) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_INFO_REP;

  Handle(req: ChampGetInfoRequest): ChampGetInfoResponse {
    throw new Error('Handle not implemented: NetMsg_ChampGetInfo_CS');
  }
}
