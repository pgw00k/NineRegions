// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DLC4GetInfo

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DLC4GetInfoReq,
  DLC4GetInfoRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4GetInfo
 * REQ = DLC4GetInfoReq
 * RES = DLC4GetInfoRep
 * 注册：reqId=10476、recId=10477
 */
export class NetMsg_DLC4GetInfo extends MessageBase<DLC4GetInfoReq, DLC4GetInfoRep> {
  /** 请求消息号：DLC4_GETINFO_REQ (10476) */
  reqId: MESSAGE_ID = MESSAGE_ID.DLC4_GETINFO_REQ;
  /** 响应消息号：DLC4_GETINFO_REP (10477) */
  recId: MESSAGE_ID = MESSAGE_ID.DLC4_GETINFO_REP;

  override Handle(req: DLC4GetInfoReq): DLC4GetInfoRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_DLC4GetInfo');
    }
    return resobj
  }
}
