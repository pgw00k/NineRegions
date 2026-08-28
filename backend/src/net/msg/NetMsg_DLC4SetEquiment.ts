// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_DLC4SetEquiment

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  DLC4SetEquipmentReq,
  DLC4SetEquipmentRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4SetEquiment
 * REQ = DLC4SetEquipmentReq
 * RES = DLC4SetEquipmentRep
 * 注册：reqId=10480、recId=10481
 */
export class NetMsg_DLC4SetEquiment implements IHandle<DLC4SetEquipmentReq, DLC4SetEquipmentRep> {
  /** 请求消息号：DLC4_SETEQUIPMENT_REQ (10480) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.DLC4_SETEQUIPMENT_REQ;
  /** 响应消息号：DLC4_SETEQUIPMENT_REP (10481) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.DLC4_SETEQUIPMENT_REP;

  Handle(req: DLC4SetEquipmentReq): DLC4SetEquipmentRep {
    throw new Error('Handle not implemented: NetMsg_DLC4SetEquiment');
  }
}
