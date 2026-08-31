// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_GetStaticDataReq

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiGetStaticDataReq,
} from 'mc-local-share';

/**
 * Infi_GetStaticDataReq
 * REQ = InfiGetStaticDataReq
 * RES = {}
 * 注册：reqId=10116、recId=0
 */
export class NetMsg_InfiGetStaticDataReq extends MessageBase<InfiGetStaticDataReq, {}> {
  /** 请求消息号：INFI_GET_STATICDATA_REQ (10116) */
  reqId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STATICDATA_REQ;
  /** 响应消息号：NETWORK_MESSAGE_BEGIN (0) */
  recId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;

  override Handle(req: InfiGetStaticDataReq): {} {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_GetStaticDataReq');
    }
    return resobj
  }
}
