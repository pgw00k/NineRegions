// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ModifyEquip

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ModifyEquipRequest,
  ModifyEquipResponse,
} from 'mc-local-share';

/**
 * NetMsg_ModifyEquip
 * REQ = ModifyEquipRequest
 * RES = ModifyEquipResponse
 * 注册：reqId=10300、recId=10301
 */
export class NetMsg_ModifyEquip extends MessageBase<ModifyEquipRequest, ModifyEquipResponse> {
  /** 请求消息号：MODIFY_EQUIP_REQ (10300) */
  reqId: MESSAGE_ID = MESSAGE_ID.MODIFY_EQUIP_REQ;
  /** 响应消息号：MODIFY_EQUIP_REP (10301) */
  recId: MESSAGE_ID = MESSAGE_ID.MODIFY_EQUIP_REP;

  override Handle(req: ModifyEquipRequest): ModifyEquipResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ModifyEquip');
    }
    return resobj
  }
}
