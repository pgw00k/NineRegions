// 由 mc-local-share generate_res 自动生成，请勿手改。
// tagName: Infi_StartShopExit

import { IHandle } from '../IHandle';
import {
  MESSAGE_ID,
  InfiOpenShopExitRequest,
  InfiOpenShopExitResponse,
} from 'mc-local-share';

/**
 * Infi_StartShopExit
 * REQ = InfiOpenShopExitRequest
 * RES = InfiOpenShopExitResponse
 * 注册：reqId=10122、recId=10123
 */
export class NetMsg_InfiStartShopExit implements IHandle<InfiOpenShopExitRequest, InfiOpenShopExitResponse> {
  /** 请求消息号：INFI_OPENSHOP_EXIT_REQ (10122) */
  readonly reqId: MESSAGE_ID = MESSAGE_ID.INFI_OPENSHOP_EXIT_REQ;
  /** 响应消息号：INFI_OPENSHOP_EXIT_REP (10123) */
  readonly recId: MESSAGE_ID = MESSAGE_ID.INFI_OPENSHOP_EXIT_REP;

  Handle(req: InfiOpenShopExitRequest): InfiOpenShopExitResponse {
    throw new Error('Handle not implemented: Infi_StartShopExit');
  }
}
