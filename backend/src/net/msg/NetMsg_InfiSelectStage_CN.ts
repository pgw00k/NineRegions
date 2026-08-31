// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_InfiSelectStage

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiSelectStageRequest,
} from 'mc-local-share';

/**
 * NetMsg_InfiSelectStage
 * REQ = InfiSelectStageRequest
 * RES = {}
 * 注册：reqId=10088、recId=0
 */
export class NetMsg_InfiSelectStage_CN extends MessageBase<InfiSelectStageRequest, {}> {
  /** 请求消息号：INFI_SELECT_STAGE_REQ (10088) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_SELECT_STAGE_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: InfiSelectStageRequest): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_InfiSelectStage');
    }
    return resobj
  }
}
