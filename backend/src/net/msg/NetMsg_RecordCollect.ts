// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Msg_RecordCollect

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  FavorRecordRequest,
  FavorRecordResponse,
} from 'mc-local-share';

/**
 * Msg_RecordCollect
 * REQ = FavorRecordRequest
 * RES = FavorRecordResponse
 * 注册：reqId=10442、recId=10443
 */
export class NetMsg_RecordCollect extends MessageBase<FavorRecordRequest, FavorRecordResponse> {
  /** 请求消息号：FAVOR_RECORD_REQ (10442) */
  reqId: MESSAGE_ID = MESSAGE_ID.FAVOR_RECORD_REQ;
  /** 响应消息号：FAVOR_RECORD_REP (10443) */
  recId: MESSAGE_ID = MESSAGE_ID.FAVOR_RECORD_REP;

  override Handle(req: FavorRecordRequest): FavorRecordResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Msg_RecordCollect');
    }
    return resobj
  }
}
