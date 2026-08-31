// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: GM_Main

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  GiveMeFiveRequest,
  GiveMeFiveResponse,
} from 'mc-local-share';

/**
 * GM_Main
 * REQ = GiveMeFiveRequest
 * RES = GiveMeFiveResponse
 * 注册：reqId=19000、recId=19001
 */
export class NetMsg_GMMain extends MessageBase<GiveMeFiveRequest, GiveMeFiveResponse> {
  /** 请求消息号：GIVEMEFIVE_LOGIC_REQ (19000) */
  reqId: MESSAGE_ID = MESSAGE_ID.GIVEMEFIVE_LOGIC_REQ;
  /** 响应消息号：GIVEMEFIVE_LOGIC_REP (19001) */
  recId: MESSAGE_ID = MESSAGE_ID.GIVEMEFIVE_LOGIC_REP;

  override Handle(req: GiveMeFiveRequest): GiveMeFiveResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: GM_Main');
    }
    return resobj
  }
}
