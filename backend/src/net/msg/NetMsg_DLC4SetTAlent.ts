// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_DLC4SetTAlent

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  DLC4SetTalentReq,
  DLC4SetTalentRep,
} from 'mc-local-share';

/**
 * NetMsg_DLC4SetTAlent
 * REQ = DLC4SetTalentReq
 * RES = DLC4SetTalentRep
 * 注册：reqId=10478、recId=10479
 */
export class NetMsg_DLC4SetTAlent implements IHandle<DLC4SetTalentReq, DLC4SetTalentRep> {
  /** 请求消息号：DLC4_SETTALENT_REQ (10478) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.DLC4_SETTALENT_REQ;
  /** 响应消息号：DLC4_SETTALENT_REP (10479) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.DLC4_SETTALENT_REP;

  Handle(req: DLC4SetTalentReq): DLC4SetTalentRep {
    throw new Error('Handle not implemented: NetMsg_DLC4SetTAlent');
  }
}
