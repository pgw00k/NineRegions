// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_SetHeadInfo_SN

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  SetHeadInfoRsp,
} from 'mc-local-share';

/**
 * NetMsg_SetHeadInfo_SN
 * REQ = {}
 * RES = SetHeadInfoRsp
 * 注册：reqId=0、recId=10377
 */
export class NetMsg_SetHeadInfo_SN extends MessageBase<{}, SetHeadInfoRsp> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SET_HEAD_INFO_RSP (10377) */
  recId: MESSAGE_ID = MESSAGE_ID.SET_HEAD_INFO_RSP;

  override Handle(req: {}): SetHeadInfoRsp {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_SetHeadInfo_SN');
    }
    return resobj
  }
}
