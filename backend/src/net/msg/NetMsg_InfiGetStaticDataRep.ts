// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: Infi_GetStaticDataRep

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  InfiGetStaticDataRep,
} from 'mc-local-share';

/**
 * Infi_GetStaticDataRep
 * REQ = {}
 * RES = InfiGetStaticDataRep
 * 注册：reqId=0、recId=10117
 */
export class NetMsg_InfiGetStaticDataRep extends MessageBase<{}, InfiGetStaticDataRep> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：INFI_GET_STATICDATA_REP (10117) */
  recId: MESSAGE_ID = MESSAGE_ID.INFI_GET_STATICDATA_REP;

  override Handle(req: {}): InfiGetStaticDataRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: Infi_GetStaticDataRep');
    }
    return resobj
  }
}
