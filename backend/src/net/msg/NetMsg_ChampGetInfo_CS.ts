// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ChampGetInfo_CS

import { MessageBase } from '../MessageBase';
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
export class NetMsg_ChampGetInfo_CS extends MessageBase<ChampGetInfoRequest, ChampGetInfoResponse> {
  /** 请求消息号：CHAMP_GET_INFO_REQ (10400) */
  reqId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_INFO_REQ;
  /** 响应消息号：CHAMP_GET_INFO_REP (10401) */
  recId: MESSAGE_ID = MESSAGE_ID.CHAMP_GET_INFO_REP;

  override Handle(req: ChampGetInfoRequest): ChampGetInfoResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ChampGetInfo_CS');
    }
    return resobj
  }
}
