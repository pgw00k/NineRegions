// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_DLC4GetInfo

import { IHandle } from '../IHandle';
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
export class NetMsg_DLC4GetInfo implements IHandle<DLC4GetInfoReq, DLC4GetInfoRep> {
  /** 请求消息号：DLC4_GETINFO_REQ (10476) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.DLC4_GETINFO_REQ;
  /** 响应消息号：DLC4_GETINFO_REP (10477) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.DLC4_GETINFO_REP;

  Handle(req: DLC4GetInfoReq): DLC4GetInfoRep {
    throw new Error('Handle not implemented: NetMsg_DLC4GetInfo');
  }
}
