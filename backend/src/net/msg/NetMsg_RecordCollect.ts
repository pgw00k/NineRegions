// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Msg_RecordCollect

import { IHandle } from '../IHandle';
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
export class NetMsg_RecordCollect implements IHandle<FavorRecordRequest, FavorRecordResponse> {
  /** 请求消息号：FAVOR_RECORD_REQ (10442) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.FAVOR_RECORD_REQ;
  /** 响应消息号：FAVOR_RECORD_REP (10443) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.FAVOR_RECORD_REP;

  Handle(req: FavorRecordRequest): FavorRecordResponse {
    throw new Error('Handle not implemented: Msg_RecordCollect');
  }
}
