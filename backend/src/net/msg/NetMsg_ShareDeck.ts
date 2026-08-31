// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_ShareDeck

import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ShareDeckReq,
  ShareDeckRep,
} from 'mc-local-share';

/**
 * NetMsg_ShareDeck
 * REQ = ShareDeckReq
 * RES = ShareDeckRep
 * 注册：reqId=10362、recId=10363
 */
export class NetMsg_ShareDeck extends MessageBase<ShareDeckReq, ShareDeckRep> {
  /** 请求消息号：SHAREDECK_REQ (10362) */
  reqId: MESSAGE_ID = MESSAGE_ID.SHAREDECK_REQ;
  /** 响应消息号：SHAREDECK_REP (10363) */
  recId: MESSAGE_ID = MESSAGE_ID.SHAREDECK_REP;

  override Handle(req: ShareDeckReq): ShareDeckRep {
    let resobj = super.Handle(req)
    if(!resobj) {
      throw new Error('Handle not implemented: NetMsg_ShareDeck');
    }
    return resobj
  }
}
