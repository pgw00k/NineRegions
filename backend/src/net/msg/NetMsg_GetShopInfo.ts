// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: GetShopInfo

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  GetShopInfoRequest,
  GetShopInfoResponse,
} from 'mc-local-share';

/**
 * GetShopInfo
 * REQ = GetShopInfoRequest
 * RES = GetShopInfoResponse
 * 注册：reqId=10210、recId=10211
 */
export class NetMsg_GetShopInfo implements IHandle<GetShopInfoRequest, GetShopInfoResponse> {
  /** 请求消息号：GET_SHOP_INFO_REQ (10210) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.GET_SHOP_INFO_REQ;
  /** 响应消息号：GET_SHOP_INFO_REP (10211) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.GET_SHOP_INFO_REP;

  Handle(req: GetShopInfoRequest): GetShopInfoResponse {
    throw new Error('Handle not implemented: GetShopInfo');
  }
}
