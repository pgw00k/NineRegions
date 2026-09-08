// 由 mc-local-share generate_ts 自动生成，请勿手改。
// tagName: NetMsg_RMB_ShopBuy_SN

import { Client } from '../Client';
import { MessageBase } from '../MessageBase';
import {
  MESSAGE_ID,
  ShopBuyResponse,
} from 'mc-local-share';

/**
 * NetMsg_RMB_ShopBuy_SN
 * REQ = {}
 * RES = ShopBuyResponse
 * 注册：reqId=0,recId=15044
 */
export class NetMsg_RMB_ShopBuy_SN extends MessageBase<{}, ShopBuyResponse> {
  /** 请求消息号：NETWORK_MESSAGE_BEGIN (0) */
  reqId: MESSAGE_ID = MESSAGE_ID.NETWORK_MESSAGE_BEGIN;
  /** 响应消息号：SHOP_RMB_BUY_PUSH (15044) */
  recId: MESSAGE_ID = MESSAGE_ID.SHOP_RMB_BUY_PUSH;

  override HandleSync(req: {}, client?: Client, uid?: string, token?: string,exData?:any): ShopBuyResponse {
    let resobj = super.HandleSync(req, client, uid, token,exData)
    if(!resobj) {
      throw new Error('HandleSync not implemented: NetMsg_RMB_ShopBuy_SN');
    }
    return resobj
  }
}
