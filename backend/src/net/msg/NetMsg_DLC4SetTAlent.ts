// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_DLC4SetTAlent

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  DLC4SetTalentReq,
  DLC4SetTalentRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4SetTAlent
 * REQ = DLC4SetTalentReq
 * RES = DLC4SetTalentRep
 * 注册：reqId=10478,recId=10479
 */
export class NetMsg_DLC4SetTAlent extends MessageBase<DLC4SetTalentReq, DLC4SetTalentRep> {
  /** 请求消息号：DLC4_SETTALENT_REQ (10478) */
  reqId: MESSAGE_ID = MESSAGE_ID.DLC4_SETTALENT_REQ;
  /** 响应消息号：DLC4_SETTALENT_REP (10479) */
  recId: MESSAGE_ID = MESSAGE_ID.DLC4_SETTALENT_REP;

  override HandleSync(req: DLC4SetTalentReq, client?: Client): DLC4SetTalentRep {
    let resobj = super.HandleSync(req, client)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_DLC4SetTAlent');
    }
    return resobj
  }
}
