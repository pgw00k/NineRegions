// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: NetMsg_RMB_ShopBuy_SN

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  PlayerInfoSimple,
  ShopBuyResponse,
} from 'mc-local-share';

/**
 * NetMsg_RMB_ShopBuy_SN
 * REQ = PlayerInfoSimple（reqProto 缺失，回退）
 * RES = ShopBuyResponse
 * 说明：REQ 使用 PlayerInfoSimple 作为占位。（未声明 reqProto）
 * 注册：reqId=-1、recId=15044
 */
export class NetMsg_RMB_ShopBuy_SN implements IHandle<PlayerInfoSimple, ShopBuyResponse> {
  /** 请求消息号：-1 */
  readonly reqId: number = -1;
  /** 响应消息号：SHOP_RMB_BUY_PUSH (15044) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.SHOP_RMB_BUY_PUSH;

  Handle(req: PlayerInfoSimple): ShopBuyResponse {
    throw new Error('Handle not implemented: NetMsg_RMB_ShopBuy_SN');
  }
}
