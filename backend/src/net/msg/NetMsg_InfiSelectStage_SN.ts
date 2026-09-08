// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_SelectStage_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectStageResponse,
} from 'mc-local-share';

/**
 * Infi_SelectStage_SN
 * REQ = {}
 * RES = InfiSelectStageResponse
 * 注册：reqId=0,recId=10089
 */
export class NetMsg_InfiSelectStage_SN extends MessageBase<{}, InfiSelectStageResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_SELECT_STAGE_REP (10089) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_STAGE_REP;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): InfiSelectStageResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: Infi_SelectStage_SN');
    }
    return resobj
  }
}
