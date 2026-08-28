// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_RemoveTreasure

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiDelSpellEquipRequest,
  InfiDelSpellEquipResponse,
} from 'mc-local-share';

/**
 * Infi_RemoveTreasure
 * REQ = InfiDelSpellEquipRequest
 * RES = InfiDelSpellEquipResponse
 * 注册：reqId=10108、recId=10109
 */
export class NetMsg_InfiRemoveTreasure implements IHandle<InfiDelSpellEquipRequest, InfiDelSpellEquipResponse> {
  /** 请求消息号：INFI_DEL_SPELLEQUIP_REQ (10108) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_SPELLEQUIP_REQ;
  /** 响应消息号：INFI_DEL_SPELLEQUIP_REP (10109) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_DEL_SPELLEQUIP_REP;

  Handle(req: InfiDelSpellEquipRequest): InfiDelSpellEquipResponse {
    throw new Error('Handle not implemented: Infi_RemoveTreasure');
  }
}
