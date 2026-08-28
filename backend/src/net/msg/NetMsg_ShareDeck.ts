// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_ShareDeck

import { IHandle } from '../IHandle';
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
export class NetMsg_ShareDeck implements IHandle<ShareDeckReq, ShareDeckRep> {
  /** 请求消息号：SHAREDECK_REQ (10362) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.SHAREDECK_REQ;
  /** 响应消息号：SHAREDECK_REP (10363) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SHAREDECK_REP;

  Handle(req: ShareDeckReq): ShareDeckRep {
    throw new Error('Handle not implemented: NetMsg_ShareDeck');
  }
}
