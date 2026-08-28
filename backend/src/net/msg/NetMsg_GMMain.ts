// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GM_Main

import { IHandle } from '../IHandle';
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
export class NetMsg_GMMain implements IHandle<GiveMeFiveRequest, GiveMeFiveResponse> {
  /** 请求消息号：GIVEMEFIVE_LOGIC_REQ (19000) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GIVEMEFIVE_LOGIC_REQ;
  /** 响应消息号：GIVEMEFIVE_LOGIC_REP (19001) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GIVEMEFIVE_LOGIC_REP;

  Handle(req: GiveMeFiveRequest): GiveMeFiveResponse {
    throw new Error('Handle not implemented: GM_Main');
  }
}
