// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_RemoveTreasure

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiDelSpellEquipRequest,
  InfiDelSpellEquipResponse,
} from 'mc-local-share';

/**
 * Infi_RemoveTreasure
 * REQ = InfiDelSpellEquipRequest
 * RES = InfiDelSpellEquipResponse
 * 注册：reqId=10108,recId=10109
 */
export class NetMsg_InfiRemoveTreasure extends MessageBase<InfiDelSpellEquipRequest, InfiDelSpellEquipResponse> {
  /** 请求消息号：INFI_DEL_SPELLEQUIP_REQ (10108) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_SPELLEQUIP_REQ;
  /** 响应消息号：INFI_DEL_SPELLEQUIP_REP (10109) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_SPELLEQUIP_REP;

  override HandleSync(req: InfiDelSpellEquipRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiDelSpellEquipResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_RemoveTreasure');
    }
    return resobj
  }
}
