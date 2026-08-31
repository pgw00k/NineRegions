// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_GetSimpleDataRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiGetSimpleDataResponse,
} from 'mc-local-share';

/**
 * Infi_GetSimpleDataRep
 * REQ = {}
 * RES = InfiGetSimpleDataResponse
 * 注册：reqId=0、recId=10127
 */
export class NetMsg_InfiGetSimpleDataRep extends MessageBase<{}, InfiGetSimpleDataResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_GET_SIMPLE_DATA_REP (10127) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_SIMPLE_DATA_REP;

  override Handle(req: {}): InfiGetSimpleDataResponse {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_GetSimpleDataRep');
    }
    return resobj
  }
}
