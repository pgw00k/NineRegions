// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CreatePVERoom_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  CreatePVERoomResponse,
} from 'mc-local-share';

/**
 * NetMsg_CreatePVERoom_SN
 * REQ = {}
 * RES = CreatePVERoomResponse
 * 注册：reqId=0、recId=10010
 */
export class NetMsg_CreatePVERoom_SN extends MessageBase<{}, CreatePVERoomResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：CREATE_PVEROOM_REP (10010) */
  recId: MESSAGE_ID = MESSAGE_ID.CREATE_PVEROOM_REP;

  override Handle(req: {}): CreatePVERoomResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_CreatePVERoom_SN');
    }
    return resobj
  }
}
