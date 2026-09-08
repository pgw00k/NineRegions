// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_InfiExitStage

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiExitStageRequest,
  InfiExitStageResponse,
} from 'mc-local-share';

/**
 * Infi_InfiExitStage
 * REQ = InfiExitStageRequest
 * RES = InfiExitStageResponse
 * 注册：reqId=10101,recId=10102
 */
export class NetMsg_InfiExitStage extends MessageBase<InfiExitStageRequest, InfiExitStageResponse> {
  /** 请求消息号：INFI_EXIT_STAGE_REQ (10101) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_EXIT_STAGE_REQ;
  /** 响应消息号：INFI_EXIT_STAGE_REP (10102) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_EXIT_STAGE_REP;

  override HandleSync(req: InfiExitStageRequest, client?: Client, uid?: string, token?: string,exData?:any): InfiExitStageResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_InfiExitStage');
    }
    return resobj
  }
}
