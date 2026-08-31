// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_CreatePVERoom

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  CreatePVERoomRequest,
} from 'mc-local-share';

/**
 * NetMsg_CreatePVERoom
 * REQ = CreatePVERoomRequest
 * RES = {}
 * 注册：reqId=10009、recId=0
 */
export class NetMsg_CreatePVERoom_CN extends MessageBase<CreatePVERoomRequest, {}> {
  /** 请求消息号：CREATE_PVEROOM_REQ (10009) */
  reqId: MESSAGE_ID = MESSAGE_ID.CREATE_PVEROOM_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: CreatePVERoomRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_CreatePVERoom');
    }
    return resobj
  }
}
