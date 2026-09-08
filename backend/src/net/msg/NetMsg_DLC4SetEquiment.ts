// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DLC4SetEquiment

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DLC4SetEquipmentReq,
  DLC4SetEquipmentRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4SetEquiment
 * REQ = DLC4SetEquipmentReq
 * RES = DLC4SetEquipmentRep
 * 注册：reqId=10480,recId=10481
 */
export class NetMsg_DLC4SetEquiment extends MessageBase<DLC4SetEquipmentReq, DLC4SetEquipmentRep> {
  /** 请求消息号：DLC4_SETEQUIPMENT_REQ (10480) */
  reqId: MESSAGE_ID = MESSAGE_ID.DLC4_SETEQUIPMENT_REQ;
  /** 响应消息号：DLC4_SETEQUIPMENT_REP (10481) */
  recId: MESSAGE_ID = MESSAGE_ID.DLC4_SETEQUIPMENT_REP;

  override HandleSync(req: DLC4SetEquipmentReq, client?: Client): DLC4SetEquipmentRep {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_DLC4SetEquiment');
    }
    return resobj
  }
}
